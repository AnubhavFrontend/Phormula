// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   Title as ChartTitle,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import * as XLSX from "xlsx";
// import { useRouter } from "next/navigation";
// import ModalMsg from "@/components/common/ModalMsg";
// import Button from "../ui/button/Button";
// import PageBreadcrumb from "../common/PageBreadCrumb";

// ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ChartTitle, Tooltip, Legend);

// type GraphPageProps = {
//   range: "monthly" | "quarterly" | "yearly";
//   selectedMonth?: string;
//   selectedQuarter?: "Q1" | "Q2" | "Q3" | "Q4";
//   selectedYear: number | string;
//   countryName: string;
// };

// type UploadRow = {
//   country: string;
//   month: string;
//   year: string | number;
//   total_sales: number;
//   total_amazon_fee: number;
//   total_cous: number;
//   advertising_total: number;
//   otherwplatform: number;
//   taxncredit?: number;
//   cm2_profit: number;
//   total_profit: number;
//   total_net_credits?: number;
// };

// const getCurrencySymbol = (country: string) => {
//   switch (country.toLowerCase()) {
//     case "uk":
//       return "£";
//     case "india":
//       return "₹";
//     case "us":
//       return "$";
//     case "europe":
//     case "eu":
//       return "€";
//     case "global":
//       return "$";
//     default:
//       return "¤";
//   }
// };

// const GraphPage: React.FC<GraphPageProps> = ({
//   range,
//   selectedMonth,
//   selectedQuarter,
//   selectedYear,
//   countryName,
// }) => {
//   const router = useRouter();
//   const currencySymbol = countryName ? getCurrencySymbol(countryName) : "¤";

//   const [data, setData] = useState<UploadRow[]>([]);
//   const [allValuesZero, setAllValuesZero] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const [selectedGraphs, setSelectedGraphs] = useState<Record<string, boolean>>({
//     sales: true,
//     total_cous: true,
//     AmazonExpense: true,
//     taxncredit: true,
//     profit2: true,
//     advertisingCosts: true,
//     Other: true,
//     profit: true,
//   });

//   const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [userData, setUserData] = useState<{ company_name?: string; brand_name?: string } | null>(null);

//   const generateDummyData = (labels: string[]) => {
//     const dummyMetrics: Record<string, number[]> = {
//       sales: labels.map((_, index) => 15000 + Math.random() * 5000 + index * 1000),
//       AmazonExpense: labels.map((_, index) => 3000 + Math.random() * 1000 + index * 200),
//       total_cous: labels.map((_, index) => 8000 + Math.random() * 2000 + index * 500),
//       advertisingCosts: labels.map((_, index) => 2000 + Math.random() * 800 + index * 150),
//       Other: labels.map((_, index) => 1000 + Math.random() * 500 + index * 100),
//       taxncredit: labels.map((_, index) => 500 + Math.random() * 300 + index * 50),
//       profit: labels.map((_, index) => 1500 + Math.random() * 800 + index * 200),
//       profit2: labels.map((_, index) => 2000 + Math.random() * 1000 + index * 250),
//     };
//     return dummyMetrics;
//   };

//   const getQuarterLabels = (year: number | string, quarter: "Q1" | "Q2" | "Q3" | "Q4") => {
//     const qMap: Record<string, string[]> = {
//       Q1: ["january", "february", "march"],
//       Q2: ["april", "may", "june"],
//       Q3: ["july", "august", "september"],
//       Q4: ["october", "november", "december"],
//     };
//     return qMap[quarter]?.map((m) => `${m} ${year}`) ?? [];
//   };

//   const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   const convertToAbbreviatedMonth = (m?: string) => (m ? capitalizeFirstLetter(m).slice(0, 3) : "");

//   const getTitle = () => {
//     if (range === "quarterly" && selectedQuarter) {
//       return `${capitalizeFirstLetter(range)} Tracking Profitability - ${selectedQuarter}'${String(
//         selectedYear
//       ).slice(-2)}`;
//     }
//     if (range === "monthly" && selectedMonth) {
//       return `${capitalizeFirstLetter(range)} Tracking Profitability - ${convertToAbbreviatedMonth(
//         selectedMonth
//       )} ${selectedYear}`;
//     }
//     return `${capitalizeFirstLetter(range)} Tracking Profitability - ${selectedYear}`;
//   };

//   const labelMap: Record<string, string> = {
//     sales: "Sales",
//     total_cous: "COGS",
//     taxncredit: "Taxes & Credits",
//     AmazonExpense: "Amazon Fees",
//     advertisingCosts: "Advertising Costs",
//     Other: "Other",
//     profit: "CM2 Profit",
//     profit2: "CM1 Profit",
//   };

//   useEffect(() => {
//     const fetchUploadHistory = async () => {
//       try {
//         if (!token) return;
//         const resp = await fetch(`http://127.0.0.1:5000/upload_history`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const json = await resp.json();
//         if (json?.uploads) {
//           const filtered = (json.uploads as UploadRow[]).filter(
//             (item) => item.country.toLowerCase() === countryName.toLowerCase()
//           );
//           setData(filtered);
//         }
//       } catch (e) {
//         console.error("Failed to fetch upload history:", e);
//       }
//     };
//     fetchUploadHistory();
//   }, [countryName, token]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!token) {
//         setFetchError("No token found. Please log in.");
//         return;
//       }
//       try {
//         const response = await fetch("http://127.0.0.1:5000/get_user_data", {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) {
//           const j = await response.json().catch(() => ({}));
//           setFetchError(j?.error || "Something went wrong.");
//           return;
//         }
//         const j = await response.json();
//         setUserData(j);
//       } catch {
//         setFetchError("Error fetching user data");
//       }
//     };
//     fetchUser();
//   }, [token]);

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     const selectedCount = Object.values(selectedGraphs).filter(Boolean).length;
//     if (!checked && selectedCount === 1) {
//       setShowModal(true);
//       return;
//     }
//     setSelectedGraphs((prev) => ({ ...prev, [name]: checked }));
//   };

//   const monthlyLabels = useMemo(() => {
//     if (range === "monthly" && selectedMonth && selectedYear) {
//       const label = `${selectedMonth} ${selectedYear}`;
//       return [label.toLowerCase()];
//     }
//     if (range === "quarterly" && selectedQuarter && selectedYear) {
//       return getQuarterLabels(selectedYear, selectedQuarter).map((l) => l.toLowerCase());
//     }
//     if (range === "yearly" && selectedYear) {
//       return [
//         `January ${selectedYear}`,
//         `February ${selectedYear}`,
//         `March ${selectedYear}`,
//         `April ${selectedYear}`,
//         `May ${selectedYear}`,
//         `June ${selectedYear}`,
//         `July ${selectedYear}`,
//         `August ${selectedYear}`,
//         `September ${selectedYear}`,
//         `October ${selectedYear}`,
//         `November ${selectedYear}`,
//         `December ${selectedYear}`,
//       ].map((l) => l.toLowerCase());
//     }
//     return [] as string[];
//   }, [range, selectedMonth, selectedQuarter, selectedYear]);

//   const processData = () => {
//     if (!data || data.length === 0) return { labels: [] as string[], datasets: [] as any[], isAllZero: false };

//     const monthSums: Record<
//       string,
//       {
//         sales: number;
//         AmazonExpense: number;
//         taxncredit: number;
//         total_cous: number;
//         advertisingCosts: number;
//         Other: number;
//         profit: number;
//         profit2: number;
//       }
//     > = {};

//     data.forEach((upload) => {
//       const key = `${upload.month.toLowerCase()} ${upload.year}`;
//       if (!monthSums[key]) {
//         monthSums[key] = {
//           sales: 0,
//           AmazonExpense: 0,
//           taxncredit: 0,
//           total_cous: 0,
//           advertisingCosts: 0,
//           Other: 0,
//           profit: 0,
//           profit2: 0,
//         };
//       }
//       monthSums[key].sales += upload.total_sales;
//       monthSums[key].AmazonExpense += upload.total_amazon_fee;
//       monthSums[key].total_cous += upload.total_cous;
//       monthSums[key].advertisingCosts += Math.abs(upload.advertising_total);
//       monthSums[key].Other += Math.abs(upload.otherwplatform);
//       monthSums[key].taxncredit += upload.taxncredit || 0;
//       monthSums[key].profit += upload.cm2_profit;
//       monthSums[key].profit2 += upload.total_profit;
//     });

//     const labels = monthlyLabels;

//     if (labels.length > 0) {
//       const allDataValues: number[] = [];
//       Object.entries(selectedGraphs)
//         .filter(([, checked]) => checked)
//         .forEach(([metric]) => {
//           const vals = labels.map((l) => monthSums[l]?.[metric as keyof typeof monthSums[string]] || 0);
//           allDataValues.push(...(vals as number[]));
//         });

//       const isAllZero = !allDataValues.some((v) => Math.abs(v) > 0.01);

//       let dataToUse = monthSums;
//       if (isAllZero) {
//         const dummy = generateDummyData(labels);
//         dataToUse = {};
//         labels.forEach((l, idx) => {
//           dataToUse[l] = {
//             sales: dummy.sales[idx],
//             AmazonExpense: dummy.AmazonExpense[idx],
//             taxncredit: dummy.taxncredit[idx],
//             total_cous: dummy.total_cous[idx],
//             advertisingCosts: dummy.advertisingCosts[idx],
//             Other: dummy.Other[idx],
//             profit: dummy.profit[idx],
//             profit2: dummy.profit2[idx],
//           };
//         });
//       }

//       const colorMap: Record<string, string> = {
//         sales: "#2CA9E0",
//         AmazonExpense: "#ff5c5c",
//         taxncredit: "#154B9B",
//         total_cous: "#AB64B5",
//         profit: "#87AD12",
//         advertisingCosts: "#F47A00",
//         Other: "#00627D",
//         profit2: "#5EA49B",
//       };

//       const datasets = Object.entries(selectedGraphs)
//         .filter(([, checked]) => checked)
//         .map(([metric]) => ({
//           label: metric,
//           data: labels.map((l) => dataToUse[l]?.[metric as keyof typeof dataToUse[string]] || 0),
//           fill: false,
//           borderColor: colorMap[metric] ?? "#000",
//           backgroundColor: colorMap[metric] ?? "#000",
//           tension: 0.1,
//         }));

//       return { labels, datasets, isAllZero };
//     }

//     return { labels: [], datasets: [], isAllZero: false };
//   };

//   const { labels: rawLabels, datasets, isAllZero } = useMemo(processData, [
//     data,
//     selectedGraphs,
//     range,
//     selectedMonth,
//     selectedQuarter,
//     selectedYear,
//     monthlyLabels,
//   ]);

//   useEffect(() => setAllValuesZero(isAllZero), [isAllZero]);

//   // Keep X-axis labels on a single line:
//   // - Use NBSP between month and year segment (e.g., "Jan '25")
//   // - Ensure Chart.js ticks are not rotated/wrapped via options below
//   const formattedLabels = useMemo(() => {
//     return rawLabels.map((label) => {
//       const [m, y] = label.trim().split(" ");
//       const mm = convertToAbbreviatedMonth(m);
//       const yy = (y ?? "").slice(-2);
//       return `${mm}\u00A0'${yy}`; // NBSP before the year tick
//     });
//   }, [rawLabels]);

//   const allDataPoints = datasets.flatMap((d: any) => d.data as number[]);
//   const minValue = allDataPoints.length ? Math.min(...allDataPoints) : 0;
//   const minY = minValue < 0 ? Math.floor(minValue * 1.1) : 0;

//   const periodInfo = useMemo(() => {
//     if (range === "monthly" && selectedMonth) {
//       return `${convertToAbbreviatedMonth(selectedMonth)}'${String(selectedYear).slice(-2)}`;
//     }
//     if (range === "quarterly" && selectedQuarter) {
//       return `${selectedQuarter}'${String(selectedYear).slice(-2)}`;
//     }
//     return `Year'${String(selectedYear).slice(-2)}`;
//   }, [range, selectedMonth, selectedQuarter, selectedYear]);

//   const getExtraRows = () => {
//     const formattedCountry = countryName?.toLowerCase() === "global" ? "GLOBAL" : countryName?.toUpperCase();
//     return [
//       [`${userData?.brand_name || "N/A"}`],
//       [`${userData?.company_name || "N/A"}`],
//       [`Profit Breakup (SKU Level) - ${periodInfo}`],
//       [`Currency:  ${currencySymbol}`],
//       [`Country: ${formattedCountry}`],
//       [`Platform: Amazon`],
//     ];
//   };

//   const exportToExcel = () => {
//     const labelsNorm = rawLabels.map((l) => {
//       const [m, y] = l.split(" ");
//       const mm = convertToAbbreviatedMonth(m);
//       const yy = (y ?? "").slice(-2);
//       return `${mm}'${yy}`;
//     });

//     const monthSums: Record<string, any> = {};
//     data.forEach((upload) => {
//       const key = `${upload.month.toLowerCase()} ${upload.year}`;
//       if (!monthSums[key]) {
//         monthSums[key] = {
//           sales: 0,
//           AmazonExpense: 0,
//           total_cous: 0,
//           advertisingCosts: 0,
//           Other: 0,
//           net_credits: 0,
//           taxncredit: 0,
//           profit: 0,
//           profit2: 0,
//         };
//       }
//       monthSums[key].sales += upload.total_sales;
//       monthSums[key].total_cous += upload.total_cous;
//       monthSums[key].AmazonExpense += upload.total_amazon_fee;
//       monthSums[key].taxncredit += upload.taxncredit || 0;
//       monthSums[key].net_credits += upload.total_net_credits || 0;
//       monthSums[key].profit2 += upload.total_profit;
//       monthSums[key].advertisingCosts += upload.advertising_total;
//       monthSums[key].Other += upload.otherwplatform;
//       monthSums[key].profit += upload.cm2_profit;
//     });

//     const fixedOrder = [
//       { key: "sales", label: "Sales", sign: "(+)" },
//       { key: "total_cous", label: "COGS", sign: "(-)" },
//       { key: "AmazonExpense", label: "Amazon Fees", sign: "(-)" },
//       { key: "taxncredit", label: "Taxes & Credits", sign: "(+)" },
//       { key: "profit2", label: "CM1 Profit", sign: "" },
//       { key: "advertisingCosts", label: "Advertising Costs", sign: "(-)" },
//       { key: "Other", label: "Others", sign: "(-)" },
//       { key: "profit", label: "CM2 Profit", sign: "" },
//     ];

//     const header = ["Month", ...fixedOrder.map((i) => i.label)];
//     const signRow = [" ", ...fixedOrder.map((i) => i.sign)];
//     const worksheetData: (string | number)[][] = [header, signRow];

//     rawLabels.forEach((raw, idx) => {
//       const display = labelsNorm[idx];
//       const key = raw.toLowerCase();
//       const row: (string | number)[] = [display];
//       fixedOrder.forEach(({ key: k }) => {
//         const rawVal = monthSums[key]?.[k] ?? 0;
//         row.push(typeof rawVal === "number" ? Number(rawVal.toFixed(2)) : 0);
//       });
//       worksheetData.push(row);
//     });

//     const totalRow: (string | number)[] = ["Total"];
//     fixedOrder.forEach(({ key }) => {
//       let sum = 0;
//       rawLabels.forEach((raw) => {
//         const k = raw.toLowerCase();
//         sum += monthSums[k]?.[key] || 0;
//       });
//       totalRow.push(Number(sum.toFixed(2)));
//     });
//     worksheetData.push(totalRow);

//     const finalSheet = [...getExtraRows(), [""], ...worksheetData];

//     const ws = XLSX.utils.aoa_to_sheet(finalSheet);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
//     XLSX.writeFile(wb, `Metrics-${periodInfo}.xlsx`);
//   };

//   const noMetricSelected = Object.values(selectedGraphs).every((v) => v === false);

//   const accentClass: Record<string, string> = {
//     sales: "accent-sky-500",
//     total_cous: "accent-purple-500",
//     AmazonExpense: "accent-red-500",
//     taxncredit: "accent-blue-800",
//     profit2: "accent-teal-500",
//     advertisingCosts: "accent-orange-500",
//     Other: "accent-teal-700",
//     profit: "accent-lime-600",
//   };

//   const swatchClass: Record<string, string> = {
//     sales: "bg-sky-500",
//     total_cous: "bg-purple-500",
//     AmazonExpense: "bg-red-500",
//     taxncredit: "bg-blue-800",
//     profit2: "bg-teal-500",
//     advertisingCosts: "bg-orange-500",
//     Other: "bg-teal-700",
//     profit: "bg-lime-600",
//   };

//   return (
//     <div className="p-3 sm:p-4 md:p-6">
//       <div className="flex gap-2">
//                 <PageBreadcrumb pageTitle="Tracking Profitability -" variant="page" align="left" textSize="2xl"/>
//                 <span className="text-[#5EA68E] text-2xl">
//                     {countryName?.toLowerCase() === "global"
//                         ? "GLOBAL"
//                         : countryName?.toUpperCase()}
//                 </span>
//             </div>

//       {/* Metric toggles */}
// <div
//   className={[
//     "mt-3 sm:mt-4",
//     "flex flex-wrap items-center justify-between gap-2 sm:gap-3",
//     "w-full sm:w-11/12 md:w-4/5 mx-auto",
//     allValuesZero ? "opacity-30" : "opacity-100",
//     "transition-opacity duration-300",
//   ].join(" ")}
// >
//   {[
//     { name: "sales", label: "Sales", color: "#2CA9E0" },
//     { name: "total_cous", label: "COGS", color: "#FF5C5C" },
//     { name: "AmazonExpense", label: "Amazon Fees", color: "#F47A00" },
//     { name: "taxncredit", label: "Taxes & Credits", color: "#154B9B" },
//     { name: "profit2", label: "CM1 Profit", color: "#5EA49B" },
//     { name: "advertisingCosts", label: "Advertising Costs", color: "#8A4FFF" },
//     { name: "Other", label: "Other", color: "#00627D" },
//     { name: "profit", label: "CM2 Profit", color: "#87AD12" },
//   ].map(({ name, label, color }) => (
//     <label
//       key={name}
//       className={[
//         "flex items-center gap-1 sm:gap-2",
//         "font-semibold cursor-pointer select-none whitespace-nowrap",
//         "text-[10px] sm:text-xs md:text-sm lg:text-base",
//         "underline decoration-2 underline-offset-[2px]",
//       ].join(" ")}
//       style={{ color }}
//     >
//       <input
//         type="checkbox"
//         name={name}
//         checked={!!selectedGraphs[name]}
//         onChange={handleCheckboxChange}
//         disabled={allValuesZero}
//         className={[
//           "h-3 w-3 sm:h-3.5 sm:w-3.5 appearance-none rounded-sm cursor-pointer",
//           accentClass[name],
//           "disabled:cursor-not-allowed",
//         ].join(" ")}
//       />
//       <span
//         className={[
//           "inline-block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm",
//           swatchClass[name],
//         ].join(" ")}
//       />
//       <span>{label.toUpperCase()}</span>
//     </label>
//   ))}
// </div>


//       {/* Chart */}
//       <div className="relative">
//         <div
//           className={[
//             "flex items-center justify-center",
//             "h-[55vh] sm:h-[50vh] md:h-[45vh] lg:h-[40vh]",
//             allValuesZero ? "opacity-30" : "opacity-100",
//             "transition-opacity duration-300",
//             "w-full",
//           ].join(" ")}
//         >
//           {datasets.length > 0 && (
//             <Line
//               data={{ labels: formattedLabels, datasets }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 interaction: { intersect: false, mode: allValuesZero ? "nearest" : "index" },
//                 plugins: {
//                   tooltip: {
//                     enabled: !allValuesZero,
//                     mode: "index",
//                     intersect: false,
//                     callbacks: {
//                       label: (tooltipItem: any) => {
//                         const key = tooltipItem.dataset.label as string;
//                         const displayLabel = labelMap[key] || key;
//                         const value = tooltipItem.raw as number;
//                         return `${displayLabel}: ${currencySymbol} ${value.toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}`;
//                       },
//                     },
//                   },
//                   legend: { display: false },
//                 },
//                 scales: {
//                   x: {
//                     title: { display: true, text: "Month" },
//                     ticks: {
//                       minRotation: 0,
//                       maxRotation: 0,
//                       autoSkip: true,
//                       maxTicksLimit: 12,
//                       callback: (_v, idx) => String(formattedLabels[idx] ?? ""),
//                     },
//                   },
//                   y: {
//                     title: { display: true, text: `Amount (${currencySymbol})` },
//                     min: minY,
//                     ticks: { padding: 0 },
//                   },
//                 },
//               }}
//             />
//           )}
//         </div>

//         {/* Must select >= 1 metric */}
//         {noMetricSelected && (
//           <ModalMsg
//             show={showModal}
//             onClose={() => setShowModal(false)}
//             message="At least one metric must be selected to display the graph."
//           />
//         )}

//         {/* No data overlay */}
//         {allValuesZero && (
//           <div
//             className={[
//               "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
//               "bg-white/95 border-2 border-gray-200 rounded-xl",
//               "p-4 sm:p-5 md:p-6 text-center shadow-lg backdrop-blur",
//               "z-50 w-[92%] max-w-[480px]",
//             ].join(" ")}
//           >
//             <div className="mb-3">
//               <img src="/lock.png" alt="No Data Icon" className="mx-auto h-12 w-12 opacity-70" />
//             </div>
//             <h3 className="text-[#414042] mb-2 text-base sm:text-lg font-semibold">No Data Available</h3>
//             <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
//               To see performance metrics, you need to upload more files for <strong>{getTitle()}</strong>
//             </p>
//             <div className="mt-3 px-3 py-2 bg-gray-50 rounded text-[11px] sm:text-xs text-gray-500">
//               Sample data shown for preview
//             </div>
//             <button
//               className="mt-4 inline-flex items-center justify-center rounded-md bg-[#5EA68E] px-3 py-2 text-white text-xs sm:text-sm font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#5EA68E]/50"
//               onClick={() => router.push(`/Upload/${countryName === "global" ? "uk" : countryName}`)}
//             >
//               Upload MTD(s)
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Export */}
//       <div
//         className={[
//           "mt-3 sm:mt-4",
//           "text-center md:text-right",
//           allValuesZero ? "opacity-30" : "opacity-100",
//           "transition-opacity duration-300",
//         ].join(" ")}
//       >
//         <Button onClick={exportToExcel} size="sm" disabled={allValuesZero} className={allValuesZero ? "cursor-not-allowed" : "cursor-pointer"}>
//           Download {periodInfo} Metrics (.xlsx)&nbsp;
//           <i className="fa-solid fa-download fa-beat" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default GraphPage;



























"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import ModalMsg from "@/components/common/ModalMsg";
import Button from "../ui/button/Button";
import PageBreadcrumb from "../common/PageBreadCrumb";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ChartTitle,
  Tooltip,
  Legend
);

type GraphPageProps = {
  range: "monthly" | "quarterly" | "yearly";
  selectedMonth?: string;
  selectedQuarter?: "Q1" | "Q2" | "Q3" | "Q4";
  selectedYear: number | string;
  countryName: string;
};

type UploadRow = {
  country: string;
  month: string;
  year: string | number;
  total_sales: number;
  total_amazon_fee: number;
  total_cous: number;
  advertising_total: number;
  otherwplatform: number;
  taxncredit?: number;
  cm2_profit: number;
  total_profit: number;
  total_net_credits?: number;
};

const getCurrencySymbol = (country: string) => {
  switch (country.toLowerCase()) {
    case "uk":
      return "£";
    case "india":
      return "₹";
    case "us":
      return "$";
    case "europe":
    case "eu":
      return "€";
    case "global":
      return "$";
    default:
      return "¤";
  }
};

const GraphPage: React.FC<GraphPageProps> = ({
  range,
  selectedMonth,
  selectedQuarter,
  selectedYear,
  countryName,
}) => {
  const router = useRouter();
  const currencySymbol = countryName ? getCurrencySymbol(countryName) : "¤";

  const [data, setData] = useState<UploadRow[]>([]);
  const [allValuesZero, setAllValuesZero] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedGraphs, setSelectedGraphs] = useState<Record<string, boolean>>({
    sales: true,
    total_cous: true,
    AmazonExpense: true,
    taxncredit: true,
    profit2: true,
    advertisingCosts: true,
    Other: true,
    profit: true,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    company_name?: string;
    brand_name?: string;
  } | null>(null);

  const generateDummyData = (labels: string[]) => {
    const dummyMetrics: Record<string, number[]> = {
      sales: labels.map(
        (_, index) => 15000 + Math.random() * 5000 + index * 1000
      ),
      AmazonExpense: labels.map(
        (_, index) => 3000 + Math.random() * 1000 + index * 200
      ),
      total_cous: labels.map(
        (_, index) => 8000 + Math.random() * 2000 + index * 500
      ),
      advertisingCosts: labels.map(
        (_, index) => 2000 + Math.random() * 800 + index * 150
      ),
      Other: labels.map(
        (_, index) => 1000 + Math.random() * 500 + index * 100
      ),
      taxncredit: labels.map(
        (_, index) => 500 + Math.random() * 300 + index * 50
      ),
      profit: labels.map(
        (_, index) => 1500 + Math.random() * 800 + index * 200
      ),
      profit2: labels.map(
        (_, index) => 2000 + Math.random() * 1000 + index * 250
      ),
    };
    return dummyMetrics;
  };

  const getQuarterLabels = (
    year: number | string,
    quarter: "Q1" | "Q2" | "Q3" | "Q4"
  ) => {
    const qMap: Record<string, string[]> = {
      Q1: ["january", "february", "march"],
      Q2: ["april", "may", "june"],
      Q3: ["july", "august", "september"],
      Q4: ["october", "november", "december"],
    };
    return qMap[quarter]?.map((m) => `${m} ${year}`) ?? [];
  };

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const convertToAbbreviatedMonth = (m?: string) =>
    m ? capitalizeFirstLetter(m).slice(0, 3) : "";

  const getTitle = () => {
    if (range === "quarterly" && selectedQuarter) {
      return `${capitalizeFirstLetter(
        range
      )} Tracking Profitability - ${selectedQuarter}'${String(selectedYear).slice(
        -2
      )}`;
    }
    if (range === "monthly" && selectedMonth) {
      return `${capitalizeFirstLetter(
        range
      )} Tracking Profitability - ${convertToAbbreviatedMonth(
        selectedMonth
      )} ${selectedYear}`;
    }
    return `${capitalizeFirstLetter(range)} Tracking Profitability - ${selectedYear}`;
  };

  const labelMap: Record<string, string> = {
    sales: "Sales",
    total_cous: "COGS",
    taxncredit: "Taxes & Credits",
    AmazonExpense: "Amazon Fees",
    advertisingCosts: "Advertising Costs",
    Other: "Other",
    profit: "CM2 Profit",
    profit2: "CM1 Profit",
  };

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        if (!token) return;
        const resp = await fetch(`http://127.0.0.1:5000/upload_history`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await resp.json();
        if (json?.uploads) {
          const filtered = (json.uploads as UploadRow[]).filter(
            (item) => item.country.toLowerCase() === countryName.toLowerCase()
          );
          setData(filtered);
        }
      } catch (e) {
        console.error("Failed to fetch upload history:", e);
      }
    };
    fetchUploadHistory();
  }, [countryName, token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setFetchError("No token found. Please log in.");
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:5000/get_user_data", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const j = await response.json().catch(() => ({}));
          setFetchError(j?.error || "Something went wrong.");
          return;
        }
        const j = await response.json();
        setUserData(j);
      } catch {
        setFetchError("Error fetching user data");
      }
    };
    fetchUser();
  }, [token]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const selectedCount = Object.values(selectedGraphs).filter(Boolean).length;
    if (!checked && selectedCount === 1) {
      setShowModal(true);
      return;
    }
    setSelectedGraphs((prev) => ({ ...prev, [name]: checked }));
  };

  const monthlyLabels = useMemo(() => {
    if (range === "monthly" && selectedMonth && selectedYear) {
      const label = `${selectedMonth} ${selectedYear}`;
      return [label.toLowerCase()];
    }
    if (range === "quarterly" && selectedQuarter && selectedYear) {
      return getQuarterLabels(selectedYear, selectedQuarter).map((l) =>
        l.toLowerCase()
      );
    }
    if (range === "yearly" && selectedYear) {
      return [
        `January ${selectedYear}`,
        `February ${selectedYear}`,
        `March ${selectedYear}`,
        `April ${selectedYear}`,
        `May ${selectedYear}`,
        `June ${selectedYear}`,
        `July ${selectedYear}`,
        `August ${selectedYear}`,
        `September ${selectedYear}`,
        `October ${selectedYear}`,
        `November ${selectedYear}`,
        `December ${selectedYear}`,
      ].map((l) => l.toLowerCase());
    }
    return [] as string[];
  }, [range, selectedMonth, selectedQuarter, selectedYear]);

  const processData = () => {
    if (!data || data.length === 0)
      return { labels: [] as string[], datasets: [] as any[], isAllZero: false };

    const monthSums: Record<
      string,
      {
        sales: number;
        AmazonExpense: number;
        taxncredit: number;
        total_cous: number;
        advertisingCosts: number;
        Other: number;
        profit: number;
        profit2: number;
      }
    > = {};

    data.forEach((upload) => {
      const key = `${upload.month.toLowerCase()} ${upload.year}`;
      if (!monthSums[key]) {
        monthSums[key] = {
          sales: 0,
          AmazonExpense: 0,
          taxncredit: 0,
          total_cous: 0,
          advertisingCosts: 0,
          Other: 0,
          profit: 0,
          profit2: 0,
        };
      }
      monthSums[key].sales += upload.total_sales;
      monthSums[key].AmazonExpense += upload.total_amazon_fee;
      monthSums[key].total_cous += upload.total_cous;
      monthSums[key].advertisingCosts += Math.abs(upload.advertising_total);
      monthSums[key].Other += Math.abs(upload.otherwplatform);
      monthSums[key].taxncredit += upload.taxncredit || 0;
      monthSums[key].profit += upload.cm2_profit;
      monthSums[key].profit2 += upload.total_profit;
    });

    const labels = monthlyLabels;

    if (labels.length > 0) {
      const allDataValues: number[] = [];
      Object.entries(selectedGraphs)
        .filter(([, checked]) => checked)
        .forEach(([metric]) => {
          const vals = labels.map(
            (l) =>
              monthSums[l]?.[metric as keyof (typeof monthSums)[string]] || 0
          );
          allDataValues.push(...(vals as number[]));
        });

      const isAllZero = !allDataValues.some((v) => Math.abs(v) > 0.01);

      let dataToUse = monthSums;
      if (isAllZero) {
        const dummy = generateDummyData(labels);
        dataToUse = {};
        labels.forEach((l, idx) => {
          dataToUse[l] = {
            sales: dummy.sales[idx],
            AmazonExpense: dummy.AmazonExpense[idx],
            taxncredit: dummy.taxncredit[idx],
            total_cous: dummy.total_cous[idx],
            advertisingCosts: dummy.advertisingCosts[idx],
            Other: dummy.Other[idx],
            profit: dummy.profit[idx],
            profit2: dummy.profit2[idx],
          };
        });
      }

      const colorMap: Record<string, string> = {
        sales: "#2CA9E0",
        AmazonExpense: "#ff5c5c",
        taxncredit: "#154B9B",
        total_cous: "#AB64B5",
        profit: "#87AD12",
        advertisingCosts: "#F47A00",
        Other: "#00627D",
        profit2: "#5EA49B",
      };

      const datasets = Object.entries(selectedGraphs)
        .filter(([, checked]) => checked)
        .map(([metric]) => ({
          // use human-friendly labels for lines
          label: labelMap[metric] ?? metric,
          data: labels.map(
            (l) =>
              dataToUse[l]?.[metric as keyof (typeof dataToUse)[string]] || 0
          ),
          fill: false,
          borderColor: colorMap[metric] ?? "#000",
          backgroundColor: colorMap[metric] ?? "#000",
          tension: 0.1,
        }));

      return { labels, datasets, isAllZero };
    }

    return { labels: [], datasets: [], isAllZero: false };
  };

  const {
    labels: rawLabels,
    datasets,
    isAllZero,
  } = useMemo(processData, [
    data,
    selectedGraphs,
    range,
    selectedMonth,
    selectedQuarter,
    selectedYear,
    monthlyLabels,
  ]);

  useEffect(() => setAllValuesZero(isAllZero), [isAllZero]);

  // X-axis tick labels like "Jan '25"
  const formattedLabels = useMemo(() => {
    return rawLabels.map((label) => {
      const [m, y] = label.trim().split(" ");
      const mm = convertToAbbreviatedMonth(m);
      const yy = (y ?? "").slice(-2);
      return `${mm}\u00A0'${yy}`;
    });
  }, [rawLabels]);

  const allDataPoints = datasets.flatMap((d: any) => d.data as number[]);
  const minValue = allDataPoints.length ? Math.min(...allDataPoints) : 0;
  const minY = minValue < 0 ? Math.floor(minValue * 1.1) : 0;

  const periodInfo = useMemo(() => {
    if (range === "monthly" && selectedMonth) {
      return `${convertToAbbreviatedMonth(selectedMonth)}'${String(
        selectedYear
      ).slice(-2)}`;
    }
    if (range === "quarterly" && selectedQuarter) {
      return `${selectedQuarter}'${String(selectedYear).slice(-2)}`;
    }
    return `Year'${String(selectedYear).slice(-2)}`;
  }, [range, selectedMonth, selectedQuarter, selectedYear]);

  const getExtraRows = () => {
    const formattedCountry =
      countryName?.toLowerCase() === "global"
        ? "GLOBAL"
        : countryName?.toUpperCase();
    return [
      [`${userData?.brand_name || "N/A"}`],
      [`${userData?.company_name || "N/A"}`],
      [`Profit Breakup (SKU Level) - ${periodInfo}`],
      [`Currency:  ${currencySymbol}`],
      [`Country: ${formattedCountry}`],
      [`Platform: Amazon`],
    ];
  };

  const exportToExcel = () => {
    const labelsNorm = rawLabels.map((l) => {
      const [m, y] = l.split(" ");
      const mm = convertToAbbreviatedMonth(m);
      const yy = (y ?? "").slice(-2);
      return `${mm}'${yy}`;
    });

    const monthSums: Record<string, any> = {};
    data.forEach((upload) => {
      const key = `${upload.month.toLowerCase()} ${upload.year}`;
      if (!monthSums[key]) {
        monthSums[key] = {
          sales: 0,
          AmazonExpense: 0,
          total_cous: 0,
          advertisingCosts: 0,
          Other: 0,
          net_credits: 0,
          taxncredit: 0,
          profit: 0,
          profit2: 0,
        };
      }
      monthSums[key].sales += upload.total_sales;
      monthSums[key].total_cous += upload.total_cous;
      monthSums[key].AmazonExpense += upload.total_amazon_fee;
      monthSums[key].taxncredit += upload.taxncredit || 0;
      monthSums[key].net_credits += upload.total_net_credits || 0;
      monthSums[key].profit2 += upload.total_profit;
      monthSums[key].advertisingCosts += upload.advertising_total;
      monthSums[key].Other += upload.otherwplatform;
      monthSums[key].profit += upload.cm2_profit;
    });

    const fixedOrder = [
      { key: "sales", label: "Sales", sign: "(+)" },
      { key: "total_cous", label: "COGS", sign: "(-)" },
      { key: "AmazonExpense", label: "Amazon Fees", sign: "(-)" },
      { key: "taxncredit", label: "Taxes & Credits", sign: "(+)" },
      { key: "profit2", label: "CM1 Profit", sign: "" },
      { key: "advertisingCosts", label: "Advertising Costs", sign: "(-)" },
      { key: "Other", label: "Others", sign: "(-)" },
      { key: "profit", label: "CM2 Profit", sign: "" },
    ];

    const header = ["Month", ...fixedOrder.map((i) => i.label)];
    const signRow = [" ", ...fixedOrder.map((i) => i.sign)];
    const worksheetData: (string | number)[][] = [header, signRow];

    rawLabels.forEach((raw, idx) => {
      const display = labelsNorm[idx];
      const key = raw.toLowerCase();
      const row: (string | number)[] = [display];
      fixedOrder.forEach(({ key: k }) => {
        const rawVal = monthSums[key]?.[k] ?? 0;
        row.push(typeof rawVal === "number" ? Number(rawVal.toFixed(2)) : 0);
      });
      worksheetData.push(row);
    });

    const totalRow: (string | number)[] = ["Total"];
    fixedOrder.forEach(({ key }) => {
      let sum = 0;
      rawLabels.forEach((raw) => {
        const k = raw.toLowerCase();
        sum += monthSums[k]?.[key] || 0;
      });
      totalRow.push(Number(sum.toFixed(2)));
    });
    worksheetData.push(totalRow);

    const finalSheet = [...getExtraRows(), [""], ...worksheetData];

    const ws = XLSX.utils.aoa_to_sheet(finalSheet);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
    XLSX.writeFile(wb, `Metrics-${periodInfo}.xlsx`);
  };

  const noMetricSelected = Object.values(selectedGraphs).every(
    (v) => v === false
  );

  const accentClass: Record<string, string> = {
    sales: "accent-sky-500",
    total_cous: "accent-purple-500",
    AmazonExpense: "accent-red-500",
    taxncredit: "accent-blue-800",
    profit2: "accent-teal-500",
    advertisingCosts: "accent-orange-500",
    Other: "accent-teal-700",
    profit: "accent-lime-600",
  };

  const swatchClass: Record<string, string> = {
    sales: "bg-sky-500",
    total_cous: "bg-purple-500",
    AmazonExpense: "bg-red-500",
    taxncredit: "bg-blue-800",
    profit2: "bg-teal-500",
    advertisingCosts: "bg-orange-500",
    Other: "bg-teal-700",
    profit: "bg-lime-600",
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex gap-2">
        <PageBreadcrumb
          pageTitle="Tracking Profitability -"
          variant="page"
          align="left"
          textSize="2xl"
        />
        <span className="text-[#5EA68E] text-2xl">
          {countryName?.toLowerCase() === "global"
            ? "GLOBAL"
            : countryName?.toUpperCase()}
        </span>
      </div>

      {/* Metric toggles */}
      <div
        className={[
          "mt-3 sm:mt-4",
          "flex flex-wrap lg:flex-nowrap items-center justify-start",
          "gap-1.5 sm:gap-2 md:gap-1.5",
          "w-full mx-auto",
          allValuesZero ? "opacity-30" : "opacity-100",
          "transition-opacity duration-300",
        ].join(" ")}
      >
        {[
          { name: "sales", label: "Sales", color: "#2CA9E0" },
          { name: "total_cous", label: "COGS", color: "#FF5C5C" },
          { name: "AmazonExpense", label: "Amazon Fees", color: "#F47A00" },
          { name: "taxncredit", label: "Taxes & Credits", color: "#154B9B" },
          { name: "profit2", label: "CM1 Profit", color: "#5EA49B" },
          {
            name: "advertisingCosts",
            label: "Advertising Costs",
            color: "#8A4FFF",
          },
          { name: "Other", label: "Other", color: "#00627D" },
          { name: "profit", label: "CM2 Profit", color: "#87AD12" },
        ].map(({ name, label, color }) => (
          <label
            key={name}
            className={[
              "shrink-0",
              "flex items-center gap-1 sm:gap-1.5",
              "font-semibold cursor-pointer select-none whitespace-nowrap",
              "text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs xl:text-sm",
              "underline decoration-2 underline-offset-[2px]",
            ].join(" ")}
            style={{ color }}
          >
            <input
              type="checkbox"
              name={name}
              checked={!!selectedGraphs[name]}
              onChange={handleCheckboxChange}
              disabled={allValuesZero}
              className={[
                "h-3 w-3 sm:h-3.5 sm:w-3.5 appearance-none rounded-sm cursor-pointer",
                accentClass[name],
                "disabled:cursor-not-allowed",
              ].join(" ")}
            />
            <span
              className={[
                "inline-block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm",
                swatchClass[name],
              ].join(" ")}
            />
            <span>{label.toUpperCase()}</span>
          </label>
        ))}
      </div>



      {/* Chart */}
      <div className="relative mt-2 sm:mt-3">
        <div
          className={[
            "flex items-center justify-center",
            "h-[55vh] sm:h-[50vh] md:h-[45vh] lg:h-[40vh]",
            allValuesZero ? "opacity-30" : "opacity-100",
            "transition-opacity duration-300",
            "w-full",
          ].join(" ")}
        >
          {datasets.length > 0 && (
            <Line
              data={{ labels: formattedLabels, datasets }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  intersect: false,
                  mode: allValuesZero ? "nearest" : "index",
                },
                plugins: {
                  tooltip: {
                    enabled: !allValuesZero,
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: (tooltipItem: any) => {
                        // dataset.label already contains pretty label (e.g. "Sales")
                        const displayLabel =
                          (tooltipItem.dataset.label as string) || "";
                        const value = tooltipItem.raw as number;
                        return `${displayLabel}: ${currencySymbol} ${value.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`;
                      },
                    },
                  },
                  legend: { display: false },
                },
                scales: {
                  x: {
                    title: { display: true, text: "Month" },
                    ticks: {
                      minRotation: 0,
                      maxRotation: 0,
                      // IMPORTANT: always show the tick if there's only 1 label (monthly case)
                      autoSkip: formattedLabels.length > 6,
                      maxTicksLimit:
                        formattedLabels.length > 0
                          ? formattedLabels.length
                          : 12,
                      callback: (_v, idx) =>
                        String(formattedLabels[idx] ?? ""),
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: `Amount (${currencySymbol})`,
                    },
                    min: minY,
                    ticks: { padding: 0 },
                  },
                },
              }}
            />
          )}
        </div>

        {/* Must select >= 1 metric */}
        {noMetricSelected && (
          <ModalMsg
            show={showModal}
            onClose={() => setShowModal(false)}
            message="At least one metric must be selected to display the graph."
          />
        )}

        {/* No data overlay */}
        {allValuesZero && (
          <div
            className={[
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "bg-white/95 border-2 border-gray-200 rounded-xl",
              "p-4 sm:p-5 md:p-6 text-center shadow-lg backdrop-blur",
              "z-50 w-[92%] max-w-[480px]",
            ].join(" ")}
          >
            <div className="mb-3">
              <img
                src="/lock.png"
                alt="No Data Icon"
                className="mx-auto h-12 w-12 opacity-70"
              />
            </div>
            <h3 className="text-[#414042] mb-2 text-base sm:text-lg font-semibold">
              No Data Available
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              To see performance metrics, you need to upload more files for{" "}
              <strong>{getTitle()}</strong>
            </p>
            <div className="mt-3 px-3 py-2 bg-gray-50 rounded text-[11px] sm:text-xs text-gray-500">
              Sample data shown for preview
            </div>
            <button
              className="mt-4 inline-flex items-center justify-center rounded-md bg-[#5EA68E] px-3 py-2 text-white text-xs sm:text-sm font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#5EA68E]/50"
              onClick={() =>
                router.push(
                  `/Upload/${countryName === "global" ? "uk" : countryName}`
                )
              }
            >
              Upload MTD(s)
            </button>
          </div>
        )}
      </div>

      {/* Export button ABOVE chart */}
      <div
        className={[
          "mt-2 sm:mt-3",
          "w-full mx-auto",
          "flex justify-end",     
          allValuesZero ? "opacity-30" : "opacity-100",
          "transition-opacity duration-300",
        ].join(" ")}
      >
        <Button
          onClick={exportToExcel}
          size="sm"
          disabled={allValuesZero}
          className={allValuesZero ? "cursor-not-allowed" : "cursor-pointer"}
        >
          Download {periodInfo} Metrics (.xlsx)&nbsp;
          <i className="fa-solid fa-download fa-beat" />
        </Button>
      </div>

    </div>
  );
};

export default GraphPage;
