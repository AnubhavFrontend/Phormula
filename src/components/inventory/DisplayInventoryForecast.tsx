'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/* ---------------------- Types ---------------------- */
type YM = { y: number; m: number };

export interface DisplayInventoryForecastProps {
  countryName: string;
  month: string;
  year: string;
  data: Array<Record<string, any>>;
}

/* -------------------- Constants -------------------- */
const MONTH_ABBR = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
] as const;

const FULL_MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
] as const;

/* -------------------- Utilities -------------------- */
function parseMonthHeaderToDate(col?: string | null): YM | null {
  if (!col) return null;

  // e.g., Oct'25
  let m = col.match(/^([A-Z][a-z]{2})'\s?(\d{2})$/);
  if (m) {
    const mi = MONTH_ABBR.indexOf(m[1] as (typeof MONTH_ABBR)[number]);
    const y = 2000 + parseInt(m[2], 10);
    if (mi >= 0) return { y, m: mi };
  }

  // e.g., October 2025
  m = col.match(/^([A-Z][a-z]+)\s+(\d{4})$/);
  if (m) {
    const mi = FULL_MONTHS.indexOf(m[1] as (typeof FULL_MONTHS)[number]);
    const y = parseInt(m[2], 10);
    if (mi >= 0) return { y, m: mi };
  }

  // e.g., Oct 2025
  m = col.match(/^([A-Z][a-z]{2})\s+(\d{4})$/);
  if (m) {
    const mi = MONTH_ABBR.indexOf(m[1] as (typeof MONTH_ABBR)[number]);
    const y = parseInt(m[2], 10);
    if (mi >= 0) return { y, m: mi };
  }

  return null;
}

const monthShortLabel = (col: string) => {
  const p = parseMonthHeaderToDate(col);
  return p ? MONTH_ABBR[p.m] : col;
};

const compareYM = (a: YM, b: YM) => (a.y !== b.y ? a.y - b.y : a.m - b.m);

/* -------------------- Component -------------------- */
const DisplayInventoryForecast: React.FC<DisplayInventoryForecastProps> = ({
  countryName,
  month,
  year,
  data,
}) => {
  const [monthRange, setMonthRange] = useState<string | null>(null);
  const chartRef = useRef<any>(null);

  const forecastData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Collect all keys
  const allKeys = useMemo<string[]>(() => {
    const s = new Set<string>();
    forecastData.forEach((r) => Object.keys(r || {}).forEach((k) => s.add(k)));
    return Array.from(s);
  }, [forecastData]);

  // Detect "* Sold" month columns, sort oldest->newest
  const soldColsSorted = useMemo(() => {
    const items: Array<{ key: string; ym: YM }> = [];
    for (const k of allKeys) {
      if (!/\sSold$/i.test(k)) continue;
      const core = k.replace(/\s+Sold$/i, '');
      const parsed = parseMonthHeaderToDate(core);
      if (parsed) items.push({ key: k, ym: parsed });
    }
    items.sort((a, b) => compareYM(a.ym, b.ym));
    return items;
  }, [allKeys]);

  // We want the last two Sold months (displayed as "Aug", "Jul") in newer → older order
  const last2SoldNewerFirst = useMemo<string[]>(() => {
    const last2 = soldColsSorted.slice(-2).map((x) => x.key);
    const sorted = last2
      .map((k) => ({ k, ym: parseMonthHeaderToDate(k.replace(/\s+Sold$/i, ''))! }))
      .sort((a, b) => compareYM(b.ym, a.ym))
      .map((x) => x.k);
    return sorted;
  }, [soldColsSorted]);

  // The max sold month (to pick forecasts after this)
  const maxSoldYM = useMemo<YM | null>(() => {
    if (!soldColsSorted.length) return null;
    return soldColsSorted[soldColsSorted.length - 1].ym;
  }, [soldColsSorted]);

  // Forecast month columns (no "Sold"), sorted oldest->newest
  const forecastMonthColsSorted = useMemo(() => {
    const arr: Array<{ key: string; ym: YM }> = [];
    for (const k of allKeys) {
      if (/\sSold$/i.test(k)) continue;
      const parsed = parseMonthHeaderToDate(k);
      if (parsed) arr.push({ key: k, ym: parsed });
    }
    arr.sort((a, b) => compareYM(a.ym, b.ym));
    return arr;
  }, [allKeys]);

  // Next 3 forecast months **after** the max sold month (chronological)
  const forecast3 = useMemo<string[]>(() => {
    if (!forecastMonthColsSorted.length) return [];
    let after = forecastMonthColsSorted;
    if (maxSoldYM) {
      after = forecastMonthColsSorted.filter((x) => compareYM(x.ym, maxSoldYM) > 0);
    }
    const chosen = (after.length >= 3 ? after.slice(0, 3) : forecastMonthColsSorted.slice(0, 3)).map(
      (x) => x.key
    );
    return chosen;
  }, [forecastMonthColsSorted, maxSoldYM]);

  // Labels for header 2nd row
  const lastMonthKey = 'Last Month Sales(Units)';
  const soldLabels = useMemo(
    () => last2SoldNewerFirst.map((k) => monthShortLabel(k.replace(/\s+Sold$/i, ''))),
    [last2SoldNewerFirst]
  );
  const forecastLabels = useMemo(() => forecast3.map((k) => monthShortLabel(k)), [forecast3]);

  // Build table rows
  const tableRows = useMemo(
    () =>
      forecastData
        .filter((r) => r && r.sku && r.sku !== 'Total')
        .map((r, idx) => ({
          sNo: idx + 1,
          product: r['Product Name'] ?? '',
          sku: r['sku'] ?? '',
          lastMonth: r[lastMonthKey] ?? '',
          soldNewer: r[last2SoldNewerFirst[0]] ?? '',
          soldOlder: r[last2SoldNewerFirst[1]] ?? '',
          f1: r[forecast3[0]] ?? '',
          f2: r[forecast3[1]] ?? '',
          f3: r[forecast3[2]] ?? '',
        })),
    [forecastData, last2SoldNewerFirst, forecast3]
  );

  // Totals row
  const totalsRow = useMemo(() => {
    const sumCol = (key: string) => {
      if (!key) return 0;
      let sum = 0;
      for (const r of forecastData) {
        if (!r || r.sku === 'Total') continue;
        const n = Number(r[key]);
        if (Number.isFinite(n)) sum += n;
      }
      return Math.round(sum);
    };
    return {
      label: 'Total',
      lastMonth: sumCol(lastMonthKey),
      soldNewer: sumCol(last2SoldNewerFirst[0] || ''),
      soldOlder: sumCol(last2SoldNewerFirst[1] || ''),
      f1: sumCol(forecast3[0] || ''),
      f2: sumCol(forecast3[1] || ''),
      f3: sumCol(forecast3[2] || ''),
    };
  }, [forecastData, last2SoldNewerFirst, forecast3]);

  // ===== Chart: Top 5 SKUs + Total =====
  const chartLabels = useMemo(
    () => ['Last Month', ...soldLabels, ...forecastLabels],
    [soldLabels, forecastLabels]
  );

  const valuesForRow = (r: Record<string, any>) => [
    Number(r[lastMonthKey]) || 0,
    Number(r[last2SoldNewerFirst[0]]) || 0,
    Number(r[last2SoldNewerFirst[1]]) || 0,
    Number(r[forecast3[0]]) || 0,
    Number(r[forecast3[1]]) || 0,
    Number(r[forecast3[2]]) || 0,
  ];

  const top5Rows = useMemo(() => {
    const rows = forecastData
      .filter((r) => r && r.sku && r.sku !== 'Total')
      .map((r) => {
        const vals = valuesForRow(r);
        const total = vals.reduce((a, b) => a + b, 0);
        return { row: r, vals, total };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
    return rows;
  }, [forecastData, last2SoldNewerFirst, forecast3]);

  const grandTotalSeries = useMemo(
    () => [
      totalsRow.lastMonth || 0,
      totalsRow.soldNewer || 0,
      totalsRow.soldOlder || 0,
      totalsRow.f1 || 0,
      totalsRow.f2 || 0,
      totalsRow.f3 || 0,
    ],
    [totalsRow]
  );

  const palette = ['#5EA68E', '#2CA9E0', '#FF8A5B', '#8E6CEF', '#F4C430', '#E15361'];
  const forecastStartIndex = 3;

  const datasets = useMemo(() => {
    const skuDatasets = top5Rows.map((t, i) => ({
      label: (t.row['sku'] as string) || (t.row['Product Name'] as string) || `SKU ${i + 1}`,
      data: t.vals,
      borderColor: palette[i % palette.length],
      backgroundColor: palette[i % palette.length],
      borderWidth: 2,
      tension: 0.3,
      fill: false,
      segment: {
        borderDash: (ctx: any) => {
          const idx = ctx?.p0DataIndex ?? 0;
          return idx >= forecastStartIndex ? [6, 6] : undefined;
        },
      },
    }));

    const totalDs = {
      label: 'Total',
      data: grandTotalSeries,
      borderColor: '#111827',
      backgroundColor: '#111827',
      borderWidth: 3,
      tension: 0.3,
      fill: false,
      segment: {
        borderDash: (ctx: any) => {
          const idx = ctx?.p0DataIndex ?? 0;
          return idx >= forecastStartIndex ? [6, 6] : undefined;
        },
      },
    };

    return [...skuDatasets, totalDs];
  }, [top5Rows, grandTotalSeries]);

  const chartData = useMemo(
    () => ({
      labels: chartLabels,
      datasets,
    }),
    [chartLabels, datasets]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: 'top' as const },
        title: {
          display: true,
          text: `Inventory Forecast — ${countryName?.toUpperCase?.() || ''}`,
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const val = ctx.parsed?.y ?? 0;
              return `${ctx.dataset.label}: ${Number(val).toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: { title: { display: true, text: 'Months' } },
        y: { title: { display: true, text: 'Units' }, beginAtZero: true },
      },
    }),
    [countryName]
  );

  const forecastPlugin = {
    id: 'forecastBackground',
    beforeDraw(chart: any) {
      const { ctx, chartArea, data, scales } = chart;
      const scaleX = scales?.x;
      if (!scaleX || !data?.labels?.length) return;
      const idx = Math.max(0, Math.min(data.labels.length - 1, forecastStartIndex));
      if (data.labels.length <= idx) return;
      const xNow = scaleX.getPixelForValue(idx);
      const hasPrev = idx - 1 >= 0;
      const xPrev = hasPrev ? scaleX.getPixelForValue(idx - 1) : null;
      const startX = xPrev != null ? (xPrev + xNow) / 2 : xNow;
      ctx.save();
      ctx.fillStyle = 'rgba(217,217,217,0.35)';
      ctx.fillRect(startX, chartArea.top, chartArea.right - startX, chartArea.bottom - chartArea.top);
      ctx.restore();
    },
  };

  // Optional month range
 useEffect(() => {
  if (!Array.isArray(data) || data.length === 0) return; // guard

  const fetchMonthRange = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      const resp = await fetch(
        `http://127.0.0.1:5000/api/forecast_monthrange?country=${encodeURIComponent(countryName.toLowerCase())}`,
        { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!resp.ok) {
        // helpful debug in UI console
        console.warn('monthrange failed', resp.status);
        return;
      }
      const j = (await resp.json()) as { month_range?: string };
      setMonthRange(j.month_range ?? null);
    } catch (e) {
      console.warn('monthrange error', e);
    }
  };

  fetchMonthRange();
}, [countryName, data]); 

  const handleDownload = () => {
    // 1) Excel with totals row at bottom
    const header1 = ['S.No', 'Product Name', 'SKU', 'Last 3 Months', '', '', 'Forecasted Months', '', ''];
    const header2 = [
      '', '', '',
      'Last Month', soldLabels[0] || '', soldLabels[1] || '',
      forecastLabels[0] || '', forecastLabels[1] || '', forecastLabels[2] || '',
    ];

    const rows = tableRows.map((r) => [
      r.sNo,
      r.product,
      r.sku,
      r.lastMonth,
      r.soldNewer,
      r.soldOlder,
      r.f1,
      r.f2,
      r.f3,
    ]);

    const totalsExcelRow = [
      '', 'Total', '',
      totalsRow.lastMonth,
      totalsRow.soldNewer,
      totalsRow.soldOlder,
      totalsRow.f1,
      totalsRow.f2,
      totalsRow.f3,
    ];

    const ws = XLSX.utils.aoa_to_sheet([header1, header2, ...rows, totalsExcelRow]);

    // Merge first header row blocks and vertical headers
    (ws as any)['!merges'] = [
      { s: { r: 0, c: 3 }, e: { r: 0, c: 5 } }, // D1-F1
      { s: { r: 0, c: 6 }, e: { r: 0, c: 8 } }, // G1-I1
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // S.No
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Product
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // SKU
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Forecast (View)');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `Inventory_Forecast_View_${countryName}_${month}_${year}.xlsx`
    );

    // 2) Chart PNG
    const chartInstance = chartRef.current;
    const dataUrl = chartInstance?.toBase64Image?.() || chartInstance?.canvas?.toDataURL?.('image/png');
    if (dataUrl) {
      const byteString = atob(dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const imgBlob = new Blob([ab], { type: 'image/png' });
      saveAs(imgBlob, `Inventory_Forecast_Chart_${countryName}_${month}_${year}.png`);
    }
  };

  if (!forecastData.length) return <p style={{ color: 'gray' }}>No data available.</p>;

  return (
    <div>
      <h3  className='text-3xl font-bold text-[#414042]'>
      Forecasted Data - 
        {monthRange && (
          <span className='text-[#5EA68E]'>
          {countryName.toUpperCase()}   <strong>({monthRange})</strong>
          </span>
        )}
      </h3>

      {/* Chart: Top 5 SKUs + Total */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <Line ref={chartRef} data={chartData} options={chartOptions} plugins={[forecastPlugin]} />
      </div>

      {/* Table with two-row header and totals row */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="p-2 border bg-[#5EA68E] text-[#F8EDCE]">S.No</th>
              <th className="p-2 border bg-[#5EA68E] text-[#F8EDCE]">Product Name</th>
              <th className="p-2 border bg-[#5EA68E] text-[#F8EDCE]">SKU</th>
              <th className="p-2 border bg-[#5EA68E] text-[#F8EDCE]" colSpan={3}>
                Last 3 Months
              </th>
              <th className="p-2 border bg-[#5EA68E] text-[#F8EDCE]" colSpan={3}>
                Forecasted Months
              </th>
            </tr>
            <tr>
              <th className="p-2 border bg-[#D9D9D9]"></th>
              <th className="p-2 border bg-[#D9D9D9]"></th>
              <th className="p-2 border bg-[#D9D9D9]"></th>
              <th className="p-2 border bg-[#D9D9D9]">Last Month</th>
              <th className="p-2 border bg-[#D9D9D9]">{soldLabels[0] || ''}</th>
              <th className="p-2 border bg-[#D9D9D9]">{soldLabels[1] || ''}</th>
              <th className="p-2 border bg-[#D9D9D9]">{forecastLabels[0] || ''}</th>
              <th className="p-2 border bg-[#D9D9D9]">{forecastLabels[1] || ''}</th>
              <th className="p-2 border bg-[#D9D9D9]">{forecastLabels[2] || ''}</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, i) => (
              <tr key={i} className="text-center border-t">
                <td className="p-2 border">{row.sNo}</td>
                <td className="p-2 border text-left">{row.product}</td>
                <td className="p-2 border">{row.sku}</td>
                <td className="p-2 border">{row.lastMonth}</td>
                <td className="p-2 border">{row.soldNewer}</td>
                <td className="p-2 border">{row.soldOlder}</td>
                <td className="p-2 border">{row.f1}</td>
                <td className="p-2 border">{row.f2}</td>
                <td className="p-2 border">{row.f3}</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="text-center border-t bg-[#F7F7F7] font-semibold">
              <td className="p-2 border"></td>
              <td className="p-2 border text-left">Total</td>
              <td className="p-2 border"></td>
              <td className="p-2 border">{totalsRow.lastMonth}</td>
              <td className="p-2 border">{totalsRow.soldNewer}</td>
              <td className="p-2 border">{totalsRow.soldOlder}</td>
              <td className="p-2 border">{totalsRow.f1}</td>
              <td className="p-2 border">{totalsRow.f2}</td>
              <td className="p-2 border">{totalsRow.f3}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleDownload}
          className="bg-[#37455F] text-sm text-[#F8EDCE] font-bold w-[220px] py-2 rounded-lg shadow-[0px_4px_4px_0px_#00000040]"
        >
          Download (.xlsx & .png)
        </button>
      </div>
    </div>
  );
};

export default DisplayInventoryForecast;
