"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  type JSX,
  useCallback,
} from "react";
import MonthYearPickerTable from "@/components/filters/MonthYearPickerTable";
import { FiDownload } from "react-icons/fi";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { ColumnDef, Row } from "@/components/ui/table/DataTable";
import Button from "@/components/ui/button/Button";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ===================== ENV / CONSTANTS ===================== */
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

/* ===================== Types ===================== */
interface DonutProps {
  label: string;
  pct: number;
  amount: number;
  color?: string;
}

type ReferralRow = Partial<{
  sku: string;
  product_name: string;
  category: string;
  asin: string;
  quantity: number | string;
  sales: number | string;
  product_sales: number | string;
  refRate: number | string;
  refFeesApplicable: number | string;
  refFeesCharged: number | string;
  overcharged: number | string;
  difference: number | string;
  errorstatus: string;
  selling_fees: number | string;
  answer: number | string;
}>;

type Summary = {
  ordersUnits: number;
  totalSales: number;
  feeImpact: number;
};

type FeeSummaryRow = {
  label: string;
  units: number;
  sales: number;
  refFeesApplicable: number;
  refFeesCharged: number;
  overcharged: number;
};

type ProductOverchargeRow = {
  sku: string;
  productName: string;
  quantity: number;
  sales: number;
  refRate: number;
  refFeesApplicable: number;
  refFeesCharged: number;
  overcharged: number;
  total: number;
};

/* ===================== Formatters ===================== */
const fmtCurrency = (n: number): string =>
  typeof n === "number"
    ? n.toLocaleString(undefined, {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    : "-";


const fmtNumber = (n: number): string =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "-";

const fmtInteger = (n: number): string =>
  typeof n === "number"
    ? n.toLocaleString(undefined, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })
    : "-";


const toNumberSafe = (v: any): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  const num = Number(String(v).replace(/[, ]+/g, ""));
  return Number.isNaN(num) ? 0 : num;
};

/* ===================== Donut Component ===================== */
function Donut({ label, pct, amount, color = "#60A68E" }: DonutProps) {
  const data = {
    labels: [label, "Remaining"],
    datasets: [
      {
        data: [pct, Math.max(0, 100 - pct)],
        backgroundColor: [color, "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  } as const;

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col items-center">
      <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
        {label}
      </h3>

      <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36">
        <Doughnut data={data} options={options} />
      </div>

      <p className="mt-2 text-lg sm:text-xl lg:text-2xl font-bold">
        {Number.isFinite(pct) ? pct.toFixed(2) : 0}%
      </p>

      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
        {fmtCurrency(amount)}
      </p>
    </div>
  );
}



const donutColors = [
  "#14B8A6", // green
  "#FB923C", // amber
  "#EF4444", // red
];

/* ===================== MAIN DASHBOARD ===================== */
export default function ReferralFeesDashboard(): JSX.Element {
  const [country] = useState<string>("UK");
  const [month, setMonth] = useState<string>("january");
  const [year, setYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  // API data
  const [rows, setRows] = useState<ReferralRow[]>([]);
  // 👇 NEW: skuwise smaller table (14 rows)
  const [skuwiseRows, setSkuwiseRows] = useState<ReferralRow[]>([]);
  const [summary, setSummary] = useState<Summary>({
    ordersUnits: 0,
    totalSales: 0,
    feeImpact: 0,
  });
  const [feeSummaryRows, setFeeSummaryRows] = useState<FeeSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("unknown");

  /* ======= derive userId from JWT ======= */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      const id = decoded?.user_id?.toString() ?? "unknown";
      setUserId(id);
    } catch {
      setUserId("unknown");
    }
  }, []);

  /* ======= fileName ======= */
  const fileName = useMemo(
    () =>
      `user_${userId}_${country.toLowerCase()}_${month}${year}_data`.toLowerCase(),
    [userId, country, month, year]
  );

  /* ===================== API Fetch ===================== */
  const fetchReferralData = useCallback(async () => {
    if (!month || !year || !country) return;
    setLoading(true);
    setError(null);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("jwtToken")
          : null;

      const params = new URLSearchParams({
        country: country,
        month: month,
        year: year,
      });

      const url = `${baseURL}/get_table_data/${fileName}?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch referral data (${res.status})`);
      }

      const json: any = await res.json();
      console.log("REFERRAL JSON:", json);

      // full table for calculations / overcharged logic
      const tableData = json?.table_data ?? json;
      const arr: ReferralRow[] = Array.isArray(tableData) ? tableData : [];
      setRows(arr);

      // 👇 NEW: sku-wise subset (14 rows)
      const skuwise = json?.skuwise_table_data ?? [];
      const skuArr: ReferralRow[] = Array.isArray(skuwise) ? skuwise : [];
      setSkuwiseRows(skuArr);

      // summary_table mapping
      const summary_table = json?.summary_table ?? [];
      const mappedSummary: FeeSummaryRow[] = Array.isArray(summary_table)
        ? summary_table.map(
          (r: any): FeeSummaryRow => ({
            label: r["Ref Fees"],
            // units: toNumberSafe(r["Units"]),
            units: Math.round(toNumberSafe(r["Units"])),
            sales: toNumberSafe(r["Sales"]),
            refFeesApplicable: toNumberSafe(r["Ref Fees Applicable"]),
            refFeesCharged: toNumberSafe(r["Ref Fees Charged"]),
            overcharged: toNumberSafe(r["Overcharged"]),
          })
        )
        : [];

      setFeeSummaryRows(mappedSummary);

      // aggregate summary from detailed rows (still using full table_data)
      let totalUnits = 0;
      let totalSales = 0;
      let feeImpact = 0;

      for (const r of arr) {
        totalUnits += Math.round(toNumberSafe(r.quantity));
        totalSales += toNumberSafe(r.product_sales ?? r.sales);
        feeImpact += toNumberSafe(r.overcharged ?? r.difference);
      }

      setSummary({
        ordersUnits: totalUnits,
        totalSales,
        feeImpact,
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load data");
      setRows([]);
      setSkuwiseRows([]);
      setFeeSummaryRows([]);
      setSummary({ ordersUnits: 0, totalSales: 0, feeImpact: 0 });
    } finally {
      setLoading(false);
    }
  }, [month, year, country, fileName]);

  useEffect(() => {
    fetchReferralData();
  }, [fetchReferralData]);

  /* ===================== Derived from summary_table ===================== */

  const totalFeeRow = useMemo<FeeSummaryRow | null>(() => {
    if (!feeSummaryRows.length) return null;
    const total =
      feeSummaryRows.find(
        (r) => r.label && r.label.toLowerCase() === "total"
      ) || feeSummaryRows[feeSummaryRows.length - 1];
    return total || null;
  }, [feeSummaryRows]);

  const cardSummary = useMemo(
    () => ({
      ordersUnits: totalFeeRow?.units ?? 0,
      totalSales: totalFeeRow?.sales ?? 0,
      feeImpact: totalFeeRow?.overcharged ?? 0,
    }),
    [totalFeeRow]
  );

  const feeDonuts = useMemo(() => {
    if (!totalFeeRow) {
      return [
        { label: "Fees Applicable", pct: 0, amount: 0 },
        { label: "Fees Charged", pct: 0, amount: 0 },
        { label: "Overcharged", pct: 0, amount: 0 },
      ];
    }

    const sales = totalFeeRow.sales || 0;
    const applicable = totalFeeRow.refFeesApplicable || 0;
    const charged = totalFeeRow.refFeesCharged || 0;
    const overcharged = totalFeeRow.overcharged || 0;

    const applicablePct = sales ? (applicable / sales) * 100 : 0;
    const chargedPct = sales ? (charged / sales) * 100 : 0;
    const overchargedPct = charged ? (overcharged / charged) * 100 : 0;

    return [
      {
        label: "Fees Applicable",
        pct: applicablePct,
        amount: applicable,
      },
      {
        label: "Fees Charged",
        pct: chargedPct,
        amount: charged,
      },
      {
        label: "Overcharged",
        pct: overchargedPct,
        amount: overcharged,
      },
    ];
  }, [totalFeeRow]);

  /* ===================== Product-wise Overcharged Rows (for Excel) ===================== */

  const overchargedRows = useMemo<ProductOverchargeRow[]>(() => {
    if (!rows.length) return [];

    const grouped = new Map<string, ProductOverchargeRow>();

    rows.forEach((r) => {
      const over = toNumberSafe(r.overcharged ?? r.difference);
      if (over <= 0) return; // skip rows without positive overcharge

      const sku = String(r.sku ?? "");
      const productName = String(r.product_name ?? "");
      const quantity = Math.round(toNumberSafe(r.quantity)); // units as whole numbers
      const sales = toNumberSafe(r.product_sales ?? r.sales);
      const applicable = toNumberSafe(r.answer);
      const charged = toNumberSafe(r.selling_fees);
      const total = toNumberSafe((r as any).total);

      const existing = grouped.get(sku);

      if (!existing) {
        grouped.set(sku, {
          sku,
          productName,
          quantity,
          sales,
          refRate: 0, // will compute later
          refFeesApplicable: applicable,
          refFeesCharged: charged,
          overcharged: over,
          total,
        });
      } else {
        existing.quantity += quantity;
        existing.sales += sales;
        existing.refFeesApplicable += applicable;
        existing.refFeesCharged += charged;
        existing.overcharged += over;
        existing.total += total;
      }
    });

    // compute Ref % per SKU from aggregated values
    return Array.from(grouped.values()).map((item) => ({
      ...item,
      refRate: item.sales ? (item.refFeesApplicable / item.sales) * 100 : 0,
    }));
  }, [rows]);


  /* ===================== Excel Download ===================== */

  const handleDownloadExcel = useCallback(() => {
    if (!rows.length && !overchargedRows.length) return;

    const wb = XLSX.utils.book_new();

    // Sheet 1: Overcharged Ref Fees
    const overDataBody = overchargedRows.map((r) => ({
      SKU: r.sku,
      "Product Name": r.productName,
      Units: Math.round(r.quantity),
      Sales: Number(r.sales.toFixed(2)),
      "Ref %": Number(r.refRate.toFixed(2)),
      "Ref Fees Applicable": Number(r.refFeesApplicable.toFixed(2)),
      "Ref Fees Charged": Number(r.refFeesCharged.toFixed(2)),
      Overcharged: Number(r.overcharged.toFixed(2)),
    }));

    const totals = overchargedRows.reduce(
      (acc, r) => {
        acc.units += Math.round(r.quantity);
        acc.sales += r.sales;
        acc.refFeesApplicable += r.refFeesApplicable;
        acc.refFeesCharged += r.refFeesCharged;
        acc.overcharged += r.overcharged;
        return acc;
      },
      {
        units: 0,
        sales: 0,
        refFeesApplicable: 0,
        refFeesCharged: 0,
        overcharged: 0,
      }
    );

    const totalRow = {
      SKU: "TOTAL",
      "Product Name": "",
      Units: totals.units,
      Sales: Number(totals.sales.toFixed(2)),
      "Ref %": "",
      "Ref Fees Applicable": Number(totals.refFeesApplicable.toFixed(2)),
      "Ref Fees Charged": Number(totals.refFeesCharged.toFixed(2)),
      Overcharged: Number(totals.overcharged.toFixed(2)),
    };

    const overData = [...overDataBody, totalRow];

    const wsOver = XLSX.utils.json_to_sheet(overData);
    XLSX.utils.book_append_sheet(wb, wsOver, "Overcharged Ref Fees");

    // Sheet 2: All Data (raw table_data)
    const allData = rows.map((r) => ({ ...r }));
    const wsAll = XLSX.utils.json_to_sheet(allData);
    XLSX.utils.book_append_sheet(wb, wsAll, "All Data");

    XLSX.writeFile(
      wb,
      `Referral-Fees-${country}-${month}-${year}.xlsx`
    );
  }, [rows, overchargedRows, country, month, year]);


  // Columns for DataTable (SKU-wise overcharged)
  const skuColumns: ColumnDef<Row>[] = [
    { key: "sku", header: "SKU" },
    { key: "productName", header: "Product Name" },
    { key: "units", header: "Units" },
    { key: "sales", header: "Sales", render: (_, v) => fmtCurrency(Number(v)) },
    { key: "refPct", header: "Ref %", render: (_, v) => `${Number(v).toFixed(2)}%` },
    { key: "applicable", header: "Ref Fees Applicable", render: (_, v) => fmtCurrency(Number(v)) },
    { key: "charged", header: "Ref Fees Charged", render: (_, v) => fmtCurrency(Number(v)) },
    {
      key: "overcharged", header: "Overcharged", render: (_, v) => (
        <span >{fmtCurrency(Number(v))}</span>
      )
    },
  ];

  const skuTableData: Row[] = skuwiseRows.map((r, idx) => {
    const quantity = Math.round(toNumberSafe(r.quantity));
    const sales = toNumberSafe(r.product_sales ?? r.sales);
    const applicable = toNumberSafe(r.answer);
    const charged = toNumberSafe(r.selling_fees);
    const overcharged = toNumberSafe(r.overcharged ?? r.difference);

    const refPct = sales ? (applicable / sales) * 100 : 0;

    // Detect TOTAL row (either by value or by position)
    const isTotal =
      String(r.sku ?? "").toUpperCase() === "TOTAL" ||
      idx === skuwiseRows.length - 1;

    return {
      sku: isTotal ? "TOTAL" : (r.sku ?? ""),
      productName: isTotal ? "" : (r.product_name ?? ""),   // 👈 BLANK second column
      units: quantity,
      sales,
      refPct,
      applicable,
      charged,
      overcharged,
      _isTotal: isTotal,   // 👈 helper flag for styling
    };
  });



  /* ===================== RENDER ===================== */

  return (
    <div className="p-4 space-y-4 font-sans text-[#414042]">
      {/* Top bar */}
      {/* <div className="flex gap-2">
        <PageBreadcrumb pageTitle="Referral Fees -" variant="page" align="left" textSize="2xl" />
        <span className="text-[#5EA68E] text-2xl">
          {country.toUpperCase()}
        </span>
      </div> */}

      <div className="flex items-baseline gap-2">
        <PageBreadcrumb
          pageTitle="Referral Fees -"
          variant="page"
          align="left"
          textSize="2xl"
          className="mb-0"
        />
        <span className="text-[#5EA68E] text-xl sm:text-2xl">
          {country.toUpperCase()}
        </span>
      </div>


      {/* Filter row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MonthYearPickerTable
          month={month}
          year={year}
          yearOptions={[
            new Date().getFullYear(),
            new Date().getFullYear() - 1,
          ]}
          onMonthChange={(v) => setMonth(v)}
          onYearChange={(v) => setYear(v)}
          valueMode="lower"
        />
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-sm text-slate-600">Loading data…</div>
      )}
      {!loading && error && (
        <div className="text-sm text-red-600">Error: {error}</div>
      )}

      {/* <h3 className="text-sm font-semibold mb-2">Summary Overview</h3> */}

      <PageBreadcrumb pageTitle="Summary Overview" variant="page" align="left" className="mt-4" />

      {/* Summary tiles */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Orders Units</p>
          <p className="text-3xl font-bold text-emerald-700">
            {fmtInteger(cardSummary.ordersUnits)}
          </p>

        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-3xl font-bold text-amber-600">
            {fmtCurrency(cardSummary.totalSales)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Fee Impact</p>
          <p className="text-3xl font-bold text-rose-600">
            {fmtCurrency(cardSummary.feeImpact)}
          </p>
        </div>
      </div> */}

      {/* Summary tiles */}
      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Orders / Units */}
        <div className="
      rounded-xl border border-[#87AD12] bg-[#87AD1226]
      px-3 py-2 sm:px-4 sm:py-3
    ">
          <p className="text-xs sm:text-sm font-medium text-charcoal-500">
            Orders/Units
          </p>

          <p className="mt-1 text-xl sm:text-2xl font-bold text-charcoal-500">
            {fmtInteger(cardSummary.ordersUnits)}
          </p>

          <p className="mt-1 text-[10px] sm:text-xs text-charcoal-500">
            Total Units Processed
          </p>
        </div>

        {/* Total Sales */}
        <div className="
      rounded-xl border border-[#F47A00] bg-[#F47A0026]
      px-3 py-2 sm:px-4 sm:py-3
    ">
          <p className="text-xs sm:text-sm font-medium text-charcoal-500">
            Total Sales
          </p>

          <p className="mt-1 text-xl sm:text-2xl font-bold text-charcoal-500">
            {fmtCurrency(cardSummary.totalSales)}
          </p>

          <p className="mt-1 text-[10px] sm:text-xs text-charcoal-500">
            Revenue generated
          </p>
        </div>

        {/* Fee Impact */}
        <div className="
      rounded-xl border border-[#FF5C5C] bg-[#FF5C5C26]
      px-3 py-2 sm:px-4 sm:py-3
    ">
          <p className="text-xs sm:text-sm font-medium text-charcoal-500">
            Fee Impact
          </p>

          <p className="mt-1 text-xl sm:text-2xl font-bold text-charcoal-500">
            {fmtCurrency(cardSummary.feeImpact)}
          </p>

          <p className="mt-1 text-[10px] sm:text-xs text-charcoal-500">
            Overcharged amount
          </p>
        </div>

      </div>



      {/* Summary Overview table */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="min-w-[720px] w-full text-xs md:text-sm whitespace-nowrap">
          <thead className="text-charcoal-500 border-b-[1px] border-charcoal-500">
            <tr className="font-black">
              <th className="text-left py-3 px-3">Ref. Fees</th>
              <th className="text-left py-3 px-3">Units</th>
              <th className="text-left py-3 px-3">Sales</th>
              <th className="text-left py-3 px-3">Ref Fees Applicable</th>
              <th className="text-left py-3 px-3">Ref Fees Charged</th>
              <th className="text-left py-3 px-3">Overcharged</th>
            </tr>
          </thead>

          <tbody>
            {feeSummaryRows.map((r: FeeSummaryRow, index) => {
              const isLast = index === feeSummaryRows.length - 1;
              const isSecondLast = index === feeSummaryRows.length - 2;

              return (
                <tr
                  key={r.label}
                  className={`${isLast || isSecondLast
                      ? "border-b-[2.5px] border-charcoal-500"
                      : "border-b-[1px] border-charcoal-500"
                    }`}
                >
                  <td className={`py-2 px-3 ${isLast ? "font-black" : ""}`}>
                    {r.label}
                  </td>
                  <td className={`py-2 px-3 ${isLast ? "font-black" : ""}`}>
                    {fmtInteger(r.units)}
                  </td>
                  <td className={`py-2 px-3 ${isLast ? "font-black" : ""}`}>
                    {fmtCurrency(r.sales)}
                  </td>
                  <td className={`py-2 px-3 ${isLast ? "font-black" : ""}`}>
                    {fmtCurrency(r.refFeesApplicable)}
                  </td>
                  <td className={`py-2 px-3 ${isLast ? "font-black" : ""}`}>
                    {fmtCurrency(r.refFeesCharged)}
                  </td>
                  <td className={`py-2 px-3 ${isLast ? "font-black" : ""}`}>
                    {fmtCurrency(r.overcharged)}
                  </td>
                </tr>
              );
            })}

            {!feeSummaryRows.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 px-3 text-center text-slate-500 italic"
                >
                  No summary available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Donuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {feeDonuts.map((d, index) => (
          <Donut
            key={d.label}
            label={d.label}
            pct={Number.isFinite(d.pct) ? d.pct : 0}
            amount={d.amount}
            color={donutColors[index % donutColors.length]}
          />
        ))}
      </div>


      {/* ✅ SKU-wise table using skuwise_table_data */}
      <div className="bg-white rounded-2xl shadow p-4 w-full overflow-x-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-2 gap-2 min-w-max">

          <PageBreadcrumb pageTitle="Product-wise Details of Overcharged Ref Fees" variant="page" align="left" className="mt-4" />
          <Button
            onClick={handleDownloadExcel}
            variant="primary"
            size="sm"
            // className="inline-flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-xl text-xs md:text-sm whitespace-nowrap"
          >
            <FiDownload className="h-4 w-4" />
            Download Excel
          </Button>
        </div>

        {/* <table className="min-w-[960px] text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2 px-2 whitespace-nowrap">SKU</th>
              <th className="text-left py-2 px-2 whitespace-nowrap">
                Product Name
              </th>
              <th className="text-left py-2 px-2 whitespace-nowrap">Units</th>
              <th className="text-left py-2 px-2 whitespace-nowrap">Sales</th>
              <th className="text-left py-2 px-2 whitespace-nowrap">Ref %</th>
              <th className="text-left py-2 px-2 whitespace-nowrap">
                Ref Fees Applicable
              </th>
              <th className="text-left py-2 px-2 whitespace-nowrap">
                Ref Fees Charged
              </th>
              <th className="text-left py-2 px-2 whitespace-nowrap">
                Overcharged
              </th>
            </tr>
          </thead>
          <tbody>
            {skuwiseRows.map((r, idx) => {
              const quantity = Math.round(toNumberSafe(r.quantity));
              const sales = Number(toNumberSafe(r.product_sales ?? r.sales).toFixed(2));
              const applicable = Number(toNumberSafe(r.answer).toFixed(2));
              const charged = Number(toNumberSafe(r.selling_fees).toFixed(2));
              const over = Number(toNumberSafe(r.overcharged ?? r.difference).toFixed(2));

              const refPct = sales ? (applicable / sales) * 100 : 0;

              return (
                <tr
                  key={`${r.sku ?? "sku"}-${idx}`}
                  className="border-b"
                >
                  <td className="py-2 px-2 font-medium whitespace-nowrap">
                    {r.sku}
                  </td>
                  <td className="py-2 px-2">{r.product_name}</td>
                  
                  <td className="py-2 px-2 whitespace-nowrap">
                    {fmtInteger(quantity)}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {fmtCurrency(sales)}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {refPct.toFixed(2)}%
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {fmtCurrency(applicable)}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {fmtCurrency(charged)}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap text-rose-600 font-semibold">
                    {fmtCurrency(over)}
                  </td>
                </tr>
              );
            })}
            {!skuwiseRows.length && (
              <tr>
                <td
                  colSpan={11}
                  className="py-4 text-center text-slate-500 italic"
                >
                  No SKU-wise data available.
                </td>
              </tr>
            )}
          </tbody>
        </table> */}

        <DataTable
          columns={skuColumns}
          data={skuTableData}
          paginate={false}     // 👈 no pagination
          scrollY={false}      // 👈 no vertical scrollbar
          maxHeight="none"     // optional; won't matter if scrollY=false per style above
          zebra={true}
          stickyHeader={false} // you can set true/false as you like
          rowClassName={(row) =>
            (row as any)._isTotal
              ? "bg-[#DDDDDD] font-bold"   // 👈 different bg + font for TOTAL row
              : ""
          }
        />

      </div>
    </div>
  );
}
