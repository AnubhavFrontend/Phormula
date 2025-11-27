"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import PeriodFiltersTable from "@/components/filters/PeriodFiltersTable";
import Loader from "@/components/loader/Loader"; // 👈 NEW

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Title as ChartTitle,
} from "chart.js";
import { FiDownload } from "react-icons/fi";
import DataTable, { ColumnDef } from "@/components/ui/table/DataTable";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ChartTitle
);

const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), { ssr: false });
const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), { ssr: false });

type PeriodType = "monthly" | "quarterly" | "yearly";

type SummaryShape = {
  net_sales: number;
  amazon_fee: number;
  advertising_total: number;
  taxncredit: number;
  otherwplatform: number;
  rembursement_fee: number;
  cashflow: number;
};

type SummaryRow = {
  sno: React.ReactNode;
  category: React.ReactNode;
  sign: React.ReactNode;
  amount: React.ReactNode;
};

const labelMap: Record<(typeof columnsToDisplay2)[number], string> = {
  net_sales: "Sales",
  amazon_fee: "Amazon Fees",
  advertising_total: "Advertising Cost",
  taxncredit: "Tax and Credit",
  otherwplatform: "Other Charges",
  rembursement_fee: "Net Reimbursement",
  cashflow: "Cash Generated",
};


type APIResponse = {
  summary?: Partial<SummaryShape>;
  monthlyBreakdown?: Record<string, Partial<SummaryShape>>;
};

type QuarterlyMonthlyData = Record<string, Partial<SummaryShape>>;
type QuarterlyTotals = Partial<SummaryShape>;

const getCurrencySymbol = (country?: string) => {
  switch ((country || "").toLowerCase()) {
    case "uk":
      return "£";
    case "india":
      return "₹";
    case "us":
      return "$";
    case "global":
      return "$";
    default:
      return "$";
  }
};

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

// fixed columns expected
const columnsToDisplay2 = [
  "net_sales",
  "amazon_fee",
  "advertising_total",
  "taxncredit",
  "otherwplatform",
  "rembursement_fee",
  "cashflow",
] as const;


const colorMapping: Record<string, string> = {
  Sales: "#2CA9E0",
  "Amazon Fees": "#ff5c5c",
  "Advertising Cost": "#F47A00",
  "Other Charges": "#00627D",
  "Tax and Credit": "#154B9B",
  "CM1 Profit": "#5EA49B",
  "Net Reimbursement": "#87AD12",
  "Cash Generated": "#5EA49B",
};

const monthsList = [
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

const quarterMapping: Record<string, string[]> = {
  Q1: ["January", "February", "March"],
  Q2: ["April", "May", "June"],
  Q3: ["July", "August", "September"],
  Q4: ["October", "November", "December"],
};

const CashFlowPage: React.FC = () => {
  const params = useParams<{ countryName?: string; month?: string; year?: string }>();
  const router = useRouter();

  const countryName = params?.countryName || "";
  const paramMonth = params?.month ? decodeURIComponent(params.month) : "";
  const paramYear = params?.year || "";
  const currencySymbol = getCurrencySymbol(countryName);

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 2 }, (_, i) => currentYear - i),
    [currentYear]
  );

  // State
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [month, setMonth] = useState<string>(paramMonth ? capitalize(paramMonth) : "");
  const [year, setYear] = useState<string>(paramYear || "");
  const [periodType, setPeriodType] = useState<PeriodType>("monthly");
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [allQuarterlyData, setAllQuarterlyData] = useState<Record<string, QuarterlyTotals>>({});
  const [allYearlyData, setAllYearlyData] = useState<Record<string, Partial<SummaryShape>>>({});
  const [quarterlyMonthlyData, setQuarterlyMonthlyData] = useState<QuarterlyMonthlyData>({});

  const defaultMetricState = {
    net_sales: true,
    amazon_fee: true,
    advertising_total: true,
    taxncredit: true,
    otherwplatform: true,
    rembursement_fee: true,
    cashflow: true,
  };


const summaryColumns: ColumnDef<SummaryRow>[] = [
  {
    key: "sno",
    header: "S.No.",
    width: "60px",
    headerClassName: "text-center border border-[#414042] bg-white text-[#5EA68E]",
    cellClassName: "text-center border border-[#414042] bg-gray-50",
  },
  {
    key: "category",
    header: "Category",
    headerClassName: "text-center border border-[#414042] bg-white text-[#5EA68E]",
    cellClassName:
      "border border-[#414042] bg-gray-50 font-semibold text-[#414042]",
  },
  {
    key: "sign",
    header: "",
    width: "60px",
    headerClassName: "text-center border border-[#414042] bg-white",
    cellClassName: "text-center border border-[#414042] bg-gray-50",
  },
  {
    key: "amount",
    header: `Amount (${currencySymbol})`,
    headerClassName: "text-center border border-[#414042] bg-white text-[#5EA68E]",
    cellClassName: "text-center border border-[#414042] bg-gray-50",
  },
];

const summaryRows: SummaryRow[] = React.useMemo(() => {
  if (!data?.summary) return [];

  // same logic you had before
  return columnsToDisplay2
    .filter((key) => key !== "rembursement_fee")
    .map((key, index, arr) => {
      const isLastRow = index === arr.length - 1;
      const signText = index === 0 || index === 3 ? "(+)" : "(-)";
      const value = Math.abs(getSafeValue(key as keyof SummaryShape));

      const signNode = !isLastRow ? (
        <span
          className={`font-semibold ${
            index === 0 || index === 3 ? "text-green-600" : "text-red-600"
          }`}
        >
          {signText}
        </span>
      ) : (
        ""
      );

      return {
        sno: index + 1,
        category: labelMap[key],
        sign: signNode,
        amount: value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      };
    });
}, [data?.summary, currencySymbol]);





  const [selectedGraphs, setSelectedGraphs] =
    useState<Record<string, boolean>>(defaultMetricState);

  // token (browser only)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

  const getSafeValue = (key: keyof SummaryShape) => {
    return (data?.summary?.[key] ?? 0) as number;
  };

  const allValuesZero =
    Object.keys(data?.summary || {}).every((k) => !(data?.summary as any)[k]) ||
    !data?.summary ||
    Object.values(data.summary!).every((v) => !v);

  // API helpers (using fetch)
  const fetchSpecificPeriodData = async (
    requestMonth: string | null,
    requestYear: string | null,
    requestPeriodType: PeriodType
  ): Promise<APIResponse> => {
    if (!token) {
      throw new Error("Authorization token not found. Please login.");
    }
    const searchParams = new URLSearchParams();
    if (requestMonth) searchParams.set("month", requestMonth);
    if (requestYear) searchParams.set("year", String(requestYear));
    if (countryName) searchParams.set("country", countryName.toLowerCase());
    searchParams.set("period_type", requestPeriodType);

    const res = await fetch(
      `http://127.0.0.1:5000/cashflow?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const json = (await res.json()) as APIResponse;
    return json;
  };

  const fetchQuarterlyMonthlyData = async (quarter: string, y: string) => {
    const qMonths = quarterMapping[quarter] || [];
    const monthlyData: QuarterlyMonthlyData = {};
    const quarterSummary: QuarterlyTotals = {
      net_sales: 0,
      amazon_fee: 0,
      advertising_total: 0,
      taxncredit: 0,
      otherwplatform: 0,
      rembursement_fee: 0,
      cashflow: 0,
    };

    for (const mName of qMonths) {
      try {
        const result = await fetchSpecificPeriodData(
          mName.toLowerCase(),
          y,
          "monthly"
        );
        if (result && result.summary) {
          monthlyData[mName] = result.summary;
          (Object.keys(quarterSummary) as (keyof SummaryShape)[]).forEach(
            (key) => {
              quarterSummary[key] =
                (quarterSummary[key] || 0) +
                (result.summary?.[key] || 0);
            }
          );
        }
      } catch {
        // continue
      }
    }
    return { monthlyData, quarterSummary };
  };

  const fetchAllQuarterlyData = async () => {
    const quarterlyData: Record<string, QuarterlyTotals> = {};
    for (const q of Object.keys(quarterMapping)) {
      try {
        const { quarterSummary } = await fetchQuarterlyMonthlyData(q, year);
        quarterlyData[q] = quarterSummary;
      } catch {
        // continue
      }
    }
    setAllQuarterlyData(quarterlyData);
    return quarterlyData;
  };

  const fetchAllYearlyData = async () => {
    const yearlyData: Record<string, Partial<SummaryShape>> = {};
    for (const mName of monthsList) {
      try {
        const result = await fetchSpecificPeriodData(
          mName.toLowerCase(),
          year,
          "monthly"
        );
        if (result && result.summary) {
          yearlyData[mName] = result.summary;
        }
      } catch {
        // continue
      }
    }
    setAllYearlyData(yearlyData);
    return yearlyData;
  };

  const fetchCashFlowData = async () => {
    setError("");
    setLoading(true);
    setData(null);

    // validation
    if (periodType === "monthly" && (!month || !year)) {
      setError("Please select both month and year for monthly view.");
      setLoading(false);
      return;
    }
    if (periodType === "quarterly" && (!selectedQuarter || !year)) {
      setError("Please select both quarter and year for quarterly view.");
      setLoading(false);
      return;
    }
    if (periodType === "yearly" && !year) {
      setError("Please select year for yearly view.");
      setLoading(false);
      return;
    }

    try {
      if (periodType === "quarterly") {
        await fetchAllQuarterlyData();
        const { monthlyData, quarterSummary } =
          await fetchQuarterlyMonthlyData(selectedQuarter, year);
        setQuarterlyMonthlyData(monthlyData);
        setData({ summary: quarterSummary, monthlyBreakdown: monthlyData });
      } else if (periodType === "yearly") {
        await fetchAllYearlyData();
        const resp = await fetchSpecificPeriodData(null, year, "yearly");
        setData(resp);
      } else {
        const resp = await fetchSpecificPeriodData(
          month.toLowerCase(),
          year,
          "monthly"
        );
        setData(resp);
      }
    } catch (err: any) {
      setError(
        err?.message || "Network error or unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-fetch when filters become valid
  useEffect(() => {
    if (periodType === "monthly") {
      if (month && year) {
        void fetchCashFlowData();
      }
    } else if (periodType === "quarterly") {
      if (selectedQuarter && year) {
        void fetchCashFlowData();
      }
    } else if (periodType === "yearly") {
      if (year) {
        void fetchCashFlowData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodType, month, year, selectedQuarter]);

  // user data (company/brand) for export headers
  const [userData, setUserData] = useState<{
    company_name?: string;
    brand_name?: string;
  } | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      try {
        const res = await fetch("http://127.0.0.1:5000/get_user_data", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(err.error || "Something went wrong.");
          return;
        }
        const json = await res.json();
        setUserData(json);
      } catch {
        setError("Error fetching user data");
      }
    };
    void fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // chart helpers
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1200;
  const barWidthInPixels = Math.max(viewportWidth * 0.05, 40);

  const getLineChartData = () => {
    let labels: string[] = [];
    const datasets: any[] = [];

    if (periodType === "quarterly" && selectedQuarter && quarterlyMonthlyData) {
      labels = quarterMapping[selectedQuarter] || [];
      columnsToDisplay2.forEach((key) => {
        if (!selectedGraphs[key]) return;
        const ds = (quarterMapping[selectedQuarter] || []).map((m) => {
          const md = quarterlyMonthlyData[m];
          const val = md?.[key] ?? 0;
          return Math.abs(Number(val));
        });
        const label = labelMap[key];
        datasets.push({
          label,
          data: ds,
          borderColor: colorMapping[label],
          backgroundColor: `${colorMapping[label]}20`,
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointRadius: 2,
          pointHoverRadius: 3,
        });
      });
    } else if (periodType === "yearly") {
      labels = monthsList;
      columnsToDisplay2.forEach((key) => {
        if (!selectedGraphs[key]) return;
        const ds = monthsList.map((m) => {
          const md = allYearlyData[m];
          const val = md?.[key] ?? 0;
          return Math.abs(Number(val));
        });
        const label = labelMap[key];
        datasets.push({
          label,
          data: ds,
          borderColor: colorMapping[label],
          backgroundColor: `${colorMapping[label]}20`,
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointRadius: 2,
          pointHoverRadius: 3,
        });
      });
    }

    return { labels, datasets };
  };

  const getFilteredBarChartData = () => {
    const filteredKeys = columnsToDisplay2.filter((k) => selectedGraphs[k]);
    return {
      labels: filteredKeys.map((k) => labelMap[k]),
      datasets: [
        {
          label: "Amount",
          data: filteredKeys.map((k) =>
            Math.abs(Number(getSafeValue(k)))
          ),
          backgroundColor: filteredKeys.map(
            (k) => colorMapping[labelMap[k]] || "#999"
          ),
          borderColor: filteredKeys.map(
            (k) => colorMapping[labelMap[k]] || "#666"
          ),
          borderWidth: 1,
          maxBarThickness: barWidthInPixels,
        },
      ],
    };
  };

  const xAxisTitle =
    periodType === "monthly"
      ? `${month} ${year}`
      : periodType === "quarterly"
        ? `${selectedQuarter} (${(quarterMapping[selectedQuarter] || []).join(
          ", "
        )}) ${year}`
        : `${year}`;

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `Amount: ${currencySymbol}${Number(
              tooltipItem.raw
            ).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: xAxisTitle },
        offset: true,
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: `Amount (${currencySymbol})` },
        ticks: {
          callback: (value: any) =>
            `${currencySymbol}${Number(value).toLocaleString()}`,
        },
      },
    },
  } as const;

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false, position: "top" as const },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.dataset.label}: ${currencySymbol}${Number(
              tooltipItem.raw
            ).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text:
            periodType === "quarterly"
              ? `${selectedQuarter} ${year}`
              : "Months",
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: `Amount (${currencySymbol})` },
        ticks: {
          callback: (value: any) =>
            `${currencySymbol}${Number(value).toLocaleString()}`,
        },
      },
    },
    interaction: { mode: "index" as const, intersect: false },
  } as const;

  // exports
  const exportChartToExcel = (chartType: "line" | "bar" = "line") => {
    const chartData =
      chartType === "line"
        ? getLineChartData()
        : getFilteredBarChartData();
    const { labels, datasets } = chartData as any;

    const company = userData?.company_name || "N/A";
    const brand = userData?.brand_name || "N/A";

    const extraHeader = [
      [`Brand: ${brand}`],
      [`Company: ${company}`],
      [`Cash Flow - ${capitalize(periodType)}`],
      [`Time Frame: ${xAxisTitle}`],
      [`Currency: ${currencySymbol}`],
      [`Country: ${capitalize(countryName || "")}`],
      [""],
    ];

    const worksheetData: any[] = [["Metric", ...(labels || [])]];

    (datasets || []).forEach((ds: any) => {
      const row = [
        ds.label,
        ...(ds.data || []).map((v: number) =>
          Number(Number(v).toFixed(2))
        ),
      ];
      worksheetData.push(row);
    });

    const totals = (labels || []).map((_: any, i: number) =>
      (datasets || []).reduce(
        (sum: number, ds: any) => sum + (ds.data?.[i] || 0),
        0
      )
    );
    worksheetData.push([
      "Total",
      ...totals.map((v: number) => Number(Number(v).toFixed(2))),
    ]);

    const finalSheet = [...extraHeader, ...worksheetData];

    const ws = XLSX.utils.aoa_to_sheet(finalSheet);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      chartType === "line" ? "Line Chart Metrics" : "Bar Chart Metrics"
    );

    const fileName = `${chartType === "line" ? "LineChart" : "BarChart"
      }_${periodType}_${year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const downloadTableDataAsExcel = () => {
    if (!data?.summary) return;

    const extraRows = [
      [`Brand: ${userData?.brand_name || "N/A"}`],
      [`Company: ${userData?.company_name || "N/A"}`],
      [`Period Type: ${capitalize(periodType)}`],
      [`Time Frame: ${xAxisTitle}`],
      [`Currency: ${currencySymbol}`],
      [`Country: ${capitalize(countryName || "")}`],
      [""],
    ];

    const tableHeader = [
      ["S.No.", "Category", "", `Amount (${currencySymbol})`],
    ];

    const signs = ["(+)", "(-)", "(-)", "(-)", "(-)", "(-)", "(+)"];

    const tableData = columnsToDisplay2.map((key, index) => {
      const label = labelMap[key];
      const sign = signs[index] || "";
      const isLastRow = index === columnsToDisplay2.length - 1;
      return [
        isLastRow ? "" : index + 1,
        label,
        isLastRow ? "" : sign,
        Number(
          Math.abs(
            getSafeValue(key as keyof SummaryShape)
          ).toFixed(2)
        ),
      ];
    });

    const finalSheetData = [...extraRows, ...tableHeader, ...tableData];

    const ws = XLSX.utils.aoa_to_sheet(finalSheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table Summary");

    const fileName = `SummaryTable_${periodType}_${year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const metrics = columnsToDisplay2.map((key) => ({
    name: key,
    label: labelMap[key],
    color: colorMapping[labelMap[key]],
  }));

  // Handlers for PeriodFiltersTable
  const handleRangeChange = (v: PeriodType) => {
    setPeriodType(v);
    setData(null);
    setError("");
  };

  const handleMonthChange = (lowercaseMonth: string) => {
    setMonth(capitalize(lowercaseMonth));
    setData(null);
    setError("");
  };

  const handleQuarterChange = (q: string) => {
    setSelectedQuarter(q);
    setData(null);
    setError("");
  };

  const handleYearChange = (y: string) => {
    setYear(y);
    setData(null);
    setError("");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <PageBreadcrumb
          pageTitle="Cash Flow"
          variant="page"
          align="left"
          textSize="2xl"
        />
      </div>

      {/* Filters */}
      <div className="mb-[2vh]">
        <div className="flex flex-col md:flex-row items-center gap-[0.5vw]">
          <PeriodFiltersTable
            range={periodType}
            selectedMonth={month.toLowerCase()}
            selectedQuarter={selectedQuarter}
            selectedYear={year}
            yearOptions={years}
            onRangeChange={handleRangeChange}
            onMonthChange={handleMonthChange}
            onQuarterChange={handleQuarterChange}
            onYearChange={handleYearChange}
          />
        </div>
      </div>

      {/* Loading – now using Loader */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
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

      {/* Error */}
      {!!error && (
        <div className="mt-5 box-border flex w-full items-center justify-between rounded-md border-t-4 border-[#ff5c5c] bg-[#f2f2f2] px-4 py-3 text-sm text-[#414042] lg:max-w-fit">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-exclamation mr-2 text-lg text-[#ff5c5c]" />
            <span>
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="flex flex-col">
          {/* <div className="flex items-baseline gap-2 mb-2">
            <PageBreadcrumb
              pageTitle="Cash Generated –"
              variant="page"
              align="left"
              className="mt-0 md:mt-2 mb-0 md:mb-2 "
            />
            <span className="text-[#5EA68E] text-xl sm:text-2xl">
              {xAxisTitle} ({currencySymbol})
            </span>
          </div> */}

          {/* Header + Download in one responsive row */}
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: title + period */}
            <div className="flex flex-wrap items-baseline gap-2">
              <PageBreadcrumb
                pageTitle="Cash Generated –"
                variant="page"
                align="left"
                className="mt-0 md:mt-2 mb-0 md:mb-2"
              />
              <span className="text-[#5EA68E] text-xl sm:text-2xl">
                {xAxisTitle} ({currencySymbol})
              </span>
            </div>

            {/* Right: Download button */}
            <div className="flex justify-start sm:justify-end">
              <Button
                size="sm"
                variant="primary"
                onClick={downloadTableDataAsExcel}
                disabled={allValuesZero}
                endIcon={<FiDownload className="text-yellow-200" />}
              >
                Download (.xlsx)
              </Button>
            </div>
          </div>


          {/* Summary Table */}
          {/* <div className="overflow-x-auto">
            <table className="w-full max-w-[720px] border-collapse text-[clamp(12px,0.729vw,16px)] font-[Lato] text-center">
              <thead>
                <tr className="bg-white text-[#5EA68E] border border-[#414042]">
                  <th className="px-3 py-2 text-center border border-[#414042] w-[60px]">
                    S.No.
                  </th>
                  <th className="px-3 py-2 text-center border border-[#414042]">
                    Category
                  </th>
                  <th className="px-3 py-2 text-center border border-[#414042] w-[60px]"></th>
                  <th className="px-3 py-2 text-center border border-[#414042]">
                    {`Amount (${currencySymbol})`}
                  </th>
                </tr>
              </thead>
              <tbody>
                {columnsToDisplay2
                  .filter((key) => key !== "rembursement_fee")
                  .map((key, index, arr) => {
                    const isLastRow =
                      index === arr.length - 1;
                    const sign =
                      index === 0 || index === 3
                        ? "(+)"
                        : "(-)";
                    const value = Math.abs(
                      getSafeValue(
                        key as keyof SummaryShape
                      )
                    );
                    return (
                      <tr
                        key={key}
                        className="border border-[#414042] bg-gray-50"
                      >
                        <td className="px-3 py-2 text-center border border-[#414042]">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 border border-[#414042] font-semibold text-[#414042]">
                          {labelMap[key]}
                        </td>
                        <td className="px-3 py-2 text-center border border-[#414042]">
                          {!isLastRow && (
                            <span
                              className={`${index === 0 ||
                                index === 3
                                ? "text-green-600"
                                : "text-red-600"
                                } font-semibold`}
                            >
                              {sign}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center border border-[#414042]">
                          {value.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div> */}

          {/* Summary Table using DataTable */}
          <div className="w-full max-w-[720px]">
            <DataTable<SummaryRow>
              columns={summaryColumns}
              data={summaryRows}
              paginate={false}
              scrollY={false}
              showCellTitle={false}
              tableClassName="!min-w-0 w-full border-collapse text-[clamp(12px,0.729vw,16px)] font-[Lato]"
              className="border border-[#414042] rounded-md overflow-hidden"
            />
          </div>


          {/* <div className="mt-2 w-full flex justify-center md:justify-start">
            <Button
              size="sm"
              variant="primary"
              onClick={downloadTableDataAsExcel}
              disabled={allValuesZero}
              endIcon={
                <FiDownload className="text-yellow-200" />
              }
            >
              Download (.xlsx)
            </Button>
          </div> */}

          {/* Chart Section */}
          <div className="mt-6 rounded-xl bg-white p-4 shadow border">
            <div
              className="flex flex-wrap items-center gap-2 md:gap-3 mb-4"
              style={{
                opacity: allValuesZero ? 0.3 : 1,
                transition: "opacity 0.3s ease",
              }}
            >
              {columnsToDisplay2.map((name) => {
                const label = labelMap[name];
                const color = colorMapping[label];
                const isChecked = !!selectedGraphs[name];

                return (
                  <label
                    key={name}
                    className={[
                      "shrink-0",
                      "flex items-center gap-1 sm:gap-1.5",
                      "font-semibold cursor-pointer select-none whitespace-nowrap",
                      "text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs xl:text-sm",
                      "underline decoration-2 underline-offset-[2px]",
                      isChecked ? "opacity-100" : "opacity-40",
                    ].join(" ")}
                    style={{ color }}
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={isChecked}
                      onChange={(e) =>
                        setSelectedGraphs((prev) => ({
                          ...prev,
                          [name]: e.target.checked,
                        }))
                      }
                      disabled={allValuesZero}
                      className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm cursor-pointer disabled:cursor-not-allowed"
                      style={{
                        accentColor: color,
                      }}
                    />
                    <span>{label.toUpperCase()}</span>
                  </label>
                );
              })}
            </div>

            <div className="h-[50vh] sm:h-[40vw] max-h-[560px]">
              {periodType === "monthly" ? (
                <Bar
                  data={getFilteredBarChartData() as any}
                  options={barChartOptions as any}
                />
              ) : (
                <Line
                  data={getLineChartData() as any}
                  options={lineChartOptions as any}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlowPage;
