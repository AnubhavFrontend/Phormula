// // // "use client";

// // // import { useParams } from "next/navigation";
// // // import { useEffect, useMemo, useState } from "react";
// // // import * as XLSX from "xlsx";
// // // import { jwtDecode } from "jwt-decode";
// // // import MonthYearPickerTable from "@/components/filters/MonthYearPickerTable";

// // // // ---- Types ----
// // // type TableRow = Partial<{
// // //     sku: string;
// // //     quantity: number | string;
// // //     marketplace: string;
// // //     product_sales: number | string;
// // //     product_sales_tax: number | string;
// // //     postage_credits: number | string;
// // //     promotional_rebates: number | string;
// // //     selling_fees: number | string;
// // //     product_name: string;
// // //     difference: number | string;
// // //     errorstatus: string;
// // //     answer: string;
// // //     // ...other possible keys from your backend are ignored by design
// // // }>;

// // // export default function ReferralFeesPage() {
// // //     // If your route is /referral-fees/[countryName]/[month]/[year]
// // //     const params = useParams<{
// // //         countryName?: string;
// // //         month?: string;
// // //         year?: string;
// // //     }>();

// // //     const countryName = (params?.countryName || "").toString();
// // //     const monthParam = (params?.month || "").toString();
// // //     const yearParam = (params?.year || "").toString();

// // //     const months = [
// // //         "January",
// // //         "February",
// // //         "March",
// // //         "April",
// // //         "May",
// // //         "June",
// // //         "July",
// // //         "August",
// // //         "September",
// // //         "October",
// // //         "November",
// // //         "December",
// // //     ];

// // //     const years = useMemo(
// // //         () => Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i),
// // //         []
// // //     );

// // //     const [month, setMonth] = useState<string>(monthParam || "");
// // //     const [year, setYear] = useState<string>(yearParam || "");
// // //     const [tableData, setTableData] = useState<TableRow[]>([]);
// // //     const [loading, setLoading] = useState<boolean>(false);
// // //     const [error, setError] = useState<string | null>(null);


// // //     // === Column filtering config ===
// // //     const VISIBLE_COLUMNS: (keyof TableRow)[] = [
// // //         "sku",
// // //         "quantity",
// // //         "marketplace",
// // //         "product_sales",
// // //         "product_sales_tax",
// // //         "postage_credits",
// // //         "promotional_rebates",
// // //         "selling_fees",
// // //         "product_name",
// // //         "difference",
// // //         "errorstatus",
// // //         "answer",
// // //     ];

// // //     const COLUMN_LABELS: Record<keyof TableRow, string> = {
// // //         sku: "SKU",
// // //         quantity: "Quantity",
// // //         marketplace: "Marketplace",
// // //         product_sales: "Product Sales",
// // //         product_sales_tax: "Product Sales Tax",
// // //         postage_credits: "Postage Credits",
// // //         promotional_rebates: "Promotional Rebates",
// // //         selling_fees: "Selling Fees",
// // //         product_name: "Product Name",
// // //         difference: "Difference",
// // //         errorstatus: "Error Status",
// // //         answer: "Answer",
// // //     };

// // //     // Derive the columns to render (only those present in the data)
// // //     const columns = useMemo(() => {
// // //         if (tableData?.length) {
// // //             return VISIBLE_COLUMNS.filter((c) => c in tableData[0]);
// // //         }
// // //         return VISIBLE_COLUMNS;
// // //     }, [tableData]);

// // //     // Create a filtered view of the data for rendering & export
// // //     const filteredRows = useMemo(
// // //         () =>
// // //             tableData.map((row) =>
// // //                 Object.fromEntries(columns.map((c) => [c, (row as any)?.[c]]))
// // //             ) as TableRow[],
// // //         [tableData, columns]
// // //     );

// // //     // Build filename safely (guard against missing/invalid token)
// // //     const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
// // //     let userid = "unknown";
// // //     try {
// // //         if (token) {
// // //             const decoded: any = jwtDecode(token);
// // //             userid = decoded?.user_id?.toString() ?? "unknown";
// // //         }
// // //     } catch {
// // //         // ignore decode errors; userid stays "unknown"
// // //     }

// // //     const fileName = `user_${userid}_${countryName}_${month}${year}_data`.toLowerCase();

// // //     const fetchTableData = async () => {
// // //         setLoading(true);
// // //         try {
// // //             const authToken = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
// // //             const response = await fetch(
// // //                 `http://127.0.0.1:5000/get_table_data/${fileName}`,
// // //                 {
// // //                     method: "GET",
// // //                     headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
// // //                 }
// // //             );

// // //             if (!response.ok) throw new Error("Failed to fetch table data");
// // //             const data = (await response.json()) as TableRow[];
// // //             setTableData(Array.isArray(data) ? data : []);
// // //             setError(null);
// // //         } catch (err: any) {
// // //             setError(err?.message || "Unknown error");
// // //             setTableData([]);
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     // Keep state in sync if params change (e.g., via navigation)
// // //     useEffect(() => {
// // //         if (monthParam && monthParam !== month) setMonth(monthParam);
// // //         if (yearParam && yearParam !== year) setYear(yearParam);
// // //     }, [monthParam, yearParam]); // eslint-disable-line react-hooks/exhaustive-deps

// // //     useEffect(() => {
// // //         if (month && year && countryName) {
// // //             fetchTableData();
// // //         }
// // //         // eslint-disable-next-line react-hooks/exhaustive-deps
// // //     }, [month, year, countryName]);

// // //     const handleDownload = () => {
// // //         const exportRows = filteredRows.map((row) => {
// // //             const out: Record<string, any> = {};
// // //             columns.forEach((c) => {
// // //                 const label = COLUMN_LABELS[c] || (c as string);
// // //                 out[label] = (row as any)[c];
// // //             });
// // //             return out;
// // //         });

// // //         const worksheet = XLSX.utils.json_to_sheet(exportRows);
// // //         const workbook = XLSX.utils.book_new();
// // //         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
// // //         const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
// // //         const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
// // //         const link = document.createElement("a");
// // //         link.href = URL.createObjectURL(blob);
// // //         link.download = `Referral-fees-${month}-${year}-${countryName}.xlsx`;
// // //         document.body.appendChild(link);
// // //         link.click();
// // //         link.remove();
// // //     };

// // //     return (
// // //         <div className="font-sans text-[#414042]">
// // //             <h2 className="text-base md:text-lg font-bold bg-white rounded-md">
// // //                 Referral Fees Error Status Recon{" "}
// // //                 <span className="text-[#60a68e]">
// // //                     {countryName ? countryName.toUpperCase() : ""}
// // //                 </span>
// // //             </h2>

// // //             {/* Dropdowns */}

// // //             <MonthYearPickerTable
// // //                 month={month}                             // could be lowercase like "november"
// // //                 year={year}
// // //                 yearOptions={years}
// // //                 onMonthChange={(v) => setMonth(v)}        // v will be lowercase because of valueMode="lower"
// // //                 onYearChange={(v) => setYear(v)}
// // //                 valueMode="lower"                         // emit lowercase to match backend/URL
// // //             />

// // //             {/* Loader & Errors */}
// // //             {loading && <div className="text-sm">Loading...</div>}
// // //             {!loading && error && tableData.length === 0 && (
// // //                 <div className="text-sm text-red-600">Error: {error}</div>
// // //             )}

// // //             {!loading && month && year && countryName && (
// // //                 <>
// // //                     {/* Data table (filtered to VISIBLE_COLUMNS) */}
// // //                     <div className="w-full overflow-x-auto overflow-y-auto mt-2 max-h-[65vh] scrollbar-thin scrollbar-thumb-[#5EA68E] scrollbar-track-gray-100">
// // //                         <table className="min-w-max border-collapse text-sm">
// // //                             <thead className="sticky top-0 z-10">
// // //                                 <tr>
// // //                                     {columns.map((key) => (
// // //                                         <th
// // //                                             key={key as string}
// // //                                             className="px-4 py-3 text-center bg-[#5EA68E] text-[#f8edcf] border border-[#747070] first:text-left"
// // //                                         >
// // //                                             {COLUMN_LABELS[key] || (key as string)}
// // //                                         </th>
// // //                                     ))}
// // //                                 </tr>
// // //                             </thead>
// // //                             <tbody>
// // //                                 {filteredRows.map((row, index) => (
// // //                                     <tr
// // //                                         key={index}
// // //                                         className="odd:bg-white even:bg-[#f9f9f9] hover:bg-[rgb(72,168,135)]"
// // //                                     >
// // //                                         {columns.map((col) => (
// // //                                             <td
// // //                                                 key={`${index}-${String(col)}`}
// // //                                                 className="px-4 py-3 text-center border border-[#747070] whitespace-nowrap overflow-hidden text-ellipsis hover:bg-[#f8f8f8] first:text-left"
// // //                                             >
// // //                                                 {(row as any)[col] ?? ""}
// // //                                             </td>
// // //                                         ))}
// // //                                     </tr>
// // //                                 ))}

// // //                                 {!filteredRows.length && (
// // //                                     <tr>
// // //                                         <td
// // //                                             className="text-center py-6 text-slate-500"
// // //                                             colSpan={Math.max(columns.length, 1)}
// // //                                         >
// // //                                             {month && year
// // //                                                 ? "No data to display."
// // //                                                 : "Please select Month & Year."}
// // //                                         </td>
// // //                                     </tr>
// // //                                 )}
// // //                             </tbody>
// // //                         </table>
// // //                     </div>

// // //                     {tableData.length > 0 && (
// // //                         <button
// // //                             onClick={handleDownload}
// // //                             className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded bg-[#2c3e50] text-[#f8edcf] shadow hover:bg-[#34495e] active:shadow-sm active:translate-y-[1px] mt-3"
// // //                         >
// // //                             Referral Fees sheet for {month} {year} {countryName.toUpperCase()}
// // //                             <i className="fa-solid fa-download fa-beat" />
// // //                         </button>
// // //                     )}
// // //                 </>
// // //             )}
// // //         </div>
// // //     );
// // // }











// // "use client";

// // import React, {
// //   useEffect,
// //   useMemo,
// //   useState,
// //   type JSX,
// //   useCallback,
// // } from "react";
// // import MonthYearPickerTable from "@/components/filters/MonthYearPickerTable";
// // import { FiDownload, FiFilter } from "react-icons/fi";
// // import { Doughnut } from "react-chartjs-2";
// // import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// // import { jwtDecode } from "jwt-decode";

// // ChartJS.register(ArcElement, Tooltip, Legend);

// // /* ===================== ENV / CONSTANTS ===================== */
// // const baseURL =
// //   process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

// // /* ===================== Types ===================== */
// // type DonutProps = {
// //   label: string;
// //   pct: number;
// //   amount: number;
// // };

// // type ReferralRow = Partial<{
// //   sku: string;
// //   product_name: string;
// //   category: string;
// //   asin: string;
// //   quantity: number | string;
// //   sales: number | string;
// //   product_sales: number | string;
// //   refRate: number | string;
// //   refFeesApplicable: number | string;
// //   refFeesCharged: number | string;
// //   overcharged: number | string;
// //   difference: number | string;
// //   errorstatus: string;
// // }>;

// // type Summary = {
// //   ordersUnits: number;
// //   totalSales: number;
// //   feeImpact: number;
// // };

// // // shape of each row in summary_table from API
// // type FeeSummaryRow = {
// //   label: string; // "Accurate" | "Undercharged" | "Total" etc
// //   units: number;
// //   sales: number;
// //   refFeesApplicable: number;
// //   refFeesCharged: number;
// //   overcharged: number;
// // };

// // /* ===================== Formatters ===================== */
// // const fmtCurrency = (n: number): string =>
// //   typeof n === "number"
// //     ? n.toLocaleString(undefined, {
// //         style: "currency",
// //         currency: "USD",
// //         maximumFractionDigits: 0,
// //       })
// //     : "-";

// // const fmtNumber = (n: number): string =>
// //   typeof n === "number" ? n.toLocaleString() : "-";

// // const toNumberSafe = (v: any): number => {
// //   if (v === null || v === undefined) return 0;
// //   if (typeof v === "number") return v;
// //   const num = Number(String(v).replace(/[, ]+/g, ""));
// //   return Number.isNaN(num) ? 0 : num;
// // };

// // /* ===================== Donut Component ===================== */
// // function Donut({ label, pct, amount }: DonutProps) {
// //   const data = {
// //     labels: [label, "Remaining"],
// //     datasets: [
// //       {
// //         data: [pct, Math.max(0, 100 - pct)],
// //         backgroundColor: ["#60a68e", "#e5e7eb"],
// //         borderWidth: 0,
// //       },
// //     ],
// //   };

// //   const options = {
// //     cutout: "70%",
// //     plugins: { legend: { display: false } },
// //     maintainAspectRatio: false,
// //   } as const;

// //   return (
// //     <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
// //       <h3 className="text-sm font-semibold text-slate-700 mb-2">{label}</h3>
// //       <div className="w-36 h-36">
// //         <Doughnut data={data} options={options} />
// //       </div>
// //       <p className="text-2xl font-bold mt-2">
// //         {Number.isFinite(pct) ? pct.toFixed(2) : 0}%
// //       </p>
// //       <p className="text-xs text-gray-500">{fmtCurrency(amount)}</p>
// //     </div>
// //   );
// // }

// // /* ===================== MAIN DASHBOARD ===================== */
// // export default function ReferralFeesDashboard(): JSX.Element {
// //   const [country, setCountry] = useState<string>("UK");
// //   const [month, setMonth] = useState<string>("january");
// //   const [year, setYear] = useState<string>(
// //     new Date().getFullYear().toString()
// //   );

// //   // API data
// //   const [rows, setRows] = useState<ReferralRow[]>([]);
// //   const [summary, setSummary] = useState<Summary>({
// //     ordersUnits: 0,
// //     totalSales: 0,
// //     feeImpact: 0,
// //   });
// //   const [feeSummaryRows, setFeeSummaryRows] = useState<FeeSummaryRow[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [userId, setUserId] = useState<string>("unknown");

// //   /* ======= derive userId from JWT ======= */
// //   useEffect(() => {
// //     if (typeof window === "undefined") return;
// //     const token = localStorage.getItem("jwtToken");
// //     if (!token) return;
// //     try {
// //       const decoded: any = jwtDecode(token);
// //       const id = decoded?.user_id?.toString() ?? "unknown";
// //       setUserId(id);
// //     } catch {
// //       setUserId("unknown");
// //     }
// //   }, []);

// //   /* ======= derive fileName like your previous page ======= */
// //   const fileName = useMemo(
// //     () =>
// //       `user_${userId}_${country.toLowerCase()}_${month}${year}_data`.toLowerCase(),
// //     [userId, country, month, year]
// //   );

// //   /* ===================== API Fetch ===================== */
// //   const fetchReferralData = useCallback(async () => {
// //     if (!month || !year || !country) return;
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const token =
// //         typeof window !== "undefined"
// //           ? localStorage.getItem("jwtToken")
// //           : null;

// //       const res = await fetch(`${baseURL}/get_table_data/${fileName}`, {
// //         method: "GET",
// //         headers: token ? { Authorization: `Bearer ${token}` } : {},
// //       });

// //       if (!res.ok) {
// //         throw new Error(`Failed to fetch referral data (${res.status})`);
// //       }

// //       const json: any = await res.json();
// //       console.log("REFERRAL JSON:", json);

// //       // main table rows if the API returns a plain array
// //       const arr: ReferralRow[] = Array.isArray(json) ? json : [];

// //       // summary_table mapping (from your example)
// //       const summary_table = json?.summary_table ?? [];
// //       const mappedSummary: FeeSummaryRow[] = Array.isArray(summary_table)
// //         ? summary_table.map((r: any): FeeSummaryRow => ({
// //             label: r["Ref Fees"],
// //             units: toNumberSafe(r["Units"]),
// //             sales: toNumberSafe(r["Sales"]),
// //             refFeesApplicable: toNumberSafe(r["Ref Fees Applicable"]),
// //             refFeesCharged: toNumberSafe(r["Ref Fees Charged"]),
// //             overcharged: toNumberSafe(r["Overcharged"]),
// //           }))
// //         : [];

// //       setFeeSummaryRows(mappedSummary);
// //       setRows(arr);

// //       // aggregate summary from detailed rows (still kept if needed elsewhere)
// //       let totalUnits = 0;
// //       let totalSales = 0;
// //       let feeImpact = 0;

// //       for (const r of arr) {
// //         totalUnits += toNumberSafe(r.quantity);
// //         totalSales += toNumberSafe(r.product_sales ?? r.sales);
// //         feeImpact += toNumberSafe(r.overcharged ?? r.difference);
// //       }

// //       setSummary({
// //         ordersUnits: totalUnits,
// //         totalSales,
// //         feeImpact,
// //       });
// //     } catch (e: any) {
// //       setError(e?.message || "Failed to load data");
// //       setRows([]);
// //       setFeeSummaryRows([]);
// //       setSummary({ ordersUnits: 0, totalSales: 0, feeImpact: 0 });
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [month, year, country, fileName]);

// //   useEffect(() => {
// //     fetchReferralData();
// //   }, [fetchReferralData]);

// //   /* ===================== Derived from summary_table ===================== */

// //   // The Total row from summary_table (or last row as fallback)
// //   const totalFeeRow = useMemo<FeeSummaryRow | null>(() => {
// //     if (!feeSummaryRows.length) return null;
// //     const total =
// //       feeSummaryRows.find(
// //         (r) => r.label && r.label.toLowerCase() === "total"
// //       ) || feeSummaryRows[feeSummaryRows.length - 1];
// //     return total || null;
// //   }, [feeSummaryRows]);

// //   // Values for the 3 top cards, taken from Total row
// //   const cardSummary = useMemo(
// //     () => ({
// //       ordersUnits: totalFeeRow?.units ?? 0,
// //       totalSales: totalFeeRow?.sales ?? 0,
// //       feeImpact: totalFeeRow?.overcharged ?? 0,
// //     }),
// //     [totalFeeRow]
// //   );

// //   // Donut values based on Total row (like design screenshot)
// //   const feeDonuts = useMemo(
// //     () => {
// //       if (!totalFeeRow) {
// //         return [
// //           { label: "Fees Applicable", pct: 0, amount: 0 },
// //           { label: "Fees Charged", pct: 0, amount: 0 },
// //           { label: "Overcharged", pct: 0, amount: 0 },
// //         ];
// //       }

// //       const sales = totalFeeRow.sales || 0;
// //       const applicable = totalFeeRow.refFeesApplicable || 0;
// //       const charged = totalFeeRow.refFeesCharged || 0;
// //       const overcharged = totalFeeRow.overcharged || 0;

// //       const applicablePct = sales ? (applicable / sales) * 100 : 0;
// //       const chargedPct = sales ? (charged / sales) * 100 : 0;
// //       const overchargedPct = charged ? (overcharged / charged) * 100 : 0;

// //       return [
// //         {
// //           label: "Fees Applicable",
// //           pct: applicablePct ,
// //           amount: applicable,
// //         },
// //         {
// //           label: "Fees Charged",
// //           pct: chargedPct,
// //           amount: charged,
// //         },
// //         {
// //           label: "Overcharged",
// //           pct: overchargedPct,
// //           amount: overcharged,
// //         },
// //       ];
// //     },
// //     [totalFeeRow]
// //   );

// //   return (
// //     <div className="p-4 space-y-4 font-sans text-[#414042]">
// //       {/* Top bar */}
// //       <div className="flex flex-wrap justify-between items-center gap-3">
// //         <h2 className="text-lg md:text-xl font-bold">
// //           Referral Fees -{" "}
// //           <span className="text-emerald-600">{country.toUpperCase()}</span>
// //         </h2>
// //       </div>

// //       {/* Filter row */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //         <MonthYearPickerTable
// //           month={month}
// //           year={year}
// //           yearOptions={[new Date().getFullYear(), new Date().getFullYear() - 1]}
// //           onMonthChange={(v) => setMonth(v)}
// //           onYearChange={(v) => setYear(v)}
// //           valueMode="lower"
// //         />
// //       </div>

// //       {/* Loading / Error */}
// //       {loading && <div className="text-sm text-slate-600">Loading data…</div>}
// //       {!loading && error && (
// //         <div className="text-sm text-red-600">Error: {error}</div>
// //       )}

// //       {/* Summary tiles (from Total summary row) */}
// //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
// //         <div className="bg-white rounded-2xl shadow p-4 text-center">
// //           <p className="text-sm text-gray-500">Orders Units</p>
// //           <p className="text-3xl font-bold text-emerald-700">
// //             {fmtNumber(cardSummary.ordersUnits)}
// //           </p>
// //         </div>
// //         <div className="bg-white rounded-2xl shadow p-4 text-center">
// //           <p className="text-sm text-gray-500">Total Sales</p>
// //           <p className="text-3xl font-bold text-amber-600">
// //             {fmtCurrency(cardSummary.totalSales)}
// //           </p>
// //         </div>
// //         <div className="bg-white rounded-2xl shadow p-4 text-center">
// //           <p className="text-sm text-gray-500">Fee Impact</p>
// //           <p className="text-3xl font-bold text-rose-600">
// //             {fmtCurrency(cardSummary.feeImpact)}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Summary Overview table (from summary_table) */}
// //       <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
// //         <h3 className="text-sm font-semibold mb-2">Summary Overview</h3>
// //         <table className="min-w-full text-sm">
// //           <thead className="text-gray-500 border-b">
// //             <tr>
// //               <th className="text-left py-2">Ref. Fees</th>
// //               <th className="text-left py-2">Units</th>
// //               <th className="text-left py-2">Sales</th>
// //               <th className="text-left py-2">Ref Fees Applicable</th>
// //               <th className="text-left py-2">Ref Fees Charged</th>
// //               <th className="text-left py-2">Overcharged</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {feeSummaryRows.map((r: FeeSummaryRow) => (
// //               <tr key={r.label} className="border-b">
// //                 <td className="py-2 font-medium">{r.label}</td>
// //                 <td>{fmtNumber(r.units)}</td>
// //                 <td>{fmtCurrency(r.sales)}</td>
// //                 <td>{fmtCurrency(r.refFeesApplicable)}</td>
// //                 <td>{fmtCurrency(r.refFeesCharged)}</td>
// //                 <td className="text-rose-600 font-semibold">
// //                   {fmtCurrency(r.overcharged)}
// //                 </td>
// //               </tr>
// //             ))}
// //             {!feeSummaryRows.length && (
// //               <tr>
// //                 <td
// //                   colSpan={6}
// //                   className="py-4 text-center text-slate-500 italic"
// //                 >
// //                   No summary available.
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Donuts (Fee Comparison) */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //         {feeDonuts.map((d) => (
// //           <Donut
// //             key={d.label}
// //             label={d.label}
// //             pct={Number.isFinite(d.pct) ? d.pct : 0}
// //             amount={d.amount}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
























// "use client";

// import * as React from "react";
// import {
//   useEffect,
//   useMemo,
//   useState,
//   type JSX,
//   useCallback,
// } from "react";
// import MonthYearPickerTable from "@/components/filters/MonthYearPickerTable";
// import { FiDownload } from "react-icons/fi";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { jwtDecode } from "jwt-decode";
// import * as XLSX from "xlsx";
// import { ColumnDef } from "@/components/ui/table/DataTable";
// import DataTable from "@/components/dashboard/DataTable";



// ChartJS.register(ArcElement, Tooltip, Legend);

// /* ===================== ENV / CONSTANTS ===================== */
// const baseURL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

// /* ===================== Types ===================== */
// type DonutProps = {
//   label: string;
//   pct: number;
//   amount: number;
// };

// type ReferralRow = Partial<{
//   sku: string;
//   product_name: string;
//   category: string;
//   asin: string;
//   quantity: number | string;
//   sales: number | string;
//   product_sales: number | string;
//   refRate: number | string;
//   refFeesApplicable: number | string;
//   refFeesCharged: number | string;
//   overcharged: number | string;
//   difference: number | string;
//   errorstatus: string;
//   selling_fees: number | string;
//   answer: number | string;
// }>;

// type Summary = {
//   ordersUnits: number;
//   totalSales: number;
//   feeImpact: number;
// };

// // shape of each row in summary_table from API
// type FeeSummaryRow = {
//   label: string; // "Accurate" | "Undercharged" | "Total" etc
//   units: number;
//   sales: number;
//   refFeesApplicable: number;
//   refFeesCharged: number;
//   overcharged: number;
// };

// type ProductOverchargeRow = {
//   sku: string;
//   productName: string;
//   quantity: number;
//   sales: number;
//   refRate: number;
//   refFeesApplicable: number;
//   refFeesCharged: number;
//   overcharged: number;
// };

// /* ===================== Formatters ===================== */
// const fmtCurrency = (n: number): string =>
//   typeof n === "number"
//     ? n.toLocaleString(undefined, {
//         style: "currency",
//         currency: "USD",
//         maximumFractionDigits: 0,
//       })
//     : "-";

// const fmtNumber = (n: number): string =>
//   typeof n === "number" ? n.toLocaleString() : "-";

// const toNumberSafe = (v: any): number => {
//   if (v === null || v === undefined) return 0;
//   if (typeof v === "number") return v;
//   const num = Number(String(v).replace(/[, ]+/g, ""));
//   return Number.isNaN(num) ? 0 : num;
// };

// /* ===================== Donut Component ===================== */
// function Donut({ label, pct, amount }: DonutProps) {
//   const data = {
//     labels: [label, "Remaining"],
//     datasets: [
//       {
//         data: [pct, Math.max(0, 100 - pct)],
//         backgroundColor: ["#60a68e", "#e5e7eb"],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const options = {
//     cutout: "70%",
//     plugins: { legend: { display: false } },
//     maintainAspectRatio: false,
//   } as const;

//   return (
//     <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
//       <h3 className="text-sm font-semibold text-slate-700 mb-2">{label}</h3>
//       <div className="w-36 h-36">
//         <Doughnut data={data} options={options} />
//       </div>
//       <p className="text-2xl font-bold mt-2">
//         {Number.isFinite(pct) ? pct.toFixed(2) : 0}%
//       </p>
//       <p className="text-xs text-gray-500">{fmtCurrency(amount)}</p>
//     </div>
//   );
// }

// /* ===================== MAIN DASHBOARD ===================== */
// export default function ReferralFeesDashboard(): JSX.Element {
//   const [country] = useState<string>("UK");
//   const [month, setMonth] = useState<string>("january");
//   const [year, setYear] = useState<string>(
//     new Date().getFullYear().toString()
//   );

//   // API data
//   const [rows, setRows] = useState<ReferralRow[]>([]);
//   const [summary, setSummary] = useState<Summary>({
//     ordersUnits: 0,
//     totalSales: 0,
//     feeImpact: 0,
//   });
//   const [feeSummaryRows, setFeeSummaryRows] = useState<FeeSummaryRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string>("unknown");

//   /* ======= derive userId from JWT ======= */
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const token = localStorage.getItem("jwtToken");
//     if (!token) return;
//     try {
//       const decoded: any = jwtDecode(token);
//       const id = decoded?.user_id?.toString() ?? "unknown";
//       setUserId(id);
//     } catch {
//       setUserId("unknown");
//     }
//   }, []);

//   /* ======= derive fileName like your previous page ======= */
//   const fileName = useMemo(
//     () =>
//       `user_${userId}_${country.toLowerCase()}_${month}${year}_data`.toLowerCase(),
//     [userId, country, month, year]
//   );

//   /* ===================== API Fetch ===================== */
//   const fetchReferralData = useCallback(async () => {
//     if (!month || !year || !country) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const token =
//         typeof window !== "undefined"
//           ? localStorage.getItem("jwtToken")
//           : null;

//       const res = await fetch(`${baseURL}/get_table_data/${fileName}`, {
//         method: "GET",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to fetch referral data (${res.status})`);
//       }

//       const json: any = await res.json();
//       console.log("REFERRAL JSON:", json);

//       // table_data holds all rows
//       const tableData = json?.table_data ?? json;
//       const arr: ReferralRow[] = Array.isArray(tableData) ? tableData : [];

//       // summary_table mapping
//       const summary_table = json?.summary_table ?? [];
//       const mappedSummary: FeeSummaryRow[] = Array.isArray(summary_table)
//         ? summary_table.map((r: any): FeeSummaryRow => ({
//             label: r["Ref Fees"],
//             units: toNumberSafe(r["Units"]),
//             sales: toNumberSafe(r["Sales"]),
//             refFeesApplicable: toNumberSafe(r["Ref Fees Applicable"]),
//             refFeesCharged: toNumberSafe(r["Ref Fees Charged"]),
//             overcharged: toNumberSafe(r["Overcharged"]),
//           }))
//         : [];

//       setFeeSummaryRows(mappedSummary);
//       setRows(arr);

//       // aggregate summary from detailed rows (kept if needed)
//       let totalUnits = 0;
//       let totalSales = 0;
//       let feeImpact = 0;

//       for (const r of arr) {
//         totalUnits += toNumberSafe(r.quantity);
//         totalSales += toNumberSafe(r.product_sales ?? r.sales);
//         feeImpact += toNumberSafe(r.overcharged ?? r.difference);
//       }

//       setSummary({
//         ordersUnits: totalUnits,
//         totalSales,
//         feeImpact,
//       });
//     } catch (e: any) {
//       setError(e?.message || "Failed to load data");
//       setRows([]);
//       setFeeSummaryRows([]);
//       setSummary({ ordersUnits: 0, totalSales: 0, feeImpact: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }, [month, year, country, fileName]);

//   useEffect(() => {
//     fetchReferralData();
//   }, [fetchReferralData]);

//   /* ===================== Derived from summary_table ===================== */

//   // The Total row from summary_table (or last row as fallback)
//   const totalFeeRow = useMemo<FeeSummaryRow | null>(() => {
//     if (!feeSummaryRows.length) return null;
//     const total =
//       feeSummaryRows.find(
//         (r) => r.label && r.label.toLowerCase() === "total"
//       ) || feeSummaryRows[feeSummaryRows.length - 1];
//     return total || null;
//   }, [feeSummaryRows]);

//   // Values for the 3 top cards, taken from Total row
//   const cardSummary = useMemo(
//     () => ({
//       ordersUnits: totalFeeRow?.units ?? 0,
//       totalSales: totalFeeRow?.sales ?? 0,
//       feeImpact: totalFeeRow?.overcharged ?? 0,
//     }),
//     [totalFeeRow]
//   );

//   // Donut values based on Total row (like design screenshot)
//   const feeDonuts = useMemo(() => {
//     if (!totalFeeRow) {
//       return [
//         { label: "Fees Applicable", pct: 0, amount: 0 },
//         { label: "Fees Charged", pct: 0, amount: 0 },
//         { label: "Overcharged", pct: 0, amount: 0 },
//       ];
//     }

//     const sales = totalFeeRow.sales || 0;
//     const applicable = totalFeeRow.refFeesApplicable || 0;
//     const charged = totalFeeRow.refFeesCharged || 0;
//     const overcharged = totalFeeRow.overcharged || 0;

//     const applicablePct = sales ? (applicable / sales) * 100 : 0;
//     const chargedPct = sales ? (charged / sales) * 100 : 0;
//     const overchargedPct = charged ? (overcharged / charged) * 100 : 0;

//     return [
//       {
//         label: "Fees Applicable",
//         pct: applicablePct,
//         amount: applicable,
//       },
//       {
//         label: "Fees Charged",
//         pct: chargedPct,
//         amount: charged,
//       },
//       {
//         label: "Overcharged",
//         pct: overchargedPct,
//         amount: overcharged,
//       },
//     ];
//   }, [totalFeeRow]);

//   /* ===================== Product-wise Overcharged Rows ===================== */

//   const overchargedRows = useMemo<ProductOverchargeRow[]>(() => {
//     if (!rows.length) return [];

//     return rows
//       .map((r) => {
//         const over = toNumberSafe(r.overcharged ?? r.difference);
//         if (over <= 0) return null;

//         const sales = toNumberSafe(r.product_sales ?? r.sales);
//         const applicable = toNumberSafe(r.answer);
//         const charged = toNumberSafe(r.selling_fees);
//         const qty = toNumberSafe(r.quantity);
//         const refRate = sales ? (applicable / sales) * 100 : 0;

//         return {
//           sku: String(r.sku ?? ""),
//           productName: String(r.product_name ?? ""),
//           quantity: qty,
//           sales,
//           refRate,
//           refFeesApplicable: applicable,
//           refFeesCharged: charged,
//           overcharged: over,
//         };
//       })
//       .filter((x): x is ProductOverchargeRow => x !== null);
//   }, [rows]);

//   /* ===================== DataTable columns for Overcharged ===================== */

//   const overchargedColumns: ColumnDef<ProductOverchargeRow>[] = useMemo(
//     () => [
//       {
//         key: "sku",
//         header: "SKU",
//         width: "10rem",
//         cellClassName: "font-medium",
//       },
//       {
//         key: "productName",
//         header: "Product Name",
//         width: "18rem",
//       },
//       {
//         key: "quantity",
//         header: "Units",
//         render: (row) => fmtNumber(row.quantity),
//         width: "6rem",
//         cellClassName: "text-right",
//       },
//       {
//         key: "sales",
//         header: "Sales",
//         render: (row) => fmtCurrency(row.sales),
//         width: "7rem",
//         cellClassName: "text-right",
//       },
//       {
//         key: "refRate",
//         header: "Ref %",
//         render: (row) => `${row.refRate.toFixed(2)}%`,
//         width: "6rem",
//         cellClassName: "text-right",
//       },
//       {
//         key: "refFeesApplicable",
//         header: "Ref Fees Applicable",
//         render: (row) => fmtCurrency(row.refFeesApplicable),
//         cellClassName: "text-right",
//       },
//       {
//         key: "refFeesCharged",
//         header: "Ref Fees Charged",
//         render: (row) => fmtCurrency(row.refFeesCharged),
//         cellClassName: "text-right",
//       },
//       {
//         key: "overcharged",
//         header: "Overcharged",
//         render: (row) => fmtCurrency(row.overcharged),
//         cellClassName: "text-right text-rose-600 font-semibold",
//       },
//     ],
//     []
//   );

//   /* ===================== Excel Download ===================== */

//   const handleDownloadExcel = useCallback(() => {
//     if (!rows.length && !overchargedRows.length) return;

//     const wb = XLSX.utils.book_new();

//     // Sheet 1: Overcharged Ref Fees
//     const overData = overchargedRows.map((r) => ({
//       SKU: r.sku,
//       "Product Name": r.productName,
//       Units: r.quantity,
//       Sales: r.sales,
//       "Ref %": r.refRate,
//       "Ref Fees Applicable": r.refFeesApplicable,
//       "Ref Fees Charged": r.refFeesCharged,
//       Overcharged: r.overcharged,
//     }));
//     const wsOver = XLSX.utils.json_to_sheet(overData);
//     XLSX.utils.book_append_sheet(wb, wsOver, "Overcharged Ref Fees");

//     // Sheet 2: All Data (raw table_data)
//     const allData = rows.map((r) => ({ ...r }));
//     const wsAll = XLSX.utils.json_to_sheet(allData);
//     XLSX.utils.book_append_sheet(wb, wsAll, "All Data");

//     XLSX.writeFile(
//       wb,
//       `Referral-Fees-${country}-${month}-${year}.xlsx`
//     );
//   }, [rows, overchargedRows, country, month, year]);

//   /* ===================== RENDER ===================== */

//   return (
//     <div className="p-4 space-y-4 font-sans text-[#414042]">
//       {/* Top bar */}
//       <div className="flex flex-wrap justify-between items-center gap-3">
//         <h2 className="text-lg md:text-xl font-bold">
//           Referral Fees -{" "}
//           <span className="text-emerald-600">{country.toUpperCase()}</span>
//         </h2>
//       </div>

//       {/* Filter row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//         <MonthYearPickerTable
//           month={month}
//           year={year}
//           yearOptions={[new Date().getFullYear(), new Date().getFullYear() - 1]}
//           onMonthChange={(v) => setMonth(v)}
//           onYearChange={(v) => setYear(v)}
//           valueMode="lower"
//         />
//       </div>

//       {/* Loading / Error */}
//       {loading && <div className="text-sm text-slate-600">Loading data…</div>}
//       {!loading && error && (
//         <div className="text-sm text-red-600">Error: {error}</div>
//       )}

//       {/* Summary tiles (from Total summary row) */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//         <div className="bg-white rounded-2xl shadow p-4 text-center">
//           <p className="text-sm text-gray-500">Orders Units</p>
//           <p className="text-3xl font-bold text-emerald-700">
//             {fmtNumber(cardSummary.ordersUnits)}
//           </p>
//         </div>
//         <div className="bg-white rounded-2xl shadow p-4 text-center">
//           <p className="text-sm text-gray-500">Total Sales</p>
//           <p className="text-3xl font-bold text-amber-600">
//             {fmtCurrency(cardSummary.totalSales)}
//           </p>
//         </div>
//         <div className="bg-white rounded-2xl shadow p-4 text-center">
//           <p className="text-sm text-gray-500">Fee Impact</p>
//           <p className="text-3xl font-bold text-rose-600">
//             {fmtCurrency(cardSummary.feeImpact)}
//           </p>
//         </div>
//       </div>

//       {/* Summary Overview table (from summary_table) */}
//       <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
//         <h3 className="text-sm font-semibold mb-2">Summary Overview</h3>
//         <table className="min-w-full text-sm">
//           <thead className="text-gray-500 border-b">
//             <tr>
//               <th className="text-left py-2">Ref. Fees</th>
//               <th className="text-left py-2">Units</th>
//               <th className="text-left py-2">Sales</th>
//               <th className="text-left py-2">Ref Fees Applicable</th>
//               <th className="text-left py-2">Ref Fees Charged</th>
//               <th className="text-left py-2">Overcharged</th>
//             </tr>
//           </thead>
//           <tbody>
//             {feeSummaryRows.map((r: FeeSummaryRow) => (
//               <tr key={r.label} className="border-b">
//                 <td className="py-2 font-medium">{r.label}</td>
//                 <td>{fmtNumber(r.units)}</td>
//                 <td>{fmtCurrency(r.sales)}</td>
//                 <td>{fmtCurrency(r.refFeesApplicable)}</td>
//                 <td>{fmtCurrency(r.refFeesCharged)}</td>
//                 <td className="text-rose-600 font-semibold">
//                   {fmtCurrency(r.overcharged)}
//                 </td>
//               </tr>
//             ))}
//             {!feeSummaryRows.length && (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="py-4 text-center text-slate-500 italic"
//                 >
//                   No summary available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Donuts (Fee Comparison) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//         {feeDonuts.map((d) => (
//           <Donut
//             key={d.label}
//             label={d.label}
//             pct={Number.isFinite(d.pct) ? d.pct : 0}
//             amount={d.amount}
//           />
//         ))}
//       </div>

//       {/* Product-wise Details of Overcharged Ref Fees with DataTable */}
//       <div className="space-y-2">
//         <div className="flex items-center justify-between gap-2">
//           <h3 className="text-sm font-semibold">
//             Product-wise Details of Overcharged Ref Fees
//           </h3>
//           <button
//             onClick={handleDownloadExcel}
//             className="inline-flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-xl text-xs md:text-sm"
//           >
//             <FiDownload className="h-4 w-4" />
//             Download Excel
//           </button>
//         </div>

//         <DataTable<ProductOverchargeRow>
//           columns={overchargedColumns}
//           data={overchargedRows}
//           pageSize={10}
//           emptyMessage="No overcharged rows found."
//           maxHeight="50vh"
//         />
//       </div>
//     </div>
//   );
// }


































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

ChartJS.register(ArcElement, Tooltip, Legend);

/* ===================== ENV / CONSTANTS ===================== */
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

/* ===================== Types ===================== */
type DonutProps = {
  label: string;
  pct: number;
  amount: number;
};

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

// shape of each row in summary_table from API
type FeeSummaryRow = {
  label: string; // "Accurate" | "Undercharged" | "Total" etc
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
};

/* ===================== Formatters ===================== */
const fmtCurrency = (n: number): string =>
  typeof n === "number"
    ? n.toLocaleString(undefined, {
        style: "currency",
        currency: "GBP",          // 👈 changed from "USD" to "GBP"
        maximumFractionDigits: 0,
      })
    : "-";

const fmtNumber = (n: number): string =>
  typeof n === "number" ? n.toLocaleString() : "-";

const toNumberSafe = (v: any): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  const num = Number(String(v).replace(/[, ]+/g, ""));
  return Number.isNaN(num) ? 0 : num;
};

/* ===================== Donut Component ===================== */
function Donut({ label, pct, amount }: DonutProps) {
  const data = {
    labels: [label, "Remaining"],
    datasets: [
      {
        data: [pct, Math.max(0, 100 - pct)],
        backgroundColor: ["#60a68e", "#e5e7eb"],
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
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">{label}</h3>
      <div className="w-36 h-36">
        <Doughnut data={data} options={options} />
      </div>
      <p className="text-2xl font-bold mt-2">
        {Number.isFinite(pct) ? pct.toFixed(2) : 0}%
      </p>
      <p className="text-xs text-gray-500">{fmtCurrency(amount)}</p>
    </div>
  );
}

/* ===================== MAIN DASHBOARD ===================== */
export default function ReferralFeesDashboard(): JSX.Element {
  const [country] = useState<string>("UK");
  const [month, setMonth] = useState<string>("january");
  const [year, setYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  // API data
  const [rows, setRows] = useState<ReferralRow[]>([]);
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

  /* ======= derive fileName like your previous page ======= */
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

      const res = await fetch(`${baseURL}/get_table_data/${fileName}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch referral data (${res.status})`);
      }

      const json: any = await res.json();
      console.log("REFERRAL JSON:", json);

      // table_data holds all rows
      const tableData = json?.table_data ?? json;
      const arr: ReferralRow[] = Array.isArray(tableData) ? tableData : [];

      // summary_table mapping
      const summary_table = json?.summary_table ?? [];
      const mappedSummary: FeeSummaryRow[] = Array.isArray(summary_table)
        ? summary_table.map((r: any): FeeSummaryRow => ({
            label: r["Ref Fees"],
            units: toNumberSafe(r["Units"]),
            sales: toNumberSafe(r["Sales"]),
            refFeesApplicable: toNumberSafe(r["Ref Fees Applicable"]),
            refFeesCharged: toNumberSafe(r["Ref Fees Charged"]),
            overcharged: toNumberSafe(r["Overcharged"]),
          }))
        : [];

      setFeeSummaryRows(mappedSummary);
      setRows(arr);

      // aggregate summary from detailed rows (kept if needed)
      let totalUnits = 0;
      let totalSales = 0;
      let feeImpact = 0;

      for (const r of arr) {
        totalUnits += toNumberSafe(r.quantity);
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

  // The Total row from summary_table (or last row as fallback)
  const totalFeeRow = useMemo<FeeSummaryRow | null>(() => {
    if (!feeSummaryRows.length) return null;
    const total =
      feeSummaryRows.find(
        (r) => r.label && r.label.toLowerCase() === "total"
      ) || feeSummaryRows[feeSummaryRows.length - 1];
    return total || null;
  }, [feeSummaryRows]);

  // Values for the 3 top cards, taken from Total row
  const cardSummary = useMemo(
    () => ({
      ordersUnits: totalFeeRow?.units ?? 0,
      totalSales: totalFeeRow?.sales ?? 0,
      feeImpact: totalFeeRow?.overcharged ?? 0,
    }),
    [totalFeeRow]
  );

  // Donut values based on Total row (like design screenshot)
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

  /* ===================== Product-wise Overcharged Rows ===================== */

  const overchargedRows = useMemo<ProductOverchargeRow[]>(() => {
    if (!rows.length) return [];

    return rows
      .map((r) => {
        const over = toNumberSafe(r.overcharged ?? r.difference);
        if (over <= 0) return null;

        const sales = toNumberSafe(r.product_sales ?? r.sales);
        const applicable = toNumberSafe(r.answer);
        const charged = toNumberSafe(r.selling_fees);
        const qty = toNumberSafe(r.quantity);
        const refRate = sales ? (applicable / sales) * 100 : 0;

        return {
          sku: String(r.sku ?? ""),
          productName: String(r.product_name ?? ""),
          quantity: qty,
          sales,
          refRate,
          refFeesApplicable: applicable,
          refFeesCharged: charged,
          overcharged: over,
        };
      })
      .filter((x): x is ProductOverchargeRow => x !== null);
  }, [rows]);

  /* ===================== Excel Download ===================== */

  const handleDownloadExcel = useCallback(() => {
    if (!rows.length && !overchargedRows.length) return;

    const wb = XLSX.utils.book_new();

    // Sheet 1: Overcharged Ref Fees
    const overData = overchargedRows.map((r) => ({
      SKU: r.sku,
      "Product Name": r.productName,
      Units: r.quantity,
      Sales: r.sales,
      "Ref %": r.refRate,
      "Ref Fees Applicable": r.refFeesApplicable,
      "Ref Fees Charged": r.refFeesCharged,
      Overcharged: r.overcharged,
    }));
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

  /* ===================== RENDER ===================== */

  return (
    <div className="p-4 space-y-4 font-sans text-[#414042]">
      {/* Top bar */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg md:text-xl font-bold">
          Referral Fees -{" "}
          <span className="text-emerald-600">{country.toUpperCase()}</span>
        </h2>
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MonthYearPickerTable
          month={month}
          year={year}
          yearOptions={[new Date().getFullYear(), new Date().getFullYear() - 1]}
          onMonthChange={(v) => setMonth(v)}
          onYearChange={(v) => setYear(v)}
          valueMode="lower"
        />
      </div>

      {/* Loading / Error */}
      {loading && <div className="text-sm text-slate-600">Loading data…</div>}
      {!loading && error && (
        <div className="text-sm text-red-600">Error: {error}</div>
      )}

      {/* Summary tiles (from Total summary row) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Orders Units</p>
          <p className="text-3xl font-bold text-emerald-700">
            {fmtNumber(cardSummary.ordersUnits)}
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
      </div>

      {/* Summary Overview table (from summary_table) */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <h3 className="text-sm font-semibold mb-2">Summary Overview</h3>
        <table className="min-w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Ref. Fees</th>
              <th className="text-left py-2">Units</th>
              <th className="text-left py-2">Sales</th>
              <th className="text-left py-2">Ref Fees Applicable</th>
              <th className="text-left py-2">Ref Fees Charged</th>
              <th className="text-left py-2">Overcharged</th>
            </tr>
          </thead>
          <tbody>
            {feeSummaryRows.map((r: FeeSummaryRow) => (
              <tr key={r.label} className="border-b">
                <td className="py-2 font-medium">{r.label}</td>
                <td>{fmtNumber(r.units)}</td>
                <td>{fmtCurrency(r.sales)}</td>
                <td>{fmtCurrency(r.refFeesApplicable)}</td>
                <td>{fmtCurrency(r.refFeesCharged)}</td>
                <td className="text-rose-600 font-semibold">
                  {fmtCurrency(r.overcharged)}
                </td>
              </tr>
            ))}
            {!feeSummaryRows.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 text-center text-slate-500 italic"
                >
                  No summary available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Donuts (Fee Comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {feeDonuts.map((d) => (
          <Donut
            key={d.label}
            label={d.label}
            pct={Number.isFinite(d.pct) ? d.pct : 0}
            amount={d.amount}
          />
        ))}
      </div>

      {/* Product-wise Details of Overcharged Ref Fees */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="text-sm font-semibold">
            Product-wise Details of Overcharged Ref Fees
          </h3>
          <button
            onClick={handleDownloadExcel}
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-xl text-xs md:text-sm"
          >
            <FiDownload className="h-4 w-4" />
            Download Excel
          </button>
        </div>

        <table className="min-w-[960px] text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">SKU</th>
              <th className="text-left py-2">Product Name</th>
              <th className="text-left py-2">Units</th>
              <th className="text-left py-2">Sales</th>
              <th className="text-left py-2">Ref %</th>
              <th className="text-left py-2">Ref Fees Applicable</th>
              <th className="text-left py-2">Ref Fees Charged</th>
              <th className="text-left py-2">Overcharged</th>
            </tr>
          </thead>
          <tbody>
            {overchargedRows.map((r) => (
              <tr key={r.sku + r.productName} className="border-b">
                <td className="py-2 font-medium">{r.sku}</td>
                <td>{r.productName}</td>
                <td>{fmtNumber(r.quantity)}</td>
                <td>{fmtCurrency(r.sales)}</td>
                <td>{r.refRate.toFixed(2)}%</td>
                <td>{fmtCurrency(r.refFeesApplicable)}</td>
                <td>{fmtCurrency(r.refFeesCharged)}</td>
                <td className="text-rose-600 font-semibold">
                  {fmtCurrency(r.overcharged)}
                </td>
              </tr>
            ))}
            {!overchargedRows.length && (
              <tr>
                <td
                  colSpan={8}
                  className="py-4 text-center text-slate-500 italic"
                >
                  No overcharged rows found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
