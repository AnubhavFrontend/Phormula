// "use client";

// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import Loader from "@/components/loader/Loader";
// import React, { useEffect, useState, useMemo, useCallback } from "react";

// /* ===================== ENV & ENDPOINTS ===================== */
// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
// const SHOPIFY_CCY = process.env.NEXT_PUBLIC_SHOPIFY_CURRENCY || "GBP";
// const SHOPIFY_TO_GBP = Number(process.env.NEXT_PUBLIC_SHOPIFY_TO_GBP || "1");
// const API_URL = `${baseURL}/amazon_api/orders`;
// const SHOPIFY_ENDPOINT = `${baseURL}/shopify/get_monthly_data`;
// const SHOPIFY_DROPDOWN_ENDPOINT = `${baseURL}/shopify/dropdown`;

// /** 💵 FX rates */
// const GBP_TO_USD = Number(process.env.NEXT_PUBLIC_GBP_TO_USD || "1.31");
// const INR_TO_USD = Number(process.env.NEXT_PUBLIC_INR_TO_USD || "0.01128");

// const USE_MANUAL_LAST_MONTH =
//   (process.env.NEXT_PUBLIC_USE_MANUAL_LAST_MONTH || "false").toLowerCase() === "true";

// /** Put last month's TOTAL SALES in USD (not to-date) */
// const MANUAL_LAST_MONTH_USD_GLOBAL = Number(
//   process.env.NEXT_PUBLIC_MANUAL_LAST_MONTH_USD_GLOBAL || "0"
// );
// /** Optional per-region overrides */
// const MANUAL_LAST_MONTH_USD_UK = Number(process.env.NEXT_PUBLIC_MANUAL_LAST_MONTH_USD_UK || "0");
// const MANUAL_LAST_MONTH_USD_US = Number(process.env.NEXT_PUBLIC_MANUAL_LAST_MONTH_USD_US || "0");
// const MANUAL_LAST_MONTH_USD_CA = Number(process.env.NEXT_PUBLIC_MANUAL_LAST_MONTH_USD_CA || "0");

// /* ===================== DATE HELPERS ===================== */
// function getISTYearMonth() {
//   const optsMonth: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", month: "long" };
//   const optsYear: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", year: "numeric" };
//   const now = new Date();
//   const monthName = now.toLocaleString("en-US", optsMonth);
//   const yearStr = now.toLocaleString("en-US", optsYear);
//   return { monthName, year: Number(yearStr) };
// }

// function buildShopifyURL({ year, monthName }: { year: number; monthName: string }) {
//   const qs = new URLSearchParams();
//   qs.set("year", String(year));
//   qs.append("months[]", monthName);
//   return `${SHOPIFY_ENDPOINT}?${qs.toString()}`;
// }

// function buildShopifyDropdownMonthlyURL({
//   year,
//   monthName,
// }: {
//   year: number;
//   monthName: string;
// }) {
//   const qs = new URLSearchParams();
//   qs.set("range", "monthly");
//   qs.set("year", String(year));
//   qs.set("month", monthName.toLowerCase());
//   return `${SHOPIFY_DROPDOWN_ENDPOINT}?${qs.toString()}`;
// }

// function getPrevISTYearMonth() {
//   const tz = "Asia/Kolkata";
//   const now = new Date();
//   const istNow = new Date(now.toLocaleString("en-US", { timeZone: tz }));
//   const year = istNow.getMonth() === 0 ? istNow.getFullYear() - 1 : istNow.getFullYear();
//   const monthIdx = istNow.getMonth() === 0 ? 11 : istNow.getMonth() - 1;
//   const monthName = new Date(year, monthIdx, 1).toLocaleString("en-US", {
//     month: "long",
//     timeZone: tz,
//   });
//   return { monthName, year };
// }

// function getPrevMonthShortLabel() {
//   const { monthName, year } = getPrevISTYearMonth();
//   const shortMon = new Date(`${monthName} 1, ${year}`).toLocaleString("en-US", {
//     month: "short",
//     timeZone: "Asia/Kolkata",
//   });
//   return `${shortMon}'${String(year).slice(-2)}`; // e.g., Oct'25
// }

// function getISTDayInfo() {
//   const tz = "Asia/Kolkata";
//   const now = new Date();
//   const istNow = new Date(now.toLocaleString("en-US", { timeZone: tz }));
//   const todayDay = istNow.getDate();
//   const { monthName, year } = getPrevISTYearMonth();
//   const prevMonthIdx = new Date(`${monthName} 1, ${year}`).getMonth();
//   const daysInPrevMonth = new Date(year, prevMonthIdx + 1, 0).getDate();
//   const daysInThisMonth = new Date(istNow.getFullYear(), istNow.getMonth() + 1, 0).getDate();
//   return { todayDay, daysInPrevMonth, daysInThisMonth };
// }

// /* ===================== UI HELPERS ===================== */
// const ValueOrSkeleton = ({
//   loading,
//   children,
//   compact = false,
//   mode = "replace",
// }: {
//   loading: boolean;
//   children: React.ReactNode;
//   compact?: boolean;
//   mode?: "replace" | "inline";
// }) => {
//   if (mode === "inline") {
//     return (
//       <span className="inline-flex items-center gap-1">
//         {children}
//         {loading && (
//           <Loader
//             size={compact ? 16 : 20}
//             transparent
//             roundedClass="rounded-full"
//             backgroundClass="bg-transparent"
//             className="text-gray-400"
//             forceFallback
//           />
//         )}
//       </span>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="inline-flex items-center justify-center">
//         <Loader
//           size={compact ? 28 : 36}
//           transparent
//           roundedClass="rounded-full"
//           backgroundClass="bg-transparent"
//           className="text-gray-400"
//           forceFallback
//         />
//       </div>
//     );
//   }
//   return <>{children}</>;
// };

// /* ---------- Formatters & Safe Number ---------- */
// const fmtCurrency = (val: any, ccy = "GBP") => {
//   if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
//   return new Intl.NumberFormat("en-GB", {
//     style: "currency",
//     currency: ccy,
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(Number(val));
// };

// const fmtGBP = (val: any) => fmtCurrency(val, "GBP");

// const fmtUSD = (val: any) => {
//   if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(Number(val));
// };

// const fmtShopify = (val: any) => {
//   if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(Number(val));
// };

// const fmtNum = (val: any) =>
//   val === null || val === undefined || val === "" || isNaN(Number(val))
//     ? "—"
//     : new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
//         Number(val)
//       );

// const fmtPct = (val: any) =>
//   val === null || val === undefined || isNaN(Number(val)) ? "—" : `${Number(val).toFixed(2)}%`;

// const fmtUSDk = (val: any) => {
//   if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
//   const n = Number(val);
//   const abs = Math.abs(n);

//   // Under 1000: keep normal format
//   if (abs < 1000) {
//     return fmtUSD(n);
//   }

//   const k = n / 1000;
//   // $6.1k style
//   const base = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 1,
//     maximumFractionDigits: 1,
//   }).format(k);

//   return `${base}k`;
// };


// const toNumberSafe = (v: any) => {
//   if (v === null || v === undefined) return 0;
//   if (typeof v === "number") return v;
//   const s = String(v).replace(/[, ]+/g, "");
//   const n = Number(s);
//   return isNaN(n) ? 0 : n;
// };

// /* ===================== SALES TARGET CARD ===================== */
// type RegionKey = "Global" | "UK" | "US" | "CA";


// function SalesTargetCard({
//   regions,
//   defaultRegion = "Global",
// }: {
//   regions: Record<
//     RegionKey,
//     {
//       mtdUSD: number;
//       lastMonthToDateUSD: number;
//       lastMonthTotalUSD: number;
//       targetUSD: number;
//     }
//   >;
//   defaultRegion?: RegionKey;
// }) {
//   const [tab, setTab] = useState<RegionKey>(defaultRegion);

//   const data = regions[tab] || regions.Global;
//   const { mtdUSD, lastMonthToDateUSD, lastMonthTotalUSD, targetUSD } = data;

//   const pct = targetUSD > 0 ? Math.min(mtdUSD / targetUSD, 1) : 0;
//   const pctLastMTD = targetUSD > 0 ? Math.min(lastMonthToDateUSD / targetUSD, 1) : 0;

//   const deltaPct = (pct - pctLastMTD) * 100;

//   const { todayDay } = getISTDayInfo();
//   const todayApprox = todayDay > 0 ? mtdUSD / todayDay : 0;

//   const prevLabel = getPrevMonthShortLabel();

//   const size = 280;

//   // thinner arcs
//   const strokeMain = 10; // main (grey + green) arc thickness
//   const strokeLast = 6;  // orange arc thickness

//   const cx = size / 2;
//   const rBase = size / 2 - strokeMain;

// const gap = 14;

//   // radii
//   const rTarget = rBase;                 // grey background arc
//   const rCurrent = rBase;                // green MTD arc
//   const rLastMTD = rCurrent - strokeMain / 2 - gap - strokeLast / 2;

//   const toXYRadius = (angDeg: number, radius: number) => {
//     const rad = (Math.PI / 180) * (180 - angDeg);
//     return {
//       x: cx + radius * Math.cos(rad),
//       y: size / 2 - radius * Math.sin(rad),
//     };
//   };

//   const arcPath = (fromDeg: number, toDeg: number, radius: number) => {
//     const start = toXYRadius(fromDeg, radius);
//     const end = toXYRadius(toDeg, radius);
//     const largeArc = toDeg - fromDeg > 180 ? 1 : 0;
//     return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
//   };

//   const fullFrom = 0;
//   const fullTo = 180;
//   const toDeg_MTD = 180 * pct;

//   // orange = full last-month total (since target === lastMonthTotalUSD)
//   const toDeg_LastMTD = 180;

//   const knobGreen = toXYRadius(toDeg_MTD, rCurrent);
//   const knobYellow = toXYRadius(toDeg_LastMTD, rLastMTD);

//   const badgeIsUp = deltaPct >= 0;
//   const badgeStr = (badgeIsUp ? "▲ " : "▼ ") + `${Math.abs(deltaPct).toFixed(2)}%`;

//   return (
//     <div className="rounded-2xl border bg-white p-5 shadow-sm">
//       {/* Header with tabs */}
//       <div className="mb-3 flex flex-col items-center justify-between gap-2">
//         <PageBreadcrumb pageTitle="Sales Target" textSize="2xl" variant="page" align="center" />

//         <div className="inline-flex rounded-lg border bg-gray-50 p-1 text-xs">
//           {(["Global", "UK", "US", "CA"] as RegionKey[]).map((key) => (
//             <button
//               key={key}
//               type="button"
//               onClick={() => setTab(key)}
//               className={`px-3 py-1 rounded-lg ${
//                 key === tab
//                   ? "bg-[#C7E6D7] text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               {key}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="mt-3 mb-2 flex items-center gap-5 text-xs">
//         <div className="flex items-center gap-2">
//           <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "#5EA68E" }} />
//           <span className="text-gray-600">MTD Sales</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "#9ca3af" }} />
//           <span className="text-gray-600">This Month Target</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "#FFBE25" }} />
//           <span className="text-gray-600">{prevLabel} MTD</span>
//         </div>
//       </div>

//       {/* Gauge */}
//       <div className="mt-4 flex items-center justify-center">
//         <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
//           {/* grey target arc */}
//           <path
//             d={arcPath(fullFrom, fullTo, rTarget)}
//             fill="none"
//             stroke="#e5e7eb"
//             strokeWidth={strokeMain}
//             strokeLinecap="round"
//           />

//           {/* orange last-month arc */}
//           <path
//             d={arcPath(fullFrom, toDeg_LastMTD, rLastMTD)}
//             fill="none"
//             stroke="#f59e0b"
//             strokeWidth={strokeLast}
//             strokeLinecap="round"
//           />

//           {/* green MTD arc */}
//           <path
//             d={arcPath(fullFrom, toDeg_MTD, rCurrent)}
//             fill="none"
//             stroke="#16a34a"
//             strokeWidth={strokeMain}
//             strokeLinecap="round"
//           />

//           {/* pointers */}
//           <circle
//             cx={knobYellow.x}
//             cy={knobYellow.y}
//             r={12} // bigger orange pointer
//             fill="#f59e0b"
//             stroke="#fffbeb"
//             strokeWidth={4}
//           />

//           <circle
//             cx={knobGreen.x}
//             cy={knobGreen.y}
//             r={16} // bigger main pointer
//             fill="#16a34a"
//             stroke="#ecfdf3"
//             strokeWidth={5}
//           />
//         </svg>
//       </div>

//       {/* Center metrics */}
//       <div className="text-center">
//         <div className="text-3xl font-bold">{(pct * 100).toFixed(1)}%</div>
//         <div
//           className={`mx-auto mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
//             badgeIsUp ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"
//           }`}
//         >
//           {badgeStr}
//         </div>
//       </div>

//       {/* Bottom KPIs (in K) */}
//       <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
//         <div className="flex flex-col items-center rounded-xl justify-between bg-gray-50 p-3">
//           <div className="text-gray-500">Today</div>
//           <div className="mt-0.5 font-semibold">{fmtUSDk(todayApprox)}</div>
//         </div>
//         <div className="flex flex-col items-center rounded-xl justify-between bg-gray-50 p-3">
//           <div className="text-gray-500">MTD Sales</div>
//           <div className="mt-0.5 font-semibold">{fmtUSDk(mtdUSD)}</div>
//         </div>
//         <div className="flex flex-col items-center rounded-xl justify-between bg-gray-50 p-3">
//           <div className="text-gray-500">Target</div>
//           <div className="mt-0.5 font-semibold">{fmtUSDk(targetUSD)}</div>
//         </div>
//         <div className="flex flex-col items-center rounded-xl justify-between bg-gray-50 p-3">
//           <div className="text-gray-500">{prevLabel}</div>
//           <div className="mt-0.5 font-semibold">{fmtUSDk(lastMonthTotalUSD)}</div>
//         </div>
//       </div>
//     </div>
//   );
// }


// /* ===================== SIMPLE BAR CHART ===================== */
// function SimpleBarChart({
//   items,
//   height = 300,
//   padding = { top: 28, right: 24, bottom: 56, left: 24 },
//   colors = ["#2563eb", "#5EA68E", "#FFBE25", "#ec4899", "#8b5cf6"],
// }: {
//   items: Array<{ label: string; raw: number; display: string }>;
//   height?: number;
//   padding?: { top: number; right: number; bottom: number; left: number };
//   colors?: string[];
// }) {
//   const [animateIn, setAnimateIn] = useState(false);
//   const [hoverIdx, setHoverIdx] = useState<number | null>(null);

//   useEffect(() => {
//     const t = setTimeout(() => setAnimateIn(true), 50);
//     return () => clearTimeout(t);
//   }, []);

//   const width = 760;
//   const innerW = width - padding.left - padding.right;
//   const innerH = height - padding.top - padding.bottom;
//   const values = items.map((d) => (Number.isFinite(d.raw) ? Math.abs(Number(d.raw)) : 0));
//   const max = Math.max(1, ...values);
//   const baseBarW = Math.max(12, (innerW / Math.max(1, items.length)) * 0.4);

//   const Tooltip = ({
//     x,
//     y,
//     label,
//     display,
//     color,
//   }: {
//     x: number;
//     y: number;
//     label: string;
//     display: string;
//     color: string;
//   }) => {
//     const textY1 = y - 30;
//     const text = `${label}: ${display}`;
//     return (
//       <g>
//         <rect x={x - 70} y={textY1 - 24} width={140} height={24} rx={6} fill="#111827" opacity="0.9" />
//         <text
//           x={x}
//           y={textY1 - 8}
//           textAnchor="middle"
//           fontSize="11"
//           fill="#ffffff"
//           style={{ pointerEvents: "none" }}
//         >
//           {text}
//         </text>
//         <polygon points={`${x - 6},${textY1} ${x + 6},${textY1} ${x},${textY1 + 6}`} fill="#111827" opacity="0.9" />
//         <circle cx={x} cy={y} r="6.5" fill="none" stroke={color} strokeWidth={2} />
//       </g>
//     );
//   };

//   return (
//     <div className="w-full overflow-x-auto ">
//       <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[760px] select-none">
//         <defs>
//           <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
//             <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
//           </filter>
//         </defs>

//         <line
//           x1={padding.left}
//           y1={height - padding.bottom}
//           x2={width - padding.right}
//           y2={height - padding.bottom}
//           stroke="#e5e7eb"
//         />

//         {items.map((d, i) => {
//           const v = values[i];
//           const hFull = (v / max) * innerH;
//           const barH = animateIn ? hFull : 0;
//           const band = innerW / Math.max(1, items.length);
//           const xCenter = padding.left + band * i + band / 2;
//           const barW = hoverIdx === i ? baseBarW + 6 : baseBarW;
//           const x = xCenter - barW / 2;
//           const y = padding.top + (innerH - barH);
//           const color = colors[i % colors.length];

//           return (
//             <g
//               key={d.label}
//               onMouseEnter={() => setHoverIdx(i)}
//               onMouseLeave={() => setHoverIdx(null)}
//               style={{ cursor: "pointer" }}
//             >
//               <rect
//                 x={x}
//                 y={y}
//                 width={barW}
//                 height={Math.max(0, barH)}
//                 rx={8}
//                 fill={color}
//                 filter="url(#barShadow)"
//                 opacity={hoverIdx === i ? 0.95 : 0.85}
//               />
//               <text x={xCenter} y={y - 10} textAnchor="middle" fontSize={12} fontWeight={600} fill="#111827">
//                 {d.display}
//               </text>
//               <text x={xCenter} y={height - padding.bottom + 20} textAnchor="middle" fontSize={12} fill="#6b7280">
//                 {d.label}
//               </text>
//               {hoverIdx === i && <Tooltip x={xCenter} y={y} label={d.label} display={d.display} color={color} />}
//             </g>
//           );
//         })}
//       </svg>
//     </div>
//   );
// }

// /* ===================== MAIN PAGE ===================== */
// export default function DashboardPage() {
//   // Amazon
//   const [loading, setLoading] = useState(false);
//   const [unauthorized, setUnauthorized] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<any>(null);

//   // Shopify (current month)
//   const [shopifyLoading, setShopifyLoading] = useState(false);
//   const [shopifyError, setShopifyError] = useState<string | null>(null);
//   const [shopifyRows, setShopifyRows] = useState<any[]>([]);
//   const shopify = shopifyRows?.[0] || null;

//   // Shopify (previous month)
//   const [shopifyPrevRows, setShopifyPrevRows] = useState<any[]>([]);

//   // Shopify store info (shop_name + access_token)
//   const [shopifyStore, setShopifyStore] = useState<any | null>(null);

//   // which region tab is selected in the Amazon card
//   const [amazonRegion, setAmazonRegion] = useState<RegionKey>("Global");

//   const fetchAmazon = useCallback(async () => {
//     setLoading(true);
//     setUnauthorized(false);
//     setError(null);
//     try {
//       const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
//       if (!token) {
//         setUnauthorized(true);
//         throw new Error("No token found. Please sign in.");
//       }
//       const res = await fetch(API_URL, {
//         method: "GET",
//         headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//         credentials: "omit",
//       });
//       if (res.status === 401) {
//         setUnauthorized(true);
//         throw new Error("Unauthorized — token missing/invalid/expired.");
//       }
//       if (!res.ok) throw new Error(`Request failed: ${res.status}`);
//       const json = await res.json();
//       setData(json);
//     } catch (e: any) {
//       setError(e?.message || "Failed to load data");
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch Shopify store info (shop_name + access_token)
//   useEffect(() => {
//     const fetchShopifyStore = async () => {
//       try {
//         const token =
//           typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
//         if (!token) {
//           console.log("No JWT found for Shopify store lookup");
//           return;
//         }

//         const res = await fetch(`${baseURL}/shopify/store`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const ct = res.headers.get("content-type") || "";
//         if (!ct.includes("application/json")) {
//           const text = await res.text();
//           console.error("Non-JSON /shopify/store response:", text);
//           return;
//         }

//         const data = await res.json();
//         console.log("Shopify store for dashboard:", data);

//         if (!res.ok || data?.error) return;

//         setShopifyStore(data);
//       } catch (err) {
//         console.error("Error fetching Shopify store in Dashboard:", err);
//       }
//     };

//     fetchShopifyStore();
//   }, []);

//   const fetchShopify = useCallback(async () => {
//     setShopifyLoading(true);
//     setShopifyError(null);
//     try {
//       const user_token =
//         typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
//       if (!user_token) throw new Error("No token found. Please sign in.");

//       if (!shopifyStore?.shop_name || !shopifyStore?.access_token) {
//         throw new Error("Shopify store not connected.");
//       }

//       const { monthName, year } = getISTYearMonth();

//       const params = new URLSearchParams({
//         range: "monthly",
//         month: monthName.toLowerCase(),
//         year: String(year),
//         user_token,
//         shop: shopifyStore.shop_name,
//         token: shopifyStore.access_token,
//       });

//       const url = `${SHOPIFY_DROPDOWN_ENDPOINT}?${params.toString()}`;

//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${user_token}`,
//         },
//         credentials: "omit",
//       });

//       if (res.status === 401)
//         throw new Error("Unauthorized — token missing/invalid/expired.");
//       if (!res.ok) throw new Error(`Shopify request failed: ${res.status}`);

//       const json = await res.json();
//       console.log("Shopify dropdown (current month):", json);

//       const row = json?.last_row_data ? json.last_row_data : null;
//       setShopifyRows(row ? [row] : []);
//     } catch (e: any) {
//       setShopifyError(e?.message || "Failed to load Shopify data");
//       setShopifyRows([]);
//     } finally {
//       setShopifyLoading(false);
//     }
//   }, [shopifyStore]);

//   const fetchShopifyPrev = useCallback(async () => {
//     try {
//       const user_token =
//         typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
//       if (!user_token) throw new Error("No token found. Please sign in.");

//       if (!shopifyStore?.shop_name || !shopifyStore?.access_token) {
//         throw new Error("Shopify store not connected.");
//       }

//       const { year, monthName } = getPrevISTYearMonth();

//       const params = new URLSearchParams({
//         range: "monthly",
//         month: monthName.toLowerCase(),
//         year: String(year),
//         user_token,
//         shop: shopifyStore.shop_name,
//         token: shopifyStore.access_token,
//       });

//       const url = `${SHOPIFY_DROPDOWN_ENDPOINT}?${params.toString()}`;

//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${user_token}`,
//         },
//         credentials: "omit",
//       });

//       if (res.status === 401)
//         throw new Error("Unauthorized — token missing/invalid/expired.");
//       if (!res.ok) throw new Error(`Shopify (prev) request failed: ${res.status}`);

//       const json = await res.json();
//       console.log("Shopify dropdown (prev month):", json);

//       const row = json?.last_row_data ? json.last_row_data : null;
//       setShopifyPrevRows(row ? [row] : []);
//     } catch (e: any) {
//       console.warn("Shopify prev-month fetch failed:", e?.message);
//       setShopifyPrevRows([]);
//     }
//   }, [shopifyStore]);

//   const refreshAll = useCallback(async () => {
//     await fetchAmazon();

//     if (shopifyStore?.shop_name && shopifyStore?.access_token) {
//       await Promise.all([fetchShopify(), fetchShopifyPrev()]);
//     }
//   }, [fetchAmazon, fetchShopify, fetchShopifyPrev, shopifyStore]);

//   useEffect(() => {
//     refreshAll();
//   }, [refreshAll]);

//   // ---------- Amazon aliases ----------
//   const cms = data?.current_month_summary || null;
//   const cmp = data?.current_month_profit || null;

//   const uk = useMemo(() => {
//     const netSalesGBP = cms?.net_sales?.GBP != null ? toNumberSafe(cms.net_sales.GBP) : null;
//     const aspGBP = cms?.asp?.GBP != null ? toNumberSafe(cms.asp.GBP) : null;

//     const breakdownGBP = cmp?.breakdown?.GBP || {};

//     const cogsGBP = breakdownGBP.cogs !== undefined ? toNumberSafe(breakdownGBP.cogs) : 0;
//     const fbaFeesGBP =
//       breakdownGBP.fba_fees !== undefined ? toNumberSafe(breakdownGBP.fba_fees) : 0;
//     const sellingFeesGBP =
//       breakdownGBP.selling_fees !== undefined ? toNumberSafe(breakdownGBP.selling_fees) : 0;
//     const amazonFeesGBP = fbaFeesGBP + sellingFeesGBP;

//     let profitGBP: number | null = null;
//     if (cmp?.profit && typeof cmp.profit === "object" && cmp.profit.GBP !== undefined) {
//       profitGBP = toNumberSafe(cmp.profit.GBP);
//     } else if ((typeof cmp?.profit === "number" || typeof cmp?.profit === "string") && netSalesGBP !== null) {
//       profitGBP = toNumberSafe(cmp.profit);
//     }

//     let unitsGBP: number | null = null;
//     if (breakdownGBP.quantity !== undefined) {
//       unitsGBP = toNumberSafe(breakdownGBP.quantity);
//     }

//     let profitPctGBP: number | null = null;
//     if (profitGBP !== null && netSalesGBP && !isNaN(netSalesGBP) && netSalesGBP !== 0) {
//       profitPctGBP = (profitGBP / netSalesGBP) * 100;
//     }

//     return {
//       unitsGBP,
//       netSalesGBP,
//       aspGBP,
//       profitGBP,
//       profitPctGBP,
//       cogsGBP,
//       amazonFeesGBP,
//     };
//   }, [cms, cmp]);

//   const shopifyNotConnected =
//   !shopifyStore?.shop_name ||
//   !shopifyStore?.access_token ||
//   (shopifyError &&
//     (shopifyError.toLowerCase().includes("shopify store not connected") ||
//      shopifyError.toLowerCase().includes("no token")));

//   const barsAmazon = useMemo(() => {
//     const units = cms?.total_quantity ?? 0;
//     const sales = uk.netSalesGBP ?? 0;
//     const asp = uk.aspGBP ?? 0;
//     const profit = uk.profitGBP ?? 0;
//     const pcent = Number.isFinite(uk.profitPctGBP) ? (uk.profitPctGBP as number) : 0;

//     return [
//       { label: "Units", raw: Number(units) || 0, display: fmtNum(units) },
//       { label: "Sales", raw: Number(sales) || 0, display: fmtGBP(sales) },
//       { label: "ASP", raw: Number(asp) || 0, display: fmtGBP(asp) },
//       { label: "Profit", raw: Number(profit) || 0, display: fmtGBP(profit) },
//       { label: "Profit %", raw: Number(pcent) || 0, display: fmtPct(pcent) },
//     ];
//   }, [uk, cms]);

//   const shopifyDeriv = useMemo(() => {
//     if (!shopify) return null;
//     const totalOrders = toNumberSafe(shopify.total_orders);
//     const netSales = toNumberSafe(shopify.net_sales);
//     const totalDiscounts = toNumberSafe(shopify.total_discounts);
//     const totalTax = toNumberSafe(shopify.total_tax);
//     const gross = toNumberSafe(shopify.total_price);
//     const aov = totalOrders > 0 ? gross / totalOrders : 0;
//     return { totalOrders, netSales, totalDiscounts, totalTax, gross, aov };
//   }, [shopify]);

//   const shopifyPrevDeriv = useMemo(() => {
//     const row = shopifyPrevRows?.[0];
//     if (!row) return null;
//     const netSales = toNumberSafe(row.net_sales);
//     return { netSales };
//   }, [shopifyPrevRows]);

//   const amazonUK_USD = useMemo(() => {
//     const amazonUK_GBP = toNumberSafe(uk.netSalesGBP);
//     return amazonUK_GBP * GBP_TO_USD;
//   }, [uk.netSalesGBP]);

//   const combinedUSD = useMemo(() => {
//     const aUK = amazonUK_USD;
//     const shopifyUSD = toNumberSafe(shopifyDeriv?.netSales) * INR_TO_USD;
//     return aUK + shopifyUSD;
//   }, [amazonUK_USD, shopifyDeriv?.netSales]);

//   const prevAmazonUKTotalUSD = useMemo(() => {
//     const prevTotalGBP = toNumberSafe(data?.previous_month_total_net_sales?.total);
//     return prevTotalGBP * GBP_TO_USD;
//   }, [data?.previous_month_total_net_sales?.total]);

//   const prevShopifyTotalUSD = useMemo(() => {
//     const prevINRTotal = toNumberSafe(shopifyPrevDeriv?.netSales);
//     return prevINRTotal * INR_TO_USD;
//   }, [shopifyPrevDeriv]);

//   const globalPrevTotalUSD = prevShopifyTotalUSD + prevAmazonUKTotalUSD;

//   const chooseLastMonthTotal = (manualUSD: number, computedUSD: number) =>
//     USE_MANUAL_LAST_MONTH && manualUSD > 0 ? manualUSD : computedUSD;

//   const prorateToDate = (lastMonthTotalUSD: number) => {
//     const { todayDay, daysInPrevMonth } = getISTDayInfo();
//     return daysInPrevMonth > 0 ? (lastMonthTotalUSD * todayDay) / daysInPrevMonth : 0;
//   };

//   const regions = useMemo(() => {
//     const globalLastMonthTotal = chooseLastMonthTotal(
//       MANUAL_LAST_MONTH_USD_GLOBAL,
//       globalPrevTotalUSD
//     );
//     const global = {
//       mtdUSD: combinedUSD,
//       lastMonthToDateUSD: prorateToDate(globalLastMonthTotal),
//       lastMonthTotalUSD: globalLastMonthTotal,
//       targetUSD: globalLastMonthTotal,
//     };

//     const ukLastMonthTotal = chooseLastMonthTotal(MANUAL_LAST_MONTH_USD_UK, prevAmazonUKTotalUSD);
//     const ukRegion = {
//       mtdUSD: amazonUK_USD,
//       lastMonthToDateUSD: prorateToDate(ukLastMonthTotal),
//       lastMonthTotalUSD: ukLastMonthTotal,
//       targetUSD: ukLastMonthTotal,
//     };

//     const usLastMonthTotal = chooseLastMonthTotal(MANUAL_LAST_MONTH_USD_US, 0);
//     const usRegion = {
//       mtdUSD: 0,
//       lastMonthToDateUSD: prorateToDate(usLastMonthTotal),
//       lastMonthTotalUSD: usLastMonthTotal,
//       targetUSD: usLastMonthTotal,
//     };

//     const caLastMonthTotal = chooseLastMonthTotal(MANUAL_LAST_MONTH_USD_CA, 0);
//     const caRegion = {
//       mtdUSD: 0,
//       lastMonthToDateUSD: prorateToDate(caLastMonthTotal),
//       lastMonthTotalUSD: caLastMonthTotal,
//       targetUSD: caLastMonthTotal,
//     };

//     return {
//       Global: global,
//       UK: ukRegion,
//       US: usRegion,
//       CA: caRegion,
//     } as Record<
//       RegionKey,
//       { mtdUSD: number; lastMonthToDateUSD: number; lastMonthTotalUSD: number; targetUSD: number }
//     >;
//   }, [combinedUSD, amazonUK_USD, globalPrevTotalUSD, prevAmazonUKTotalUSD]);

//   const anyLoading = loading || shopifyLoading;

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-6">
//       <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div className="flex items-start justify-center gap-2 whitespace-nowrap">
//           <PageBreadcrumb
//             pageTitle="Sales Dashboard -"
//             variant="page"
//             textSize="2xl"
//             className="text-2xl"
//           />
//           <span className="text-[#5EA68E] text-lg sm:text-2xl md:text-2xl font-semibold">
//             {(() => {
//               const { monthName, year } = getISTYearMonth();
//               const shortMon = new Date(`${monthName} 1, ${year}`).toLocaleString(
//                 "en-US",
//                 { month: "short", timeZone: "Asia/Kolkata" }
//               );
//               return `${shortMon} '${String(year).slice(-2)}`;
//             })()}
//           </span>
//         </div>

//         <button
//           onClick={refreshAll}
//           disabled={anyLoading}
//           className={`w-full sm:w-auto rounded-md border px-3 py-1.5 text-sm shadow-sm active:scale-[.99] ${
//             anyLoading
//               ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
//               : "border-gray-300 bg-white hover:bg-gray-50"
//           }`}
//           title="Refresh Amazon & Shopify"
//         >
//           {anyLoading ? "Refreshing…" : "Refresh"}
//         </button>
//       </div>

//       <div className="grid grid-cols-12 gap-6">
//         {/* LEFT 8: Amazon + Shopify */}
//         <div className="col-span-12 lg:col-span-8 space-y-6">
//           {/* {unauthorized && (
//             <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
//               <div className="text-sm">
//                 You’re not signed in or your session expired. Please authenticate to load Amazon
//                 orders.
//               </div>
//               <a
//                 href={`${baseURL || ""}/auth/login`}
//                 className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-amber-100"
//               >
//                 Sign in
//               </a>
//             </div>
//           )}
//           {error && (
//             <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
//               <span>⚠️</span>
//               <span className="text-sm">{error}</span>
//             </div>
//           )} */}

//           {/* AMAZON card */}
//           <div className="rounded-2xl border bg-white p-5 shadow-sm">
//             <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
//               <div className="flex flex-col">
//                 <div className="flex flex-wrap items-baseline gap-2">
//                   <PageBreadcrumb
//                     pageTitle="Amazon -"
//                     variant="page"
//                     align="left"
//                   />
//                   <span className="text-[#5EA68E] text-lg sm:text-2xl md:text-2xl font-semibold">
//                     {(() => {
//                       const { monthName, year } = getISTYearMonth();
//                       const shortMon = new Date(
//                         `${monthName} 1, ${year}`
//                       ).toLocaleString("en-US", {
//                         month: "short",
//                         timeZone: "Asia/Kolkata",
//                       });
//                       return `${shortMon} '${String(year).slice(-2)}`;
//                     })()}
//                   </span>
//                 </div>

//                 <p className="text-sm text-charcoal-500 mt-1">
//                   Real-time data from Amazon
//                 </p>
//               </div>

//               <div className="inline-flex rounded-lg border bg-gray-50 p-1 text-xs w-full sm:w-auto justify-between sm:justify-start">
//                 {(["Global", "UK", "US", "CA"] as RegionKey[]).map((key) => (
//                   <button
//                     key={key}
//                     type="button"
//                     onClick={() => setAmazonRegion(key)}
//                     className={`px-3 py-1 rounded-lg min-w-[60px] text-center ${
//                       key === amazonRegion
//                         ? "bg-[#C7E6D7] text-gray-900 shadow-sm"
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     {key}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
//               <div className="rounded-2xl border border-[#87AD12] bg-[#87AD1226] p-5 shadow-sm">
//                 <div className="text-sm text-charcoal-500">Sales</div>
//                 <div className="mt-2 text-lg font-semibold">
//                   <ValueOrSkeleton loading={loading} mode="inline">
//                     {fmtGBP(uk.netSalesGBP)}
//                   </ValueOrSkeleton>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-[#F47A00] bg-[#F47A0026] py-5 px-3 shadow-sm">
//                 <div className="text-sm text-charcoal-500">Units</div>
//                 <div className="mt-2 text-lg font-semibold">
//                   <ValueOrSkeleton loading={loading} mode="inline" compact>
//                     {fmtNum(cms?.total_quantity ?? 0)}
//                   </ValueOrSkeleton>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-[#2CA9E0] bg-[#2CA9E026] py-5 px-3 shadow-sm">
//                 <div className="text-sm text-charcoal-500">ASP</div>
//                 <div className="mt-2 text-lg font-semibold">
//                   <ValueOrSkeleton loading={loading} mode="inline" compact>
//                     {fmtGBP(uk.aspGBP)}
//                   </ValueOrSkeleton>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-[#AB64B5] bg-[#AB64B526] py-5 px-3 shadow-sm">
//                 <div className="text-sm text-charcoal-500">Profit</div>
//                 <div className="mt-2 text-lg font-semibold">
//                   <ValueOrSkeleton loading={loading} mode="inline" compact>
//                     {fmtGBP(uk.profitGBP)}
//                   </ValueOrSkeleton>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-[#00627B] bg-[#00627B26] py-5 px-3 shadow-sm">
//                 <div className="text-sm text-charcoal-500">Profit %</div>
//                 <div className="mt-2 text-lg font-semibold">
//                   <ValueOrSkeleton loading={loading} mode="inline" compact>
//                     {fmtPct(uk.profitPctGBP)}
//                   </ValueOrSkeleton>
//                 </div>
//               </div>
//             </div> */}
          
//           {/* 🔴 INTEGRATION MESSAGE OR METRICS */}
//   {unauthorized ? (
//     <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
//       <p className="font-medium">
//         Connection needs to be established in order to view Amazon details.
//       </p>
//       <a
//         href={`${baseURL || ""}/auth/login`}
//         className="mt-2 inline-flex items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-amber-100"
//       >
//         Connect Amazon
//       </a>
//     </div>
//   ) : (
//     <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
//       <div className="rounded-2xl border border-[#87AD12] bg-[#87AD1226] p-5 shadow-sm">
//         <div className="text-sm text-charcoal-500">Sales</div>
//         <div className="mt-2 text-lg font-semibold">
//           <ValueOrSkeleton loading={loading} mode="inline">
//             {fmtGBP(uk.netSalesGBP)}
//           </ValueOrSkeleton>
//         </div>
//       </div>

//       <div className="rounded-2xl border border-[#F47A00] bg-[#F47A0026] py-5 px-3 shadow-sm">
//         <div className="text-sm text-charcoal-500">Units</div>
//         <div className="mt-2 text-lg font-semibold">
//           <ValueOrSkeleton loading={loading} mode="inline" compact>
//             {fmtNum(cms?.total_quantity ?? 0)}
//           </ValueOrSkeleton>
//         </div>
//       </div>

//       <div className="rounded-2xl border border-[#2CA9E0] bg-[#2CA9E026] py-5 px-3 shadow-sm">
//         <div className="text-sm text-charcoal-500">ASP</div>
//         <div className="mt-2 text-lg font-semibold">
//           <ValueOrSkeleton loading={loading} mode="inline" compact>
//             {fmtGBP(uk.aspGBP)}
//           </ValueOrSkeleton>
//         </div>
//       </div>

//       <div className="rounded-2xl border border-[#AB64B5] bg-[#AB64B526] py-5 px-3 shadow-sm">
//         <div className="text-sm text-charcoal-500">Profit</div>
//         <div className="mt-2 text-lg font-semibold">
//           <ValueOrSkeleton loading={loading} mode="inline" compact>
//             {fmtGBP(uk.profitGBP)}
//           </ValueOrSkeleton>
//         </div>
//       </div>

//       <div className="rounded-2xl border border-[#00627B] bg-[#00627B26] py-5 px-3 shadow-sm">
//         <div className="text-sm text-charcoal-500">Profit %</div>
//         <div className="mt-2 text-lg font-semibold">
//           <ValueOrSkeleton loading={loading} mode="inline" compact>
//             {fmtPct(uk.profitPctGBP)}
//           </ValueOrSkeleton>
//         </div>
//       </div>
//     </div>
//   )}


//           </div>

//           {/* SHOPIFY card */}
//           {/* <div className="rounded-2xl border bg-white p-5 shadow-sm">
//             <div className="">
//               <div className="flex items-baseline gap-2">
//                 <PageBreadcrumb
//                   pageTitle="Shopify -"
//                   variant="page"
//                   align="left"
//                   textSize="2xl"
//                 />
//                 <span className="text-[#5EA68E] text-2xl font-semibold">
//                   {(() => {
//                     const { monthName, year } = getISTYearMonth();
//                     const shortMon = new Date(
//                       `${monthName} 1, ${year}`
//                     ).toLocaleString("en-US", {
//                       month: "short",
//                       timeZone: "Asia/Kolkata",
//                     });
//                     return `${shortMon} '${String(year).slice(-2)}`;
//                   })()}
//                 </span>
//               </div>

//               <p className="text-sm  text-charcoal-500">
//                 Real-time data from Shopify
//               </p>
//             </div>

            

//             {shopifyLoading && (
//               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
//                 {[...Array(5)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="rounded-2xl border bg-white p-5 shadow-sm"
//                   >
//                     <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
//                     <div className="mt-2 h-7 w-28 animate-pulse rounded bg-gray-200" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {!shopifyLoading && !shopifyError && (
//               <>
//                 {shopify ? (
//                   <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mt-3">
//                     <div className="rounded-2xl border border-[#87AD12] bg-[#87AD1226] py-5 px-3 shadow-sm">
//                       <div className="text-sm text-charcoal-500">Units</div>
//                       <div className="mt-1 text-lg font-semibold text-gray-900">
//                         <ValueOrSkeleton
//                           loading={shopifyLoading}
//                           mode="inline"
//                           compact
//                         >
//                           {shopify?.total_orders}
//                         </ValueOrSkeleton>
//                       </div>
//                     </div>

//                     <div className="rounded-2xl border border-[#F47A00] bg-[#F47A0026] py-5 px-3 shadow-sm">
//                       <div className="text-sm text-charcoal-500">Total Sales</div>
//                       <div className="mt-1 text-lg  font-bold tracking-tight text-gray-900">
//                         <ValueOrSkeleton loading={shopifyLoading} mode="inline">
//                           {fmtShopify(toNumberSafe(shopify?.net_sales ?? 0))}
//                         </ValueOrSkeleton>
//                       </div>
//                     </div>

//                     <div className="rounded-2xl border border-[#2CA9E0] bg-[#2CA9E026] py-5 px-3 shadow-sm">
//                       <div className="text-sm text-gray-500">ASP</div>
//                       <div className="mt-1 text-lg  font-semibold text-gray-900">
//                         <ValueOrSkeleton
//                           loading={shopifyLoading}
//                           mode="inline"
//                           compact
//                         >
//                           {(() => {
//                             const units = toNumberSafe(
//                               shopify?.total_orders ?? 0
//                             );
//                             const net = toNumberSafe(shopify?.net_sales ?? 0);
//                             if (units <= 0) return "—";
//                             return fmtShopify(net / units);
//                           })()}
//                         </ValueOrSkeleton>
//                       </div>
//                     </div>

//                     <div className="rounded-2xl border border-[#AB64B5] bg-[#AB64B526] py-5 px-3 shadow-sm">
//                       <div className="text-sm text-charcoal-500">Sessions</div>
//                       <div className="mt-1 text-lg  font-semibold text-gray-900">
//                         —
//                       </div>
//                     </div>

//                     <div className="rounded-2xl border border-[#00627B] bg-[#00627B26] py-5 px-3 shadow-sm">
//                       <div className="text-sm text-gray-500">Conversion %</div>
//                       <div className="mt-1 text-lg  font-semibold text-gray-900">
//                         —
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="mt-2 text-sm text-gray-500">
//                     No Shopify data for the current month.
//                   </div>
//                 )}
//               </>
//             )}
//           </div> */}

//           {/* SHOPIFY card */}
// <div className="rounded-2xl border bg-white p-5 shadow-sm">
//   <div className="">
//     <div className="flex items-baseline gap-2">
//       <PageBreadcrumb
//         pageTitle="Shopify -"
//         variant="page"
//         align="left"
//         textSize="2xl"
//       />
//       <span className="text-[#5EA68E] text-2xl font-semibold">
//         {(() => {
//           const { monthName, year } = getISTYearMonth();
//           const shortMon = new Date(
//             `${monthName} 1, ${year}`
//           ).toLocaleString("en-US", {
//             month: "short",
//             timeZone: "Asia/Kolkata",
//           });
//           return `${shortMon} '${String(year).slice(-2)}`;
//         })()}
//       </span>
//     </div>

//     <p className="text-sm  text-charcoal-500">
//       Real-time data from Shopify
//     </p>
//   </div>

//   {/* 🔴 INTEGRATION MESSAGE OR METRICS */}
//   {shopifyNotConnected ? (
//     <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
//       <p className="font-medium">
//         Connection needs to be established in order to view Shopify details.
//       </p>
//       {/* Optional: link/button to your Shopify connect flow */}
//       {/* <button className="mt-2 inline-flex items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-amber-100">
//         Connect Shopify
//       </button> */}
//     </div>
//   ) : shopifyLoading ? (
//     <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mt-3">
//       {[...Array(5)].map((_, i) => (
//         <div
//           key={i}
//           className="rounded-2xl border bg-white p-5 shadow-sm"
//         >
//           <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
//           <div className="mt-2 h-7 w-28 animate-pulse rounded bg-gray-200" />
//         </div>
//       ))}
//     </div>
//   ) : shopify ? (
//     <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mt-3">
//       <div className="rounded-2xl border border-[#87AD12] bg-[#87AD1226] py-5 px-3 shadow-sm">
//         <div className="text-sm text-charcoal-500">Units</div>
//         <div className="mt-1 text-lg font-semibold text-gray-900">
//           <ValueOrSkeleton
//             loading={shopifyLoading}
//             mode="inline"
//             compact
//           >
//             {shopify?.total_orders}
//           </ValueOrSkeleton>
//         </div>
//       </div>

//       <div className="rounded-2xl border border-[#F47A00] bg-[#F47A0026] py-5 px-3 shadow-sm">
//         <div className="text-sm text-charcoal-500">Total Sales</div>
//         <div className="mt-1 text-lg  font-bold tracking-tight text-gray-900">
//           <ValueOrSkeleton loading={shopifyLoading} mode="inline">
//             {fmtShopify(toNumberSafe(shopify?.net_sales ?? 0))}
//           </ValueOrSkeleton>
//         </div>
//       </div>

//       <div className="rounded-2xl border border-[#2CA9E0] bg-[#2CA9E026] py-5 px-3 shadow-sm">
//         <div className="text-sm text-gray-500">ASP</div>
//         <div className="mt-1 text-lg  font-semibold text-gray-900">
//           <ValueOrSkeleton
//             loading={shopifyLoading}
//             mode="inline"
//             compact
//           >
//             {(() => {
//               const units = toNumberSafe(shopify?.total_orders ?? 0);
//               const net = toNumberSafe(shopify?.net_sales ?? 0);
//               if (units <= 0) return "—";
//               return fmtShopify(net / units);
//             })()}
//           </ValueOrSkeleton>
//         </div>
//       </div>

//       <div className="rounded-2xl border border-[#AB64B5] bg-[#AB64B526] py-5 px-3 shadow-sm">
//         <div className="text-sm text-charcoal-500">Sessions</div>
//         <div className="mt-1 text-lg  font-semibold text-gray-900">
//           —
//         </div>
//       </div>

//       <div className="rounded-2xl border border-[#00627B] bg-[#00627B26] py-5 px-3 shadow-sm">
//         <div className="text-sm text-gray-500">Conversion %</div>
//         <div className="mt-1 text-lg  font-semibold text-gray-900">
//           —
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className="mt-2 text-sm text-gray-500">
//       No Shopify data for the current month.
//     </div>
//   )}
// </div>

//         </div>

//         {/* RIGHT 4: Sales Target card */}
//         <aside className="col-span-12 lg:col-span-4">
//           <div className="lg:sticky lg:top-6">
//             <SalesTargetCard regions={regions} defaultRegion="Global" />
//           </div>
//         </aside>
//       </div>

//       {/* FULL-WIDTH GRAPH */}
//       <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
//         <div className="mb-3 text-sm text-gray-500">
//           Amazon — Units, Sales, ASP, Profit, Profit %
//         </div>

//         <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
//           <div className="mb-3 text-sm text-gray-500">
//             Amazon — P&amp;L Breakdown (Sales, Fees, COGS, Ads, Other, Profit)
//           </div>
//           <SimpleBarChart
//             items={[
//               {
//                 label: "Sales",
//                 raw: Number(uk.netSalesGBP ?? 0),
//                 display: fmtGBP(uk.netSalesGBP ?? 0),
//               },
//               {
//                 label: "Amazon Fees",
//                 raw: Number(uk.amazonFeesGBP ?? 0),
//                 display: fmtGBP(uk.amazonFeesGBP ?? 0),
//               },
//               {
//                 label: "COGS",
//                 raw: Number(uk.cogsGBP ?? 0),
//                 display: fmtGBP(uk.cogsGBP ?? 0),
//               },
//               {
//                 label: "Advertisements",
//                 raw: 0,
//                 display: fmtGBP(0),
//               },
//               {
//                 label: "Other Charges",
//                 raw: 0,
//                 display: fmtGBP(0),
//               },
//               {
//                 label: "Profit",
//                 raw: Number(uk.profitGBP ?? 0),
//                 display: fmtGBP(uk.profitGBP ?? 0),
//               },
//             ]}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



































































"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Loader from "@/components/loader/Loader";
import React, { useEffect, useState, useMemo, useCallback } from "react";

/* ===================== ENV & ENDPOINTS ===================== */
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
const SHOPIFY_CCY = process.env.NEXT_PUBLIC_SHOPIFY_CURRENCY || "GBP";
const SHOPIFY_TO_GBP = Number(process.env.NEXT_PUBLIC_SHOPIFY_TO_GBP || "1");
const API_URL = `${baseURL}/amazon_api/orders`;
const SHOPIFY_ENDPOINT = `${baseURL}/shopify/get_monthly_data`;
const SHOPIFY_DROPDOWN_ENDPOINT = `${baseURL}/shopify/dropdown`;

/** 💵 FX rates */
const GBP_TO_USD = Number(process.env.NEXT_PUBLIC_GBP_TO_USD || "1.31");
const INR_TO_USD = Number(process.env.NEXT_PUBLIC_INR_TO_USD || "0.01128");

const USE_MANUAL_LAST_MONTH =
  (process.env.NEXT_PUBLIC_USE_MANUAL_LAST_MONTH || "false").toLowerCase() === "true";

/** Put last month's TOTAL SALES in USD (not to-date) */
const MANUAL_LAST_MONTH_USD_GLOBAL = Number(
  process.env.NEXT_PUBLIC_MANUAL_LAST_MONTH_USD_GLOBAL || "0"
);
/** Optional per-region overrides */
const MANUAL_LAST_MONTH_USD_UK = Number(process.env.NEXT_PUBLIC_MANUAL_LAST_MONTH_USD_UK || "0");
const MANUAL_LAST_MONTH_USD_US = Number(process.env.NEXT_PUBLIC_MANUAL_LAST_MONTH_USD_US || "0");
const MANUAL_LAST_MONTH_USD_CA = Number(process.env.NEXT_PUBLIC_MANUAL_LAST_MONTH_USD_CA || "0");

/* ===================== DATE HELPERS ===================== */
function getISTYearMonth() {
  const optsMonth: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", month: "long" };
  const optsYear: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", year: "numeric" };
  const now = new Date();
  const monthName = now.toLocaleString("en-US", optsMonth);
  const yearStr = now.toLocaleString("en-US", optsYear);
  return { monthName, year: Number(yearStr) };
}

function buildShopifyURL({ year, monthName }: { year: number; monthName: string }) {
  const qs = new URLSearchParams();
  qs.set("year", String(year));
  qs.append("months[]", monthName);
  return `${SHOPIFY_ENDPOINT}?${qs.toString()}`;
}

function buildShopifyDropdownMonthlyURL({
  year,
  monthName,
}: {
  year: number;
  monthName: string;
}) {
  const qs = new URLSearchParams();
  qs.set("range", "monthly");
  qs.set("year", String(year));
  qs.set("month", monthName.toLowerCase());
  return `${SHOPIFY_DROPDOWN_ENDPOINT}?${qs.toString()}`;
}

function getPrevISTYearMonth() {
  const tz = "Asia/Kolkata";
  const now = new Date();
  const istNow = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const year = istNow.getMonth() === 0 ? istNow.getFullYear() - 1 : istNow.getFullYear();
  const monthIdx = istNow.getMonth() === 0 ? 11 : istNow.getMonth() - 1;
  const monthName = new Date(year, monthIdx, 1).toLocaleString("en-US", {
    month: "long",
    timeZone: tz,
  });
  return { monthName, year };
}

function getPrevMonthShortLabel() {
  const { monthName, year } = getPrevISTYearMonth();
  const shortMon = new Date(`${monthName} 1, ${year}`).toLocaleString("en-US", {
    month: "short",
    timeZone: "Asia/Kolkata",
  });
  return `${shortMon}'${String(year).slice(-2)}`; // e.g., Oct'25
}

function getISTDayInfo() {
  const tz = "Asia/Kolkata";
  const now = new Date();
  const istNow = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const todayDay = istNow.getDate();
  const { monthName, year } = getPrevISTYearMonth();
  const prevMonthIdx = new Date(`${monthName} 1, ${year}`).getMonth();
  const daysInPrevMonth = new Date(year, prevMonthIdx + 1, 0).getDate();
  const daysInThisMonth = new Date(istNow.getFullYear(), istNow.getMonth() + 1, 0).getDate();
  return { todayDay, daysInPrevMonth, daysInThisMonth };
}

/* ===================== UI HELPERS ===================== */
const ValueOrSkeleton = ({
  loading,
  children,
  compact = false,
  mode = "replace",
}: {
  loading: boolean;
  children: React.ReactNode;
  compact?: boolean;
  mode?: "replace" | "inline";
}) => {
  if (mode === "inline") {
    return (
      <span className="inline-flex items-center gap-1">
        {children}
        {loading && (
          <Loader
            size={compact ? 16 : 20}
            transparent
            roundedClass="rounded-full"
            backgroundClass="bg-transparent"
            className="text-gray-400"
            forceFallback
          />
        )}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="inline-flex items-center justify-center">
        <Loader
          size={compact ? 28 : 36}
          transparent
          roundedClass="rounded-full"
          backgroundClass="bg-transparent"
          className="text-gray-400"
          forceFallback
        />
      </div>
    );
  }
  return <>{children}</>;
};

/* ---------- Formatters & Safe Number ---------- */
const fmtCurrency = (val: any, ccy = "GBP") => {
  if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: ccy,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(val));
};

const fmtGBP = (val: any) => fmtCurrency(val, "GBP");

const fmtUSD = (val: any) => {
  if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(val));
};

const fmtShopify = (val: any) => {
  if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(val));
};

const fmtNum = (val: any) =>
  val === null || val === undefined || val === "" || isNaN(Number(val))
    ? "—"
    : new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
        Number(val)
      );

const fmtPct = (val: any) =>
  val === null || val === undefined || isNaN(Number(val)) ? "—" : `${Number(val).toFixed(2)}%`;

const fmtUSDk = (val: any) => {
  if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
  const n = Number(val);
  const abs = Math.abs(n);

  // Under 1000: keep normal format
  if (abs < 1000) {
    return fmtUSD(n);
  }

  const k = n / 1000;
  // $6.1k style
  const base = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(k);

  return `${base}k`;
};

const toNumberSafe = (v: any) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  const s = String(v).replace(/[, ]+/g, "");
  const n = Number(s);
  return isNaN(n) ? 0 : n;
};

/* ===================== SALES TARGET CARD ===================== */
type RegionKey = "Global" | "UK" | "US" | "CA";

function SalesTargetCard({
  regions,
  defaultRegion = "Global",
}: {
  regions: Record<
    RegionKey,
    {
      mtdUSD: number;
      lastMonthToDateUSD: number;
      lastMonthTotalUSD: number;
      targetUSD: number;
    }
  >;
  defaultRegion?: RegionKey;
}) {
  const [tab, setTab] = useState<RegionKey>(defaultRegion);

  const data = regions[tab] || regions.Global;
  const { mtdUSD, lastMonthToDateUSD, lastMonthTotalUSD, targetUSD } = data;

  const pct = targetUSD > 0 ? Math.min(mtdUSD / targetUSD, 1) : 0;
  const pctLastMTD = targetUSD > 0 ? Math.min(lastMonthToDateUSD / targetUSD, 1) : 0;

  const deltaPct = (pct - pctLastMTD) * 100;

  const { todayDay } = getISTDayInfo();
  const todayApprox = todayDay > 0 ? mtdUSD / todayDay : 0;

  const prevLabel = getPrevMonthShortLabel();

  const size = 280;

  // thinner arcs
  const strokeMain = 10; // main (grey + green) arc thickness
  const strokeLast = 6; // orange arc thickness

  const cx = size / 2;
  const rBase = size / 2 - strokeMain;

  const gap = 14;

  // radii
  const rTarget = rBase; // grey background arc
  const rCurrent = rBase; // green MTD arc
  const rLastMTD = rCurrent - strokeMain / 2 - gap - strokeLast / 2;

  const toXYRadius = (angDeg: number, radius: number) => {
    const rad = (Math.PI / 180) * (180 - angDeg);
    return {
      x: cx + radius * Math.cos(rad),
      y: size / 2 - radius * Math.sin(rad),
    };
  };

  const arcPath = (fromDeg: number, toDeg: number, radius: number) => {
    const start = toXYRadius(fromDeg, radius);
    const end = toXYRadius(toDeg, radius);
    const largeArc = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const fullFrom = 0;
  const fullTo = 180;
  const toDeg_MTD = 180 * pct;

  // orange = full last-month total (since target === lastMonthTotalUSD)
  const toDeg_LastMTD = 180;

  const knobGreen = toXYRadius(toDeg_MTD, rCurrent);
  const knobYellow = toXYRadius(toDeg_LastMTD, rLastMTD);

  const badgeIsUp = deltaPct >= 0;
  const badgeStr = (badgeIsUp ? "▲ " : "▼ ") + `${Math.abs(deltaPct).toFixed(2)}%`;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      {/* Header with tabs */}
      <div className="mb-3 flex flex-col items-center justify-between gap-2">
        <PageBreadcrumb pageTitle="Sales Target" textSize="2xl" variant="page" align="center" />

        <div className="inline-flex rounded-lg border bg-gray-50 p-1 text-xs">
          {(["Global", "UK", "US", "CA"] as RegionKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3 py-1 rounded-lg ${
                key === tab
                  ? "bg-[#C7E6D7] text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 mb-2 flex items-center gap-5 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "#5EA68E" }} />
          <span className="text-gray-600">MTD Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "#9ca3af" }} />
          <span className="text-gray-600">This Month Target</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "#FFBE25" }} />
          <span className="text-gray-600">{prevLabel} MTD</span>
        </div>
      </div>

      {/* Gauge */}
      <div className="mt-4 flex items-center justify-center">
        <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
          {/* grey target arc */}
          <path
            d={arcPath(fullFrom, fullTo, rTarget)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeMain}
            strokeLinecap="round"
          />

          {/* orange last-month arc */}
          <path
            d={arcPath(fullFrom, toDeg_LastMTD, rLastMTD)}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeLast}
            strokeLinecap="round"
          />

          {/* green MTD arc */}
          <path
            d={arcPath(fullFrom, toDeg_MTD, rCurrent)}
            fill="none"
            stroke="#16a34a"
            strokeWidth={strokeMain}
            strokeLinecap="round"
          />

          {/* pointers */}
          <circle
            cx={knobYellow.x}
            cy={knobYellow.y}
            r={12} // bigger orange pointer
            fill="#f59e0b"
            stroke="#fffbeb"
            strokeWidth={4}
          />

          <circle
            cx={knobGreen.x}
            cy={knobGreen.y}
            r={16} // bigger main pointer
            fill="#16a34a"
            stroke="#ecfdf3"
            strokeWidth={5}
          />
        </svg>
      </div>

      {/* Center metrics */}
      <div className="text-center">
        <div className="text-3xl font-bold">{(pct * 100).toFixed(1)}%</div>
        <div
          className={`mx-auto mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
            badgeIsUp ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {badgeStr}
        </div>
      </div>

      {/* Bottom KPIs (in K) */}
      <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
        <div className="flex flex-col items-center rounded-xl justify-between bg-gray-50 p-3">
          <div className="text-gray-500">Today</div>
          <div className="mt-0.5 font-semibold">{fmtUSDk(todayApprox)}</div>
        </div>
        <div className="flex flex-col items-center rounded-xl justify-between bg-gray-50 p-3">
          <div className="text-gray-500">MTD Sales</div>
          <div className="mt-0.5 font-semibold">{fmtUSDk(mtdUSD)}</div>
        </div>
        <div className="flex flex-col items-center rounded-xl justify-between bg-gray-50 p-3">
          <div className="text-gray-500">Target</div>
          <div className="mt-0.5 font-semibold">{fmtUSDk(targetUSD)}</div>
        </div>
        <div className="flex flex-col items-center rounded-xl justify-between bg-gray-50 p-3">
          <div className="text-gray-500">{prevLabel}</div>
          <div className="mt-0.5 font-semibold">{fmtUSDk(lastMonthTotalUSD)}</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== SIMPLE BAR CHART ===================== */
function SimpleBarChart({
  items,
  height = 300,
  padding = { top: 28, right: 24, bottom: 56, left: 24 },
  colors = ["#2563eb", "#5EA68E", "#FFBE25", "#ec4899", "#8b5cf6"],
}: {
  items: Array<{ label: string; raw: number; display: string }>;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
}) {
  const [animateIn, setAnimateIn] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const width = 760;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const values = items.map((d) => (Number.isFinite(d.raw) ? Math.abs(Number(d.raw)) : 0));
  const max = Math.max(1, ...values);
  const baseBarW = Math.max(12, (innerW / Math.max(1, items.length)) * 0.4);

  const Tooltip = ({
    x,
    y,
    label,
    display,
    color,
  }: {
    x: number;
    y: number;
    label: string;
    display: string;
    color: string;
  }) => {
    const textY1 = y - 30;
    const text = `${label}: ${display}`;
    return (
      <g>
        <rect x={x - 70} y={textY1 - 24} width={140} height={24} rx={6} fill="#111827" opacity="0.9" />
        <text
          x={x}
          y={textY1 - 8}
          textAnchor="middle"
          fontSize="11"
          fill="#ffffff"
          style={{ pointerEvents: "none" }}
        >
          {text}
        </text>
        <polygon points={`${x - 6},${textY1} ${x + 6},${textY1} ${x},${textY1 + 6}`} fill="#111827" opacity="0.9" />
        <circle cx={x} cy={y} r="6.5" fill="none" stroke={color} strokeWidth={2} />
      </g>
    );
  };

  return (
    <div className="w-full overflow-x-auto ">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[760px] select-none">
        <defs>
          <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#e5e7eb"
        />

        {items.map((d, i) => {
          const v = values[i];
          const hFull = (v / max) * innerH;
          const barH = animateIn ? hFull : 0;
          const band = innerW / Math.max(1, items.length);
          const xCenter = padding.left + band * i + band / 2;
          const barW = hoverIdx === i ? baseBarW + 6 : baseBarW;
          const x = xCenter - barW / 2;
          const y = padding.top + (innerH - barH);
          const color = colors[i % colors.length];

          return (
            <g
              key={d.label}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(0, barH)}
                rx={8}
                fill={color}
                filter="url(#barShadow)"
                opacity={hoverIdx === i ? 0.95 : 0.85}
              />
              <text x={xCenter} y={y - 10} textAnchor="middle" fontSize={12} fontWeight={600} fill="#111827">
                {d.display}
              </text>
              <text x={xCenter} y={height - padding.bottom + 20} textAnchor="middle" fontSize={12} fill="#6b7280">
                {d.label}
              </text>
              {hoverIdx === i && <Tooltip x={xCenter} y={y} label={d.label} display={d.display} color={color} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */
export default function DashboardPage() {
  // Amazon
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Shopify (current month)
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyError, setShopifyError] = useState<string | null>(null);
  const [shopifyRows, setShopifyRows] = useState<any[]>([]);
  const shopify = shopifyRows?.[0] || null;

  // Shopify (previous month)
  const [shopifyPrevRows, setShopifyPrevRows] = useState<any[]>([]);

  // Shopify store info (shop_name + access_token)
  const [shopifyStore, setShopifyStore] = useState<any | null>(null);

  // which region tab is selected in the Amazon card
  const [amazonRegion, setAmazonRegion] = useState<RegionKey>("Global");

  const fetchAmazon = useCallback(async () => {
    setLoading(true);
    setUnauthorized(false);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
      if (!token) {
        setUnauthorized(true);
        throw new Error("No token found. Please sign in.");
      }
      const res = await fetch(API_URL, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        credentials: "omit",
      });
      if (res.status === 401) {
        setUnauthorized(true);
        throw new Error("Unauthorized — token missing/invalid/expired.");
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to load data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Shopify store info (shop_name + access_token)
  useEffect(() => {
    const fetchShopifyStore = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
        if (!token) {
          console.log("No JWT found for Shopify store lookup");
          return;
        }

        const res = await fetch(`${baseURL}/shopify/store`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON /shopify/store response:", text);
          return;
        }

        const data = await res.json();
        console.log("Shopify store for dashboard:", data);

        if (!res.ok || data?.error) return;

        setShopifyStore(data);
      } catch (err) {
        console.error("Error fetching Shopify store in Dashboard:", err);
      }
    };

    fetchShopifyStore();
  }, []);

  const fetchShopify = useCallback(async () => {
    setShopifyLoading(true);
    setShopifyError(null);
    try {
      const user_token =
        typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
      if (!user_token) throw new Error("No token found. Please sign in.");

      if (!shopifyStore?.shop_name || !shopifyStore?.access_token) {
        throw new Error("Shopify store not connected.");
      }

      const { monthName, year } = getISTYearMonth();

      const params = new URLSearchParams({
        range: "monthly",
        month: monthName.toLowerCase(),
        year: String(year),
        user_token,
        shop: shopifyStore.shop_name,
        token: shopifyStore.access_token,
      });

      const url = `${SHOPIFY_DROPDOWN_ENDPOINT}?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user_token}`,
        },
        credentials: "omit",
      });

      if (res.status === 401)
        throw new Error("Unauthorized — token missing/invalid/expired.");
      if (!res.ok) throw new Error(`Shopify request failed: ${res.status}`);

      const json = await res.json();
      console.log("Shopify dropdown (current month):", json);

      const row = json?.last_row_data ? json.last_row_data : null;
      setShopifyRows(row ? [row] : []);
    } catch (e: any) {
      setShopifyError(e?.message || "Failed to load Shopify data");
      setShopifyRows([]);
    } finally {
      setShopifyLoading(false);
    }
  }, [shopifyStore]);

  const fetchShopifyPrev = useCallback(async () => {
    try {
      const user_token =
        typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
      if (!user_token) throw new Error("No token found. Please sign in.");

      if (!shopifyStore?.shop_name || !shopifyStore?.access_token) {
        throw new Error("Shopify store not connected.");
      }

      const { year, monthName } = getPrevISTYearMonth();

      const params = new URLSearchParams({
        range: "monthly",
        month: monthName.toLowerCase(),
        year: String(year),
        user_token,
        shop: shopifyStore.shop_name,
        token: shopifyStore.access_token,
      });

      const url = `${SHOPIFY_DROPDOWN_ENDPOINT}?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user_token}`,
        },
        credentials: "omit",
      });

      if (res.status === 401)
        throw new Error("Unauthorized — token missing/invalid/expired.");
      if (!res.ok) throw new Error(`Shopify (prev) request failed: ${res.status}`);

      const json = await res.json();
      console.log("Shopify dropdown (prev month):", json);

      const row = json?.last_row_data ? json.last_row_data : null;
      setShopifyPrevRows(row ? [row] : []);
    } catch (e: any) {
      console.warn("Shopify prev-month fetch failed:", e?.message);
      setShopifyPrevRows([]);
    }
  }, [shopifyStore]);

  const refreshAll = useCallback(async () => {
    await fetchAmazon();

    if (shopifyStore?.shop_name && shopifyStore?.access_token) {
      await Promise.all([fetchShopify(), fetchShopifyPrev()]);
    }
  }, [fetchAmazon, fetchShopify, fetchShopifyPrev, shopifyStore]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ---------- Amazon aliases ----------
  const cms = data?.current_month_summary || null;
  const cmp = data?.current_month_profit || null;

  const uk = useMemo(() => {
    const netSalesGBP = cms?.net_sales?.GBP != null ? toNumberSafe(cms.net_sales.GBP) : null;
    const aspGBP = cms?.asp?.GBP != null ? toNumberSafe(cms.asp.GBP) : null;

    const breakdownGBP = cmp?.breakdown?.GBP || {};

    const cogsGBP = breakdownGBP.cogs !== undefined ? toNumberSafe(breakdownGBP.cogs) : 0;
    const fbaFeesGBP =
      breakdownGBP.fba_fees !== undefined ? toNumberSafe(breakdownGBP.fba_fees) : 0;
    const sellingFeesGBP =
      breakdownGBP.selling_fees !== undefined ? toNumberSafe(breakdownGBP.selling_fees) : 0;
    const amazonFeesGBP = fbaFeesGBP + sellingFeesGBP;

    let profitGBP: number | null = null;
    if (cmp?.profit && typeof cmp.profit === "object" && cmp.profit.GBP !== undefined) {
      profitGBP = toNumberSafe(cmp.profit.GBP);
    } else if ((typeof cmp?.profit === "number" || typeof cmp?.profit === "string") && netSalesGBP !== null) {
      profitGBP = toNumberSafe(cmp.profit);
    }

    let unitsGBP: number | null = null;
    if (breakdownGBP.quantity !== undefined) {
      unitsGBP = toNumberSafe(breakdownGBP.quantity);
    }

    let profitPctGBP: number | null = null;
    if (profitGBP !== null && netSalesGBP && !isNaN(netSalesGBP) && netSalesGBP !== 0) {
      profitPctGBP = (profitGBP / netSalesGBP) * 100;
    }

    return {
      unitsGBP,
      netSalesGBP,
      aspGBP,
      profitGBP,
      profitPctGBP,
      cogsGBP,
      amazonFeesGBP,
    };
  }, [cms, cmp]);

  const shopifyNotConnected =
    !shopifyStore?.shop_name ||
    !shopifyStore?.access_token ||
    (shopifyError &&
      (shopifyError.toLowerCase().includes("shopify store not connected") ||
        shopifyError.toLowerCase().includes("no token")));

  const barsAmazon = useMemo(() => {
    const units = cms?.total_quantity ?? 0;
    const sales = uk.netSalesGBP ?? 0;
    const asp = uk.aspGBP ?? 0;
    const profit = uk.profitGBP ?? 0;
    const pcent = Number.isFinite(uk.profitPctGBP) ? (uk.profitPctGBP as number) : 0;

    return [
      { label: "Units", raw: Number(units) || 0, display: fmtNum(units) },
      { label: "Sales", raw: Number(sales) || 0, display: fmtGBP(sales) },
      { label: "ASP", raw: Number(asp) || 0, display: fmtGBP(asp) },
      { label: "Profit", raw: Number(profit) || 0, display: fmtGBP(profit) },
      { label: "Profit %", raw: Number(pcent) || 0, display: fmtPct(pcent) },
    ];
  }, [uk, cms]);

  const shopifyDeriv = useMemo(() => {
    if (!shopify) return null;
    const totalOrders = toNumberSafe(shopify.total_orders);
    const netSales = toNumberSafe(shopify.net_sales);
    const totalDiscounts = toNumberSafe(shopify.total_discounts);
    const totalTax = toNumberSafe(shopify.total_tax);
    const gross = toNumberSafe(shopify.total_price);
    const aov = totalOrders > 0 ? gross / totalOrders : 0;
    return { totalOrders, netSales, totalDiscounts, totalTax, gross, aov };
  }, [shopify]);

  const shopifyPrevDeriv = useMemo(() => {
    const row = shopifyPrevRows?.[0];
    if (!row) return null;
    const netSales = toNumberSafe(row.net_sales);
    return { netSales };
  }, [shopifyPrevRows]);

  const amazonUK_USD = useMemo(() => {
    const amazonUK_GBP = toNumberSafe(uk.netSalesGBP);
    return amazonUK_GBP * GBP_TO_USD;
  }, [uk.netSalesGBP]);

  const combinedUSD = useMemo(() => {
    const aUK = amazonUK_USD;
    const shopifyUSD = toNumberSafe(shopifyDeriv?.netSales) * INR_TO_USD;
    return aUK + shopifyUSD;
  }, [amazonUK_USD, shopifyDeriv?.netSales]);

  const prevAmazonUKTotalUSD = useMemo(() => {
    const prevTotalGBP = toNumberSafe(data?.previous_month_total_net_sales?.total);
    return prevTotalGBP * GBP_TO_USD;
  }, [data?.previous_month_total_net_sales?.total]);

  const prevShopifyTotalUSD = useMemo(() => {
    const prevINRTotal = toNumberSafe(shopifyPrevDeriv?.netSales);
    return prevINRTotal * INR_TO_USD;
  }, [shopifyPrevDeriv]);

  const globalPrevTotalUSD = prevShopifyTotalUSD + prevAmazonUKTotalUSD;

  const chooseLastMonthTotal = (manualUSD: number, computedUSD: number) =>
    USE_MANUAL_LAST_MONTH && manualUSD > 0 ? manualUSD : computedUSD;

  const prorateToDate = (lastMonthTotalUSD: number) => {
    const { todayDay, daysInPrevMonth } = getISTDayInfo();
    return daysInPrevMonth > 0 ? (lastMonthTotalUSD * todayDay) / daysInPrevMonth : 0;
  };

  const regions = useMemo(() => {
    const globalLastMonthTotal = chooseLastMonthTotal(
      MANUAL_LAST_MONTH_USD_GLOBAL,
      globalPrevTotalUSD
    );
    const global = {
      mtdUSD: combinedUSD,
      lastMonthToDateUSD: prorateToDate(globalLastMonthTotal),
      lastMonthTotalUSD: globalLastMonthTotal,
      targetUSD: globalLastMonthTotal,
    };

    const ukLastMonthTotal = chooseLastMonthTotal(MANUAL_LAST_MONTH_USD_UK, prevAmazonUKTotalUSD);
    const ukRegion = {
      mtdUSD: amazonUK_USD,
      lastMonthToDateUSD: prorateToDate(ukLastMonthTotal),
      lastMonthTotalUSD: ukLastMonthTotal,
      targetUSD: ukLastMonthTotal,
    };

    const usLastMonthTotal = chooseLastMonthTotal(MANUAL_LAST_MONTH_USD_US, 0);
    const usRegion = {
      mtdUSD: 0,
      lastMonthToDateUSD: prorateToDate(usLastMonthTotal),
      lastMonthTotalUSD: usLastMonthTotal,
      targetUSD: usLastMonthTotal,
    };

    const caLastMonthTotal = chooseLastMonthTotal(MANUAL_LAST_MONTH_USD_CA, 0);
    const caRegion = {
      mtdUSD: 0,
      lastMonthToDateUSD: prorateToDate(caLastMonthTotal),
      lastMonthTotalUSD: caLastMonthTotal,
      targetUSD: caLastMonthTotal,
    };

    return {
      Global: global,
      UK: ukRegion,
      US: usRegion,
      CA: caRegion,
    } as Record<
      RegionKey,
      { mtdUSD: number; lastMonthToDateUSD: number; lastMonthTotalUSD: number; targetUSD: number }
    >;
  }, [combinedUSD, amazonUK_USD, globalPrevTotalUSD, prevAmazonUKTotalUSD]);

  const anyLoading = loading || shopifyLoading;

  /* 🌟 NEW: Initial fullscreen loader
     Show only on first load when we have no content yet */
  const hasAnyContent =
    !!data ||
    !!shopify ||
    unauthorized ||
    shopifyNotConnected ||
    !!error;

  const initialLoading = anyLoading && !hasAnyContent;

 if (initialLoading) {
  return (
    <Loader
      src="/infinity-unscreen.gif"          // 👈 your video in /public
      label="Loading sales dashboard…"
      fullscreen
      size={120}
      roundedClass="rounded-none"
      backgroundClass="bg-transparent"
      respectReducedMotion
    />
  );
}


  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start justify-center gap-2 whitespace-nowrap">
          <PageBreadcrumb
            pageTitle="Sales Dashboard -"
            variant="page"
            textSize="2xl"
            className="text-2xl"
          />
          <span className="text-[#5EA68E] text-lg sm:text-2xl md:text-2xl font-semibold">
            {(() => {
              const { monthName, year } = getISTYearMonth();
              const shortMon = new Date(`${monthName} 1, ${year}`).toLocaleString(
                "en-US",
                { month: "short", timeZone: "Asia/Kolkata" }
              );
              return `${shortMon} '${String(year).slice(-2)}`;
            })()}
          </span>
        </div>

        <button
          onClick={refreshAll}
          disabled={anyLoading}
          className={`w-full sm:w-auto rounded-md border px-3 py-1.5 text-sm shadow-sm active:scale-[.99] ${
            anyLoading
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-gray-300 bg-white hover:bg-gray-50"
          }`}
          title="Refresh Amazon & Shopify"
        >
          {anyLoading ? (
  <span className="inline-flex items-center gap-2">
    <Loader
      src="/infinity-unscreen.gif"       // or keep default GIF here
      size={16}
      transparent
      roundedClass="rounded-full"
      backgroundClass="bg-transparent"
      className="text-gray-400"
      forceFallback={false}
      respectReducedMotion
    />
    <span>Refreshing…</span>
  </span>
) : (
  "Refresh"
)}

        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT 8: Amazon + Shopify */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* AMAZON card */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-baseline gap-2">
                  <PageBreadcrumb
                    pageTitle="Amazon -"
                    variant="page"
                    align="left"
                  />
                  <span className="text-[#5EA68E] text-lg sm:text-2xl md:text-2xl font-semibold">
                    {(() => {
                      const { monthName, year } = getISTYearMonth();
                      const shortMon = new Date(
                        `${monthName} 1, ${year}`
                      ).toLocaleString("en-US", {
                        month: "short",
                        timeZone: "Asia/Kolkata",
                      });
                      return `${shortMon} '${String(year).slice(-2)}`;
                    })()}
                  </span>
                </div>

                <p className="text-sm text-charcoal-500 mt-1">
                  Real-time data from Amazon
                </p>
              </div>

              <div className="inline-flex rounded-lg border bg-gray-50 p-1 text-xs w-full sm:w-auto justify-between sm:justify-start">
                {(["Global", "UK", "US", "CA"] as RegionKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAmazonRegion(key)}
                    className={`px-3 py-1 rounded-lg min-w-[60px] text-center ${
                      key === amazonRegion
                        ? "bg-[#C7E6D7] text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* 🔴 INTEGRATION MESSAGE OR METRICS */}
            {unauthorized ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-medium">
                  Connection needs to be established in order to view Amazon details.
                </p>
                <a
                  href={`${baseURL || ""}/auth/login`}
                  className="mt-2 inline-flex items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-amber-100"
                >
                  Connect Amazon
                </a>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-2xl border border-[#87AD12] bg-[#87AD1226] p-5 shadow-sm">
                  <div className="text-sm text-charcoal-500">Sales</div>
                  <div className="mt-2 text-lg font-semibold">
                    <ValueOrSkeleton loading={loading} mode="inline">
                      {fmtGBP(uk.netSalesGBP)}
                    </ValueOrSkeleton>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#F47A00] bg-[#F47A0026] py-5 px-3 shadow-sm">
                  <div className="text-sm text-charcoal-500">Units</div>
                  <div className="mt-2 text-lg font-semibold">
                    <ValueOrSkeleton loading={loading} mode="inline" compact>
                      {fmtNum(cms?.total_quantity ?? 0)}
                    </ValueOrSkeleton>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#2CA9E0] bg-[#2CA9E026] py-5 px-3 shadow-sm">
                  <div className="text-sm text-charcoal-500">ASP</div>
                  <div className="mt-2 text-lg font-semibold">
                    <ValueOrSkeleton loading={loading} mode="inline" compact>
                      {fmtGBP(uk.aspGBP)}
                    </ValueOrSkeleton>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#AB64B5] bg-[#AB64B526] py-5 px-3 shadow-sm">
                  <div className="text-sm text-charcoal-500">Profit</div>
                  <div className="mt-2 text-lg font-semibold">
                    <ValueOrSkeleton loading={loading} mode="inline" compact>
                      {fmtGBP(uk.profitGBP)}
                    </ValueOrSkeleton>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#00627B] bg-[#00627B26] py-5 px-3 shadow-sm">
                  <div className="text-sm text-charcoal-500">Profit %</div>
                  <div className="mt-2 text-lg font-semibold">
                    <ValueOrSkeleton loading={loading} mode="inline" compact>
                      {fmtPct(uk.profitPctGBP)}
                    </ValueOrSkeleton>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SHOPIFY card */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="">
              <div className="flex items-baseline gap-2">
                <PageBreadcrumb
                  pageTitle="Shopify -"
                  variant="page"
                  align="left"
                  textSize="2xl"
                />
                <span className="text-[#5EA68E] text-2xl font-semibold">
                  {(() => {
                    const { monthName, year } = getISTYearMonth();
                    const shortMon = new Date(
                      `${monthName} 1, ${year}`
                    ).toLocaleString("en-US", {
                      month: "short",
                      timeZone: "Asia/Kolkata",
                    });
                    return `${shortMon} '${String(year).slice(-2)}`;
                  })()}
                </span>
              </div>

              <p className="text-sm  text-charcoal-500">
                Real-time data from Shopify
              </p>
            </div>

            {/* 🔴 INTEGRATION MESSAGE OR METRICS */}
            {shopifyNotConnected ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-medium">
                  Connection needs to be established in order to view Shopify details.
                </p>
              </div>
            ) : shopifyLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mt-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="mt-2 h-7 w-28 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : shopify ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mt-3">
                <div className="rounded-2xl border border-[#87AD12] bg-[#87AD1226] py-5 px-3 shadow-sm">
                  <div className="text-sm text-charcoal-500">Units</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    <ValueOrSkeleton
                      loading={shopifyLoading}
                      mode="inline"
                      compact
                    >
                      {shopify?.total_orders}
                    </ValueOrSkeleton>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#F47A00] bg-[#F47A0026] py-5 px-3 shadow-sm">
                  <div className="text-sm text-charcoal-500">Total Sales</div>
                  <div className="mt-1 text-lg  font-bold tracking-tight text-gray-900">
                    <ValueOrSkeleton loading={shopifyLoading} mode="inline">
                      {fmtShopify(toNumberSafe(shopify?.net_sales ?? 0))}
                    </ValueOrSkeleton>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#2CA9E0] bg-[#2CA9E026] py-5 px-3 shadow-sm">
                  <div className="text-sm text-gray-500">ASP</div>
                  <div className="mt-1 text-lg  font-semibold text-gray-900">
                    <ValueOrSkeleton
                      loading={shopifyLoading}
                      mode="inline"
                      compact
                    >
                      {(() => {
                        const units = toNumberSafe(shopify?.total_orders ?? 0);
                        const net = toNumberSafe(shopify?.net_sales ?? 0);
                        if (units <= 0) return "—";
                        return fmtShopify(net / units);
                      })()}
                    </ValueOrSkeleton>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#AB64B5] bg-[#AB64B526] py-5 px-3 shadow-sm">
                  <div className="text-sm text-charcoal-500">Sessions</div>
                  <div className="mt-1 text-lg  font-semibold text-gray-900">
                    —
                  </div>
                </div>

                <div className="rounded-2xl border border-[#00627B] bg-[#00627B26] py-5 px-3 shadow-sm">
                  <div className="text-sm text-gray-500">Conversion %</div>
                  <div className="mt-1 text-lg  font-semibold text-gray-900">
                    —
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">
                No Shopify data for the current month.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 4: Sales Target card */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-6">
            <SalesTargetCard regions={regions} defaultRegion="Global" />
          </div>
        </aside>
      </div>

      {/* FULL-WIDTH GRAPH */}
      <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm text-gray-500">
          Amazon — Units, Sales, ASP, Profit, Profit %
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-3 text-sm text-gray-500">
            Amazon — P&amp;L Breakdown (Sales, Fees, COGS, Ads, Other, Profit)
          </div>
          <SimpleBarChart
            items={[
              {
                label: "Sales",
                raw: Number(uk.netSalesGBP ?? 0),
                display: fmtGBP(uk.netSalesGBP ?? 0),
              },
              {
                label: "Amazon Fees",
                raw: Number(uk.amazonFeesGBP ?? 0),
                display: fmtGBP(uk.amazonFeesGBP ?? 0),
              },
              {
                label: "COGS",
                raw: Number(uk.cogsGBP ?? 0),
                display: fmtGBP(uk.cogsGBP ?? 0),
              },
              {
                label: "Advertisements",
                raw: 0,
                display: fmtGBP(0),
              },
              {
                label: "Other Charges",
                raw: 0,
                display: fmtGBP(0),
              },
              {
                label: "Profit",
                raw: Number(uk.profitGBP ?? 0),
                display: fmtGBP(uk.profitGBP ?? 0),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
