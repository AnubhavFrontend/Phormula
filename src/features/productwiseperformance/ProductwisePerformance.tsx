// // "use client";

// // import React, { useEffect, useMemo, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import dynamic from "next/dynamic";
// // import {
// //     Chart as ChartJS,
// //     CategoryScale,
// //     LinearScale,
// //     PointElement,
// //     LineElement,
// //     Title as ChartTitle,
// //     Tooltip,
// //     Legend,
// //     Filler,
// // } from "chart.js";
// // import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// // // import MonthYearPickerTable from "@/components/filters/MonthYearPickerTable"; // ⬅️ NEW
// // import PeriodFiltersTable from "@/components/filters/PeriodFiltersTable";

// // const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
// //     ssr: false,
// // });

// // ChartJS.register(
// //     CategoryScale,
// //     LinearScale,
// //     PointElement,
// //     LineElement,
// //     ChartTitle,
// //     Tooltip,
// //     Legend,
// //     Filler
// // );

// // type CountryKey = "uk" | "us" | "global" | string;

// // type MonthDatum = {
// //     month: string;
// //     net_sales: number;
// //     quantity: number;
// //     profit: number;
// // };

// // type APIResponse = {
// //     success: boolean;
// //     message?: string;
// //     data: Record<CountryKey, MonthDatum[]>;
// // };

// // interface ProductwisePerformanceProps {
// //     productname?: string;
// // }


// // // ----------------------
// // // Slug helper functions
// // // ----------------------
// // const toSlug = (name: string) =>
// //   name
// //     .trim()
// //     .toLowerCase()
// //     .replace(/\s*\+\s*/g, " plus ")
// //     .replace(/\s+/g, "-"); // spaces → dashes

// // const fromSlug = (slug: string) =>
// //   slug
// //     .replace(/-/g, " ")
// //     .replace(/\bplus\b/gi, "+")
// //     .replace(/\s+/g, " ")
// //     .trim();


// // const ProductwisePerformance: React.FC<ProductwisePerformanceProps> = ({
// //     productname: propProductName,
// // }) => {
// //     const params = useParams();
// //     const router = useRouter();

// //     const rawSlug = params?.productname as string | undefined;
// //     const urlProductName = rawSlug ? fromSlug(rawSlug) : undefined;

// //     const countryName = (params?.countryName as string) || undefined;
// //     const monthParam = (params?.month as string) || undefined;
// //     const yearParam = (params?.year as string) || undefined;

// //     const productname = propProductName || urlProductName || "Menthol";

    

// //     const [data, setData] = useState<APIResponse | null>(null);
// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState<string>("");

// //     const authToken =
// //         typeof window !== "undefined"
// //             ? localStorage.getItem("jwtToken")
// //             : null;


// //     const getCurrencySymbol = (country?: string) => {
// //         if (!country) return "¤";
// //         switch (country.toLowerCase()) {
// //             case "uk":
// //                 return "£";
// //             case "india":
// //                 return "₹";
// //             case "us":
// //                 return "$";
// //             case "europe":
// //             case "eu":
// //                 return "€";
// //             case "global":
// //                 return "$";
// //             default:
// //                 return "¤";
// //         }
// //     };

// //     const currencySymbol = countryName ? getCurrencySymbol(countryName) : "¤";

// //     // -------------------------
// //     // Search State
// //     // -------------------------
// //     const [searchQuery, setSearchQuery] = useState("");
// //     const [searchResults, setSearchResults] = useState<
// //         { product_name: string }[]
// //     >([]);
// //     const [showSearchResults, setShowSearchResults] = useState(false);
// //     const [searchLoading, setSearchLoading] = useState(false);

// //     // -------------------------
// //     // Controls State
// //     // -------------------------
// // // -------------------------
// // // Controls State
// // // -------------------------
// // type Range = "monthly" | "quarterly" | "yearly";

// // const [range, setRange] = useState<Range>("yearly");


// //     const initialYear = useMemo(() => new Date().getFullYear(), []);
// //     const [selectedYear, setSelectedYear] = useState<number>(
// //         yearParam ? Number(yearParam) : initialYear
// //     );

// //     // Month state for MonthYearPickerTable (not sent to backend yet, but available)
// //     const [selectedMonth, setSelectedMonth] = useState<string>(
// //         monthParam || ""
// //     );

// //     // We still keep quarter + timeRange in case backend needs it.
// //     const [selectedQuarter, setSelectedQuarter] = useState("1");

// //     const [selectedCountries, setSelectedCountries] = useState<
// //         Record<CountryKey, boolean>
// //     >({
// //         uk: true,
// //         us: true,
// //         global: true,
// //     });

// //     const years = useMemo(
// //         () => Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i),
// //         []
// //     );

// //     const quarters = [
// //         { value: "1", label: "Q1" },
// //         { value: "2", label: "Q2" },
// //         { value: "3", label: "Q3" },
// //         { value: "4", label: "Q4" },
// //     ];

// //     const handleCountryChange = (country: CountryKey) => {
// //         setSelectedCountries((prev) => ({
// //             ...prev,
// //             [country]: !prev[country],
// //         }));
// //     };

// //     // -------------------------
// //     // Search function (debounced)
// //     // -------------------------
// //     useEffect(() => {
// //         const timeoutId = setTimeout(async () => {
// //             if (!searchQuery.trim()) {
// //                 setSearchResults([]);
// //                 setShowSearchResults(false);
// //                 return;
// //             }
// //             setSearchLoading(true);
// //             try {
// //                 const res = await fetch(
// //                     `http://localhost:5000/Product_search?query=${encodeURIComponent(
// //                         searchQuery
// //                     )}`,
// //                     {
// //                         method: "GET",
// //                         headers: {
// //                             Authorization: `Bearer ${authToken ?? ""}`,
// //                             "Content-Type": "application/json",
// //                         },
// //                     }
// //                 );
// //                 if (!res.ok)
// //                     throw new Error(`HTTP error! status: ${res.status}`);
// //                 const json = await res.json();
// //                 setSearchResults(json.products || []);
// //                 setShowSearchResults(true);
// //             } catch (e) {
// //                 console.error("Search error:", e);
// //                 setSearchResults([]);
// //                 setShowSearchResults(false);
// //             } finally {
// //                 setSearchLoading(false);
// //             }
// //         }, 300);

// //         return () => clearTimeout(timeoutId);
// //         // eslint-disable-next-line react-hooks/exhaustive-deps
// //     }, [searchQuery]);

// //     // const handleProductSelect = (product: { product_name: string }) => {
// //     //     const base = "/productwiseperformance";

// //     //     const to = `${base}/${product.product_name}/${countryName ?? ""}/${selectedMonth ?? ""}/${selectedYear ?? ""}`;

// //     //     router.push(to);
// //     // };

// //     const handleProductSelect = (product: { product_name: string }) => {
// //   const base = "/productwiseperformance";
// //   const slug = toSlug(product.product_name);

// //   const to = `${base}/${slug}/${countryName ?? ""}/${selectedMonth ?? ""}/${selectedYear ?? ""}`;
// //   router.push(to);
// // };




// //     // -------------------------
// //     // Fetch Product Data
// //     // -------------------------
// //     const fetchProductData = async () => {
// //   setLoading(true);
// //   setError("");
// //   try {
// //     const countries = Object.keys(selectedCountries).filter(
// //       (k) => selectedCountries[k]
// //     );

// //     // Map UI "monthly|quarterly|yearly" to backend format
// //     const backendTimeRange =
// //       range === "yearly"
// //         ? "Yearly"
// //         : range === "quarterly"
// //         ? "Quarterly"
// //         : "Monthly"; // make sure backend supports this

// //     const payload: any = {
// //       product_name: productname,
// //       time_range: backendTimeRange,
// //       year: selectedYear,
// //       countries,
// //     };

// //     if (range === "quarterly") {
// //       payload.quarter = selectedQuarter; // "1" | "2" | "3" | "4"
// //     }

// //     if (range === "monthly") {
// //       payload.month = selectedMonth; // e.g. "january" (lowercase full name)
// //     }

// //     const res = await fetch("http://localhost:5000/ProductwisePerformance", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${authToken ?? ""}`,
// //       },
// //       body: JSON.stringify(payload),
// //     });
// //     ...
// //   } catch (e: any) {
// //     ...
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// //     // 🔁 Auto-fetch when key controls change (no Fetch button)
// //     useEffect(() => {
// //   fetchProductData();
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // }, [
// //   productname,
// //   selectedYear,
// //   range,
// //   selectedQuarter,
// //   selectedMonth,
// //   selectedCountries,
// // ]);

// // // -------------------------
// //     // Helpers for Chart Data
// //     // -------------------------
// //     const monthOrder = [
// //         "January",
// //         "February",
// //         "March",
// //         "April",
// //         "May",
// //         "June",
// //         "July",
// //         "August",
// //         "September",
// //         "October",
// //         "November",
// //         "December",
// //     ];

// //     const prepareProfitData = () => {
// //         if (!data?.data) return [] as any[];

// //         const allMonths = new Set<string>();
// //         Object.values(data.data).forEach((countryData) => {
// //             countryData.forEach((m) => allMonths.add(m.month));
// //         });

// //         const sortedMonths = Array.from(allMonths).sort(
// //             (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
// //         );

// //         const profitData: any[] = [];
// //         sortedMonths.forEach((m) => {
// //             const point: Record<string, any> = { month: m };
// //             Object.entries(data.data).forEach(([country, cd]) => {
// //                 const md = cd.find((d) => d.month === m);
// //                 point[country] = md ? md.profit : 0;
// //             });
// //             profitData.push(point);
// //         });

// //         return profitData;
// //     };

// //     const prepareChartData = () => {
// //         if (!data?.data)
// //             return { netSalesData: [] as any[], quantityData: [] as any[] };

// //         const allMonths = new Set<string>();
// //         Object.values(data.data).forEach((countryData) => {
// //             countryData.forEach((m) => allMonths.add(m.month));
// //         });

// //         const sortedMonths = Array.from(allMonths).sort(
// //             (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
// //         );

// //         const netSalesData: any[] = [];
// //         const quantityData: any[] = [];

// //         sortedMonths.forEach((m) => {
// //             const netSalesPoint: Record<string, any> = { month: m };
// //             const quantityPoint: Record<string, any> = { month: m };

// //             Object.entries(data.data).forEach(([country, cd]) => {
// //                 const md = cd.find((d) => d.month === m);
// //                 netSalesPoint[country] = md ? md.net_sales : 0;
// //                 quantityPoint[country] = md ? md.quantity : 0;
// //             });

// //             netSalesData.push(netSalesPoint);
// //             quantityData.push(quantityPoint);
// //         });

// //         return { netSalesData, quantityData };
// //     };

// //     const getCountryColor = (country: CountryKey) => {
// //         const colors: Record<string, string> = {
// //             uk: "#AB64B5",
// //             us: "#87AD12",
// //             global: "#F47A00",
// //         };
// //         return colors[country] || "#ff7c7c";
// //     };

// //     const formatCurrency = (value: number) =>
// //         new Intl.NumberFormat("en-US", {
// //             style: "currency",
// //             currency: "USD",
// //             minimumFractionDigits: 0,
// //             maximumFractionDigits: 0,
// //         }).format(value);


// //     const formatCurrencyByCountry = (country: string, value: number) => {
// //         const lower = country.toLowerCase();

// //         if (lower === "uk") {
// //             // Pounds for UK
// //             return new Intl.NumberFormat("en-GB", {
// //                 style: "currency",
// //                 currency: "GBP",
// //                 minimumFractionDigits: 0,
// //                 maximumFractionDigits: 0,
// //             }).format(value);
// //         }

// //         // Global, US, and others -> show in USD
// //         return new Intl.NumberFormat("en-US", {
// //             style: "currency",
// //             currency: "USD",
// //             minimumFractionDigits: 0,
// //             maximumFractionDigits: 0,
// //         }).format(value);
// //     };


// //     const buildChartJSData = () => {
// //         const { netSalesData, quantityData } = prepareChartData();
// //         const profitData = prepareProfitData();

// //         const buildChart = (rawData: any[], labelSuffix: string) => {
// //             if (!rawData || rawData.length === 0) return null;
// //             const labels = rawData.map((i) => i.month);
// //             const datasets = Object.keys(selectedCountries)
// //                 .filter((country) => selectedCountries[country])
// //                 .map((country) => ({
// //                     label: `${country.toUpperCase()} ${labelSuffix}`,
// //                     data: rawData.map((item) => item[country] || 0),
// //                     borderColor: getCountryColor(country),
// //                     backgroundColor: getCountryColor(country),
// //                     tension: 0.1,
// //                     pointRadius: 3,
// //                     fill: false,
// //                 }));
// //             return { labels, datasets };
// //         };

// //         const charts = [
// //             buildChart(netSalesData, "Net Sales"),
// //             buildChart(quantityData, "Quantity"),
// //             buildChart(profitData, "Profit"),
// //         ];

// //         return charts;
// //     };

// //     const chartDataList = buildChartJSData();

// //     const chartOptions = {
// //         responsive: true,
// //         plugins: {
// //             legend: { display: false },
// //             tooltip: {
// //                 callbacks: {
// //                     label: (context: any) => {
// //                         const value = context.parsed.y as number;
// //                         const datasetLabel = context.dataset.label as string;
// //                         const parts = datasetLabel.split(" ");
// //                         const countryCode = parts[0]; // e.g. "UK", "US", "GLOBAL"
// //                         const metricPart = (parts.slice(1).join(" ") || "").toLowerCase();

// //                         // For quantity / units, show plain number
// //                         if (metricPart.includes("quantity") || metricPart.includes("units")) {
// //                             return `${datasetLabel}: ${value}`;
// //                         }

// //                         // For money, pick currency by country
// //                         return `${datasetLabel}: ${formatCurrencyByCountry(
// //                             countryCode,
// //                             value
// //                         )}`;
// //                     },
// //                 },
// //             },

// //         },
// //         scales: {
// //             x: { title: { display: true, text: "Month" } },
// //             y: {
// //                 title: { display: true, text: `Amount (${currencySymbol})` },
// //                 min: 0,
// //                 ticks: { padding: 0 },
// //             },
// //         },
// //     } as const;

// //     const [currentIndex, setCurrentIndex] = useState(0);
// //     const handlePrev = () =>
// //         setCurrentIndex((i) =>
// //             i === 0 ? chartDataList.length - 1 : i - 1
// //         );
// //     const handleNext = () =>
// //         setCurrentIndex((i) =>
// //             i === chartDataList.length - 1 ? 0 : i + 1
// //         );

// //     const yearShort = selectedYear.toString().slice(-2);

// // const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

// // const getTitle = () => {
// //   if (range === "yearly") return `Year'${yearShort}`;
// //   if (range === "quarterly") return `Q${selectedQuarter}'${yearShort}`;

// //   // monthly
// //   return selectedMonth
// //     ? `${cap(selectedMonth)}'${yearShort}`
// //     : `Year'${yearShort}`;
// // };


// //     // -------------------------
// //     // Derived values for cards
// //     // -------------------------
// //     // const cards = useMemo(() => {
// //     //     if (!data?.data) return [] as { country: string; stats: any }[];

// //     //     return Object.entries(data.data).map(([country, countryData]) => {
// //     //         const totalSales = countryData.reduce(
// //     //             (s, m) => s + m.net_sales,
// //     //             0
// //     //         );
// //     //         const totalProfit = countryData.reduce(
// //     //             (s, m) => s + m.profit,
// //     //             0
// //     //         );
// //     //         const totalUnits = countryData.reduce(
// //     //             (s, m) => s + m.quantity,
// //     //             0
// //     //         );

// //     //         const gross_margin_avg =
// //     //             totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
// //     //         const monthsWithSales = countryData.filter((m) => m.net_sales > 0);
// //     //         const avgSales =
// //     //             monthsWithSales.length > 0
// //     //                 ? totalSales / monthsWithSales.length
// //     //                 : 0;
// //     //         const avgSellingPrice =
// //     //             totalUnits > 0 ? totalSales / totalUnits : 0;
// //     //         const avgMonthlyProfit =
// //     //             countryData.length > 0 ? totalProfit / countryData.length : 0;

// //     //         const maxSalesMonth = countryData.reduce((max, m) =>
// //     //             m.net_sales > max.net_sales ? m : max
// //     //         );
// //     //         const maxUnitsMonth = countryData.reduce((max, m) =>
// //     //             m.quantity > max.quantity ? m : max
// //     //         );

// //     //         return {
// //     //             country,
// //     //             stats: {
// //     //                 totalSales,
// //     //                 totalProfit,
// //     //                 totalUnits,
// //     //                 gross_margin_avg,
// //     //                 avgSales,
// //     //                 avgSellingPrice,
// //     //                 avgMonthlyProfit,
// //     //                 maxSalesMonth,
// //     //                 maxUnitsMonth,
// //     //             },
// //     //         };
// //     //     });
// //     // }, [data]);


// //     const cards = useMemo(() => {
// //         if (!data?.data) return [] as { country: string; stats: any }[];

// //         const GBP_TO_USD = 1.27; // 🔹 You can adjust or fetch dynamically

// //         return Object.entries(data.data).map(([country, countryData]) => {
// //             let processedData = countryData;

// //             // 🔥 GLOBAL REBUILD: Convert UK → USD, combine with US
// //             if (country.toLowerCase() === "global") {
// //                 processedData = monthOrder.map((month) => {
// //                     const uk = data.data.uk?.find((m) => m.month === month);
// //                     const us = data.data.us?.find((m) => m.month === month);

// //                     return {
// //                         month,
// //                         net_sales:
// //                             (uk?.net_sales || 0) * GBP_TO_USD + (us?.net_sales || 0),
// //                         profit:
// //                             (uk?.profit || 0) * GBP_TO_USD + (us?.profit || 0),
// //                         quantity:
// //                             (uk?.quantity || 0) + (us?.quantity || 0),
// //                     };
// //                 });
// //             }

// //             // ⬇️ Below this, everything uses processedData instead of original
// //             const totalSales = processedData.reduce((s, m) => s + m.net_sales, 0);
// //             const totalProfit = processedData.reduce((s, m) => s + m.profit, 0);
// //             const totalUnits = processedData.reduce((s, m) => s + m.quantity, 0);

// //             const gross_margin_avg =
// //                 totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

// //             const monthsWithSales = processedData.filter((m) => m.net_sales > 0);

// //             const avgSales =
// //                 monthsWithSales.length > 0
// //                     ? totalSales / monthsWithSales.length
// //                     : 0;

// //             const avgSellingPrice =
// //                 totalUnits > 0 ? totalSales / totalUnits : 0;

// //             const avgMonthlyProfit =
// //                 processedData.length > 0
// //                     ? totalProfit / processedData.length
// //                     : 0;

// //             const maxSalesMonth = processedData.reduce((max, m) =>
// //                 m.net_sales > max.net_sales ? m : max
// //             );

// //             const maxUnitsMonth = processedData.reduce((max, m) =>
// //                 m.quantity > max.quantity ? m : max
// //             );

// //             return {
// //                 country,
// //                 stats: {
// //                     totalSales,
// //                     totalProfit,
// //                     totalUnits,
// //                     gross_margin_avg,
// //                     avgSales,
// //                     avgSellingPrice,
// //                     avgMonthlyProfit,
// //                     maxSalesMonth,
// //                     maxUnitsMonth,
// //                 },
// //             };
// //         });
// //     }, [data]);


// //     const formatMonthYear = (monthName: string, year: number | string) => {
// //         const MONTH_ABBRS = [
// //             "Jan",
// //             "Feb",
// //             "Mar",
// //             "Apr",
// //             "May",
// //             "Jun",
// //             "Jul",
// //             "Aug",
// //             "Sep",
// //             "Oct",
// //             "Nov",
// //             "Dec",
// //         ];

// //         if (!monthName) return "";

// //         const idx = MONTH_ABBRS.findIndex(
// //             (_, i) =>
// //                 monthName.toLowerCase().startsWith(
// //                     [
// //                         "january",
// //                         "february",
// //                         "march",
// //                         "april",
// //                         "may",
// //                         "june",
// //                         "july",
// //                         "august",
// //                         "september",
// //                         "october",
// //                         "november",
// //                         "december",
// //                     ][i].slice(0, 3)
// //                 ) ||
// //                 monthName.toLowerCase() ===
// //                 [
// //                     "january",
// //                     "february",
// //                     "march",
// //                     "april",
// //                     "may",
// //                     "june",
// //                     "july",
// //                     "august",
// //                     "september",
// //                     "october",
// //                     "november",
// //                     "december",
// //                 ][i]
// //         );

// //         const abbr =
// //             idx >= 0 ? MONTH_ABBRS[idx] : monthName.slice(0, 3) || monthName;
// //         const y = String(year);
// //         const shortYear = y.slice(-2);
// //         return `${abbr}'${shortYear}`;
// //     };


// //     // const CountryCard: React.FC<{ country: string; stats: any }> = ({
// //     //     country,
// //     //     stats,
// //     // }) => (
// //     //     <div className="rounded-lg border border-[#414042] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
// //     //         <div className="mb-4 flex items-center justify-between">
// //     //             <h4 className="m-0 text-xl font-extrabold text-[#5EA68E]">
// //     //                 <span
// //     //                     className="mr-2 inline-block h-3.5 w-3.5 rounded-full"
// //     //                     style={{ backgroundColor: getCountryColor(country) }}
// //     //                 />
// //     //                 <span className="text-[#414042]">
// //     //                     {country.toUpperCase()}
// //     //                 </span>
// //     //             </h4>
// //     //             <span className="rounded-full bg-[#5EA68E] px-2 py-0.5 text-sm font-semibold text-[#f8edcf]">
// //     //                 {productname} ({getTitle()})
// //     //             </span>
// //     //         </div>

// //     //         <div className="flex flex-col gap-4">
// //     //             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// //     //                 <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2">
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         Net Sales
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {formatCurrency(stats.totalSales)}
// //     //                     </p>
// //     //                 </div>
// //     //                 <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2">
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         Units
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {stats.totalUnits.toLocaleString()}
// //     //                     </p>
// //     //                 </div>
// //     //                 <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2">
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         CM1 Profit
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {formatCurrency(stats.totalProfit)}
// //     //                     </p>
// //     //                 </div>
// //     //                 <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2">
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         Avg. Monthly Sales
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {formatCurrency(stats.avgSales)}
// //     //                     </p>
// //     //                 </div>
// //     //                 <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2">
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         Avg. Selling Price
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {formatCurrency(stats.avgSellingPrice)}
// //     //                     </p>
// //     //                 </div>
// //     //                 <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2">
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         CM1 Profit (%)
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {stats.gross_margin_avg.toFixed(2)}%
// //     //                     </p>
// //     //                 </div>
// //     //             </div>

// //     //             <p className="m-0 font-bold">Best Performance Month</p>
// //     //             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// //     //                 <div
// //     //                     className="rounded-lg border border-gray-300 bg-gray-200/40 p-2"
// //     //                     style={{
// //     //                         borderTopWidth: 4,
// //     //                         borderTopColor: getCountryColor(country),
// //     //                     }}
// //     //                 >
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         Sales
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {stats.maxSalesMonth.month} {selectedYear}
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {formatCurrency(stats.maxSalesMonth.net_sales)}
// //     //                     </p>
// //     //                 </div>
// //     //                 <div
// //     //                     className="rounded-lg border border-gray-300 bg-gray-200/40 p-2"
// //     //                     style={{
// //     //                         borderTopWidth: 4,
// //     //                         borderTopColor: getCountryColor(country),
// //     //                     }}
// //     //                 >
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         Units
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {stats.maxUnitsMonth.month} {selectedYear}
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {stats.maxUnitsMonth.quantity.toLocaleString()}
// //     //                     </p>
// //     //                 </div>
// //     //                 <div
// //     //                     className="rounded-lg border border-gray-300 bg-gray-200/40 p-2"
// //     //                     style={{
// //     //                         borderTopWidth: 4,
// //     //                         borderTopColor: getCountryColor(country),
// //     //                     }}
// //     //                 >
// //     //                     <p className="mb-1 text-sm font-semibold text-[#414042]">
// //     //                         CM1 Profit
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {stats.maxSalesMonth.month} {selectedYear}
// //     //                     </p>
// //     //                     <p className="text-base">
// //     //                         {formatCurrency(stats.maxSalesMonth.profit)}
// //     //                     </p>
// //     //                 </div>
// //     //             </div>
// //     //         </div>
// //     //     </div>
// //     // );

// //     const GBP_TO_USD = 1.32;

// //     const CountryCard: React.FC<{ country: string; stats: any }> = ({
// //         country,
// //         stats,
// //     }) => (
// //         <div className="rounded-lg border border-[#414042] bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
// //             <div className="mb-4 flex items-center justify-between gap-2">
// //                 <h4 className="m-0 font-extrabold text-[#5EA68E] text-[clamp(14px,1.2vw,20px)] flex items-center gap-2">
// //                     <span
// //                         className="inline-block h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full"
// //                         style={{ backgroundColor: getCountryColor(country) }}
// //                     />
// //                     <span className="text-[#414042] text-[clamp(14px,1.1vw,18px)]">
// //                         {country.toUpperCase()}
// //                     </span>
// //                 </h4>
// //                 <span className="rounded-full bg-[#5EA68E] px-2 py-0.5 text-[clamp(10px,0.8vw,13px)] font-semibold text-[#f8edcf] whitespace-nowrap">
// //                     {productname} ({getTitle()})
// //                 </span>
// //             </div>

// //             <div className="flex flex-col gap-4">
// //                 {/* Stats grid */}
// //                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
// //                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             Net Sales
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {formatCurrencyByCountry(country, stats.totalSales)}
// //                         </p>
// //                     </div>
// //                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             Units
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {stats.totalUnits.toLocaleString()}
// //                         </p>
// //                     </div>
// //                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             CM1 Profit
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {formatCurrencyByCountry(country, stats.totalProfit)}
// //                         </p>
// //                     </div>

// //                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             Avg. Monthly Sales
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {formatCurrencyByCountry(country, stats.avgSales)}
// //                         </p>
// //                     </div>
// //                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             Avg. Selling Price
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {formatCurrencyByCountry(country, stats.avgSellingPrice)}
// //                         </p>
// //                     </div>
// //                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             CM1 Profit (%)
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {stats.gross_margin_avg.toFixed(2)}%
// //                         </p>
// //                     </div>
// //                 </div>

// //                 <p className="m-0 text-[clamp(13px,1vw,16px)] font-bold">
// //                     Best Performance Month
// //                 </p>

// //                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
// //                     {/* Sales */}
// //                     <div
// //                         className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
// //                         style={{
// //                             borderTopWidth: 4,
// //                             borderTopColor: getCountryColor(country),
// //                         }}
// //                     >
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             Sales
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {formatMonthYear(
// //                                 stats.maxSalesMonth.month,
// //                                 selectedYear
// //                             )}
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)]">
// //                             {formatCurrencyByCountry(country, stats.maxSalesMonth.net_sales)}
// //                         </p>
// //                     </div>

// //                     {/* Units */}
// //                     <div
// //                         className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
// //                         style={{
// //                             borderTopWidth: 4,
// //                             borderTopColor: getCountryColor(country),
// //                         }}
// //                     >
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             Units
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {formatMonthYear(
// //                                 stats.maxUnitsMonth.month,
// //                                 selectedYear
// //                             )}
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)]">
// //                             {stats.maxUnitsMonth.quantity.toLocaleString()}
// //                         </p>
// //                     </div>

// //                     {/* CM1 Profit */}
// //                     <div
// //                         className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
// //                         style={{
// //                             borderTopWidth: 4,
// //                             borderTopColor: getCountryColor(country),
// //                         }}
// //                     >
// //                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
// //                             CM1 Profit
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
// //                             {formatMonthYear(
// //                                 stats.maxSalesMonth.month,
// //                                 selectedYear
// //                             )}
// //                         </p>
// //                         <p className="text-[clamp(12px,0.95vw,16px)]">
// //                             {formatCurrencyByCountry(country, stats.maxSalesMonth.profit)}
// //                         </p>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );


// //     const globalCard = cards.find(
// //         (c) => c.country.toLowerCase() === "global"
// //     );
// //     const ukCard = cards.find((c) => c.country.toLowerCase() === "uk");
// //     const usCard = cards.find((c) => c.country.toLowerCase() === "us");

// //     return (
// //         <div className="w-full">
// //             {/* Header */}
// //             <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
// //                 <PageBreadcrumb
// //                     pageTitle="Performance Analysis"
// //                     variant="page"
// //                     align="left"
// //                     textSize="2xl"
// //                 />

// //                 {/* Search */}
// //                 <div className="relative min-w-[280px] w-full max-w-[320px]">
// //                     <div className="relative flex items-center">
// //                         <input
// //                             type="text"
// //                             placeholder="Search products..."
// //                             className="w-full rounded-lg border border-[#414042]/90 bg-white px-3 py-2 pl-7 text-base outline-none transition-colors focus:border-[#414042]"
// //                             value={searchQuery}
// //                             onChange={(e) => setSearchQuery(e.target.value)}
// //                             onFocus={() => {
// //                                 if (searchResults.length > 0)
// //                                     setShowSearchResults(true);
// //                             }}
// //                             onBlur={() =>
// //                                 setTimeout(
// //                                     () => setShowSearchResults(false),
// //                                     200
// //                                 )
// //                             }
// //                         />
// //                         <svg
// //                             className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#414042]/50"
// //                             viewBox="0 0 24 24"
// //                             fill="none"
// //                             stroke="currentColor"
// //                             strokeWidth="2"
// //                         >
// //                             <circle cx="11" cy="11" r="8"></circle>
// //                             <line
// //                                 x1="21"
// //                                 y1="21"
// //                                 x2="16.65"
// //                                 y2="16.65"
// //                             ></line>
// //                         </svg>
// //                         {searchLoading && (
// //                             <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
// //                         )}
// //                     </div>

// //                     {showSearchResults &&
// //                         searchResults.length > 0 && (
// //                             <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white">
// //                                 {searchResults.map((p, i) => (
// //                                     <button
// //                                         key={`${p.product_name}-${i}`}
// //                                         className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-50"
// //                                         onMouseDown={(e) => e.preventDefault()}
// //                                         onClick={() =>
// //                                             handleProductSelect(p)
// //                                         }
// //                                     >
// //                                         <div className="font-semibold text-gray-800">
// //                                             {p.product_name}
// //                                         </div>
// //                                     </button>
// //                                 ))}
// //                             </div>
// //                         )}

// //                     {showSearchResults &&
// //                         searchResults.length === 0 &&
// //                         searchQuery.trim() &&
// //                         !searchLoading && (
// //                             <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-gray-200 bg-white p-4 text-center text-gray-500">
// //                                 No products found for "{searchQuery}"
// //                             </div>
// //                         )}
// //                 </div>
// //             </div>

// //             {/* Filters – replaced by MonthYearPickerTable (no Fetch button) */}
// //             {/* Filters – using PeriodFiltersTable */}
// // <div className="mb-5">
// //   <div className="flex flex-col md:flex-row items-center justify-between gap-[0.5vw]">
// //     <PeriodFiltersTable
// //       range={range}
// //       selectedMonth={selectedMonth}
// //       selectedQuarter={`Q${selectedQuarter}`}   // internal "1" -> UI "Q1"
// //       selectedYear={selectedYear}
// //       yearOptions={years}
// //       onRangeChange={(v) => setRange(v)}
// //       onMonthChange={(val) => setSelectedMonth(val)}
// //       onQuarterChange={(val) => {
// //         // val is "Q1", "Q2", etc. → store "1","2","3","4"
// //         const num = val.replace("Q", "");
// //         setSelectedQuarter(num || "1");
// //       }}
// //       onYearChange={(val) => {
// //         setSelectedYear(Number(val) || initialYear);
// //       }}
// //     />
// //   </div>
// // </div>


// //             {/* Loading */}
// //             {loading && (
// //                 <div className="flex flex-col items-center justify-center py-12 text-center">
// //                     <video
// //                         src="/infinity2.webm"
// //                         autoPlay
// //                         loop
// //                         muted
// //                         playsInline
// //                         className="h-auto w-[150px] bg-transparent pointer-events-none"
// //                     />
// //                 </div>
// //             )}

// //             {/* Error */}
// //             {!!error && (
// //                 <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6">
// //                     <div className="flex items-center gap-3 text-red-700">
// //                         <span className="text-xl">❌</span>
// //                         <p className="m-0 font-medium">{error}</p>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* Results */}
// //             {data && !loading && (
// //                 <div className="flex flex-col">
// //                     {/* Chart Header */}
// //                     <div className="mb-3 w-full">
// //                         <div className="flex flex-wrap items-start justify-between gap-4">
// //                             <div>
// //                                 <h3 className="m-0 text-xl font-bold text-[#414042]">
// //                                     {currentIndex === 0
// //                                         ? "Net Sales Trend"
// //                                         : currentIndex === 1
// //                                             ? "Units Trend"
// //                                             : "CM1 Profit Trend"}{" "}
// //                                     -{" "}
// //                                     <b className="text-[#5ea68e]">
// //                                         {productname} ({getTitle()})
// //                                     </b>
// //                                 </h3>
// //                             </div>

// //                             <div className="flex flex-wrap items-center gap-3">
// //                                 {Object.entries(
// //                                     selectedCountries
// //                                 ).map(([country, isSelected]) => {
// //                                     const color =
// //                                         getCountryColor(country);
// //                                     return (
// //                                         <label
// //                                             key={country}
// //                                             className="flex cursor-pointer select-none items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-gray-900"
// //                                         >
// //                                             <input
// //                                                 type="checkbox"
// //                                                 className="peer h-3 w-3 appearance-none rounded-sm"
// //                                                 checked={isSelected}
// //                                                 onChange={() =>
// //                                                     handleCountryChange(
// //                                                         country
// //                                                     )
// //                                                 }
// //                                                 style={{
// //                                                     backgroundColor:
// //                                                         color,
// //                                                     borderColor:
// //                                                         color,
// //                                                 }}
// //                                             />
// //                                             <span
// //                                                 className="underline decoration-1 underline-offset-[2px]"
// //                                                 style={{
// //                                                     color: color,
// //                                                 }}
// //                                             >
// //                                                 {country.toUpperCase()}
// //                                             </span>
// //                                         </label>
// //                                     );
// //                                 })}
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Chart */}
// //                     <div className="flex h-[40vw] items-center justify-between">
// //                         {chartDataList ? (
// //                             <>
// //                                 <button
// //                                     className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
// //                                     onClick={handlePrev}
// //                                     aria-label="Previous chart"
// //                                 >
// //                                     <svg
// //                                         xmlns="http://www.w3.org/2000/svg"
// //                                         viewBox="0 0 24 24"
// //                                         fill="currentColor"
// //                                         className="h-4 w-4"
// //                                     >
// //                                         <path
// //                                             fillRule="evenodd"
// //                                             d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z"
// //                                             clipRule="evenodd"
// //                                         />
// //                                     </svg>
// //                                 </button>

// //                                 {chartDataList[currentIndex] ? (
// //                                     <div className="mx-2 w-full">
// //                                         <Line
// //                                             data={
// //                                                 chartDataList[
// //                                                 currentIndex
// //                                                 ] as any
// //                                             }
// //                                             options={
// //                                                 chartOptions as any
// //                                             }
// //                                         />
// //                                     </div>
// //                                 ) : (
// //                                     <p className="mx-auto">
// //                                         No chart data available.
// //                                     </p>
// //                                 )}

// //                                 <button
// //                                     className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
// //                                     onClick={handleNext}
// //                                     aria-label="Next chart"
// //                                 >
// //                                     <svg
// //                                         xmlns="http://www.w3.org/2000/svg"
// //                                         viewBox="0 0 24 24"
// //                                         fill="currentColor"
// //                                         className="h-4 w-4"
// //                                     >
// //                                         <path
// //                                             fillRule="evenodd"
// //                                             d="M8.22 19.78a.75.75 0 010-1.06L14.94 12 8.22 5.28a.75.75 0 111.06-1.06l7.25 7.25a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0z"
// //                                             clipRule="evenodd"
// //                                         />
// //                                     </svg>
// //                                 </button>
// //                             </>
// //                         ) : (
// //                             <p>No chart data available</p>
// //                         )}
// //                     </div>

// //                     {/* Dots */}
// //                     <div className="mt-3 flex items-center justify-center gap-2">
// //                         {[0, 1, 2].map((idx) => (
// //                             <span
// //                                 key={idx}
// //                                 className={`h-2 w-2 rounded-full border ${currentIndex === idx
// //                                     ? "border-gray-300 bg-gray-300"
// //                                     : "border-[#414042] bg-white"
// //                                     }`}
// //                             />
// //                         ))}
// //                     </div>

// //                     {/* Summary Cards */}
// //                     {/* <div className="mt-8 space-y-5">
// //                         {globalCard && selectedCountries["global"] && (
// //                             <div className="grid grid-cols-1">
// //                                 <CountryCard
// //                                     country={globalCard.country}
// //                                     stats={globalCard.stats}
// //                                 />
// //                             </div>
// //                         )}

// //                         {(ukCard || usCard) && (
// //                             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
// //                                 {ukCard && selectedCountries["uk"] && (
// //                                     <CountryCard
// //                                         country={ukCard.country}
// //                                         stats={ukCard.stats}
// //                                     />
// //                                 )}
// //                                 {usCard && selectedCountries["us"] && (
// //                                     <CountryCard
// //                                         country={usCard.country}
// //                                         stats={usCard.stats}
// //                                     />
// //                                 )}
// //                             </div>
// //                         )}
// //                     </div> */}

// //                     {/* Summary Cards – Global, UK, US in one row (on md+) */}
// //                     <div className="mt-8">
// //                         <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
// //                             {globalCard && selectedCountries["global"] && (
// //                                 <CountryCard
// //                                     country={globalCard.country}
// //                                     stats={globalCard.stats}
// //                                 />
// //                             )}
// //                             {ukCard && selectedCountries["uk"] && (
// //                                 <CountryCard country={ukCard.country} stats={ukCard.stats} />
// //                             )}
// //                             {usCard && selectedCountries["us"] && (
// //                                 <CountryCard country={usCard.country} stats={usCard.stats} />
// //                             )}
// //                         </div>
// //                     </div>

// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default ProductwisePerformance;


















































// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import dynamic from "next/dynamic";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title as ChartTitle,
//     Tooltip,
//     Legend,
//     Filler,
// } from "chart.js";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import PeriodFiltersTable from "@/components/filters/PeriodFiltersTable";

// const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
//     ssr: false,
// });

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     ChartTitle,
//     Tooltip,
//     Legend,
//     Filler
// );

// type CountryKey = "uk" | "us" | "global" | string;
// type Range = "monthly" | "quarterly" | "yearly";

// type MonthDatum = {
//     month: string;
//     net_sales: number;
//     quantity: number;
//     profit: number;
// };

// type APIResponse = {
//     success: boolean;
//     message?: string;
//     data: Record<CountryKey, MonthDatum[]>;
// };

// interface ProductwisePerformanceProps {
//     productname?: string;
// }

// // ----------------------
// // Slug helper functions
// // ----------------------
// const toSlug = (name: string) =>
//     name
//         .trim()
//         .toLowerCase()
//         .replace(/\s*\+\s*/g, " plus ")
//         .replace(/\s+/g, "-"); // spaces → dashes

// const fromSlug = (slug: string) =>
//     slug
//         .replace(/-/g, " ")
//         .replace(/\bplus\b/gi, "+")
//         .replace(/\s+/g, " ")
//         .trim();

// const ProductwisePerformance: React.FC<ProductwisePerformanceProps> = ({
//     productname: propProductName,
// }) => {
//     const params = useParams();
//     const router = useRouter();

//     const rawSlug = params?.productname as string | undefined;
//     const urlProductName = rawSlug ? fromSlug(rawSlug) : undefined;

//     const countryName = (params?.countryName as string) || undefined;
//     const monthParam = (params?.month as string) || undefined;
//     const yearParam = (params?.year as string) || undefined;

//     const productname = propProductName || urlProductName || "Menthol";

//     const [data, setData] = useState<APIResponse | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string>("");

//     const authToken =
//         typeof window !== "undefined"
//             ? localStorage.getItem("jwtToken")
//             : null;

//     const getCurrencySymbol = (country?: string) => {
//         if (!country) return "¤";
//         switch (country.toLowerCase()) {
//             case "uk":
//                 return "£";
//             case "india":
//                 return "₹";
//             case "us":
//                 return "$";
//             case "europe":
//             case "eu":
//                 return "€";
//             case "global":
//                 return "$";
//             default:
//                 return "¤";
//         }
//     };

//     const currencySymbol = countryName ? getCurrencySymbol(countryName) : "¤";

//     // -------------------------
//     // Search State
//     // -------------------------
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState<
//         { product_name: string }[]
//     >([]);
//     const [showSearchResults, setShowSearchResults] = useState(false);
//     const [searchLoading, setSearchLoading] = useState(false);

//     // -------------------------
//     // Controls State
//     // -------------------------
//     const [range, setRange] = useState<Range>("yearly");

//     const initialYear = useMemo(() => new Date().getFullYear(), []);
//     const [selectedYear, setSelectedYear] = useState<number>(
//         yearParam ? Number(yearParam) : initialYear
//     );

//     const [selectedMonth, setSelectedMonth] = useState<string>(monthParam || "");
//     const [selectedQuarter, setSelectedQuarter] = useState("1"); // "1" | "2" | "3" | "4"

//     const [selectedCountries, setSelectedCountries] = useState<
//         Record<CountryKey, boolean>
//     >({
//         uk: true,
//         us: true,
//         global: true,
//     });

//     const years = useMemo(
//         () =>
//             Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i),
//         []
//     );

//     const handleCountryChange = (country: CountryKey) => {
//         setSelectedCountries((prev) => ({
//             ...prev,
//             [country]: !prev[country],
//         }));
//     };

//     // -------------------------
//     // Search function (debounced)
//     // -------------------------
//     useEffect(() => {
//         const timeoutId = setTimeout(async () => {
//             if (!searchQuery.trim()) {
//                 setSearchResults([]);
//                 setShowSearchResults(false);
//                 return;
//             }
//             setSearchLoading(true);
//             try {
//                 const res = await fetch(
//                     `http://localhost:5000/Product_search?query=${encodeURIComponent(
//                         searchQuery
//                     )}`,
//                     {
//                         method: "GET",
//                         headers: {
//                             Authorization: `Bearer ${authToken ?? ""}`,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );
//                 if (!res.ok)
//                     throw new Error(`HTTP error! status: ${res.status}`);
//                 const json = await res.json();
//                 setSearchResults(json.products || []);
//                 setShowSearchResults(true);
//             } catch (e) {
//                 console.error("Search error:", e);
//                 setSearchResults([]);
//                 setShowSearchResults(false);
//             } finally {
//                 setSearchLoading(false);
//             }
//         }, 300);

//         return () => clearTimeout(timeoutId);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [searchQuery]);

//     const handleProductSelect = (product: { product_name: string }) => {
//         const base = "/productwiseperformance";
//         const slug = toSlug(product.product_name);

//         const to = `${base}/${slug}/${countryName ?? ""}/${selectedMonth ?? ""}/${selectedYear ?? ""
//             }`;
//         router.push(to);
//     };

//     // -------------------------
//     // Fetch Product Data
//     // -------------------------
//     const fetchProductData = async () => {
//         setLoading(true);
//         setError("");
//         try {
//             const countries = Object.keys(selectedCountries).filter(
//                 (k) => selectedCountries[k]
//             );

//             // Map UI "monthly|quarterly|yearly" to backend format
//             const backendTimeRange =
//                 range === "yearly"
//                     ? "Yearly"
//                     : range === "quarterly"
//                         ? "Quarterly"
//                         : "Monthly";

//             const payload: any = {
//                 product_name: productname,
//                 time_range: backendTimeRange,
//                 year: selectedYear,
//                 countries,
//             };

//             if (range === "quarterly") {
//                 payload.quarter = selectedQuarter; // "1" | "2" | "3" | "4"
//             }

//             if (range === "monthly") {
//                 payload.month = selectedMonth; // e.g. "january"
//             }

//             const res = await fetch(
//                 "http://localhost:5000/ProductwisePerformance",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${authToken ?? ""}`,
//                     },
//                     body: JSON.stringify(payload),
//                 }
//             );

//             const json: APIResponse | any = await res
//                 .json()
//                 .catch(() => null);

//             if (!res.ok || !json?.success) {
//                 const errMsg =
//                     (json && (json.error || json.message)) ||
//                     `HTTP error! status: ${res.status}`;
//                 throw new Error(errMsg);
//             }

//             setData(json as APIResponse);
//         } catch (e: any) {
//             console.error("API Error:", e);
//             setError(e?.message || "Failed to fetch data from server");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 🔁 Auto-fetch when key controls change (no Fetch button)
//     useEffect(() => {
//         fetchProductData();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [
//         productname,
//         selectedYear,
//         range,
//         selectedQuarter,
//         selectedMonth,
//         selectedCountries,
//     ]);

//     // -------------------------
//     // Helpers for Chart Data
//     // -------------------------
//     const monthOrder = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//     ];

//     const prepareProfitData = () => {
//         if (!data?.data) return [] as any[];

//         const allMonths = new Set<string>();
//         Object.values(data.data).forEach((countryData) => {
//             countryData.forEach((m) => allMonths.add(m.month));
//         });

//         const sortedMonths = Array.from(allMonths).sort(
//             (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
//         );

//         const profitData: any[] = [];
//         sortedMonths.forEach((m) => {
//             const point: Record<string, any> = { month: m };
//             Object.entries(data.data).forEach(([country, cd]) => {
//                 const md = cd.find((d) => d.month === m);
//                 point[country] = md ? md.profit : 0;
//             });
//             profitData.push(point);
//         });

//         return profitData;
//     };

//     const prepareChartData = () => {
//         if (!data?.data)
//             return { netSalesData: [] as any[], quantityData: [] as any[] };

//         const allMonths = new Set<string>();
//         Object.values(data.data).forEach((countryData) => {
//             countryData.forEach((m) => allMonths.add(m.month));
//         });

//         const sortedMonths = Array.from(allMonths).sort(
//             (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
//         );

//         const netSalesData: any[] = [];
//         const quantityData: any[] = [];

//         sortedMonths.forEach((m) => {
//             const netSalesPoint: Record<string, any> = { month: m };
//             const quantityPoint: Record<string, any> = { month: m };

//             Object.entries(data.data).forEach(([country, cd]) => {
//                 const md = cd.find((d) => d.month === m);
//                 netSalesPoint[country] = md ? md.net_sales : 0;
//                 quantityPoint[country] = md ? md.quantity : 0;
//             });

//             netSalesData.push(netSalesPoint);
//             quantityData.push(quantityPoint);
//         });

//         return { netSalesData, quantityData };
//     };

//     const getCountryColor = (country: CountryKey) => {
//         const colors: Record<string, string> = {
//             uk: "#AB64B5",
//             us: "#87AD12",
//             global: "#F47A00",
//         };
//         return colors[country] || "#ff7c7c";
//     };

//     const formatCurrencyByCountry = (country: string, value: number) => {
//         const lower = country.toLowerCase();

//         if (lower === "uk") {
//             // Pounds for UK
//             return new Intl.NumberFormat("en-GB", {
//                 style: "currency",
//                 currency: "GBP",
//                 minimumFractionDigits: 0,
//                 maximumFractionDigits: 0,
//             }).format(value);
//         }

//         // Global, US, and others -> show in USD
//         return new Intl.NumberFormat("en-US", {
//             style: "currency",
//             currency: "USD",
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//         }).format(value);
//     };

//     const buildChartJSData = () => {
//         const { netSalesData, quantityData } = prepareChartData();
//         const profitData = prepareProfitData();

//         const buildChart = (rawData: any[], labelSuffix: string) => {
//             if (!rawData || rawData.length === 0) return null;
//             const labels = rawData.map((i) => i.month);
//             const datasets = Object.keys(selectedCountries)
//                 .filter((country) => selectedCountries[country])
//                 .map((country) => ({
//                     label: `${country.toUpperCase()} ${labelSuffix}`,
//                     data: rawData.map((item) => item[country] || 0),
//                     borderColor: getCountryColor(country),
//                     backgroundColor: getCountryColor(country),
//                     tension: 0.1,
//                     pointRadius: 3,
//                     fill: false,
//                 }));
//             return { labels, datasets };
//         };

//         const charts = [
//             buildChart(netSalesData, "Net Sales"),
//             buildChart(quantityData, "Quantity"),
//             buildChart(profitData, "Profit"),
//         ];

//         return charts;
//     };

//     const chartDataList = buildChartJSData();

//     const chartOptions = {
//         responsive: true,
//         plugins: {
//             legend: { display: false },
//             tooltip: {
//                 callbacks: {
//                     label: (context: any) => {
//                         const value = context.parsed.y as number;
//                         const datasetLabel = context.dataset.label as string;
//                         const parts = datasetLabel.split(" ");
//                         const countryCode = parts[0]; // e.g. "UK", "US", "GLOBAL"
//                         const metricPart = (parts.slice(1).join(" ") || "").toLowerCase();

//                         // For quantity / units, show plain number
//                         if (metricPart.includes("quantity") || metricPart.includes("units")) {
//                             return `${datasetLabel}: ${value}`;
//                         }

//                         // For money, pick currency by country
//                         return `${datasetLabel}: ${formatCurrencyByCountry(
//                             countryCode,
//                             value
//                         )}`;
//                     },
//                 },
//             },
//         },
//         scales: {
//             x: { title: { display: true, text: "Month" } },
//             y: {
//                 title: { display: true, text: `Amount (${currencySymbol})` },
//                 min: 0,
//                 ticks: { padding: 0 },
//             },
//         },
//     } as const;

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const handlePrev = () =>
//         setCurrentIndex((i) =>
//             i === 0 ? chartDataList.length - 1 : i - 1
//         );
//     const handleNext = () =>
//         setCurrentIndex((i) =>
//             i === chartDataList.length - 1 ? 0 : i + 1
//         );

//     const yearShort = selectedYear.toString().slice(-2);
//     const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

//     const getTitle = () => {
//         if (range === "yearly") return `Year'${yearShort}`;
//         if (range === "quarterly") return `Q${selectedQuarter}'${yearShort}`;

//         // monthly
//         return selectedMonth
//             ? `${cap(selectedMonth)}'${yearShort}`
//             : `Year'${yearShort}`;
//     };

//     // -------------------------
//     // Derived values for cards
//     // -------------------------
//     const cards = useMemo(() => {
//         if (!data?.data) return [] as { country: string; stats: any }[];

//         const GBP_TO_USD = 1.27; // 🔹 You can adjust or fetch dynamically

//         return Object.entries(data.data).map(([country, countryData]) => {
//             let processedData = countryData;

//             // GLOBAL REBUILD: Convert UK → USD, combine with US
//             if (country.toLowerCase() === "global") {
//                 processedData = monthOrder.map((month) => {
//                     const uk = data.data.uk?.find((m) => m.month === month);
//                     const us = data.data.us?.find((m) => m.month === month);

//                     return {
//                         month,
//                         net_sales:
//                             (uk?.net_sales || 0) * GBP_TO_USD +
//                             (us?.net_sales || 0),
//                         profit:
//                             (uk?.profit || 0) * GBP_TO_USD +
//                             (us?.profit || 0),
//                         quantity: (uk?.quantity || 0) + (us?.quantity || 0),
//                     };
//                 });
//             }

//             const totalSales = processedData.reduce(
//                 (s, m) => s + m.net_sales,
//                 0
//             );
//             const totalProfit = processedData.reduce(
//                 (s, m) => s + m.profit,
//                 0
//             );
//             const totalUnits = processedData.reduce(
//                 (s, m) => s + m.quantity,
//                 0
//             );

//             const gross_margin_avg =
//                 totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

//             const monthsWithSales = processedData.filter(
//                 (m) => m.net_sales > 0
//             );

//             const avgSales =
//                 monthsWithSales.length > 0
//                     ? totalSales / monthsWithSales.length
//                     : 0;

//             const avgSellingPrice =
//                 totalUnits > 0 ? totalSales / totalUnits : 0;

//             const avgMonthlyProfit =
//                 processedData.length > 0
//                     ? totalProfit / processedData.length
//                     : 0;

//             const maxSalesMonth = processedData.reduce((max, m) =>
//                 m.net_sales > max.net_sales ? m : max
//             );

//             const maxUnitsMonth = processedData.reduce((max, m) =>
//                 m.quantity > max.quantity ? m : max
//             );

//             return {
//                 country,
//                 stats: {
//                     totalSales,
//                     totalProfit,
//                     totalUnits,
//                     gross_margin_avg,
//                     avgSales,
//                     avgSellingPrice,
//                     avgMonthlyProfit,
//                     maxSalesMonth,
//                     maxUnitsMonth,
//                 },
//             };
//         });
//     }, [data, monthOrder]);

//     const formatMonthYear = (monthName: string, year: number | string) => {
//         const MONTH_ABBRS = [
//             "Jan",
//             "Feb",
//             "Mar",
//             "Apr",
//             "May",
//             "Jun",
//             "Jul",
//             "Aug",
//             "Sep",
//             "Oct",
//             "Nov",
//             "Dec",
//         ];

//         if (!monthName) return "";

//         const idx = MONTH_ABBRS.findIndex(
//             (_, i) =>
//                 monthName.toLowerCase().startsWith(
//                     [
//                         "january",
//                         "february",
//                         "march",
//                         "april",
//                         "may",
//                         "june",
//                         "july",
//                         "august",
//                         "september",
//                         "october",
//                         "november",
//                         "december",
//                     ][i].slice(0, 3)
//                 ) ||
//                 monthName.toLowerCase() ===
//                 [
//                     "january",
//                     "february",
//                     "march",
//                     "april",
//                     "may",
//                     "june",
//                     "july",
//                     "august",
//                     "september",
//                     "october",
//                     "november",
//                     "december",
//                 ][i]
//         );

//         const abbr =
//             idx >= 0 ? MONTH_ABBRS[idx] : monthName.slice(0, 3) || monthName;
//         const y = String(year);
//         const shortYear = y.slice(-2);
//         return `${abbr}'${shortYear}`;
//     };

//     const CountryCard: React.FC<{ country: string; stats: any }> = ({
//         country,
//         stats,
//     }) => (
//         <div className="rounded-lg border border-[#414042] bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
//             <div className="mb-4 flex items-center justify-between gap-2">
//                 <h4 className="m-0 font-extrabold text-[#5EA68E] text-[clamp(14px,1.2vw,20px)] flex items-center gap-2">
//                     <span
//                         className="inline-block h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full"
//                         style={{ backgroundColor: getCountryColor(country) }}
//                     />
//                     <span className="text-[#414042] text-[clamp(14px,1.1vw,18px)]">
//                         {country.toUpperCase()}
//                     </span>
//                 </h4>
//                 <span className="rounded-full bg-[#5EA68E] px-2 py-0.5 text-[clamp(10px,0.8vw,13px)] font-semibold text-[#f8edcf] whitespace-nowrap">
//                     {productname} ({getTitle()})
//                 </span>
//             </div>

//             <div className="flex flex-col gap-4">
//                 {/* Stats grid */}
//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             Net Sales
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {formatCurrencyByCountry(
//                                 country,
//                                 stats.totalSales
//                             )}
//                         </p>
//                     </div>
//                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             Units
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {stats.totalUnits.toLocaleString()}
//                         </p>
//                     </div>
//                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             CM1 Profit
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {formatCurrencyByCountry(
//                                 country,
//                                 stats.totalProfit
//                             )}
//                         </p>
//                     </div>

//                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             Avg. Monthly Sales
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {formatCurrencyByCountry(
//                                 country,
//                                 stats.avgSales
//                             )}
//                         </p>
//                     </div>
//                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             Avg. Selling Price
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {formatCurrencyByCountry(
//                                 country,
//                                 stats.avgSellingPrice
//                             )}
//                         </p>
//                     </div>
//                     <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             CM1 Profit (%)
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {stats.gross_margin_avg.toFixed(2)}%
//                         </p>
//                     </div>
//                 </div>

//                 <p className="m-0 text-[clamp(13px,1vw,16px)] font-bold">
//                     Best Performance Month
//                 </p>

//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//                     {/* Sales */}
//                     <div
//                         className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
//                         style={{
//                             borderTopWidth: 4,
//                             borderTopColor: getCountryColor(country),
//                         }}
//                     >
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             Sales
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {formatMonthYear(
//                                 stats.maxSalesMonth.month,
//                                 selectedYear
//                             )}
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)]">
//                             {formatCurrencyByCountry(
//                                 country,
//                                 stats.maxSalesMonth.net_sales
//                             )}
//                         </p>
//                     </div>

//                     {/* Units */}
//                     <div
//                         className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
//                         style={{
//                             borderTopWidth: 4,
//                             borderTopColor: getCountryColor(country),
//                         }}
//                     >
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             Units
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {formatMonthYear(
//                                 stats.maxUnitsMonth.month,
//                                 selectedYear
//                             )}
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)]">
//                             {stats.maxUnitsMonth.quantity.toLocaleString()}
//                         </p>
//                     </div>

//                     {/* CM1 Profit */}
//                     <div
//                         className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
//                         style={{
//                             borderTopWidth: 4,
//                             borderTopColor: getCountryColor(country),
//                         }}
//                     >
//                         <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
//                             CM1 Profit
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
//                             {formatMonthYear(
//                                 stats.maxSalesMonth.month,
//                                 selectedYear
//                             )}
//                         </p>
//                         <p className="text-[clamp(12px,0.95vw,16px)]">
//                             {formatCurrencyByCountry(
//                                 country,
//                                 stats.maxSalesMonth.profit
//                             )}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     const globalCard = cards.find(
//         (c) => c.country.toLowerCase() === "global"
//     );
//     const ukCard = cards.find((c) => c.country.toLowerCase() === "uk");
//     const usCard = cards.find((c) => c.country.toLowerCase() === "us");

//     return (
//         <div className="w-full">
//             {/* Header */}
//             <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
//                 <PageBreadcrumb
//                     pageTitle="Performance Analysis"
//                     variant="page"
//                     align="left"
//                     textSize="2xl"
//                 />

//                 {/* Search */}
//                 <div className="relative min-w-[280px] w-full max-w-[320px]">
//                     <div className="relative flex items-center">
//                         <input
//                             type="text"
//                             placeholder="Search products..."
//                             className="w-full rounded-lg border border-[#414042]/90 bg-white px-3 py-2 pl-7 text-base outline-none transition-colors focus:border-[#414042]"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             onFocus={() => {
//                                 if (searchResults.length > 0)
//                                     setShowSearchResults(true);
//                             }}
//                             onBlur={() =>
//                                 setTimeout(
//                                     () => setShowSearchResults(false),
//                                     200
//                                 )
//                             }
//                         />
//                         <svg
//                             className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#414042]/50"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                         >
//                             <circle cx="11" cy="11" r="8"></circle>
//                             <line
//                                 x1="21"
//                                 y1="21"
//                                 x2="16.65"
//                                 y2="16.65"
//                             ></line>
//                         </svg>
//                         {searchLoading && (
//                             <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
//                         )}
//                     </div>

//                     {showSearchResults &&
//                         searchResults.length > 0 && (
//                             <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white">
//                                 {searchResults.map((p, i) => (
//                                     <button
//                                         key={`${p.product_name}-${i}`}
//                                         className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-50"
//                                         onMouseDown={(e) => e.preventDefault()}
//                                         onClick={() =>
//                                             handleProductSelect(p)
//                                         }
//                                     >
//                                         <div className="font-semibold text-gray-800">
//                                             {p.product_name}
//                                         </div>
//                                     </button>
//                                 ))}
//                             </div>
//                         )}

//                     {showSearchResults &&
//                         searchResults.length === 0 &&
//                         searchQuery.trim() &&
//                         !searchLoading && (
//                             <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-gray-200 bg-white p-4 text-center text-gray-500">
//                                 No products found for "{searchQuery}"
//                             </div>
//                         )}
//                 </div>
//             </div>

//             {/* Filters – using PeriodFiltersTable */}
//             <div className="mb-5">
//                 <div className="flex flex-col md:flex-row items-center justify-between gap-[0.5vw]">
//                     <PeriodFiltersTable
//                         range={range}
//                         selectedMonth={selectedMonth}
//                         selectedQuarter={`Q${selectedQuarter}`} // internal "1" -> UI "Q1"
//                         selectedYear={selectedYear}
//                         yearOptions={years}
//                         onRangeChange={(v) => setRange(v)}
//                         onMonthChange={(val) => setSelectedMonth(val)}
//                         onQuarterChange={(val) => {
//                             // val is "Q1", "Q2", etc. → store "1","2","3","4"
//                             const num = val.replace("Q", "");
//                             setSelectedQuarter(num || "1");
//                         }}
//                         onYearChange={(val) => {
//                             setSelectedYear(Number(val) || initialYear);
//                         }}
//                     />
//                 </div>
//             </div>

//             {/* Loading */}
//             {loading && (
//                 <div className="flex flex-col items-center justify-center py-12 text-center">
//                     <video
//                         src="/infinity2.webm"
//                         autoPlay
//                         loop
//                         muted
//                         playsInline
//                         className="h-auto w-[150px] bg-transparent pointer-events-none"
//                     />
//                 </div>
//             )}

//             {/* Error */}
//             {!!error && (
//                 <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6">
//                     <div className="flex items-center gap-3 text-red-700">
//                         <span className="text-xl">❌</span>
//                         <p className="m-0 font-medium">{error}</p>
//                     </div>
//                 </div>
//             )}

//             {/* Results */}
//             {data && !loading && (
//                 <div className="flex flex-col">
//                     {/* Chart Header */}
//                     <div className="mb-3 w-full">
//                         <div className="flex flex-wrap items-start justify-between gap-4">
//                             <div>
//                                 <h3 className="m-0 text-xl font-bold text-[#414042]">
//                                     {currentIndex === 0
//                                         ? "Net Sales Trend"
//                                         : currentIndex === 1
//                                             ? "Units Trend"
//                                             : "CM1 Profit Trend"}{" "}
//                                     -{" "}
//                                     <b className="text-[#5ea68e]">
//                                         {productname} ({getTitle()})
//                                     </b>
//                                 </h3>
//                             </div>

//                             <div className="flex flex-wrap items-center gap-3">
//                                 {Object.entries(selectedCountries).map(
//                                     ([country, isSelected]) => {
//                                         const color =
//                                             getCountryColor(country);
//                                         return (
//                                             <label
//                                                 key={country}
//                                                 className="flex cursor-pointer select-none items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-gray-900"
//                                             >
//                                                 <input
//                                                     type="checkbox"
//                                                     className="peer h-3 w-3 appearance-none rounded-sm"
//                                                     checked={isSelected}
//                                                     onChange={() =>
//                                                         handleCountryChange(
//                                                             country
//                                                         )
//                                                     }
//                                                     style={{
//                                                         backgroundColor: color,
//                                                         borderColor: color,
//                                                     }}
//                                                 />
//                                                 <span
//                                                     className="underline decoration-1 underline-offset-[2px]"
//                                                     style={{
//                                                         color: color,
//                                                     }}
//                                                 >
//                                                     {country.toUpperCase()}
//                                                 </span>
//                                             </label>
//                                         );
//                                     }
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Chart */}
//                     <div className="flex h-[40vw] items-center justify-between">
//                         {chartDataList ? (
//                             <>
//                                 <button
//                                     className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
//                                     onClick={handlePrev}
//                                     aria-label="Previous chart"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="currentColor"
//                                         className="h-4 w-4"
//                                     >
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>
//                                 </button>

//                                 {chartDataList[currentIndex] ? (
//                                     <div className="mx-2 w-full">
//                                         <Line
//                                             data={
//                                                 chartDataList[
//                                                 currentIndex
//                                                 ] as any
//                                             }
//                                             options={chartOptions as any}
//                                         />
//                                     </div>
//                                 ) : (
//                                     <p className="mx-auto">
//                                         No chart data available.
//                                     </p>
//                                 )}

//                                 <button
//                                     className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
//                                     onClick={handleNext}
//                                     aria-label="Next chart"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="currentColor"
//                                         className="h-4 w-4"
//                                     >
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M8.22 19.78a.75.75 0 010-1.06L14.94 12 8.22 5.28a.75.75 0 111.06-1.06l7.25 7.25a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>
//                                 </button>
//                             </>
//                         ) : (
//                             <p>No chart data available</p>
//                         )}
//                     </div>

//                     {/* Dots */}
//                     <div className="mt-3 flex items-center justify-center gap-2">
//                         {[0, 1, 2].map((idx) => (
//                             <span
//                                 key={idx}
//                                 className={`h-2 w-2 rounded-full border ${currentIndex === idx
//                                     ? "border-gray-300 bg-gray-300"
//                                     : "border-[#414042] bg-white"
//                                     }`}
//                             />
//                         ))}
//                     </div>

//                     {/* Summary Cards – Global, UK, US in one row (on md+) */}
//                     <div className="mt-8">
//                         <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//                             {globalCard && selectedCountries["global"] && (
//                                 <CountryCard
//                                     country={globalCard.country}
//                                     stats={globalCard.stats}
//                                 />
//                             )}
//                             {ukCard && selectedCountries["uk"] && (
//                                 <CountryCard
//                                     country={ukCard.country}
//                                     stats={ukCard.stats}
//                                 />
//                             )}
//                             {usCard && selectedCountries["us"] && (
//                                 <CountryCard
//                                     country={usCard.country}
//                                     stats={usCard.stats}
//                                 />
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProductwisePerformance;





















"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PeriodFiltersTable from "@/components/filters/PeriodFiltersTable";

const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
    ssr: false,
});

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartTitle,
    Tooltip,
    Legend,
    Filler
);

type CountryKey = "uk" | "us" | "global" | string;
type Range = "monthly" | "quarterly" | "yearly";

type MonthDatum = {
    month: string;
    net_sales: number;
    quantity: number;
    profit: number;
};

type APIResponse = {
    success: boolean;
    message?: string;
    data: Record<CountryKey, MonthDatum[]>;
};

interface ProductwisePerformanceProps {
    productname?: string;
}

// ----------------------
// Slug helper functions
// ----------------------
const toSlug = (name: string) =>
    name
        .trim()
        .toLowerCase()
        .replace(/\s*\+\s*/g, " plus ")
        .replace(/\s+/g, "-");

const fromSlug = (slug: string) =>
    slug
        .replace(/-/g, " ")
        .replace(/\bplus\b/gi, "+")
        .replace(/\s+/g, " ")
        .trim();

// ----------------------
// Currency helpers
// ----------------------
const GBP_TO_USD_RATE = 1.27;

const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

const ProductwisePerformance: React.FC<ProductwisePerformanceProps> = ({
    productname: propProductName,
}) => {
    const params = useParams();
    const router = useRouter();

    const rawSlug = params?.productname as string | undefined;
    const urlProductName = rawSlug ? fromSlug(rawSlug) : undefined;

    const countryName = (params?.countryName as string) || undefined;
    const monthParam = (params?.month as string) || undefined;
    const yearParam = (params?.year as string) || undefined;

    const productname = propProductName || urlProductName || "Menthol";

    const [data, setData] = useState<APIResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const authToken =
        typeof window !== "undefined"
            ? localStorage.getItem("jwtToken")
            : null;

    const getCurrencySymbol = (country?: string) => {
        if (!country) return "¤";
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

    // kept in case you use it elsewhere later
    const currencySymbol = countryName ? getCurrencySymbol(countryName) : "¤";

    // -------------------------
    // Search State
    // -------------------------
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<
        { product_name: string }[]
    >([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    // -------------------------
    // Controls State
    // -------------------------
    const [range, setRange] = useState<Range>("yearly");

    const initialYear = useMemo(() => new Date().getFullYear(), []);
    const [selectedYear, setSelectedYear] = useState<number>(
        yearParam ? Number(yearParam) : initialYear
    );

    const [selectedMonth, setSelectedMonth] = useState<string>(monthParam || "");
    const [selectedQuarter, setSelectedQuarter] = useState("1"); // "1" | "2" | "3" | "4"

    const [selectedCountries, setSelectedCountries] = useState<
        Record<CountryKey, boolean>
    >({
        uk: true,
        us: true,
        global: true,
    });

    const years = useMemo(
        () =>
            Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i),
        []
    );

    const handleCountryChange = (country: CountryKey) => {
        setSelectedCountries((prev) => ({
            ...prev,
            [country]: !prev[country],
        }));
    };

    // -------------------------
    // Search function (debounced)
// -------------------------
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                setShowSearchResults(false);
                return;
            }
            setSearchLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:5000/Product_search?query=${encodeURIComponent(
                        searchQuery
                    )}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${authToken ?? ""}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!res.ok)
                    throw new Error(`HTTP error! status: ${res.status}`);
                const json = await res.json();
                setSearchResults(json.products || []);
                setShowSearchResults(true);
            } catch (e) {
                console.error("Search error:", e);
                setSearchResults([]);
                setShowSearchResults(false);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const handleProductSelect = (product: { product_name: string }) => {
        const base = "/productwiseperformance";
        const slug = toSlug(product.product_name);

        const to = `${base}/${slug}/${countryName ?? ""}/${selectedMonth ?? ""}/${selectedYear ?? ""
            }`;
        router.push(to);
    };

    // -------------------------
    // Fetch Product Data
    // -------------------------
    const fetchProductData = async () => {
        setLoading(true);
        setError("");
        try {
            const countries = Object.keys(selectedCountries).filter(
                (k) => selectedCountries[k]
            );

            const backendTimeRange =
                range === "yearly"
                    ? "Yearly"
                    : range === "quarterly"
                        ? "Quarterly"
                        : "Monthly";

            const payload: any = {
                product_name: productname,
                time_range: backendTimeRange,
                year: selectedYear,
                countries,
            };

            if (range === "quarterly") {
                payload.quarter = selectedQuarter;
            }

            if (range === "monthly") {
                payload.month = selectedMonth;
            }

            const res = await fetch(
                "http://localhost:5000/ProductwisePerformance",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken ?? ""}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const json: APIResponse | any = await res
                .json()
                .catch(() => null);

            if (!res.ok || !json?.success) {
                const errMsg =
                    (json && (json.error || json.message)) ||
                    `HTTP error! status: ${res.status}`;
                throw new Error(errMsg);
            }

            setData(json as APIResponse);
        } catch (e: any) {
            console.error("API Error:", e);
            setError(e?.message || "Failed to fetch data from server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        productname,
        selectedYear,
        range,
        selectedQuarter,
        selectedMonth,
        selectedCountries,
    ]);

    // -------------------------
    // Helpers for Chart Data
    // -------------------------
    const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const prepareProfitData = () => {
        if (!data?.data) return [] as any[];

        const allMonths = new Set<string>();
        Object.values(data.data).forEach((countryData) => {
            countryData.forEach((m) => allMonths.add(m.month));
        });

        const sortedMonths = Array.from(allMonths).sort(
            (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
        );

        const profitData: any[] = [];
        sortedMonths.forEach((m) => {
            const point: Record<string, any> = { month: m };
            Object.entries(data.data).forEach(([country, cd]) => {
                const md = cd.find((d) => d.month === m);
                point[country] = md ? md.profit : 0;
            });
            profitData.push(point);
        });

        return profitData;
    };

    const prepareChartData = () => {
        if (!data?.data)
            return { netSalesData: [] as any[], quantityData: [] as any[] };

        const allMonths = new Set<string>();
        Object.values(data.data).forEach((countryData) => {
            countryData.forEach((m) => allMonths.add(m.month));
        });

        const sortedMonths = Array.from(allMonths).sort(
            (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
        );

        const netSalesData: any[] = [];
        const quantityData: any[] = [];

        sortedMonths.forEach((m) => {
            const netSalesPoint: Record<string, any> = { month: m };
            const quantityPoint: Record<string, any> = { month: m };

            Object.entries(data.data).forEach(([country, cd]) => {
                const md = cd.find((d) => d.month === m);
                netSalesPoint[country] = md ? md.net_sales : 0;
                quantityPoint[country] = md ? md.quantity : 0;
            });

            netSalesData.push(netSalesPoint);
            quantityData.push(quantityPoint);
        });

        return { netSalesData, quantityData };
    };

    const getCountryColor = (country: CountryKey) => {
        const colors: Record<string, string> = {
            uk: "#AB64B5",
            us: "#87AD12",
            global: "#F47A00",
        };
        return colors[country] || "#ff7c7c";
    };

    const formatCurrencyByCountry = (country: string, value: number) => {
        const lower = country.toLowerCase();

        if (lower === "uk") {
            return new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value);
        }

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // -------------------------
    // Chart datasets (GLOBAL uses UK→USD + US, with fallback to backend global)
// -------------------------
    const buildChartJSData = () => {
        if (!data?.data) return [null, null, null];

        const allMonths = new Set<string>();
        Object.values(data.data).forEach((countryData) => {
            countryData.forEach((m) => allMonths.add(m.month));
        });

        const labels = Array.from(allMonths).sort(
            (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
        );

        const getMetric = (
            country: CountryKey,
            month: string,
            metric: keyof MonthDatum
        ) => {
            const arr = data.data[country];
            if (!arr) return 0;
            const found = arr.find((m) => m.month === month);
            return found ? (found[metric] as number) : 0;
        };

        const makeDataset = (
            country: string,
            metric: keyof MonthDatum,
            labelSuffix: string
        ) => {
            const lower = country.toLowerCase();

            const dataSeries = labels.map((month) => {
                const ukVal = getMetric("uk", month, metric);
                const usVal = getMetric("us", month, metric);
                const rawGlobal = getMetric("global", month, metric);
                const isMoney =
                    metric === "net_sales" || metric === "profit";

                if (lower === "global") {
                    if (metric === "quantity") {
                        const sumUnits = ukVal + usVal;
                        return sumUnits !== 0 ? sumUnits : rawGlobal;
                    }
                    const sumMoney = ukVal * GBP_TO_USD_RATE + usVal;
                    if (sumMoney !== 0) return sumMoney;
                    return rawGlobal;
                }

                if (lower === "uk") {
                    if (metric === "quantity") return ukVal;
                    return ukVal * GBP_TO_USD_RATE;
                }

                if (lower === "us") {
                    return usVal;
                }

                const raw = getMetric(country as CountryKey, month, metric);
                if (!isMoney) return raw;
                return raw;
            });

            const isGlobal = lower === "global";

            return {
                label: `${country.toUpperCase()} ${labelSuffix}`,
                data: dataSeries,
                borderColor: getCountryColor(country),
                backgroundColor: getCountryColor(country),
                tension: 0.1,
                pointRadius: 3,
                fill: false,
                borderDash: isGlobal ? [6, 4] : [],
                borderWidth: 2,
            };
        };

        const metrics: { metric: keyof MonthDatum; suffix: string }[] = [
            { metric: "net_sales", suffix: "Net Sales" },
            { metric: "quantity", suffix: "Quantity" },
            { metric: "profit", suffix: "Profit" },
        ];

        const charts = metrics.map(({ metric, suffix }) => {
            const datasets = Object.keys(selectedCountries)
                .filter((k) => selectedCountries[k])
                .map((country) =>
                    makeDataset(country, metric, suffix)
                );

            return {
                labels,
                datasets,
            };
        });

        return charts;
    };

    const chartDataList = buildChartJSData();

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed.y as number;
                        const datasetLabel = context.dataset.label as string;
                        const metricPart = (datasetLabel
                            .split(" ")
                            .slice(1)
                            .join(" ") || ""
                        ).toLowerCase();

                        if (
                            metricPart.includes("quantity") ||
                            metricPart.includes("units")
                        ) {
                            return `${datasetLabel}: ${value.toLocaleString()}`;
                        }

                        return `${datasetLabel}: ${formatUSD(value)}`;
                    },
                },
            },
        },
        scales: {
            x: { title: { display: true, text: "Month" } },
            y: {
                title: { display: true, text: "Amount (USD)" },
                min: 0,
                ticks: {
                    padding: 0,
                },
            },
        },
    } as const;

    const [currentIndex, setCurrentIndex] = useState(0);
    const handlePrev = () =>
        setCurrentIndex((i) =>
            i === 0 ? chartDataList.length - 1 : i - 1
        );
    const handleNext = () =>
        setCurrentIndex((i) =>
            i === chartDataList.length - 1 ? 0 : i + 1
        );

    const yearShort = selectedYear.toString().slice(-2);
    const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

    const getTitle = () => {
        if (range === "yearly") return `Year'${yearShort}`;
        if (range === "quarterly") return `Q${selectedQuarter}'${yearShort}`;
        return selectedMonth
            ? `${cap(selectedMonth)}'${yearShort}`
            : `Year'${yearShort}`;
    };

    // -------------------------
    // Cards (GLOBAL uses same conversion + fallback as chart)
// -------------------------
    const cards = useMemo(() => {
        if (!data?.data) return [] as { country: string; stats: any }[];

        // Build month labels based on actual data (like chart)
        const allMonths = new Set<string>();
        Object.values(data.data).forEach((countryData) => {
            countryData.forEach((m) => allMonths.add(m.month));
        });

        const labels = Array.from(allMonths).sort(
            (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
        );

        return Object.entries(data.data).map(([country, countryData]) => {
            let processedData = countryData;

            if (country.toLowerCase() === "global") {
                processedData = labels.map((month) => {
                    const uk = data.data.uk?.find((m) => m.month === month);
                    const us = data.data.us?.find((m) => m.month === month);
                    const g = data.data.global?.find((m) => m.month === month);

                    const ukNetUSD = (uk?.net_sales || 0) * GBP_TO_USD_RATE;
                    const usNet = us?.net_sales || 0;
                    const ukProfitUSD = (uk?.profit || 0) * GBP_TO_USD_RATE;
                    const usProfit = us?.profit || 0;

                    const sumNetSales = ukNetUSD + usNet;
                    const sumProfit = ukProfitUSD + usProfit;
                    const sumUnits = (uk?.quantity || 0) + (us?.quantity || 0);

                    return {
                        month,
                        net_sales:
                            sumNetSales !== 0
                                ? sumNetSales
                                : g?.net_sales || 0,
                        profit:
                            sumProfit !== 0
                                ? sumProfit
                                : g?.profit || 0,
                        quantity:
                            sumUnits !== 0
                                ? sumUnits
                                : g?.quantity || 0,
                    };
                });
            }

            const totalSales = processedData.reduce(
                (s, m) => s + m.net_sales,
                0
            );
            const totalProfit = processedData.reduce(
                (s, m) => s + m.profit,
                0
            );
            const totalUnits = processedData.reduce(
                (s, m) => s + m.quantity,
                0
            );

            const gross_margin_avg =
                totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

            const monthsWithSales = processedData.filter(
                (m) => m.net_sales > 0
            );

            const avgSales =
                monthsWithSales.length > 0
                    ? totalSales / monthsWithSales.length
                    : 0;

            const avgSellingPrice =
                totalUnits > 0 ? totalSales / totalUnits : 0;

            const avgMonthlyProfit =
                processedData.length > 0
                    ? totalProfit / processedData.length
                    : 0;

            const maxSalesMonth = processedData.reduce((max, m) =>
                m.net_sales > max.net_sales ? m : max
            );

            const maxUnitsMonth = processedData.reduce((max, m) =>
                m.quantity > max.quantity ? m : max
            );

            return {
                country,
                stats: {
                    totalSales,
                    totalProfit,
                    totalUnits,
                    gross_margin_avg,
                    avgSales,
                    avgSellingPrice,
                    avgMonthlyProfit,
                    maxSalesMonth,
                    maxUnitsMonth,
                },
            };
        });
    }, [data, monthOrder]);

    const formatMonthYear = (monthName: string, year: number | string) => {
        const MONTH_ABBRS = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        if (!monthName) return "";

        const idx = MONTH_ABBRS.findIndex(
            (_, i) =>
                monthName.toLowerCase().startsWith(
                    [
                        "january",
                        "february",
                        "march",
                        "april",
                        "may",
                        "june",
                        "july",
                        "august",
                        "september",
                        "october",
                        "november",
                        "december",
                    ][i].slice(0, 3)
                ) ||
                monthName.toLowerCase() ===
                [
                    "january",
                    "february",
                    "march",
                    "april",
                    "may",
                    "june",
                    "july",
                    "august",
                    "september",
                    "october",
                    "november",
                    "december",
                ][i]
        );

        const abbr =
            idx >= 0 ? MONTH_ABBRS[idx] : monthName.slice(0, 3) || monthName;
        const y = String(year);
        const shortYear = y.slice(-2);
        return `${abbr}'${shortYear}`;
    };

    const CountryCard: React.FC<{ country: string; stats: any }> = ({
        country,
        stats,
    }) => (
        <div className="rounded-lg border border-[#414042] bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h4 className="m-0 font-extrabold text-[#5EA68E] text-[clamp(14px,1.2vw,20px)] flex items-center gap-2">
                    <span
                        className="inline-block h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full"
                        style={{ backgroundColor: getCountryColor(country) }}
                    />
                    <span className="text-[#414042] text-[clamp(14px,1.1vw,18px)]">
                        {country.toUpperCase()}
                    </span>
                </h4>
            </div>

            <div className="flex flex-col gap-4">
                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            Net Sales
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {formatCurrencyByCountry(
                                country,
                                stats.totalSales
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            Units
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {stats.totalUnits.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            CM1 Profit
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {formatCurrencyByCountry(
                                country,
                                stats.totalProfit
                            )}
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            Avg. Monthly Sales
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {formatCurrencyByCountry(
                                country,
                                stats.avgSales
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            Avg. Selling Price
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {formatCurrencyByCountry(
                                country,
                                stats.avgSellingPrice
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3">
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            CM1 Profit (%)
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {stats.gross_margin_avg.toFixed(2)}%
                        </p>
                    </div>
                </div>

                <p className="m-0 text-[clamp(13px,1vw,16px)] font-bold">
                    Best Performance Month
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* Sales */}
                    <div
                        className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
                        style={{
                            borderTopWidth: 4,
                            borderTopColor: getCountryColor(country),
                        }}
                    >
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            Sales
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {formatMonthYear(
                                stats.maxSalesMonth.month,
                                selectedYear
                            )}
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)]">
                            {formatCurrencyByCountry(
                                country,
                                stats.maxSalesMonth.net_sales
                            )}
                        </p>
                    </div>

                    {/* Units */}
                    <div
                        className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
                        style={{
                            borderTopWidth: 4,
                            borderTopColor: getCountryColor(country),
                        }}
                    >
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            Units
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {formatMonthYear(
                                stats.maxUnitsMonth.month,
                                selectedYear
                            )}
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)]">
                            {stats.maxUnitsMonth.quantity.toLocaleString()}
                        </p>
                    </div>

                    {/* CM1 Profit */}
                    <div
                        className="rounded-lg border border-gray-300 bg-gray-200/40 p-2 sm:p-3"
                        style={{
                            borderTopWidth: 4,
                            borderTopColor: getCountryColor(country),
                        }}
                    >
                        <p className="mb-1 text-[clamp(11px,0.85vw,13px)] font-semibold text-[#414042]">
                            CM1 Profit
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)] font-semibold">
                            {formatMonthYear(
                                stats.maxSalesMonth.month,
                                selectedYear
                            )}
                        </p>
                        <p className="text-[clamp(12px,0.95vw,16px)]">
                            {formatCurrencyByCountry(
                                country,
                                stats.maxSalesMonth.profit
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const globalCard = cards.find(
        (c) => c.country.toLowerCase() === "global"
    );
    const ukCard = cards.find((c) => c.country.toLowerCase() === "uk");
    const usCard = cards.find((c) => c.country.toLowerCase() === "us");

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <PageBreadcrumb
                    pageTitle="Performance Analysis"
                    variant="page"
                    align="left"
                    textSize="2xl"
                />

                {/* Search */}
                <div className="relative min-w-[280px] w-full max-w-[320px]">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full rounded-lg border border-[#414042]/90 bg-white px-3 py-2 pl-7 text-base outline-none transition-colors focus:border-[#414042]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                if (searchResults.length > 0)
                                    setShowSearchResults(true);
                            }}
                            onBlur={() =>
                                setTimeout(
                                    () => setShowSearchResults(false),
                                    200
                                )
                            }
                        />
                        <svg
                            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#414042]/50"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line
                                x1="21"
                                y1="21"
                                x2="16.65"
                                y2="16.65"
                            ></line>
                        </svg>
                        {searchLoading && (
                            <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
                        )}
                    </div>

                    {showSearchResults &&
                        searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white">
                                {searchResults.map((p, i) => (
                                    <button
                                        key={`${p.product_name}-${i}`}
                                        className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-50"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() =>
                                            handleProductSelect(p)
                                        }
                                    >
                                        <div className="font-semibold text-gray-800">
                                            {p.product_name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                    {showSearchResults &&
                        searchResults.length === 0 &&
                        searchQuery.trim() &&
                        !searchLoading && (
                            <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-gray-200 bg-white p-4 text-center text-gray-500">
                                No products found for "{searchQuery}"
                            </div>
                        )}
                </div>
            </div>

            {/* Filters – using PeriodFiltersTable */}
            <div className="mb-5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-[0.5vw]">
                    <PeriodFiltersTable
                        range={range}
                        selectedMonth={selectedMonth}
                        selectedQuarter={`Q${selectedQuarter}`}
                        selectedYear={selectedYear}
                        yearOptions={years}
                        onRangeChange={(v) => setRange(v)}
                        onMonthChange={(val) => setSelectedMonth(val)}
                        onQuarterChange={(val) => {
                            const num = val.replace("Q", "");
                            setSelectedQuarter(num || "1");
                        }}
                        onYearChange={(val) => {
                            setSelectedYear(Number(val) || initialYear);
                        }}
                    />
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <video
                        src="/infinity2.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-auto w-[150px] bg-transparent pointer-events-none"
                    />
                </div>
            )}

            {/* Error */}
            {!!error && (
                <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6">
                    <div className="flex items-center gap-3 text-red-700">
                        <span className="text-xl">❌</span>
                        <p className="m-0 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {data && !loading && (
                <div className="flex flex-col">
                    {/* Chart Header */}
                    <div className="mb-3 w-full">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h3 className="m-0 text-xl font-bold text-[#414042]">
                                    {currentIndex === 0
                                        ? "Net Sales Trend"
                                        : currentIndex === 1
                                            ? "Units Trend"
                                            : "CM1 Profit Trend"}{" "}
                                    -{" "}
                                    <b className="text-[#5ea68e]">
                                        {productname} ({getTitle()})
                                    </b>
                                </h3>
                            </div>

                            {/* Legend / toggles */}
                            <div className="flex flex-wrap items-center gap-3">
                                {Object.entries(selectedCountries).map(
                                    ([country, isSelected]) => {
                                        const color =
                                            getCountryColor(country);
                                        return (
                                            <button
                                                key={country}
                                                type="button"
                                                onClick={() =>
                                                    handleCountryChange(
                                                        country
                                                    )
                                                }
                                                className={`flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold border transition
                                                    ${isSelected
                                                        ? "bg-white border-transparent"
                                                        : "bg-gray-100 border-gray-300 opacity-60"
                                                    }`}
                                            >
                                                <span
                                                    className="flex h-3 w-3 items-center justify-center rounded-sm border text-[10px]"
                                                    style={{
                                                        borderColor: color,
                                                        backgroundColor:
                                                            isSelected
                                                                ? color
                                                                : "transparent",
                                                        color: isSelected
                                                            ? "#ffffff"
                                                            : "transparent",
                                                    }}
                                                >
                                                    ✓
                                                </span>
                                                <span
                                                    className="underline decoration-1 underline-offset-[2px]"
                                                    style={{
                                                        color: isSelected
                                                            ? color
                                                            : "#6b7280",
                                                    }}
                                                >
                                                    {country.toUpperCase()}
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="flex h-[40vw] items-center justify-between">
                        {chartDataList ? (
                            <>
                                <button
                                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
                                    onClick={handlePrev}
                                    aria-label="Previous chart"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {chartDataList[currentIndex] ? (
                                    <div className="mx-2 w-full">
                                        <Line
                                            data={
                                                chartDataList[
                                                currentIndex
                                                ] as any
                                            }
                                            options={chartOptions as any}
                                        />
                                    </div>
                                ) : (
                                    <p className="mx-auto">
                                        No chart data available.
                                    </p>
                                )}

                                <button
                                    className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
                                    onClick={handleNext}
                                    aria-label="Next chart"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.22 19.78a.75.75 0 010-1.06L14.94 12 8.22 5.28a.75.75 0 111.06-1.06l7.25 7.25a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <p>No chart data available</p>
                        )}
                    </div>

                    {/* Dots */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                        {[0, 1, 2].map((idx) => (
                            <span
                                key={idx}
                                className={`h-2 w-2 rounded-full border ${currentIndex === idx
                                    ? "border-gray-300 bg-gray-300"
                                    : "border-[#414042] bg-white"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Summary Cards – Global, UK, US in one row (on md+) */}
                    <div className="mt-8">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {globalCard && selectedCountries["global"] && (
                                <CountryCard
                                    country={globalCard.country}
                                    stats={globalCard.stats}
                                />
                            )}
                            {ukCard && selectedCountries["uk"] && (
                                <CountryCard
                                    country={ukCard.country}
                                    stats={ukCard.stats}
                                />
                            )}
                            {usCard && selectedCountries["us"] && (
                                <CountryCard
                                    country={usCard.country}
                                    stats={usCard.stats}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductwisePerformance;
