'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useManualPreviewMutation,
  useManualSubmitMutation,
} from '@/lib/api/inventoryapi';
import {
  useGetUploadHistoryQuery
} from '@/lib/api/userApi';
import InventoryManualResult from '@/components/inventory/InventoryManualResult';

export default function ManualPage() {
  // ── Read params from URL ──────────────────────────────────────────────────────
  const { countryName, month, year } = useParams() as {
    countryName: string;
    month?: string;
    year?: string;
  };

  // ── Defaults for missing params (e.g., direct /manual) ───────────────────────
  const today = useMemo(() => new Date(), []);
  const effectiveMonth =
    month || today.toLocaleString('en-US', { month: 'long' }).toLowerCase();
  const effectiveYear = year || String(today.getFullYear());

  // ── Upload history (to ensure >= 5 months) ────────────────────────────────────
  const { data: hist } = useGetUploadHistoryQuery();
  const uploads = hist?.uploads ?? [];

  // Memoize derived arrays so identity stays stable (prevents effect loops)
  const countryUploads = useMemo(
    () =>
      uploads.filter(
        (u: any) =>
          (u.country || '').toLowerCase() === (countryName || '').toLowerCase()
      ),
    [uploads, countryName]
  );

  const hasEnoughData = countryUploads.length >= 5;

  // ── RTK Query mutations ───────────────────────────────────────────────────────
  const [preview, { isLoading: loadingPreview }] = useManualPreviewMutation();
  const [submit, { isLoading: loadingSubmit }] = useManualSubmitMutation();

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [rows, setRows] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [missingMonths, setMissingMonths] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [showResult, setShowResult] = useState(false);

  // ── Effect A: Not-enough-data branch (runs only when that boolean changes) ───
  useEffect(() => {
    if (hasEnoughData) return;

    setErrorMsg('Please upload at least 5 months of data to proceed.');

    // Compute last 5 required months vs uploaded ones for this country
    const uploaded = new Set(
      countryUploads.map((u: any) => {
        const m = new Date(`${u.month} 1, ${u.year}`).getMonth() + 1;
        return `${u.year}-${String(m).padStart(2, '0')}`;
      })
    );

    const required: string[] = [];
    const curM = today.getMonth();
    const curY = today.getFullYear();
    for (let i = 1; i <= 5; i++) {
      let m = curM - i;
      let y = curY;
      if (m < 0) {
        m += 12;
        y -= 1;
      }
      required.push(`${y}-${String(m + 1).padStart(2, '0')}`);
    }

    const miss = required
      .filter((m) => !uploaded.has(m))
      .map((m) => {
        const [y, mo] = m.split('-');
        return new Date(Number(y), Number(mo) - 1).toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        });
      });

    setMissingMonths(miss);
  }, [hasEnoughData, countryUploads, today]);

  // ── Effect B: Load preview when enough data and params change ────────────────
  useEffect(() => {
    if (!hasEnoughData) return;

    let cancelled = false;
    (async () => {
      try {
        const res: any = await preview({
          country: countryName,
          month: effectiveMonth,
          year: effectiveYear,
        }).unwrap();

        if (cancelled) return;

        const previewRows = res?.rows || res?.items || res?.data || [];
        if (!Array.isArray(previewRows) || previewRows.length === 0) {
          setNotice('No preview data – you can still input growth % and submit.');
          setTableData([]);
          return;
        }

        // Normalize rows shown in the manual input table
        const mapped = previewRows.map((r: any, i: number) => ({
          sku: r.sku || `sku_${i}`,
          productName: r.name || r.product_name || r.sku || `Item ${i + 1}`,
          lastMonthSales: Number(r.last_month_units ?? 0),
          peakLast3: Number(r.peak_last3 ?? r['Peak Sale (last 3 mo)'] ?? 0),
          lastMonthGrowth: Number(r.last_month_growth_pct ?? 0),
          userInputGrowth: Number(r.growth_pct ?? 0),
        }));

        setTableData(mapped);
        setNotice((old) => (old === 'Preview loaded' ? old : 'Preview loaded'));
      } catch (e: any) {
        if (!cancelled) setErrorMsg(e?.message || 'Failed to load preview');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasEnoughData, countryName, effectiveMonth, effectiveYear, preview]);

  // ── Build growth map and submit ──────────────────────────────────────────────
  const buildGrowthMap = () =>
    tableData.reduce((acc: Record<string, number>, r: any) => {
      acc[r.sku] = Number(r.userInputGrowth) || 0;
      return acc;
    }, {});

const onSubmit = async () => {
  if (!hasEnoughData) return;

  const payload = {
    country: (countryName || '').toLowerCase().trim(),
    month: (effectiveMonth || '').toLowerCase().trim(),
    year: String(effectiveYear || '').trim(),
    growth: buildGrowthMap(),
  };

  const result: any = await submit(payload); // no unwrap while debugging
  if ('error' in result) {
    try { console.error('manual submit error (result.error):', JSON.parse(JSON.stringify(result.error))); }
    catch { console.error('manual submit error (result.error):', result.error); }
    setErrorMsg(result.error?.data?.message || result.error?.error || 'Submit failed');
    return;
  }

  const res = result.data ?? result;
  const finalRows =
    res?.rows ??
    res?.table ??
    res?.forecast ??
    res?.data?.rows ??
    res?.data?.table ??
    res?.data?.forecast ??
    (Array.isArray(res) ? res : []);

  sessionStorage.setItem('manualForecastRows', JSON.stringify(finalRows));
  setRows(Array.isArray(finalRows) ? finalRows : []);
  setShowResult(true);
};

const totalLastMonthSales = tableData.reduce(
  (sum: number, row: any) => sum + Number(row.lastMonthSales || 0),
  0
);

  // ── Render branches ──────────────────────────────────────────────────────────
  if (!hasEnoughData) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen font-lato">
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-md text-sm text-red-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          </div>
          <p className="mt-2 text-xs">
            The following Monthly files are needed to upload:{' '}
            <strong className="text-green-600">{missingMonths.join(', ')}</strong>
          </p>
        </div>
      </div>
    );
  }

 if (showResult) {
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-lato">
      <InventoryManualResult
        inlineData={rows}
        inlineCountry={countryName}
        inlineMonth={effectiveMonth}
        inlineYear={effectiveYear}
      />
    </div>
  );
}

  // ── Manual input table ───────────────────────────────────────────────────────
  return (
    <div className="p-3">
      <h1 className="text-3xl font-bold text-[#414042] mb-6">
       Forecast Table - <span className='text-[#5EA68E]'>{countryName} - {effectiveMonth}{' '}</span>
      </h1>

    

     <div className="overflow-x-auto shadow-md bg-white mb-6">
  <table className="min-w-full border border-gray-200 font-lato">
  <thead className="bg-[#5EA68E] text-[#F8EDCE]">
    <tr>
      <th className="py-3 px-4 text-center font-medium border border-green-700 text-sm ">
        S. No.
      </th>
      <th className="py-3 px-4 text-left font-medium border border-green-700 text-sm">
        Product Name
      </th>
      <th className="py-3 px-4 text-center font-medium border border-green-700 text-sm">
        SKU
      </th>
      <th className="py-3 px-4 text-center font-medium border border-green-700 text-sm">
        Last Month Sales (Units)
      </th>
      <th className="py-3 px-4 text-center font-medium border border-green-700 text-sm">
        Peak Sale (last 3 mo)
      </th>
      <th className="py-3 px-4 text-center font-medium border border-green-700 text-sm">
        Last Month Growth (%)
      </th>
      <th className="py-3 px-4 text-center font-medium border border-green-700 text-sm">
        Growth (%)
      </th>
    </tr>
  </thead>

  <tbody>
  {tableData.map((row: any, i: number) => (
    <tr key={row.sku} className={i % 2 === 0 ? "bg-white" : "bg-green-50"}>
      <td className="py-1 px-4 text-center border-r border-gray-200 text-sm">
        {i + 1}
      </td>
      <td className="py-1 px-4 text-gray-800 border-r border-gray-200 text-left text-sm">
        {row.productName}
      </td>
      <td className="py-1 px-4 text-center border-r border-gray-200 text-sm">
        {row.sku}
      </td>
      <td className="py-1 px-4 text-center border-r border-gray-200 text-sm">
        {row.lastMonthSales}
      </td>
      <td className="py-1 px-4 text-center border-r border-gray-200 text-sm">
        {row.peakLast3}
      </td>
      <td className="py-1 px-4 text-center border-r border-gray-200 text-sm">
        {row.lastMonthGrowth}%
      </td>
      <td className="py-1 px-4 text-center">
        <div className="flex justify-center items-center gap-1">
          <input
            type="number"
            className="w-20 border border-gray-300 rounded text-center py-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-lato"
            value={row.userInputGrowth}
            onChange={(e) => {
              const copy = [...tableData];
              copy[i].userInputGrowth = Number(e.target.value) || 0;
              setTableData(copy);
            }}
          />
          <span className="text-gray-600">%</span>
        </div>
      </td>
    </tr>
  ))}

  {/* Total row */}
  <tr className="bg-gray-100 font-semibold text-gray-800">
    <td
      colSpan={3}
      className="py-2 px-4 text-left border border-gray-200"
    >
      Total 
    </td>
    <td className="py-2 px-4 text-center border border-gray-200">
      {totalLastMonthSales}
    </td>
    <td colSpan={3} className="py-2 px-4 border border-gray-200"></td>
  </tr>
</tbody>
</table>

</div>

      <div className="flex justify-end items-center mt-5">
       
        <button
          onClick={onSubmit}
          disabled={loadingSubmit}
          className={`bg-[#37455F] text-sm text-[#F8EDCE] font-bold w-[200px] py-2 rounded-lg shadow ${
            loadingSubmit ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loadingSubmit ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </div>
  );
}