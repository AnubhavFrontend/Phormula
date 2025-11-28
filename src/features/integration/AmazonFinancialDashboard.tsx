// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaDatabase as Database,
//   FaDownload as Download,
//   FaCheckCircle as CheckCircle2,
//   FaExclamationCircle as AlertCircle,
//   FaArrowLeft as ArrowLeft,
// } from "react-icons/fa";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
// const getAuthToken = () => (typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null);

// /** ======= HARD OVERRIDE FOR TESTING ======= **/
// const FORCE = {
//   // UK
//   enabled: true,
//   country: "uk",
//   region: "eu-west-1",
//   marketplaceId: "A1F83G8C2ARO7P",

//   // // US
//   // enabled: true,
//   // country: "us",
//   // region: "us-east-1",
//   // marketplaceId: "ATVPDKIKX0DER",
// };
// /** ======================================== **/

// /** JSON fetch helper */
// async function api(path: string, options: RequestInit = {}) {
//   const token = getAuthToken();
//   const res = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(JSON.stringify(data));
//   return data;
// }

// /** Text (CSV) fetch helper */
// async function apiText(path: string, options: RequestInit = {}) {
//   const token = getAuthToken();
//   const res = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });
//   const text = await res.text();
//   if (!res.ok) throw new Error(text || "Request failed");
//   return text;
// }

// const monthNamesLower = [
//   "january", "february", "march", "april", "may", "june",
//   "july", "august", "september", "october", "november", "december",
// ];
// const two = (n: number | string) => String(n).padStart(2, "0");
// const toMonthSlug = (year: number | string, monthIdx0: number) => `${year}-${monthNamesLower[monthIdx0]}`;

// /** Canonical mappings */
// const regionForCountry = (c: string) =>
//   c === "uk" ? "eu-west-1" :
//     c === "us" ? "us-east-1" :
//       c === "canada" ? "ca-central-1" : "";

// const marketplaceForCountry = (c: string) =>
//   c === "uk" ? "A1F83G8C2ARO7P" :
//     c === "us" ? "ATVPDKIKX0DER" :
//       c === "canada" ? "A2EUQ1WTGCTBG2" : "";

// type Props = {
//   region?: string;
//   country?: string;
//   onClose?: () => void;
// };

// const AmazonFinancialDashboard: React.FC<Props> = ({ region, country, onClose }) => {
//   const router = useRouter();

//   /** ---- Normal computation ---- */
//   const countryNormalized = (country || "").toLowerCase();
//   const inferredCountry =
//     countryNormalized ||
//     (region === "eu-west-1" ? "uk" :
//       region === "us-east-1" ? "us" :
//         region === "ca-central-1" ? "canada" : "");

//   let countryUsed = inferredCountry || "uk";
//   let regionUsed = region || regionForCountry(countryUsed);
//   let marketplaceIdUsed = marketplaceForCountry(countryUsed);

//   /** ---- HARD OVERRIDE (testing) ---- */
//   if (FORCE.enabled) {
//     countryUsed = FORCE.country;
//     regionUsed = FORCE.region;
//     marketplaceIdUsed = FORCE.marketplaceId || marketplaceForCountry(FORCE.country);
//   }

//   const [account, setAccount] = useState<any>(null);
//   const [skus, setSkus] = useState<any[]>([]);
//   const [orders, setOrders] = useState<any[]>([]);
//   const [status, setStatus] = useState<any>(null);
//   const [error, setError] = useState<string>("");
//   const [message, setMessage] = useState<string>("");
//   const [debugResp, setDebugResp] = useState<any>(null);
//   const [settlementRows, setSettlementRows] = useState<any[]>([]);
//   const [settlementCols, setSettlementCols] = useState<string[]>([]);
//   const [selMonth, setSelMonth] = useState(two(new Date().getMonth() + 1));
//   const [selYear, setSelYear] = useState(String(new Date().getFullYear()));
//   const [busy, setBusy] = useState(false);

//   // 1 / 3 / 6 / 12 months
//   const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

//   const daysBetween = (a: Date, b: Date) => Math.floor((+a - +b) / (24 * 3600 * 1000));
//   const isOlderThan90Days = (year: number, month01: string) => {
//     const m = Math.max(1, Math.min(12, parseInt(month01, 10)));
//     const monthStart = new Date(year, m - 1, 1);
//     const now = new Date();
//     return daysBetween(now, monthStart) > 90;
//   };

//   const wrap = async (fn: () => Promise<void>) => {
//     try {
//       setBusy(true);
//       setError("");
//       setMessage("");
//       await fn();
//     } catch (e: any) {
//       setError(
//         e?.message?.startsWith("{")
//           ? (() => {
//             try {
//               const parsed = JSON.parse(e.message);
//               return parsed?.message || JSON.stringify(parsed, null, 2);
//             } catch {
//               return e.message;
//             }
//           })()
//           : e.message
//       );
//     } finally {
//       setBusy(false);
//     }
//   };

//   // --------- Optional helpers ----------
//   const handleFetchAccount = () =>
//     wrap(async () => {
//       const qs = new URLSearchParams({ region: regionUsed, marketplace_id: marketplaceIdUsed });
//       const data = await api(`/amazon_api/account?${qs}`);
//       setAccount(data.accounts || []);
//       setMessage("Fetched account info.");
//     });

//   const handleFetchSkus = () =>
//     wrap(async () => {
//       const qs = new URLSearchParams({ region: regionUsed, marketplace_id: marketplaceIdUsed });
//       const data = await api(`/amazon_api/skus?${qs}`);
//       setSkus(data.skus || []);
//       setMessage(`Fetched ${data.count || 0} SKUs.`);
//     });

//   const handleFetchOrders = () =>
//     wrap(async () => {
//       const now = new Date();
//       const start = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 19) + "Z";
//       const qs = new URLSearchParams({
//         region: regionUsed,
//         marketplace_id: marketplaceIdUsed,
//         include: "pricing",
//         start_date: start,
//       });
//       const data = await api(`/amazon_api/orders?${qs}`);
//       setOrders(data.orders?.items || []);
//       setMessage(`Fetched ${data.orders?.count || 0} orders.`);
//       if (data.debug) setDebugResp(data.debug);
//     });

//   const handleCheckStatus = () =>
//     wrap(async () => {
//       const qs = new URLSearchParams({ region: regionUsed, marketplace_id: marketplaceIdUsed });
//       const data = await api(`/amazon_api/status?${qs}`);
//       setStatus(data.payload || []);
//       setMessage("Fetched marketplace participations.");
//     });

//   // --------- 1 month: settlements if within 90d; finances if older ----------
//   const handleFetchSettlementsByMonth = () =>
//     wrap(async () => {
//       const useFinances = isOlderThan90Days(parseInt(selYear, 10), selMonth);

//       const monthIndex = Math.max(0, Math.min(11, parseInt(selMonth, 10) - 1));
//       const monthParam = useFinances
//         ? `${selYear}-${monthNamesLower[monthIndex]}` // e.g. 2025-january
//         : `${selYear}-${selMonth}`;                  // e.g. 2025-01

//       // optional fees sync
//       let feesMsg = "";
//       try {
//         const feesResp = await api(`/fetch_fees`, {
//           method: "POST",
//           body: JSON.stringify({
//             region: regionUsed,
//             marketplace_id: marketplaceIdUsed,
//             month: monthParam,
//             year: selYear,
//             country: countryUsed,
//           }),
//         });
//         if (feesResp && typeof feesResp === "object") {
//           const { ok, skipped, stored, failures } = feesResp as any;
//           const failCount = Array.isArray(failures) ? failures.length : 0;
//           feesMsg = `Fees sync: ${ok ? "ok" : "not ok"} · stored ${stored ?? 0} · skipped ${skipped ?? 0} · failures ${failCount}`;
//         } else {
//           feesMsg = "Fees sync: completed.";
//         }
//       } catch (err: any) {
//         feesMsg = `Fees sync error: ${err?.message || "unknown error"}`;
//       }

//       const path = useFinances ? "/amazon_api/settlements_finances" : "/amazon_api/settlements";
//       const qs = new URLSearchParams({
//         region: regionUsed,
//         marketplace_id: marketplaceIdUsed,
//         month: monthParam,
//         format: "csv",
//         store_in_db: "false",
//         limit: "all",
//         run_upload_pipeline: "true",
//         country: countryUsed,
//         year: selYear,
//         allow_report_created_fallback: "true",
//       });

//       const data = await api(`${path}?${qs}`);

//       const preview = (data as any).items || [];
//       const cols = preview.length
//         ? Object.keys(preview[0])
//         : [
//           "date/time", "settlement id", "type", "order id", "sku", "description", "quantity", "marketplace", "fulfilment",
//           "order city", "order state", "order postal", "tax collection model", "product sales", "product sales tax",
//           "postage credits", "shipping credits tax", "gift wrap credits", "giftwrap credits tax", "promotional rebates",
//           "promotional rebates tax", "marketplace withheld tax", "selling fees", "fba fees", "other transaction fees",
//           "other", "total", "currency",
//         ];

//       setSettlementCols(cols);
//       setSettlementRows(preview);

//       let settlementsMsg = "";
//       if ((data as any)?.stored?.inserted >= 0) {
//         settlementsMsg = `Saved ${(data as any).stored.inserted || 0} rows (replaced ${(data as any).stored.deleted || 0}) for ${monthParam}.`;
//       } else if ((data as any)?.stored?.skipped) {
//         settlementsMsg = `Fetched preview for ${monthParam} (DB save skipped).`;
//       } else {
//         settlementsMsg = `Fetched ${useFinances ? "finances" : "settlements"} for ${monthParam}.`;
//       }
//       setMessage(`${feesMsg} • ${settlementsMsg}`);

//       // Navigate to /country/MTD/:country/:month/:year (App Router)
//       const fullMonthNames = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December",
//       ];
//       const idxForNav = Math.max(0, Math.min(11, parseInt(selMonth, 10) - 1));
//       const monthSlug = fullMonthNames[idxForNav].toLowerCase();

//       router.push(`/country/MTD/${countryUsed}/${monthSlug}/${selYear}`);
//     });

//   // --------- 3/6/12 months via finances ----------
//   const handleFetchFinancesRange = () =>
//     wrap(async () => {
//       const n = selectedPeriod || 0;
//       if (![3, 6, 12].includes(n)) {
//         setMessage("Please select 3, 6, or 12 months.");
//         return;
//       }

//       const now = new Date();
//       const months: { y: number; mIdx: number }[] = [];
//       for (let i = 0; i < n; i++) {
//         const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
//         months.push({ y: d.getUTCFullYear(), mIdx: d.getUTCMonth() });
//       }
//       months.reverse();

//       let combinedRows: any[] = [];
//       let combinedCols: string[] | null = null;
//       let okCount = 0;
//       let csvFallbackCount = 0;

//       for (const { y, mIdx } of months) {
//         // Try JSON for preview
//         const jsonQs = new URLSearchParams({
//           region: regionUsed,
//           marketplace_id: marketplaceIdUsed,
//           month: toMonthSlug(y, mIdx),
//           limit: "all",
//           country: countryUsed,
//           run_upload_pipeline: "true",
//           year: String(y),
//           format: "json",
//           store_in_db: "false",
//         });
//         try {
//           const data = await api(`/amazon_api/settlements_finances?${jsonQs}`);
//           const rows = Array.isArray((data as any)?.items) ? (data as any).items : [];
//           if (rows.length) {
//             if (!combinedCols) combinedCols = Object.keys(rows[0]);
//             combinedRows = combinedRows.concat(rows);
//           }
//           okCount++;
//           continue;
//         } catch {
//           // Fallback to CSV (no preview parsing)
//           const csvQs = new URLSearchParams({
//             region: regionUsed,
//             marketplace_id: marketplaceIdUsed,
//             month: toMonthSlug(y, mIdx),
//             limit: "all",
//             country: countryUsed,
//             year: String(y),
//             format: "csv",
//             store_in_db: "false",
//           });
//           try {
//             await apiText(`/amazon_api/settlements_finances?${csvQs}`);
//             okCount++;
//             csvFallbackCount++;
//           } catch (e2) {
//             console.error("Finances fetch failed for", y, mIdx + 1, e2);
//           }
//         }
//       }

//       if (combinedRows.length > 0) {
//         setSettlementCols(combinedCols || []);
//         setSettlementRows(combinedRows);
//       } else {
//         setSettlementCols([]);
//         setSettlementRows([]);
//       }

//       const details = [
//         `Requested: ${n} month${n > 1 ? "s" : ""}`,
//         `Succeeded: ${okCount}`,
//         csvFallbackCount ? `CSV fallback for ${csvFallbackCount} month(s)` : null,
//       ].filter(Boolean).join(" · ");

//       setMessage(`Finances fetch complete for ${countryUsed}. ${details}`);

//       // Navigate to latest month
//       const fullMonthNames = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December",
//       ];
//       const latestMonthIdx = new Date().getMonth();
//       const latestYear = new Date().getFullYear();
//       const monthSlug = fullMonthNames[latestMonthIdx].toLowerCase();

//       router.push(`/country/MTD/${countryUsed}/${monthSlug}/${latestYear}`);
//     });

//   return (
//     <div className="w-full">
//       <div className="rounded-xl bg-white p-4">
//         {/* Header */}
//         <div className="items-center mb-2">
//           <div className="text-center">
//             {/* <h2 className="text-xl sm:text-2xl font-bold text-emerald-700">
//               Select Data Fetch Period
//             </h2> */}
//             <PageBreadcrumb pageTitle="Select Data Fetch Period" textSize="2xl" variant="table" />
//             <p className="font-bold text-charcoal-500 mt-1">
//               Link your Amazon Seller Central to sync your sales data
//             </p>
//           </div>
//           <div className="invisible inline-flex items-center gap-2 rounded-md border border-emerald-200 px-2 py-1">
//             <ArrowLeft size={16} />
//             <span className="hidden sm:inline text-sm font-medium">Back</span>
//           </div>
//         </div>

//         {/* Period Options */}
//         <div className="mt-2 grid grid-cols-2 sm:flex sm:justify-center gap-3">
//           {[1, 3, 6, 12].map((m) => {
//             const isActive = selectedPeriod === m;
//             return (
//               <button
//                 key={m}
//                 type="button"
//                 onClick={() => setSelectedPeriod(m)}
//                 className={[
//                   "w-full sm:w-48 rounded-lg border px-6 py-4 text-center transition",
//                   isActive
//                     ? "border-emerald-600 ring-2 ring-emerald-200 bg-white"
//                     : "border-slate-200 bg-slate-50 hover:bg-white",
//                 ].join(" ")}
//               >
//                 <div className="text-lg font-semibold text-slate-800">{m}</div>
//                 <div className="text-xs uppercase tracking-wide text-slate-500 mt-1">
//                   {m === 1 ? "Month" : "Months"}
//                 </div>
//               </button>
//             );
//           })}
//         </div>

//         {/* Note */}
//         <div
//           className="mt-4 rounded-lg bg-[#D9D9D9E5] p-3 text-charcoal-500 border border-[#D9D9D9] text-sm"
//           style={{ borderLeft: "6px solid #5EA68E" }} // Tailwind's green-500
//         >
//           <span className="font-medium">Note:&nbsp;</span>
//           Selecting a longer time period will provide more comprehensive historical data for better trend analysis and forecasting.
//           However, it may take longer to complete the initial data fetch.
//         </div>


//         {/* 1 month controls */}
//         {selectedPeriod === 1 && (
//           <div className="mt-6">
//             <div className="flex flex-wrap items-center gap-3 justify-center">
//               {/* Month */}
//               <div className="flex items-center gap-2">
//                 <label className="text-xs text-slate-500">Month</label>
//                 <select
//                   value={selMonth}
//                   onChange={(e) => setSelMonth(e.target.value)}
//                   className="rounded-lg border-2 border-slate-200 bg-white px-2 py-2 text-sm outline-none focus:border-[#5EA68E] focus:ring-4 focus:ring-[#5EA68E]/20"
//                 >
//                   {[
//                     ["01", "Jan"], ["02", "Feb"], ["03", "Mar"], ["04", "Apr"], ["05", "May"], ["06", "Jun"],
//                     ["07", "Jul"], ["08", "Aug"], ["09", "Sep"], ["10", "Oct"], ["11", "Nov"], ["12", "Dec"],
//                   ].map(([val, label]) => (
//                     <option key={val} value={val}>{label}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Year */}
//               <div className="flex items-center gap-2">
//                 <label className="text-xs text-slate-500">Year</label>
//                 <select
//                   value={selYear}
//                   onChange={(e) => setSelYear(e.target.value)}
//                   className="rounded-lg border-2 border-slate-200 bg-white px-2 py-2 text-sm outline-none focus:border-[#5EA68E] focus:ring-4 focus:ring-[#5EA68E]/20"
//                 >
//                   {Array.from({ length: 6 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Save */}
//               <button
//                 onClick={handleFetchSettlementsByMonth}
//                 disabled={busy}
//                 className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#5EA68E] to-[#1f5274] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
//               >
//                 <Database size={16} />
//                 Save for {selMonth}/{selYear}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* >1 month controls */}
//         {selectedPeriod && selectedPeriod > 1 && (
//           <div className="mt-6 flex flex-col items-center gap-3">
//             <div className="text-sm text-slate-600">
//               Fetching <span className="font-semibold">{selectedPeriod} months</span> via
//               <span className="font-semibold"> /amazon_api/settlements_finances</span> for{" "}
//               <b>{countryUsed.toUpperCase()}</b> (region <code>{regionUsed}</code>).
//             </div>
//             <button
//               onClick={handleFetchFinancesRange}
//               disabled={busy}
//               className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
//             >
//               <Database size={16} />
//               Fetch last {selectedPeriod} months (Finances)
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Data cards / preview / messages (optional UI kept minimal) */}
//       <div className="mt-4 space-y-4">
//         {message && (
//           <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-sm">
//             <CheckCircle2 />
//             <span>{message}</span>
//           </div>
//         )}
//         {error && (
//           <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
//             <AlertCircle />
//             <span>{error}</span>
//           </div>
//         )}
//         {/* You can render previews using settlementCols/settlementRows if desired */}
//       </div>
//     </div>
//   );
// };

// export default AmazonFinancialDashboard;





























































"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaDatabase as Database,
  FaDownload as Download,
  FaCheckCircle as CheckCircle2,
  FaExclamationCircle as AlertCircle,
  FaArrowLeft as ArrowLeft,
} from "react-icons/fa";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
const getAuthToken = () => (typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null);

/** ======= HARD OVERRIDE FOR TESTING ======= **/
const FORCE = {
  // UK
  enabled: true,
  country: "uk",
  region: "eu-west-1",
  marketplaceId: "A1F83G8C2ARO7P",

  // // US
  // enabled: true,
  // country: "us",
  // region: "us-east-1",
  // marketplaceId: "ATVPDKIKX0DER",
};
/** ======================================== **/

/** JSON fetch helper */
async function api(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

/** Text (CSV) fetch helper */
async function apiText(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || "Request failed");
  return text;
}

const monthNamesLower = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const two = (n: number | string) => String(n).padStart(2, "0");
const toMonthSlug = (year: number | string, monthIdx0: number) => `${year}-${monthNamesLower[monthIdx0]}`;

/** Canonical mappings */
const regionForCountry = (c: string) =>
  c === "uk" ? "eu-west-1" :
    c === "us" ? "us-east-1" :
      c === "canada" ? "ca-central-1" : "";

const marketplaceForCountry = (c: string) =>
  c === "uk" ? "A1F83G8C2ARO7P" :
    c === "us" ? "ATVPDKIKX0DER" :
      c === "canada" ? "A2EUQ1WTGCTBG2" : "";

type Props = {
  region?: string;
  country?: string;
  onClose?: () => void;
};

const AmazonFinancialDashboard: React.FC<Props> = ({ region, country, onClose }) => {
  const router = useRouter();

  /** ---- Normal computation ---- */
  const countryNormalized = (country || "").toLowerCase();
  const inferredCountry =
    countryNormalized ||
    (region === "eu-west-1" ? "uk" :
      region === "us-east-1" ? "us" :
        region === "ca-central-1" ? "canada" : "");

  let countryUsed = inferredCountry || "uk";
  let regionUsed = region || regionForCountry(countryUsed);
  let marketplaceIdUsed = marketplaceForCountry(countryUsed);

  /** ---- HARD OVERRIDE (testing) ---- */
  if (FORCE.enabled) {
    countryUsed = FORCE.country;
    regionUsed = FORCE.region;
    marketplaceIdUsed = FORCE.marketplaceId || marketplaceForCountry(FORCE.country);
  }

  const [skus, setSkus] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [debugResp, setDebugResp] = useState<any>(null);
  const [settlementRows, setSettlementRows] = useState<any[]>([]);
  const [settlementCols, setSettlementCols] = useState<string[]>([]);
  const [selMonth, setSelMonth] = useState(two(new Date().getMonth() + 1));
  const [selYear, setSelYear] = useState(String(new Date().getFullYear()));
  const [busy, setBusy] = useState(false);

  // 1 / 3 / 6 / 12 months
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  const daysBetween = (a: Date, b: Date) => Math.floor((+a - +b) / (24 * 3600 * 1000));
  const isOlderThan90Days = (year: number, month01: string) => {
    const m = Math.max(1, Math.min(12, parseInt(month01, 10)));
    const monthStart = new Date(year, m - 1, 1);
    const now = new Date();
    return daysBetween(now, monthStart) > 90;
  };

  const wrap = async (fn: () => Promise<void>) => {
    try {
      setBusy(true);
      setError("");
      setMessage("");
      await fn();
    } catch (e: any) {
      setError(
        e?.message?.startsWith("{")
          ? (() => {
            try {
              const parsed = JSON.parse(e.message);
              return parsed?.message || JSON.stringify(parsed, null, 2);
            } catch {
              return e.message;
            }
          })()
          : e.message
      );
    } finally {
      setBusy(false);
    }
  };

  // --------- 1 month: settlements if within 90d; finances if older ----------
  const handleFetchSettlementsByMonth = () =>
    wrap(async () => {
      const useFinances = isOlderThan90Days(parseInt(selYear, 10), selMonth);

      const monthIndex = Math.max(0, Math.min(11, parseInt(selMonth, 10) - 1));
      const monthParam = useFinances
        ? `${selYear}-${monthNamesLower[monthIndex]}` // e.g. 2025-january
        : `${selYear}-${selMonth}`;                  // e.g. 2025-01

      // optional fees sync
      let feesMsg = "";
      try {
        const feesResp = await api(`/fetch_fees`, {
          method: "POST",
          body: JSON.stringify({
            region: regionUsed,
            marketplace_id: marketplaceIdUsed,
            month: monthParam,
            year: selYear,
            country: countryUsed,
          }),
        });
        if (feesResp && typeof feesResp === "object") {
          const { ok, skipped, stored, failures } = feesResp as any;
          const failCount = Array.isArray(failures) ? failures.length : 0;
          feesMsg = `Fees sync: ${ok ? "ok" : "not ok"} · stored ${stored ?? 0} · skipped ${skipped ?? 0} · failures ${failCount}`;
        } else {
          feesMsg = "Fees sync: completed.";
        }
      } catch (err: any) {
        feesMsg = `Fees sync error: ${err?.message || "unknown error"}`;
      }

      const path = useFinances ? "/amazon_api/settlements_finances" : "/amazon_api/settlements";
      const qs = new URLSearchParams({
        region: regionUsed,
        marketplace_id: marketplaceIdUsed,
        month: monthParam,
        format: "csv",
        store_in_db: "false",
        limit: "all",
        run_upload_pipeline: "true",
        country: countryUsed,
        year: selYear,
        allow_report_created_fallback: "true",
      });

      const data = await api(`${path}?${qs}`);

      const preview = (data as any).items || [];
      const cols = preview.length
        ? Object.keys(preview[0])
        : [
          "date/time", "settlement id", "type", "order id", "sku", "description", "quantity", "marketplace", "fulfilment",
          "order city", "order state", "order postal", "tax collection model", "product sales", "product sales tax",
          "postage credits", "shipping credits tax", "gift wrap credits", "giftwrap credits tax", "promotional rebates",
          "promotional rebates tax", "marketplace withheld tax", "selling fees", "fba fees", "other transaction fees",
          "other", "total", "currency",
        ];

      setSettlementCols(cols);
      setSettlementRows(preview);

      let settlementsMsg = "";
      if ((data as any)?.stored?.inserted >= 0) {
        settlementsMsg = `Saved ${(data as any).stored.inserted || 0} rows (replaced ${(data as any).stored.deleted || 0}) for ${monthParam}.`;
      } else if ((data as any)?.stored?.skipped) {
        settlementsMsg = `Fetched preview for ${monthParam} (DB save skipped).`;
      } else {
        settlementsMsg = `Fetched ${useFinances ? "finances" : "settlements"} for ${monthParam}.`;
      }
      setMessage(`${feesMsg} • ${settlementsMsg}`);

      // Navigate to /country/MTD/:country/:month/:year (App Router)
      const fullMonthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      const idxForNav = Math.max(0, Math.min(11, parseInt(selMonth, 10) - 1));
      const monthSlug = fullMonthNames[idxForNav].toLowerCase();

      // Close the modal and navigate
      if (onClose) {
        onClose();
      }
      router.push(`/country/MTD/${countryUsed}/${monthSlug}/${selYear}`);
    });

  // --------- 3/6/12 months via finances ----------
  // const handleFetchFinancesRange = () =>
  //   wrap(async () => {
  //     const n = selectedPeriod || 0;
  //     if (![3, 6, 12].includes(n)) {
  //       setMessage("Please select 3, 6, or 12 months.");
  //       return;
  //     }

  //     const now = new Date();
  //     const months: { y: number; mIdx: number }[] = [];
  //     for (let i = 0; i < n; i++) {
  //       const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
  //       months.push({ y: d.getUTCFullYear(), mIdx: d.getUTCMonth() });
  //     }
  //     months.reverse();

  //     let combinedRows: any[] = [];
  //     let combinedCols: string[] | null = null;
  //     let okCount = 0;
  //     let csvFallbackCount = 0;

  //     for (const { y, mIdx } of months) {
  //       // Try JSON for preview
  //       const jsonQs = new URLSearchParams({
  //         region: regionUsed,
  //         marketplace_id: marketplaceIdUsed,
  //         month: toMonthSlug(y, mIdx),
  //         limit: "all",
  //         country: countryUsed,
  //         run_upload_pipeline: "true",
  //         year: String(y),
  //         format: "json",
  //         store_in_db: "false",
  //       });
  //       try {
  //         const data = await api(`/amazon_api/settlements_finances?${jsonQs}`);
  //         const rows = Array.isArray((data as any)?.items) ? (data as any).items : [];
  //         if (rows.length) {
  //           if (!combinedCols) combinedCols = Object.keys(rows[0]);
  //           combinedRows = combinedRows.concat(rows);
  //         }
  //         okCount++;
  //         continue;
  //       } catch {
  //         // Fallback to CSV (no preview parsing)
  //         const csvQs = new URLSearchParams({
  //           region: regionUsed,
  //           marketplace_id: marketplaceIdUsed,
  //           month: toMonthSlug(y, mIdx),
  //           limit: "all",
  //           country: countryUsed,
  //           year: String(y),
  //           format: "csv",
  //           store_in_db: "false",
  //         });
  //         try {
  //           await apiText(`/amazon_api/settlements_finances?${csvQs}`);
  //           okCount++;
  //           csvFallbackCount++;
  //         } catch (e2) {
  //           console.error("Finances fetch failed for", y, mIdx + 1, e2);
  //         }
  //       }
  //     }

  //     if (combinedRows.length > 0) {
  //       setSettlementCols(combinedCols || []);
  //       setSettlementRows(combinedRows);
  //     } else {
  //       setSettlementCols([]);
  //       setSettlementRows([]);
  //     }

  //     const details = [
  //       `Requested: ${n} month${n > 1 ? "s" : ""}`,
  //       `Succeeded: ${okCount}`,
  //       csvFallbackCount ? `CSV fallback for ${csvFallbackCount} month(s)` : null,
  //     ].filter(Boolean).join(" · ");

  //     setMessage(`Finances fetch complete for ${countryUsed}. ${details}`);

  //     // Navigate to latest month
  //     const fullMonthNames = [
  //       "January", "February", "March", "April", "May", "June",
  //       "July", "August", "September", "October", "November", "December",
  //     ];
  //     const latestMonthIdx = new Date().getMonth();
  //     const latestYear = new Date().getFullYear();
  //     const monthSlug = fullMonthNames[latestMonthIdx].toLowerCase();

  //     // Close the modal and navigate
  //     if (onClose) {
  //       onClose();
  //     }
  //     router.push(`/country/MTD/${countryUsed}/${monthSlug}/${latestYear}`);
  //   });

  // --------- 3/6/12 months: 3m via settlements, 6/12 via finances ----------
  const handleFetchFinancesRange = () =>
    wrap(async () => {
      const n = selectedPeriod || 0;
      if (![3, 6, 12].includes(n)) {
        setMessage("Please select 3, 6, or 12 months.");
        return;
      }

      const now = new Date();
      const months: { y: number; mIdx: number }[] = [];
      for (let i = 0; i < n; i++) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        months.push({ y: d.getUTCFullYear(), mIdx: d.getUTCMonth() });
      }
      months.reverse();

      let combinedRows: any[] = [];
      let combinedCols: string[] | null = null;
      let okCount = 0;
      let csvFallbackCount = 0;

      for (const { y, mIdx } of months) {
        if (n === 3) {
          // -------- 3 MONTHS: USE /amazon_api/settlements --------
          const monthParam = `${y}-${two(mIdx + 1)}`; // e.g. 2025-01
          const qs = new URLSearchParams({
            region: regionUsed,
            marketplace_id: marketplaceIdUsed,
            month: monthParam,
            limit: "all",
            country: countryUsed,
            year: String(y),
            format: "csv",
            store_in_db: "false",
            run_upload_pipeline: "true",
            allow_report_created_fallback: "true",
          });

          try {
            const data = await api(`/amazon_api/settlements?${qs}`);
            const rows = Array.isArray((data as any)?.items) ? (data as any).items : [];
            if (rows.length) {
              if (!combinedCols) combinedCols = Object.keys(rows[0]);
              combinedRows = combinedRows.concat(rows);
            }
            okCount++;
          } catch (e) {
            console.error("Settlements fetch failed for", y, mIdx + 1, e);
          }
        } else {
          // -------- 6/12 MONTHS: USE /amazon_api/settlements_finances --------
          // Try JSON for preview
          const jsonQs = new URLSearchParams({
            region: regionUsed,
            marketplace_id: marketplaceIdUsed,
            month: toMonthSlug(y, mIdx), // e.g. 2025-january
            limit: "all",
            country: countryUsed,
            run_upload_pipeline: "true",
            year: String(y),
            format: "json",
            store_in_db: "false",
          });
          try {
            const data = await api(`/amazon_api/settlements_finances?${jsonQs}`);
            const rows = Array.isArray((data as any)?.items) ? (data as any).items : [];
            if (rows.length) {
              if (!combinedCols) combinedCols = Object.keys(rows[0]);
              combinedRows = combinedRows.concat(rows);
            }
            okCount++;
            continue;
          } catch {
            // Fallback to CSV (no preview parsing)
            const csvQs = new URLSearchParams({
              region: regionUsed,
              marketplace_id: marketplaceIdUsed,
              month: toMonthSlug(y, mIdx),
              limit: "all",
              country: countryUsed,
              year: String(y),
              format: "csv",
              store_in_db: "false",
            });
            try {
              await apiText(`/amazon_api/settlements_finances?${csvQs}`);
              okCount++;
              csvFallbackCount++;
            } catch (e2) {
              console.error("Finances fetch failed for", y, mIdx + 1, e2);
            }
          }
        }
      }

      if (combinedRows.length > 0) {
        setSettlementCols(combinedCols || []);
        setSettlementRows(combinedRows);
      } else {
        setSettlementCols([]);
        setSettlementRows([]);
      }

      const details = [
        `Requested: ${n} month${n > 1 ? "s" : ""}`,
        `Succeeded: ${okCount}`,
        csvFallbackCount ? `CSV fallback for ${csvFallbackCount} month(s)` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      const modeLabel = n === 3 ? "Settlements" : "Finances";
      setMessage(`${modeLabel} fetch complete for ${countryUsed}. ${details}`);

      // Navigate to latest month
      const fullMonthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      const latestMonthIdx = new Date().getMonth();
      const latestYear = new Date().getFullYear();
      const monthSlug = fullMonthNames[latestMonthIdx].toLowerCase();

      if (onClose) {
        onClose();
      }
      router.push(`/country/MTD/${countryUsed}/${monthSlug}/${latestYear}`);
    });


  return (
    <div className="w-full">
      <div className="rounded-xl bg-white p-4">
        {/* Header */}
        <div className="items-center mb-2">
          <div className="text-center">
            <PageBreadcrumb pageTitle="Select Data Fetch Period" textSize="2xl" variant="table" />
            <p className="font-bold text-charcoal-500 mt-1">
              Link your Amazon Seller Central to sync your sales data
            </p>
          </div>
          <div className="invisible inline-flex items-center gap-2 rounded-md border border-emerald-200 px-2 py-1">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </div>
        </div>

        {/* Period Options */}
        <div className="mt-2 grid grid-cols-2 sm:flex sm:justify-center gap-3">
          {[1, 3, 6, 12].map((m) => {
            const isActive = selectedPeriod === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedPeriod(m)}
                className={[
                  "w-full sm:w-48 rounded-lg border px-6 py-4 text-center transition",
                  isActive
                    ? "border-emerald-600 ring-2 ring-emerald-200 bg-white"
                    : "border-slate-200 bg-slate-50 hover:bg-white",
                ].join(" ")}
              >
                <div className="text-lg font-semibold text-slate-800">{m}</div>
                <div className="text-xs uppercase tracking-wide text-slate-500 mt-1">
                  {m === 1 ? "Month" : "Months"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Note */}
        <div
          className="mt-4 rounded-lg bg-[#D9D9D9E5] p-3 text-charcoal-500 border border-[#D9D9D9] text-sm"
          style={{ borderLeft: "6px solid #5EA68E" }}
        >
          <span className="font-medium">Note:&nbsp;</span>
          Selecting a longer time period will provide more comprehensive historical data for better trend analysis and forecasting.
          However, it may take longer to complete the initial data fetch.
        </div>

        {/* 1 month controls */}
        {selectedPeriod === 1 && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              {/* Month */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500">Month</label>
                <select
                  value={selMonth}
                  onChange={(e) => setSelMonth(e.target.value)}
                  className="rounded-lg border-2 border-slate-200 bg-white px-2 py-2 text-sm outline-none focus:border-[#5EA68E] focus:ring-4 focus:ring-[#5EA68E]/20"
                >
                  {[
                    ["01", "Jan"], ["02", "Feb"], ["03", "Mar"], ["04", "Apr"], ["05", "May"], ["06", "Jun"],
                    ["07", "Jul"], ["08", "Aug"], ["09", "Sep"], ["10", "Oct"], ["11", "Nov"], ["12", "Dec"],
                  ].map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500">Year</label>
                <select
                  value={selYear}
                  onChange={(e) => setSelYear(e.target.value)}
                  className="rounded-lg border-2 border-slate-200 bg-white px-2 py-2 text-sm outline-none focus:border-[#5EA68E] focus:ring-4 focus:ring-[#5EA68E]/20"
                >
                  {Array.from({ length: 6 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Save */}
              <button
                onClick={handleFetchSettlementsByMonth}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#5EA68E] to-[#1f5274] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
              >
                <Database size={16} />
                Save for {selMonth}/{selYear}
              </button>
            </div>
          </div>
        )}

        {/* >1 month controls */}
        {selectedPeriod && selectedPeriod > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="text-sm text-slate-600">
              Fetching <span className="font-semibold">{selectedPeriod} months</span> via
              <span className="font-semibold"> /amazon_api/settlements_finances</span> for{" "}
              <b>{countryUsed.toUpperCase()}</b> (region <code>{regionUsed}</code>).
            </div>
            <button
              onClick={handleFetchFinancesRange}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
            >
              <Database size={16} />
              Fetch last {selectedPeriod} months (Finances)
            </button>
          </div>
        )}
      </div>

      {/* Data cards / preview / messages */}
      <div className="mt-4 space-y-4">
        {message && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-sm">
            <CheckCircle2 />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            <AlertCircle />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmazonFinancialDashboard;