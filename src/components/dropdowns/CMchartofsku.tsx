// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   ChartData,
//   ChartOptions,
//   TooltipItem,
// } from "chart.js";
// import PageBreadcrumb from "../common/PageBreadCrumb";

// ChartJS.register(ArcElement, Tooltip, Legend);

// type Range = "monthly" | "quarterly" | "yearly";
// type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

// type CmChartOfSkuProps = {
//   range: Range;
//   month?: string;
//   year: number | string;
//   selectedQuarter?: Quarter;
//   userId?: string | number;
//   /** Supply from parent, e.g. via Next.js route params */
//   countryName: string;
// };

// type PieApiSuccess = {
//   success: true;
//   data: { labels: string[]; values: number[] };
// };

// type PieApiError = {
//   success?: false;
//   error?: string;
// };

// type PieApiResponse = PieApiSuccess | PieApiError;

// const getCurrencySymbol = (country?: string) => {
//   switch ((country || "").toLowerCase()) {
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

// const CMchartofsku: React.FC<CmChartOfSkuProps> = ({
//   range,
//   month,
//   year,
//   selectedQuarter,
//   userId, // currently unused but typed for future use
//   countryName,
// }) => {
//   const currencySymbol = getCurrencySymbol(countryName);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [chartData, setChartData] = useState<ChartData<"pie", number[], string> | null>(null);
//   const [noDataFound, setNoDataFound] = useState<boolean>(false);

//   // Responsive legend position (TS-safe)
//   const [legendPosition, setLegendPosition] = useState<"top" | "left" | "bottom" | "right">(
//     typeof window !== "undefined" && window.innerWidth < 768 ? "bottom" : "right"
//   );

//   useEffect(() => {
//     const onResize = () => setLegendPosition(window.innerWidth < 768 ? "bottom" : "right");
//     if (typeof window !== "undefined") {
//       window.addEventListener("resize", onResize);
//       return () => window.removeEventListener("resize", onResize);
//     }
//   }, []);

//   const getDummyData = (): ChartData<"pie", number[], string> => ({
//     labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
//     datasets: [
//       {
//         data: [25, 30, 20, 15, 10],
//         backgroundColor: ["#AB64B5", "#5EA49B", "#F47A00", "#00627D", "#87AD12"],
//         borderWidth: 1,
//       },
//     ],
//   });

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       setError(null);
//       setNoDataFound(false);

//       try {
//         const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
//         const params = new URLSearchParams({
//           country: countryName || "",
//           year: String(year ?? ""),
//           range: range || "",
//         });

//         if (range === "monthly" && month) {
//           params.append("month", month);
//         } else if (range === "quarterly" && selectedQuarter) {
//           params.append("quarter", selectedQuarter);
//         }

//         const res = await fetch(`http://127.0.0.1:5000/pie-chart?${params.toString()}`, {
//           method: "GET",
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         if (!res.ok) {
//           let serverError = "";
//           try {
//             const errBody: PieApiError = await res.json();
//             serverError = errBody.error || "Failed to fetch data";
//           } catch {
//             serverError = "Failed to fetch data";
//           }
//           throw new Error(serverError);
//         }

//         const json: PieApiResponse = await res.json();

//         // Handle explicit "no data" error phrases gracefully
//         const noDataPhrase = "no data found in any of the available tables";
//         const textError = (json as PieApiError).error?.toLowerCase() || "";

//         if ("success" in json && json.success && json.data) {
//           const labels = json.data.labels || [];
//           const values = (json.data.values || []).map((v) => Math.abs(Number(v || 0)));

//           const isEmpty =
//             labels.length === 0 || values.length === 0 || values.every((v) => v === 0);

//           if (isEmpty) {
//             setNoDataFound(true);
//             setChartData(getDummyData());
//             setLoading(false);
//             return;
//           }

//           const next: ChartData<"pie", number[], string> = {
//             labels,
//             datasets: [
//               {
//                 data: values,
//                 backgroundColor: ["#AB64B5", "#5EA49B", "#F47A00", "#00627D", "#87AD12", "#D35400"],
//                 borderWidth: 1,
//               },
//             ],
//           };
//           setChartData(next);
//           setNoDataFound(false);
//         } else if (textError.includes(noDataPhrase)) {
//           setNoDataFound(true);
//           setChartData(getDummyData());
//           setError(null);
//         } else {
//           setNoDataFound(true);
//           setChartData(getDummyData());
//           setError((json as PieApiError).error || "Failed to fetch valid chart data");
//         }
//       } catch (e) {
//         const msg = e instanceof Error ? e.message : "Unknown error";
//         if (msg.toLowerCase().includes("no data found in any of the available tables")) {
//           setNoDataFound(true);
//           setChartData(getDummyData());
//           setError(null);
//         } else {
//           setError(msg);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [range, month, year, selectedQuarter, countryName, userId]);

//   const capitalizeFirstLetter = (str: string) =>
//     str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   const convertToAbbreviatedMonth = (m?: string) =>
//     m ? capitalizeFirstLetter(m).slice(0, 3) : "";

//   const titleNode = useMemo(() => {
//     const y = String(year);
//     if (range === "quarterly") {
//       return (
//         // <>
//         //   CM1 Profit Breakdown -{" "}
//         //   <span className="text-[#5EA68E]">
//         //     {selectedQuarter}&apos;{y.slice(-2)}
//         //   </span>
//         // </>
//         <div className="flex gap-2">
//                         <PageBreadcrumb pageTitle="CM1 Profit Breakdown -" variant="page" align="left" textSize="2xl"/>
//                         <span className="text-[#5EA68E] text-2xl">
//                             {countryName?.toLowerCase() === "global"
//                                 ? "GLOBAL"
//                                 : countryName?.toUpperCase()}
//                         </span>
//                     </div>
//       );
//     }
//     if (range === "monthly") {
//       return (
//         // <>
//         //   CM1 Profit Breakdown -{" "}
//         //   <span className="text-[#5EA68E]">
//         //     {convertToAbbreviatedMonth(month)}&apos;{y.slice(-2)}
//         //   </span>
//         // </>
//         <div className="flex gap-2">
//                 <PageBreadcrumb pageTitle="CM1 Profit Breakdown -" variant="page" align="left" textSize="2xl"/>
//                 <span className="text-[#5EA68E] text-2xl">
//                     {convertToAbbreviatedMonth(month)}&apos;{y.slice(-2)}
//                 </span>
//             </div>
//       );
//     }
//     return (
//       <>
//         CM1 Profit Breakdown{" "}
//         <span className="text-[#5EA68E]">Year&apos;{y.slice(-2)}</span>
//       </>
//     );
//   }, [range, month, year, selectedQuarter]);

//   const options: ChartOptions<"pie"> = {
//     responsive: true,
//     maintainAspectRatio: true,
//     plugins: {
//       legend: {
//         position: legendPosition,
//         align: "center",
//         labels: { usePointStyle: true },
//       },
//       tooltip: {
//         enabled: !noDataFound,
//         callbacks: {
//           label: (ctx: TooltipItem<"pie">) => {
//             const value = Math.abs(Number(ctx.raw ?? 0));
//             const ds = ctx.chart.data.datasets?.[ctx.datasetIndex] as
//               | { data: number[] }
//               | undefined;
//             const total = (ds?.data ?? []).reduce(
//               (acc, v) => acc + Math.abs(Number(v || 0)),
//               0
//             );
//             const pct = total ? (value / total) * 100 : 0;
//             const label = ctx.label ? `${ctx.label}: ` : "";
//             return `${label}${currencySymbol}${value.toLocaleString(undefined, {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })} (${pct.toFixed(2)}%)`;
//           },
//         },
//       },
//     },
//     layout: { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
//     animation: { duration: 900 },
//   };

//   return (
//     <div className="relative w-full">
//       {/* Title */}
//       <h2 className="mb-4 font-bold text-[#414042] bg-white text-xl sm:text-2xl">
//         {titleNode}
//       </h2>

//       <div className="w-full">
//         {loading && (
//           <p className="text-center text-sm text-gray-500">Loading chart data...</p>
//         )}
//         {error && (
//           <p className="text-center text-sm text-red-600">Error: {error}</p>
//         )}

//         {chartData && !loading && !error && (
//           <div
//             className={[
//               "mx-auto",
//               "w-full",
//               "max-w-[260px] sm:max-w-[320px] md:max-w-[420px] lg:max-w-[520px]",
//               "aspect-square",
//               "relative",
//             ].join(" ")}
//           >
//             <div
//               className={[
//                 "absolute inset-0",
//                 "transition-opacity duration-300",
//                 noDataFound ? "opacity-30 pointer-events-none" : "opacity-100",
//               ].join(" ")}
//             >
//               <Pie data={chartData} options={options} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CMchartofsku;






"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import PageBreadcrumb from "../common/PageBreadCrumb";
import Loader from "@/components/loader/Loader"; // 👈 NEW

ChartJS.register(ArcElement, Tooltip, Legend);

type Range = "monthly" | "quarterly" | "yearly";
type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

type CmChartOfSkuProps = {
  range: Range;
  month?: string;
  year: number | string;
  selectedQuarter?: Quarter;
  userId?: string | number;
  /** Supply from parent, e.g. via Next.js route params */
  countryName: string;
};

type PieApiSuccess = {
  success: true;
  data: { labels: string[]; values: number[] };
};

type PieApiError = {
  success?: false;
  error?: string;
};

type PieApiResponse = PieApiSuccess | PieApiError;

const getCurrencySymbol = (country?: string) => {
  switch ((country || "").toLowerCase()) {
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

const CMchartofsku: React.FC<CmChartOfSkuProps> = ({
  range,
  month,
  year,
  selectedQuarter,
  userId, // currently unused but typed for future use
  countryName,
}) => {
  const currencySymbol = getCurrencySymbol(countryName);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] =
    useState<ChartData<"pie", number[], string> | null>(null);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);

  // Responsive legend position (TS-safe)
  const [legendPosition, setLegendPosition] = useState<
    "top" | "left" | "bottom" | "right"
  >(
    typeof window !== "undefined" && window.innerWidth < 768
      ? "bottom"
      : "right"
  );

  useEffect(() => {
    const onResize = () =>
      setLegendPosition(window.innerWidth < 768 ? "bottom" : "right");
    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, []);

  const getDummyData = (): ChartData<"pie", number[], string> => ({
    labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
    datasets: [
      {
        data: [25, 30, 20, 15, 10],
        backgroundColor: ["#AB64B5", "#5EA49B", "#F47A00", "#00627D", "#87AD12"],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setNoDataFound(false);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("jwtToken")
            : null;
        const params = new URLSearchParams({
          country: countryName || "",
          year: String(year ?? ""),
          range: range || "",
        });

        if (range === "monthly" && month) {
          params.append("month", month);
        } else if (range === "quarterly" && selectedQuarter) {
          params.append("quarter", selectedQuarter);
        }

        const res = await fetch(
          `http://127.0.0.1:5000/pie-chart?${params.toString()}`,
          {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!res.ok) {
          let serverError = "";
          try {
            const errBody: PieApiError = await res.json();
            serverError = errBody.error || "Failed to fetch data";
          } catch {
            serverError = "Failed to fetch data";
          }
          throw new Error(serverError);
        }

        const json: PieApiResponse = await res.json();

        // Handle explicit "no data" error phrases gracefully
        const noDataPhrase = "no data found in any of the available tables";
        const textError = (json as PieApiError).error?.toLowerCase() || "";

        if ("success" in json && json.success && json.data) {
          const labels = json.data.labels || [];
          const values = (json.data.values || []).map((v) =>
            Math.abs(Number(v || 0))
          );

          const isEmpty =
            labels.length === 0 ||
            values.length === 0 ||
            values.every((v) => v === 0);

          if (isEmpty) {
            setNoDataFound(true);
            setChartData(getDummyData());
            setLoading(false);
            return;
          }

          const next: ChartData<"pie", number[], string> = {
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: [
                  "#AB64B5",
                  "#5EA49B",
                  "#F47A00",
                  "#00627D",
                  "#87AD12",
                  "#D35400",
                ],
                borderWidth: 1,
              },
            ],
          };
          setChartData(next);
          setNoDataFound(false);
        } else if (textError.includes(noDataPhrase)) {
          setNoDataFound(true);
          setChartData(getDummyData());
          setError(null);
        } else {
          setNoDataFound(true);
          setChartData(getDummyData());
          setError(
            (json as PieApiError).error || "Failed to fetch valid chart data"
          );
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (
          msg
            .toLowerCase()
            .includes("no data found in any of the available tables")
        ) {
          setNoDataFound(true);
          setChartData(getDummyData());
          setError(null);
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [range, month, year, selectedQuarter, countryName, userId]);

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const convertToAbbreviatedMonth = (m?: string) =>
    m ? capitalizeFirstLetter(m).slice(0, 3) : "";

  const titleNode = useMemo(() => {
    const y = String(year);
    if (range === "quarterly") {
      return (
        <div className="flex gap-2">
          <PageBreadcrumb
            pageTitle="CM1 Profit Breakdown -"
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
      );
    }
    if (range === "monthly") {
      return (
        <div className="flex gap-2">
          <PageBreadcrumb
            pageTitle="CM1 Profit Breakdown -"
            variant="page"
            align="left"
            textSize="2xl"
          />
          <span className="text-[#5EA68E] text-2xl">
            {convertToAbbreviatedMonth(month)}&apos;{y.slice(-2)}
          </span>
        </div>
      );
    }
    return (
      <>
        CM1 Profit Breakdown{" "}
        <span className="text-[#5EA68E]">Year&apos;{y.slice(-2)}</span>
      </>
    );
  }, [range, month, year, selectedQuarter, countryName]);

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: legendPosition,
        align: "center",
        labels: { usePointStyle: true },
      },
      tooltip: {
        enabled: !noDataFound,
        callbacks: {
          label: (ctx: TooltipItem<"pie">) => {
            const value = Math.abs(Number(ctx.raw ?? 0));
            const ds = ctx.chart.data.datasets?.[ctx.datasetIndex] as
              | { data: number[] }
              | undefined;
            const total = (ds?.data ?? []).reduce(
              (acc, v) => acc + Math.abs(Number(v || 0)),
              0
            );
            const pct = total ? (value / total) * 100 : 0;
            const label = ctx.label ? `${ctx.label}: ` : "";
            return `${label}${currencySymbol}${value.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )} (${pct.toFixed(2)}%)`;
          },
        },
      },
    },
    layout: { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
    animation: { duration: 900 },
  };

  return (
    <div className="relative w-full">
      {/* Title */}
      <h2 className="mb-4 font-bold text-[#414042] bg-white text-xl sm:text-2xl">
        {titleNode}
      </h2>

      <div className="w-full">
        {loading && (
          <div className="flex h-[260px] items-center justify-center">
            <Loader
              src="/infinity-unscreen.gif"
              size={150}
              transparent
              roundedClass="rounded-none"
              backgroundClass="bg-transparent"
              respectReducedMotion
            />
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-sm text-red-600">Error: {error}</p>
        )}

        {chartData && !loading && !error && (
          <div
            className={[
              "mx-auto",
              "w-full",
              "max-w-[260px] sm:max-w-[320px] md:max-w-[420px] lg:max-w-[520px]",
              "aspect-square",
              "relative",
            ].join(" ")}
          >
            <div
              className={[
                "absolute inset-0",
                "transition-opacity duration-300",
                noDataFound
                  ? "opacity-30 pointer-events-none"
                  : "opacity-100",
              ].join(" ")}
            >
              <Pie data={chartData} options={options} />
            </div>
          </div>
        )}

        {!chartData && !loading && !error && (
          <p className="text-center text-sm text-gray-500">
            No chart data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default CMchartofsku;
