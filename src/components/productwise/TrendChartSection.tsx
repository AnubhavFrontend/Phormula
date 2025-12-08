// // // // components/productwise/TrendChartSection.tsx
// // // "use client";

// // // import React from "react";
// // // import dynamic from "next/dynamic";
// // // import DownloadIconButton from "@/components/ui/button/DownloadIconButton";
// // // import { CountryKey, formatCountryLabel, getCountryColor } from "./productwiseHelpers";

// // // const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
// // //   ssr: false,
// // // });

// // // interface TrendChartSectionProps {
// // //   productname: string;
// // //   title: string;
// // //   chartDataList: any[];
// // //   chartOptions: any;
// // //   currentIndex: number;
// // //   onPrev: () => void;
// // //   onNext: () => void;
// // //   nonEmptyCountriesFromApi: CountryKey[];
// // //   selectedCountries: Record<CountryKey, boolean>;
// // //   onToggleCountry: (country: CountryKey) => void;
// // // }

// // // const TrendChartSection: React.FC<TrendChartSectionProps> = ({
// // //   productname,
// // //   title,
// // //   chartDataList,
// // //   chartOptions,
// // //   currentIndex,
// // //   onPrev,
// // //   onNext,
// // //   nonEmptyCountriesFromApi,
// // //   selectedCountries,
// // //   onToggleCountry,
// // // }) => {
// // //   return (
// // //     <div className="w-full rounded-md border border-charcoal-500 bg-[#D9D9D933] p-4 sm:p-5 shadow-sm">
// // //       <div className="flex items-start justify-between gap-4">
// // //         <div className="flex-1">
// // //           <h3 className="m-0 text-xl font-bold text-[#414042]">
// // //             {currentIndex === 0
// // //               ? "Net Sales Trend"
// // //               : currentIndex === 1
// // //               ? "Units Trend"
// // //               : "CM1 Profit Trend"}{" "}
// // //             -{" "}
// // //             <b className="text-green-500 capitalize">
// // //               {productname} ({title})
// // //             </b>
// // //           </h3>

// // //           <p className="mt-1 text-xs sm:text-sm text-gray-500">
// // //             Year-over-year performance comparison across regions.
// // //           </p>

// // //           <div className="my-4 flex flex-wrap items-center gap-3">
// // //             {["global", ...nonEmptyCountriesFromApi].map((country) => {
// // //               const color = getCountryColor(country);
// // //               const isChecked = selectedCountries[country] ?? true;
// // //               const label = formatCountryLabel(country);

// // //               return (
// // //                 <label
// // //                   key={country}
// // //                   className={[
// // //                     "shrink-0",
// // //                     "flex items-center gap-1 sm:gap-1.5",
// // //                     "font-semibold select-none whitespace-nowrap",
// // //                     "text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs xl:text-sm",
// // //                     "text-charcoal-500",
// // //                     isChecked ? "opacity-100" : "opacity-40",
// // //                     "cursor-pointer",
// // //                   ].join(" ")}
// // //                   onClick={() => onToggleCountry(country)}
// // //                 >
// // //                   <span
// // //                     className="
// // //                       flex items-center justify-center
// // //                       h-3 w-3 sm:h-3.5 sm:w-3.5
// // //                       rounded-sm border transition
// // //                     "
// // //                     style={{
// // //                       borderColor: color,
// // //                       backgroundColor: isChecked ? color : "white",
// // //                     }}
// // //                   >
// // //                     {isChecked && (
// // //                       <svg
// // //                         viewBox="0 0 24 24"
// // //                         width="14"
// // //                         height="14"
// // //                         className="text-white"
// // //                       >
// // //                         <path
// // //                           fill="currentColor"
// // //                           d="M20.285 6.709a1 1 0 0 0-1.414-1.414L9 15.168l-3.879-3.88a1 1 0 0 0-1.414 1.415l4.586 4.586a1 1 0 0 0 1.414 0l10-10Z"
// // //                         />
// // //                       </svg>
// // //                     )}
// // //                   </span>

// // //                   <span className="text-charcoal-500">{label}</span>
// // //                 </label>
// // //               );
// // //             })}
// // //           </div>
// // //         </div>

// // //         <div className="shrink-0">
// // //           <DownloadIconButton />
// // //         </div>
// // //       </div>

// // //       <div className="flex h-[40vw] min-h-[260px] items-center justify-between">
// // //         {chartDataList ? (
// // //           <>
// // //             <button
// // //               className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
// // //               onClick={onPrev}
// // //               aria-label="Previous chart"
// // //             >
// // //               <svg
// // //                 xmlns="http://www.w3.org/2000/svg"
// // //                 viewBox="0 0 24 24"
// // //                 fill="currentColor"
// // //                 className="h-4 w-4"
// // //               >
// // //                 <path
// // //                   fillRule="evenodd"
// // //                   d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z"
// // //                   clipRule="evenodd"
// // //                 />
// // //               </svg>
// // //             </button>

// // //             {chartDataList[currentIndex] ? (
// // //               <div className="mx-2 w-full">
// // //                 <Line data={chartDataList[currentIndex] as any} options={chartOptions as any} />
// // //               </div>
// // //             ) : (
// // //               <p className="mx-auto">No chart data available.</p>
// // //             )}

// // //             <button
// // //               className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
// // //               onClick={onNext}
// // //               aria-label="Next chart"
// // //             >
// // //               <svg
// // //                 xmlns="http://www.w3.org/2000/svg"
// // //                 viewBox="0 0 24 24"
// // //                 fill="currentColor"
// // //                 className="h-4 w-4"
// // //               >
// // //                 <path
// // //                   fillRule="evenodd"
// // //                   d="M8.22 19.78a.75.75 0 010-1.06L14.94 12 8.22 5.28a.75.75 0 111.06-1.06l7.25 7.25a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0z"
// // //                   clipRule="evenodd"
// // //                 />
// // //               </svg>
// // //             </button>
// // //           </>
// // //         ) : (
// // //           <p>No chart data available</p>
// // //         )}
// // //       </div>

// // //       <div className="mt-3 flex items-center justify-center gap-2">
// // //         {[0, 1, 2].map((idx) => (
// // //           <span
// // //             key={idx}
// // //             className={`h-2 w-2 rounded-full border ${
// // //               currentIndex === idx
// // //                 ? "border-gray-300 bg-gray-300"
// // //                 : "border-[#414042] bg-white"
// // //             }`}
// // //           />
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default TrendChartSection;











// // // components/productwise/TrendChartSection.tsx
// // "use client";

// // import React, { useMemo } from "react";
// // import dynamic from "next/dynamic";
// // import DownloadIconButton from "@/components/ui/button/DownloadIconButton";
// // import { CountryKey, formatCountryLabel, getCountryColor } from "./productwiseHelpers";

// // const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
// //   ssr: false,
// // });

// // interface TrendChartSectionProps {
// //   productname: string;
// //   title: string;
// //   chartDataList: any[];
// //   chartOptions: any;
// //   currentIndex: number;
// //   onPrev: () => void;
// //   onNext: () => void;
// //   nonEmptyCountriesFromApi: CountryKey[];
// //   selectedCountries: Record<CountryKey, boolean>;
// //   onToggleCountry: (country: CountryKey) => void;
// // }

// // const TrendChartSection: React.FC<TrendChartSectionProps> = ({
// //   productname,
// //   title,
// //   chartDataList,
// //   chartOptions,
// //   currentIndex,
// //   onPrev,
// //   onNext,
// //   nonEmptyCountriesFromApi,
// //   selectedCountries,
// //   onToggleCountry,
// // }) => {
// //   /**
// //    * Build processed chart data:
// //    * - currentIndex === 0:
// //    *   Single chart with Net Sales (index 0) + CM1 Profit (index 2)
// //    *   Net Sales = solid lines
// //    *   CM1 Profit = dotted lines
// //    *
// //    * - other indices:
// //    *   Just style datasets by label (CM1 = dotted, others = solid)
// //    */
// //   const processedChartData = useMemo(() => {
// //     if (!chartDataList) return null;

// //     // Helper: solid for non-CM1, dotted for CM1
// // const styleDatasetsByLabel = (datasets: any[] = []) =>
// //   datasets.map((ds: any) => {
// //     const label = (ds.label || "").toString().toLowerCase();

// //     const isCm1 =
// //       label.includes("cm1") ||
// //       label.includes("profit") ||
// //       label.includes("cm 1") ||
// //       label.includes("cm-1");

// //     return {
// //       ...ds,
// //       fill: false, // always solid lines, no fill
// //       borderDash: isCm1 ? [6, 6] : [], // CM1 = dotted, Net Sales = solid
// //     };
// //   });


// //     // --- Slide 0: combined Net Sales + CM1 chart ---
// //     if (currentIndex === 0) {
// //       const netSalesData = chartDataList[0];
// //       const cm1Data = chartDataList[2];

// //       if (!netSalesData) return null;

// //       // If CM1 missing, just style Net Sales and return
// //       if (!cm1Data) {
// //         return {
// //           ...netSalesData,
// //           datasets: styleDatasetsByLabel(netSalesData.datasets),
// //         };
// //       }

// //       const labels = netSalesData.labels;

// //       const netSalesDatasets = styleDatasetsByLabel(netSalesData.datasets || []);
// //       const cm1Datasets = styleDatasetsByLabel(cm1Data.datasets || []);

// //       return {
// //         ...netSalesData,
// //         labels,
// //         datasets: [...netSalesDatasets, ...cm1Datasets],
// //       };
// //     }

// //     // --- Other slides: Units / CM1 etc. ---
// //     const currentData = chartDataList[currentIndex];
// //     if (!currentData) return null;

// //     return {
// //       ...currentData,
// //       datasets: styleDatasetsByLabel(currentData.datasets || []),
// //     };
// //   }, [chartDataList, currentIndex]);

// //   const processedChartOptions = useMemo(() => {
// //     // If you later add dual axes (y / y1), tweak here.
// //     return chartOptions;
// //   }, [chartOptions]);

// //   const getTitleByIndex = () => {
// //     if (currentIndex === 0) return "Net Sales + CM1 Profit Trend";
// //     if (currentIndex === 1) return "Units Trend";
// //     return "CM1 Profit Trend";
// //   };

// //   return (
// //     <div className="w-full rounded-md border border-charcoal-500 bg-[#D9D9D933] p-4 sm:p-5 shadow-sm">
// //       <div className="flex items-start justify-between gap-4">
// //         <div className="flex-1">
// //           <h3 className="m-0 text-xl font-bold text-[#414042]">
// //             {getTitleByIndex()} -{" "}
// //             <b className="text-green-500 capitalize">
// //               {productname} ({title})
// //             </b>
// //           </h3>

// //           <p className="mt-1 text-xs sm:text-sm text-gray-500">
// //             Year-over-year performance comparison across regions.
// //           </p>

// //           <div className="my-4 flex flex-wrap items-center gap-3">
// //             {["global", ...nonEmptyCountriesFromApi].map((country) => {
// //               const color = getCountryColor(country as CountryKey);
// //               const isChecked = selectedCountries[country as CountryKey] ?? true;
// //               const label = formatCountryLabel(country as CountryKey);

// //               return (
// //                 <label
// //                   key={country}
// //                   className={[
// //                     "shrink-0",
// //                     "flex items-center gap-1 sm:gap-1.5",
// //                     "font-semibold select-none whitespace-nowrap",
// //                     "text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs xl:text-sm",
// //                     "text-charcoal-500",
// //                     isChecked ? "opacity-100" : "opacity-40",
// //                     "cursor-pointer",
// //                   ].join(" ")}
// //                   onClick={() => onToggleCountry(country as CountryKey)}
// //                 >
// //                   <span
// //                     className="
// //                       flex items-center justify-center
// //                       h-3 w-3 sm:h-3.5 sm:w-3.5
// //                       rounded-sm border transition
// //                     "
// //                     style={{
// //                       borderColor: color,
// //                       backgroundColor: isChecked ? color : "white",
// //                     }}
// //                   >
// //                     {isChecked && (
// //                       <svg
// //                         viewBox="0 0 24 24"
// //                         width="14"
// //                         height="14"
// //                         className="text-white"
// //                       >
// //                         <path
// //                           fill="currentColor"
// //                           d="M20.285 6.709a1 1 0 0 0-1.414-1.414L9 15.168l-3.879-3.88a1 1 0 0 0-1.414 1.415l4.586 4.586a1 1 0 0 0 1.414 0l10-10Z"
// //                         />
// //                       </svg>
// //                     )}
// //                   </span>

// //                   <span className="text-charcoal-500">{label}</span>
// //                 </label>
// //               );
// //             })}
// //           </div>
// //         </div>

// //         <div className="shrink-0">
// //           <DownloadIconButton />
// //         </div>
// //       </div>

// //       <div className="flex h-[40vw] min-h-[260px] items-center justify-between">
// //         {processedChartData ? (
// //           <>
// //             <button
// //               className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
// //               onClick={onPrev}
// //               aria-label="Previous chart"
// //             >
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 24 24"
// //                 fill="currentColor"
// //                 className="h-4 w-4"
// //               >
// //                 <path
// //                   fillRule="evenodd"
// //                   d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z"
// //                   clipRule="evenodd"
// //                 />
// //               </svg>
// //             </button>

// //             <div className="mx-2 w-full">
// //               <Line data={processedChartData as any} options={processedChartOptions as any} />
// //             </div>

// //             <button
// //               className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2c3e50] text-[#f8edcf] shadow transition active:scale-95"
// //               onClick={onNext}
// //               aria-label="Next chart"
// //             >
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 24 24"
// //                 fill="currentColor"
// //                 className="h-4 w-4"
// //               >
// //                 <path
// //                   fillRule="evenodd"
// //                   d="M8.22 19.78a.75.75 0 010-1.06L14.94 12 8.22 5.28a.75.75 0 111.06-1.06l7.25 7.25a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0z"
// //                   clipRule="evenodd"
// //                 />
// //               </svg>
// //             </button>
// //           </>
// //         ) : (
// //           <p className="mx-auto">No chart data available.</p>
// //         )}
// //       </div>

// //       <div className="mt-3 flex items-center justify-center gap-2">
// //         {[0, 1, 2].map((idx) => (
// //           <span
// //             key={idx}
// //             className={`h-2 w-2 rounded-full border ${currentIndex === idx
// //                 ? "border-gray-300 bg-gray-300"
// //                 : "border-[#414042] bg-white"
// //               }`}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default TrendChartSection;

























// // components/productwise/TrendChartSection.tsx
// "use client";

// import React, { useMemo, useState } from "react";
// import dynamic from "next/dynamic";
// import DownloadIconButton from "@/components/ui/button/DownloadIconButton";
// import {
//   CountryKey,
//   formatCountryLabel,
//   getCountryColor,
// } from "./productwiseHelpers";
// import SegmentedToggle from "../ui/SegmentedToggle";

// const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
//   ssr: false,
// });

// interface TrendChartSectionProps {
//   productname: string;
//   title: string; // e.g. "Classic (Year'25)"
//   chartDataList: any[];
//   chartOptions: any;
//   // kept for compatibility with old props, but no longer used:
//   currentIndex?: number;
//   onPrev?: () => void;
//   onNext?: () => void;
//   nonEmptyCountriesFromApi: CountryKey[];
//   selectedCountries: Record<CountryKey, boolean>;
//   onToggleCountry: (country: CountryKey) => void;
// }

// type TrendTab = "sales_cm1" | "units";

// const TrendChartSection: React.FC<TrendChartSectionProps> = ({
//   productname,
//   title,
//   chartDataList,
//   chartOptions,
//   nonEmptyCountriesFromApi,
//   selectedCountries,
//   onToggleCountry,
// }) => {
//   // Toggle between Sales+CM1 and Units
//   const [activeTab, setActiveTab] = useState<TrendTab>("sales_cm1");

//   /**
//    * Build processed chart data based on active tab:
//    * - "sales_cm1": single chart combining Net Sales (chartDataList[0])
//    *   and CM1 Profit (chartDataList[2]).
//    *   Net Sales = solid lines; CM1 Profit = dotted lines.
//    * - "units": chartDataList[1] (Units).
//    */
//   const processedChartData = useMemo(() => {
//     if (!chartDataList) return null;

//     // Helper: CM1/profit lines dotted, others solid
//     const styleDatasetsByLabel = (datasets: any[] = []) =>
//       datasets.map((ds: any) => {
//         const label = (ds.label || "").toString().toLowerCase();

//         const isCm1OrProfit =
//           label.includes("cm1") ||
//           label.includes("cm 1") ||
//           label.includes("cm-1") ||
//           label.includes("profit");

//         return {
//           ...ds,
//           fill: false,
//           borderDash: isCm1OrProfit ? [6, 6] : [], // dotted only for CM1/profit
//         };
//       });

//     // ---- TAB 1: Sales & CM1 (Net Sales + CM1 Profit combined) ----
//     if (activeTab === "sales_cm1") {
//       const netSalesData = chartDataList[0]; // Net Sales chart
//       const cm1Data = chartDataList[2]; // CM1 Profit chart

//       if (!netSalesData) return null;

//       // If CM1 missing, just show styled Net Sales
//       if (!cm1Data) {
//         return {
//           ...netSalesData,
//           datasets: styleDatasetsByLabel(netSalesData.datasets || []),
//         };
//       }

//       const labels = netSalesData.labels;

//       // Net Sales datasets -> solid (no borderDash)
//       const netSalesDatasets = (netSalesData.datasets || []).map((ds: any) => {
//         const label = (ds.label || "").toString().toLowerCase();
//         const isCm1OrProfit =
//           label.includes("cm1") ||
//           label.includes("cm 1") ||
//           label.includes("cm-1") ||
//           label.includes("profit");

//         return {
//           ...ds,
//           fill: false,
//           borderDash: isCm1OrProfit ? [6, 6] : [], // should usually be solid
//         };
//       });

//       // CM1 Profit datasets -> always dotted
//       const cm1Datasets = (cm1Data.datasets || []).map((ds: any) => ({
//         ...ds,
//         fill: false,
//         borderDash: [6, 6],
//       }));

//       return {
//         ...netSalesData,
//         labels,
//         datasets: [...netSalesDatasets, ...cm1Datasets],
//       };
//     }

//     // ---- TAB 2: Units ----
//     if (activeTab === "units") {
//       const unitsData = chartDataList[1]; // Units / Quantity
//       if (!unitsData) return null;

//       return {
//         ...unitsData,
//         datasets: styleDatasetsByLabel(unitsData.datasets || []),
//       };
//     }

//     return null;
//   }, [chartDataList, activeTab]);

//   const processedChartOptions = useMemo(() => chartOptions, [chartOptions]);

//   const getTitleByTab = () => {
//     if (activeTab === "sales_cm1") return "Net Sales + CM1 Profit Trend";
//     return "Units Trend";
//   };

//   return (
//     <div className="w-full rounded-md border border-charcoal-500 bg-[#D9D9D933] p-4 sm:p-5 shadow-sm">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//         {/* LEFT: Title + subtitle + country toggles */}
//         <div className="flex-1">
//           <h3 className="m-0 text-xl font-bold text-[#414042]">
//             {getTitleByTab()} -{" "}
//             <b className="text-green-500 capitalize">
//               {productname} ({title})
//             </b>
//           </h3>

//           <p className="mt-1 text-xs sm:text-sm text-gray-500">
//             Year-over-year performance comparison across regions.
//           </p>

//           <div className="my-4 flex flex-wrap items-center gap-3">
//             {["global", ...nonEmptyCountriesFromApi].map((country) => {
//               const color = getCountryColor(country as CountryKey);
//               const isChecked = selectedCountries[country as CountryKey] ?? true;
//               const label = formatCountryLabel(country as CountryKey);

//               return (
//                 <label
//                   key={country}
//                   className={[
//                     "shrink-0",
//                     "flex items-center gap-1 sm:gap-1.5",
//                     "font-semibold select-none whitespace-nowrap",
//                     "text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs xl:text-sm",
//                     "text-charcoal-500",
//                     isChecked ? "opacity-100" : "opacity-40",
//                     "cursor-pointer",
//                   ].join(" ")}
//                   onClick={() => onToggleCountry(country as CountryKey)}
//                 >
//                   <span
//                     className="
//                       flex items-center justify-center
//                       h-3 w-3 sm:h-3.5 sm:w-3.5
//                       rounded-sm border transition
//                     "
//                     style={{
//                       borderColor: color,
//                       backgroundColor: isChecked ? color : "white",
//                     }}
//                   >
//                     {isChecked && (
//                       <svg
//                         viewBox="0 0 24 24"
//                         width="14"
//                         height="14"
//                         className="text-white"
//                       >
//                         <path
//                           fill="currentColor"
//                           d="M20.285 6.709a1 1 0 0 0-1.414-1.414L9 15.168l-3.879-3.88a1 1 0 0 0-1.414 1.415l4.586 4.586a1 1 0 0 0 1.414 0l10-10Z"
//                         />
//                       </svg>
//                     )}
//                   </span>

//                   <span className="text-charcoal-500">{label}</span>
//                 </label>
//               );
//             })}
//           </div>
//         </div>

//         {/* RIGHT: SegmentedToggle + Download button */}
//         <div className="flex items-center gap-3">
//           <SegmentedToggle<TrendTab>
//             value={activeTab}
//             onChange={setActiveTab}
//             textSizeClass="text-xs sm:text-sm"
//             options={[
//               { value: "sales_cm1", label: "Sales & CM1 Profit" },
//               { value: "units", label: "Units" },
//             ]}
//           />

//           <DownloadIconButton />
//         </div>
//       </div>

//       {/* CHART AREA */}
//       <div className="mt-4 h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[420px]">
//         {processedChartData ? (
//           <Line
//             data={processedChartData as any}
//             options={processedChartOptions as any}
//             style={{ width: "100%", height: "100%" }}
//           />
//         ) : (
//           <p className="flex h-full items-center justify-center">
//             No chart data available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrendChartSection;







// components/productwise/TrendChartSection.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import DownloadIconButton from "@/components/ui/button/DownloadIconButton";
import {
  CountryKey,
  formatCountryLabel,
  getCountryColor,
} from "./productwiseHelpers";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import SegmentedToggle from "../ui/SegmentedToggle";

const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
  ssr: false,
});

type TrendTab = "sales_cm1" | "units";

interface TrendChartSectionProps {
  productname: string;
  title: string; // e.g. Classic (Year'25)
  chartDataList: any[];
  chartOptions: any;
  nonEmptyCountriesFromApi: CountryKey[];
  selectedCountries: Record<CountryKey, boolean>;
  onToggleCountry: (country: CountryKey) => void;
}

const TrendChartSection: React.FC<TrendChartSectionProps> = ({
  productname,
  title,
  chartDataList,
  chartOptions,
  nonEmptyCountriesFromApi,
  selectedCountries,
  onToggleCountry,
}) => {
  const [activeTab, setActiveTab] = useState<TrendTab>("sales_cm1");

  // ref to the chart instance
  const chartRef = useRef<any>(null);

  // ---------- Build chart data based on active tab ----------
  const processedChartData = useMemo(() => {
    if (!chartDataList) return null;

    const styleDatasetsByLabel = (datasets: any[] = []) =>
      datasets.map((ds: any) => {
        const label = (ds.label || "").toString().toLowerCase();
        const isCm1OrProfit =
          label.includes("cm1") ||
          label.includes("cm 1") ||
          label.includes("cm-1") ||
          label.includes("profit");

        return {
          ...ds,
          fill: false,
          borderDash: isCm1OrProfit ? [6, 6] : [], // dotted for CM1/Profit
        };
      });

    // TAB 1: Net Sales + CM1
    if (activeTab === "sales_cm1") {
      const netSalesData = chartDataList[0]; // Net Sales
      const cm1Data = chartDataList[2]; // CM1 Profit

      if (!netSalesData) return null;

      if (!cm1Data) {
        return {
          ...netSalesData,
          datasets: styleDatasetsByLabel(netSalesData.datasets || []),
        };
      }

      const labels = netSalesData.labels;

      const netSalesDatasets = (netSalesData.datasets || []).map((ds: any) => {
        const label = (ds.label || "").toString().toLowerCase();
        const isCm1OrProfit =
          label.includes("cm1") ||
          label.includes("cm 1") ||
          label.includes("cm-1") ||
          label.includes("profit");

        return {
          ...ds,
          fill: false,
          borderDash: isCm1OrProfit ? [6, 6] : [], // usually solid for pure Net Sales
        };
      });

      const cm1Datasets = (cm1Data.datasets || []).map((ds: any) => ({
        ...ds,
        fill: false,
        borderDash: [6, 6],
      }));

      return {
        ...netSalesData,
        labels,
        datasets: [...netSalesDatasets, ...cm1Datasets],
      };
    }

    // TAB 2: Units
    if (activeTab === "units") {
      const unitsData = chartDataList[1];
      if (!unitsData) return null;

      return {
        ...unitsData,
        datasets: styleDatasetsByLabel(unitsData.datasets || []),
      };
    }

    return null;
  }, [chartDataList, activeTab]);

  const processedChartOptions = useMemo(() => chartOptions, [chartOptions]);

  const getTitleByTab = () =>
    activeTab === "sales_cm1"
      ? "Net Sales + CM1 Profit Trend"
      : "Units Trend";

  // ---------- DOWNLOAD: Excel + chart image ----------
  const handleDownload = async () => {
    try {
      if (!processedChartData) return;

      // 1) Get chart image as data URL
      let imageDataUrl: string | undefined;
      const chart = chartRef.current;

      if (chart) {
        if (typeof chart.toBase64Image === "function") {
          imageDataUrl = chart.toBase64Image();
        } else if (chart.canvas && chart.canvas.toDataURL) {
          imageDataUrl = chart.canvas.toDataURL("image/png");
        }
      }

      // 2) Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Performance");

      // Optional: title row
      sheet.mergeCells("A1", "E1");
      const titleCell = sheet.getCell("A1");
      titleCell.value = `${getTitleByTab()} - ${productname} (${title})`;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };
      sheet.getRow(1).height = 24;

      let currentRow = 3;

      // 3) Add chart image if we have it
      if (imageDataUrl) {
        const base64 = imageDataUrl.replace(
          /^data:image\/(png|jpe?g);base64,/,
          ""
        );

        const imgId = workbook.addImage({
          base64,
          extension: "png",
        });

        // Place image in the sheet
        sheet.addImage(imgId, {
          tl: { col: 0, row: currentRow - 1 }, // row is 0-based here
          ext: { width: 900, height: 400 },
        });

        currentRow += 22; // leave space below image
      }

      // 4) Dump data table under the image
      const labels: string[] = (processedChartData as any).labels || [];
      const datasets: any[] = (processedChartData as any).datasets || [];

      if (labels.length && datasets.length) {
        // Header row
        const headerRowValues = ["Month", ...datasets.map((d) => d.label)];
        const headerRow = sheet.getRow(currentRow);
        headerRow.values = headerRowValues;
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: "center" };
        currentRow += 1;

        // Data rows
        labels.forEach((label, idx) => {
          const row = sheet.getRow(currentRow);
          const values = [
            label,
            ...datasets.map((d) => d.data?.[idx] ?? null),
          ];
          row.values = values;
          currentRow += 1;
        });

        // Make columns a bit wider
        sheet.columns.forEach((col) => {
          if (!col.width || col.width < 12) col.width = 12;
        });
      }

      // 5) Save workbook
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const filename = `${productname}-${getTitleByTab()}.xlsx`;
      saveAs(blob, filename);
    } catch (err) {
      console.error("Failed to export Excel + chart image", err);
    }
  };

  return (
    <div className="w-full rounded-md border border-charcoal-500 bg-[#D9D9D933] p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* LEFT: Title + country toggles */}
        <div className="flex-1">
          <h3 className="m-0 text-xl font-bold text-[#414042]">
            {getTitleByTab()} -{" "}
            <b className="text-green-500 capitalize">
              {productname} ({title})
            </b>
          </h3>

          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Year-over-year performance comparison across regions.
          </p>

          <div className="my-4 flex flex-wrap items-center gap-3">
            {["global", ...nonEmptyCountriesFromApi].map((country) => {
              const color = getCountryColor(country as CountryKey);
              const isChecked = selectedCountries[country as CountryKey] ?? true;
              const label = formatCountryLabel(country as CountryKey);

              return (
                <label
                  key={country}
                  className={[
                    "shrink-0",
                    "flex items-center gap-1 sm:gap-1.5",
                    "font-semibold select-none whitespace-nowrap",
                    "text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs xl:text-sm",
                    "text-charcoal-500",
                    isChecked ? "opacity-100" : "opacity-40",
                    "cursor-pointer",
                  ].join(" ")}
                  onClick={() => onToggleCountry(country as CountryKey)}
                >
                  <span
                    className="
                      flex items-center justify-center
                      h-3 w-3 sm:h-3.5 sm:w-3.5
                      rounded-sm border transition
                    "
                    style={{
                      borderColor: color,
                      backgroundColor: isChecked ? color : "white",
                    }}
                  >
                    {isChecked && (
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        className="text-white"
                      >
                        <path
                          fill="currentColor"
                          d="M20.285 6.709a1 1 0 0 0-1.414-1.414L9 15.168l-3.879-3.88a1 1 0 0 0-1.414 1.415l4.586 4.586a1 1 0 0 0 1.414 0l10-10Z"
                        />
                      </svg>
                    )}
                  </span>

                  <span className="text-charcoal-500">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Segmented toggle + Download button */}
        <div className="flex items-center gap-3">
          <SegmentedToggle<TrendTab>
            value={activeTab}
            onChange={setActiveTab}
            textSizeClass="text-xs sm:text-sm"
            options={[
              { value: "sales_cm1", label: "Sales & CM1 Profit" },
              { value: "units", label: "Units" },
            ]}
          />

          <DownloadIconButton onClick={handleDownload} />
        </div>
      </div>

      {/* CHART AREA */}
      <div className="mt-4 h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[420px]">
        {processedChartData ? (
          <Line
            ref={chartRef}
            data={processedChartData as any}
            options={processedChartOptions as any}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <p className="flex h-full items-center justify-center">
            No chart data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrendChartSection;
