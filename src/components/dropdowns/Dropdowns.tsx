"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Bargraph from "./BarGraph";
import GraphPage from "./GraphPage";
import CircleChart from "./CircleChart";
import CMchartofsku from "./CMchartofsku";
import SKUtable from "./SKUtable";
import IntegrationDashboard from "@/features/integration/IntegrationDashboard";
import PageBreadcrumb from "../common/PageBreadCrumb";
import Button from "../ui/button/Button";
import { AiOutlinePlus } from "react-icons/ai";
import { Modal } from "@/components/ui/modal";
import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";

/* ---------------------- Types ---------------------- */
type Summary = {
    unit_sold: number;
    total_sales: number;
    total_expense: number;
    cm2_profit: number;
    total_cous?: number;
    otherwplatform?: number;
    advertising_total?: number;
    total_amazon_fee?: number;
};

type UploadHistoryResponse = {
    summary: Summary;
    [key: string]: unknown;
};

type RangeType = "monthly" | "quarterly" | "yearly" | "";

/** Quarter union and helpers */
type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
const isQuarter = (v: string): v is Quarter =>
    (["Q1", "Q2", "Q3", "Q4"] as const).includes(v as Quarter);

type DropdownsProps = {
    initialRanged: string;
    initialCountryName: string;
    initialMonth: string;
    initialYear: string;
};

/* ---------------------- Utils ---------------------- */
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

const getQuarterFromMonth = (m: string): Quarter | "" => {
    const month = (m ?? "").toLowerCase();
    const quarters: Record<Quarter, string[]> = {
        Q1: ["january", "february", "march"],
        Q2: ["april", "may", "june"],
        Q3: ["july", "august", "september"],
        Q4: ["october", "november", "december"],
    };
    for (const q of Object.keys(quarters) as Quarter[]) {
        if (quarters[q].includes(month)) return q;
    }
    return "";
};

/* ---------------------- Component ---------------------- */
const Dropdowns: React.FC<DropdownsProps> = ({
    initialRanged,
    initialCountryName,
    initialMonth,
    initialYear,
}) => {
    const router = useRouter();

    // params from parent
    const ranged = initialRanged;
    const countryName = initialCountryName;
    const month = initialMonth;
    const year = initialYear;

    const currencySymbol = countryName ? getCurrencySymbol(countryName) : "¤";

    const [range, setRange] = useState<RangeType>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedQuarter, setSelectedQuarter] = useState<Quarter | "">("");
    const [uploadsData, setUploadsData] = useState<UploadHistoryResponse | null>(
        null
    );
    const [allDropdownsSelected, setAllDropdownsSelected] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);


    const yearOptions = useMemo(
        () => [new Date().getFullYear(), new Date().getFullYear() - 1].map(String),
        []
    );

    const zeroData: Summary = {
        unit_sold: 0,
        total_sales: 0,
        total_expense: 0,
        cm2_profit: 0,
        total_cous: 0,
        otherwplatform: 0,
        advertising_total: 0,
        total_amazon_fee: 0,
    };

    const displayData: Summary =
        allDropdownsSelected && uploadsData?.summary
            ? uploadsData.summary
            : zeroData;

    const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value as RangeType;
        setRange(val);
        setSelectedMonth("");
        setSelectedQuarter("");
        setSelectedYear("");
        setUploadsData(null);
    };

    const fetchUploadHistory = async (
        rangeType: RangeType,
        monthVal: string,
        quarterVal: string, // safe for the API as plain string
        yearVal: string,
        country: string
    ) => {
        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("jwtToken")
                    : null;

            const url = new URL("http://127.0.0.1:5000/upload_history2");
            url.searchParams.set("range", rangeType);
            url.searchParams.set("month", monthVal);
            url.searchParams.set("quarter", quarterVal);
            url.searchParams.set("year", yearVal);
            url.searchParams.set("country", country);

            const res = await fetch(url.toString(), {
                method: "GET",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                cache: "no-store",
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error(`API Error: ${err?.error ?? res.statusText}`);
                setUploadsData(null);
                return;
            }

            const data: UploadHistoryResponse = await res.json();
            setUploadsData(data);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setUploadsData(null);
        }
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        setSelectedMonth(v);
        if (selectedYear) {
            fetchUploadHistory(range, v, selectedQuarter || "", selectedYear, countryName);
        } else {
            setUploadsData(null);
        }
    };

    const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const raw = e.target.value;
        const v = isQuarter(raw) ? raw : "";
        setSelectedQuarter(v);

        if (selectedYear && v) {
            fetchUploadHistory(range, selectedMonth, v, selectedYear, countryName);
        } else {
            setUploadsData(null);
        }
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        setSelectedYear(v);
        if (
            (range === "monthly" && selectedMonth) ||
            (range === "quarterly" && selectedQuarter) ||
            range === "yearly"
        ) {
            fetchUploadHistory(range, selectedMonth, selectedQuarter || "", v, countryName);
        } else {
            setUploadsData(null);
        }
    };

    // Initialize range & selections from incoming params
    useEffect(() => {
        if (ranged === "QTD") {
            setRange("quarterly");
            const q = getQuarterFromMonth(month);
            setSelectedQuarter(q); // Quarter | ""
            setSelectedYear(year);
        } else if (ranged === "MTD") {
            setRange("monthly");
            setSelectedMonth(month);
            setSelectedYear(year);
        } else if (ranged === "YTD") {
            setRange("yearly");
            setSelectedYear(year);
        }
    }, [ranged, month, year]);

    // Auto-fetch when selections change
    useEffect(() => {
        if (!countryName) return;
        if (range === "") return;

        fetchUploadHistory(
            range,
            selectedMonth,
            selectedQuarter || "",
            selectedYear,
            countryName
        );
    }, [range, selectedMonth, selectedQuarter, selectedYear, countryName]);

    // Validate dropdown completeness
    useEffect(() => {
        if (range === "monthly") {
            setAllDropdownsSelected(!!selectedMonth && !!selectedYear);
        } else if (range === "quarterly") {
            setAllDropdownsSelected(!!selectedQuarter && !!selectedYear);
        } else if (range === "yearly") {
            setAllDropdownsSelected(!!selectedYear);
        } else {
            setAllDropdownsSelected(false);
        }
    }, [range, selectedMonth, selectedQuarter, selectedYear]);

    const goBack = () => router.push("/country/QTD/global/NA/NA");

    if (month === "NA" || year === "NA") {
        return <IntegrationDashboard />;
    }

    return (
        <div className="space-y-4">
            {/* Back button */}
            <div className="flex justify-start mb-3">
                <button
                    onClick={goBack}
                    aria-label="Go back"
                    title="Go back"
                    className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 font-semibold text-amber-100 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                    <i className="fa-solid fa-arrow-left" />
                    Back
                </button>
            </div>

            <div className="flex gap-2">
                <PageBreadcrumb pageTitle="Financial Metrics -" variant="page" align="left" textSize="2xl" />
                <span className="text-[#5EA68E] text-2xl">
                    {countryName?.toLowerCase() === "global"
                        ? "GLOBAL"
                        : countryName?.toUpperCase()}
                </span>
            </div>


            <div className="flex flex-col md:flex-row md:items-center md:gap-10 gap-4 w-full md:justify-start justify-center">

                {/* Period / Range / Year Table */}
                <div
                    className={[
                        "rounded-md w-full md:w-[18vw] min-w-[200px]",
                        range === "yearly" ? "md:max-w-[100px]" : "",
                    ].join(" ")}
                >
                    <table className="w-full border-collapse text-[clamp(12px,0.729vw,16px)] font-[Lato]">
                        <thead>
                            <tr className="bg-white text-[#5EA68E] border border-[#414042]">
                                <th className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">Period</th>
                                {(range === "quarterly" || range === "monthly") && (
                                    <th className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">Range</th>
                                )}
                                <th className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">
                                    <select
                                        value={range}
                                        onChange={handleRangeChange}
                                        className="min-w-[60px] w-auto text-center focus:outline-none"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </td>

                                {range === "monthly" && (
                                    <>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">
                                            <select
                                                value={selectedMonth}
                                                onChange={handleMonthChange}
                                                className="min-w-[60px] w-auto text-center focus:outline-none"
                                            >
                                                <option value="">Select</option>
                                                {[
                                                    "january", "february", "march", "april", "may", "june",
                                                    "july", "august", "september", "october", "november", "december",
                                                ].map((m) => (
                                                    <option key={m} value={m}>
                                                        {m[0].toUpperCase() + m.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">
                                            <select
                                                value={selectedYear}
                                                onChange={handleYearChange}
                                                className="min-w-[60px] w-auto text-center focus:outline-none"
                                            >
                                                <option value="">Select</option>
                                                {yearOptions.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </>
                                )}

                                {range === "quarterly" && (
                                    <>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">
                                            <select
                                                value={selectedQuarter}
                                                onChange={handleQuarterChange}
                                                className="min-w-[60px] w-auto text-center focus:outline-none"
                                            >
                                                <option value="">Select</option>
                                                {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                                                    <option key={q} value={q}>{q}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">
                                            <select
                                                value={selectedYear}
                                                onChange={handleYearChange}
                                                className="min-w-[60px] w-auto text-center focus:outline-none"
                                            >
                                                <option value="">Select</option>
                                                {yearOptions.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </>
                                )}

                                {range === "yearly" && (
                                    <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">
                                        <select
                                            value={selectedYear}
                                            onChange={handleYearChange}
                                            className="min-w-[60px] w-auto text-center focus:outline-none"
                                        >
                                            <option value="">Select</option>
                                            {yearOptions.map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Summary Table */}
                {uploadsData?.summary &&
                    (() => {
                        const summary = displayData;
                        const isSummaryZero =
                            summary.unit_sold === 0 &&
                            summary.total_sales === 0 &&
                            summary.total_expense === 0 &&
                            summary.cm2_profit === 0;

                        return (
                            <table
                                className={[
                                    "border-collapse rounded-md text-[clamp(12px,0.729vw,16px)] font-[Lato] w-full md:w-[18vw]",
                                    isSummaryZero ? "opacity-30" : "opacity-100",
                                ].join(" ")}
                            >
                                <thead>
                                    <tr className="bg-white text-[#5EA68E] border border-[#414042]">
                                        <th className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">Units</th>
                                        <th className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">Sales</th>
                                        <th className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">Expense</th>
                                        <th className="px-[0.9vw] py-[1vh] text-center border border-[#414042] whitespace-nowrap">CM2 Profit</th>
                                        <th className="px-[0.9vw] py-[1vh] text-center border border-[#414042] whitespace-nowrap">CM2 Profit (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">{summary.unit_sold}</td>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042] whitespace-nowrap">
                                            {currencySymbol}{" "}
                                            {summary.total_sales.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042] whitespace-nowrap">
                                            {currencySymbol}{" "}
                                            {summary.total_expense.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042] whitespace-nowrap">
                                            {currencySymbol}{" "}
                                            {summary.cm2_profit.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-[0.9vw] py-[1vh] text-center border border-[#414042]">
                                            {summary.total_sales > 0
                                                ? `${((summary.cm2_profit / summary.total_sales) * 100).toFixed(2)}%`
                                                : "0%"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        );
                    })()}

                {/* Upload Button */}
                {countryName !== "global" && (
                    // <div className="w-full md:w-auto flex justify-center md:justify-end">
                    //     <Button
                    //         variant="primary"
                    //         size="sm"
                    //         onClick={() => router.push(`/Upload/${countryName}?country=${countryName}`)}
                    //     // className="rounded-md bg-slate-800 px-4 py-2 font-semibold text-amber-100 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 whitespace-nowrap"
                    //     >
                    //         Upload MTD &nbsp; <AiOutlinePlus className="text-yellow-200" />
                    //     </Button>
                    // </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowUploadModal(true)}
                    >
                        Upload MTD &nbsp; <AiOutlinePlus className="text-yellow-200" />
                    </Button>

                )}
            </div>


            {/* Charts & Tables */}
            {range === "monthly" && selectedMonth && selectedYear && (
                <>
                    <Bargraph
                        range={range}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        countryName={initialCountryName}
                    />
                    <div className="flex flex-wrap justify-between gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <CircleChart
                                range={range}
                                month={selectedMonth}
                                year={selectedYear}
                                countryName={initialCountryName}
                            />
                        </div>
                        <div className="flex-1 min-w-[300px]">
                            <CMchartofsku
                                range={range}
                                month={selectedMonth}
                                year={selectedYear}
                                countryName={initialCountryName}
                            />
                        </div>
                    </div>
                    <SKUtable
                        range={range}
                        month={selectedMonth}
                        year={selectedYear}
                        countryName={initialCountryName}
                    />
                </>
            )}

            {range === "quarterly" && isQuarter(selectedQuarter) && selectedYear && (
                <>
                    <GraphPage
                        range={range}
                        selectedQuarter={selectedQuarter}
                        selectedYear={selectedYear}
                        countryName={initialCountryName}
                    />
                    <div className="flex flex-wrap justify-between gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <CircleChart
                                range={range}
                                selectedQuarter={selectedQuarter}
                                year={selectedYear}
                                countryName={initialCountryName}
                            />
                        </div>
                        <div className="flex-1 min-w-[300px]">
                            <CMchartofsku
                                range={range}
                                selectedQuarter={selectedQuarter}
                                year={selectedYear}
                                countryName={initialCountryName}
                            />
                        </div>
                    </div>
                    <SKUtable
                        range={range}
                        quarter={selectedQuarter}
                        year={selectedYear}
                        countryName={initialCountryName}
                    />
                </>
            )}

            {range === "yearly" && selectedYear && (
                <>
                    <GraphPage range={range} selectedYear={selectedYear} countryName={initialCountryName} />
                    <div className="flex flex-wrap justify-between gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <CircleChart range={range} year={selectedYear} countryName={initialCountryName} />
                        </div>
                        <div className="flex-1 min-w-[300px]">
                            <CMchartofsku range={range} year={selectedYear} countryName={initialCountryName} />
                        </div>
                    </div>
                    <SKUtable range={range} year={selectedYear} countryName={initialCountryName} />
                </>
            )}

            <Modal
  isOpen={showUploadModal}
  onClose={() => setShowUploadModal(false)}
  className="max-w-3xl w-[90vw] mx-auto p-0" // nice roomy modal
  showCloseButton
>
  <div className="max-h-[85vh] overflow-y-auto">
    <FileUploadForm
      initialCountry={initialCountryName}
      onClose={() => setShowUploadModal(false)}
      onComplete={() => {
        // Close the modal
        setShowUploadModal(false);

        // Optional: refresh the summary after a successful upload using current selections
        fetchUploadHistory(
          range,
          selectedMonth,
          selectedQuarter || "",
          selectedYear,
          initialCountryName
        );
      }}
    />
  </div>
</Modal>

        </div>
    );
};

export default Dropdowns;
