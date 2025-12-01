"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  PointElement,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "../common/PageBreadCrumb";
import Loader from "@/components/loader/Loader"; // 👈 NEW
import Button from "../ui/button/Button";
import { FiDownload } from "react-icons/fi";
import DownloadIconButton from "../ui/button/DownloadIconButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ChartTitle,
  Tooltip,
  Legend
);

type BargraphProps = {
  range: "monthly" | "quarterly" | "yearly";
  selectedMonth: string;
  selectedYear: number | string;
  countryName: string;
  onNoDataChange?: (noData: boolean) => void;
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

const Bargraph: React.FC<BargraphProps> = ({
  range,
  selectedMonth,
  selectedYear,
  countryName,
  onNoDataChange
}) => {
  const router = useRouter();
  const currencySymbol = getCurrencySymbol(countryName || "");

  const [data, setData] = useState<UploadRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // 👈 NEW
  const [selectedGraphs, setSelectedGraphs] = useState({
    sales: true,
    profit: true,
    profit2: true,
    AmazonExpense: true,
    total_cous: true,
    sellingFees: true,
    advertisingCosts: true,
    Other: true,
    taxncredit: true,
  });

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const convertToAbbreviatedMonth = (m?: string) =>
    m ? capitalizeFirstLetter(m).slice(0, 3) : "";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
  const [userData, setUserData] = useState<{
    company_name?: string;
    brand_name?: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 👈 start loader
      try {
        const response = await fetch(`http://127.0.0.1:5000/upload_history`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const result = (await response.json()) as { uploads?: UploadRow[] };
        if (result.uploads) {
          const filtered = result.uploads.filter(
            (item) => item.country.toLowerCase() === countryName.toLowerCase()
          );
          setData(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch upload history:", error);
      } finally {
        setLoading(false); // 👈 stop loader
      }
    };
    fetchData();
  }, [countryName, token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const response = await fetch("http://127.0.0.1:5000/get_user_data", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const j = (await response.json()) as {
          company_name?: string;
          brand_name?: string;
        };
        setUserData(j);
      } catch {
        // ignore
      }
    };
    fetchUser();
  }, [token]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const selectedCount = Object.values(selectedGraphs).filter(Boolean).length;
    const newSelectedCount = checked ? selectedCount + 1 : selectedCount - 1;

    if (!checked && newSelectedCount < 2) return;

    setSelectedGraphs((prev) => ({ ...prev, [name]: checked }));
  };

  const formattedMonthYear = useMemo(
    () =>
      `${convertToAbbreviatedMonth(selectedMonth)}'${String(selectedYear).slice(
        -2
      )}`,
    [selectedMonth, selectedYear]
  );

  const getExtraRows = () => {
    const formattedCountry =
      countryName?.toLowerCase() === "global"
        ? "GLOBAL"
        : countryName?.toUpperCase();
    return [
      [`${userData?.brand_name || "N/A"}`],
      [`${userData?.company_name || "N/A"}`],
      [`Profit Breakup (SKU Level) - ${formattedMonthYear}`],
      [`Currency:  ${currencySymbol}`],
      [`Country: ${formattedCountry}`],
      [`Platform: Amazon`],
    ];
  };

  const metricMapping: Record<
    | "Sales"
    | "COGS"
    | "Amazon Fees"
    | "Taxes & Credits"
    | "CM1 Profit"
    | "Advertising Cost"
    | "Other"
    | "CM2 Profit",
    keyof UploadRow
  > = {
    Sales: "total_sales",
    COGS: "total_cous",
    "Amazon Fees": "total_amazon_fee",
    "Taxes & Credits": "taxncredit",
    "CM1 Profit": "total_profit",
    "Advertising Cost": "advertising_total",
    Other: "otherwplatform",
    "CM2 Profit": "cm2_profit",
  };

  const colorMapping: Record<
    | "Sales"
    | "COGS"
    | "Amazon Fees"
    | "Taxes & Credits"
    | "CM1 Profit"
    | "Advertising Cost"
    | "Other"
    | "CM2 Profit",
    string
  > = {
    Sales: "#2CA9E0",
    COGS: "#AB64B5",
    "Amazon Fees": "#ff5c5c",
    "Advertising Cost": "#F47A00",
    Other: "#00627D",
    "Taxes & Credits": "#154B9B",
    "CM1 Profit": "#5EA49B",
    "CM2 Profit": "#87AD12",
  };

  const preferredOrder = [
    "Sales",
    "COGS",
    "Amazon Fees",
    "Taxes & Credits",
    "CM1 Profit",
    "Advertising Cost",
    "Other",
    "CM2 Profit",
  ] as const;

  const {
    chartData,
    chartOptions,
    exportToExcel,
    allValuesZero,
  }: {
    chartData: ChartData<"bar">;
    chartOptions: ChartOptions<"bar">;
    exportToExcel: () => void;
    allValuesZero: boolean;
  } = useMemo(() => {
    if (!data || data.length === 0) {
      const emptyData: ChartData<"bar"> = { labels: [], datasets: [] };
      const emptyOptions: ChartOptions<"bar"> = {};
      const noop = () => { };
      return {
        chartData: emptyData,
        chartOptions: emptyOptions,
        exportToExcel: noop,
        allValuesZero: true,
      };
    }

    const selectedMonthYearKey = `${selectedMonth} ${selectedYear}`.toLowerCase();
    const monthData = data.find(
      (upload) =>
        `${upload.month} ${upload.year}`.toLowerCase() === selectedMonthYearKey
    );

    const metricsToShow = (
      Object.entries(selectedGraphs)
        .filter(([, isChecked]) => isChecked)
        .map(([key]) => {
          switch (key) {
            case "sales":
              return "Sales";
            case "total_cous":
              return "COGS";
            case "AmazonExpense":
              return "Amazon Fees";
            case "taxncredit":
              return "Taxes & Credits";
            case "profit2":
              return "CM1 Profit";
            case "advertisingCosts":
              return "Advertising Cost";
            case "Other":
              return "Other";
            case "profit":
              return "CM2 Profit";
            default:
              return null;
          }
        })
        .filter(Boolean) as typeof preferredOrder[number][]
    ).sort(
      (a, b) => preferredOrder.indexOf(a) - preferredOrder.indexOf(b)
    );

    const labels = metricsToShow as string[];

    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1200;
    const barWidthInPixels = viewportWidth * 0.05;

    let values = metricsToShow.map((label) => {
      const field = metricMapping[label];
      const v = monthData ? Math.abs(Number(monthData?.[field] ?? 0)) : 0;
      return v;
    });

    const zero = values.every((v) => v === 0);

    if (zero)
      values = metricsToShow.map(() => Math.floor(Math.random() * 1000 + 100));

    const chartData: ChartData<"bar"> = {
      labels,
      datasets: [
        {
          label: formattedMonthYear,
          data: values,
          maxBarThickness: barWidthInPixels,
          backgroundColor: metricsToShow.map((l) => colorMapping[l]),
          borderWidth: 0,
        },
      ],
    };

    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          intersect: false,
          callbacks: {
            title: (tooltipItems: TooltipItem<"bar">[]) =>
              tooltipItems[0]?.label ?? "",
            label: (context: TooltipItem<"bar">) => {
              const value = Number(context.raw ?? 0);
              const salesIndex = (labels as string[]).findIndex(
                (l) => l === "Sales"
              );
              const salesValue =
                salesIndex >= 0
                  ? Number(
                    (chartData.datasets[0].data as number[])[salesIndex] ?? 1
                  )
                  : 1;
              const percentage = (value / (salesValue || 1)) * 100;
              const metricLabel = String(context.label ?? "");
              const formattedValue = Number(value.toFixed(2)).toLocaleString();
              return `${metricLabel}: ${currencySymbol}${formattedValue} (${percentage.toFixed(
                1
              )}%)`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: (_value, index) => String(labels[index] ?? ""),
          },
          title: { display: true, text: formattedMonthYear },
        },
        y: {
          title: { display: true, text: `Amount (${currencySymbol})` },
        },
      },
    };

    const exportToExcel = () => {
      const extraRows = getExtraRows();
      const blankRow = [""];

      const sheetHeader: (string | number)[][] = [
        ["Metric", "", `Amount (${currencySymbol})`],
      ];

      const signs: Record<(typeof preferredOrder)[number], string> = {
        Sales: "(+)",
        COGS: "(-)",
        "Amazon Fees": "(-)",
        "Taxes & Credits": "(+)",
        "CM1 Profit": "",
        "Advertising Cost": "(-)",
        Other: "(-)",
        "CM2 Profit": "",
      };

      values.forEach((v, idx) => {
        const label = metricsToShow[idx];
        sheetHeader.push([label, signs[label], Number(v.toFixed(2))]);
      });

      const totalValue = values.reduce((acc, v) => acc + v, 0);
      sheetHeader.push(["Total", "", Number(totalValue.toFixed(2))]);

      const finalSheetData = [...extraRows, blankRow, ...sheetHeader];
      const ws = XLSX.utils.aoa_to_sheet(finalSheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
      XLSX.writeFile(wb, `Metrics-${formattedMonthYear}.xlsx`);
    };

    return {
      chartData,
      chartOptions: options,
      exportToExcel,
      allValuesZero: zero,
    };
  }, [
    data,
    selectedGraphs,
    selectedMonth,
    selectedYear,
    countryName,
    formattedMonthYear,
    currencySymbol,
  ]);

  useEffect(() => {
  // only signal "no data" when not loading
  if (!onNoDataChange) return;
  onNoDataChange(!loading && allValuesZero);
}, [onNoDataChange, allValuesZero, loading]);

  return (
    <div className="relative w-full py-3 sm:py-4 md:y-6">

      {/* 🔹 everything fades when no data */}
      <div className={allValuesZero ? "opacity-30 pointer-events-none" : "opacity-100"}>
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: title + period */}
        <div className="flex flex-wrap items-baseline gap-2 justify-center sm:justify-start">
          <PageBreadcrumb
            pageTitle="Tracking Profitability -"
            variant="page"
            align="left"
            textSize="2xl"
          />
          <span className="text-[#5EA68E] font-bold text-lg sm:text-2xl md:text-2xl">
            {countryName?.toLowerCase() === "global"
              ? "GLOBAL"
              : countryName?.toUpperCase()}
          </span>
        </div>

        {/* Right: Download button */}
        <div className="flex justify-center sm:justify-end">
          <DownloadIconButton onClick={exportToExcel} />
        </div>
      </div>
      



      {/* Chart container – show loader or chart */}
      <div
        className={[
          "mt-4",
          "w-full",
          "h-[46vh] sm:h-[48vh] md:h-[50vh]",
          allValuesZero && !loading ? "opacity-30" : "opacity-100",
          "transition-opacity duration-300",
        ].join(" ")}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader
              src="/infinity-unscreen.gif"
              size={150}
              transparent
              roundedClass="rounded-full"
              backgroundClass="bg-transparent"
              respectReducedMotion
            />
          </div>
        ) : (
          chartData.datasets.length > 0 && (
            <Bar data={chartData} options={chartOptions} />
          )
        )}
      </div>

     

      {/* No data overlay (only when NOT loading) */}
      {/* {!loading && allValuesZero && (
        <div className="absolute inset-0 z-[30]">
          <div
            className={[
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "bg-white/90 border border-[#e0e0e0] rounded-xl shadow-lg backdrop-blur",
              "max-w-[450px] w-[90%] p-6 text-center",
            ].join(" ")}
          >
            <div className="text-5xl text-gray-300 mb-4">🔒</div>
            <h3 className="text-[18px] font-semibold text-[#333] mb-3">
              No Data Available
            </h3>
            <p className="text-sm text-gray-600 leading-6">
              To see performance metrics, you need to upload more files for{" "}
              <strong>{capitalizeFirstLetter(countryName)}</strong>
            </p>
            <div className="mt-4 px-3 py-2 bg-gray-50 rounded text-xs text-gray-500">
              Sample data shown for preview
            </div>
            <button
              onClick={() =>
                router.push(
                  `/Upload/${countryName === "global" ? "uk" : countryName}`
                )
              }
              className="mt-4 inline-flex items-center justify-center rounded-md bg-[#5EA68E] px-4 py-2 font-semibold text-white hover:bg-[#4d8d78] transition-colors"
            >
              Upload MTD(s)
            </button>
          </div>
        </div>
      )} */}


    </div>
    </div>
  );
};

export default Bargraph;
