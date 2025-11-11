"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";
import MonthYearPickerTable from "@/components/filters/MonthYearPickerTable";

// ---- Types ----
type TableRow = Partial<{
    sku: string;
    quantity: number | string;
    marketplace: string;
    product_sales: number | string;
    product_sales_tax: number | string;
    postage_credits: number | string;
    promotional_rebates: number | string;
    selling_fees: number | string;
    product_name: string;
    difference: number | string;
    errorstatus: string;
    answer: string;
    // ...other possible keys from your backend are ignored by design
}>;

export default function ReferralFeesPage() {
    // If your route is /referral-fees/[countryName]/[month]/[year]
    const params = useParams<{
        countryName?: string;
        month?: string;
        year?: string;
    }>();

    const countryName = (params?.countryName || "").toString();
    const monthParam = (params?.month || "").toString();
    const yearParam = (params?.year || "").toString();

    const months = [
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

    const years = useMemo(
        () => Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i),
        []
    );

    const [month, setMonth] = useState<string>(monthParam || "");
    const [year, setYear] = useState<string>(yearParam || "");
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    // === Column filtering config ===
    const VISIBLE_COLUMNS: (keyof TableRow)[] = [
        "sku",
        "quantity",
        "marketplace",
        "product_sales",
        "product_sales_tax",
        "postage_credits",
        "promotional_rebates",
        "selling_fees",
        "product_name",
        "difference",
        "errorstatus",
        "answer",
    ];

    const COLUMN_LABELS: Record<keyof TableRow, string> = {
        sku: "SKU",
        quantity: "Quantity",
        marketplace: "Marketplace",
        product_sales: "Product Sales",
        product_sales_tax: "Product Sales Tax",
        postage_credits: "Postage Credits",
        promotional_rebates: "Promotional Rebates",
        selling_fees: "Selling Fees",
        product_name: "Product Name",
        difference: "Difference",
        errorstatus: "Error Status",
        answer: "Answer",
    };

    // Derive the columns to render (only those present in the data)
    const columns = useMemo(() => {
        if (tableData?.length) {
            return VISIBLE_COLUMNS.filter((c) => c in tableData[0]);
        }
        return VISIBLE_COLUMNS;
    }, [tableData]);

    // Create a filtered view of the data for rendering & export
    const filteredRows = useMemo(
        () =>
            tableData.map((row) =>
                Object.fromEntries(columns.map((c) => [c, (row as any)?.[c]]))
            ) as TableRow[],
        [tableData, columns]
    );

    // Build filename safely (guard against missing/invalid token)
    const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
    let userid = "unknown";
    try {
        if (token) {
            const decoded: any = jwtDecode(token);
            userid = decoded?.user_id?.toString() ?? "unknown";
        }
    } catch {
        // ignore decode errors; userid stays "unknown"
    }

    const fileName = `user_${userid}_${countryName}_${month}${year}_data`.toLowerCase();

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const authToken = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
            const response = await fetch(
                `http://127.0.0.1:5000/get_table_data/${fileName}`,
                {
                    method: "GET",
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
                }
            );

            if (!response.ok) throw new Error("Failed to fetch table data");
            const data = (await response.json()) as TableRow[];
            setTableData(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            setError(err?.message || "Unknown error");
            setTableData([]);
        } finally {
            setLoading(false);
        }
    };

    // Keep state in sync if params change (e.g., via navigation)
    useEffect(() => {
        if (monthParam && monthParam !== month) setMonth(monthParam);
        if (yearParam && yearParam !== year) setYear(yearParam);
    }, [monthParam, yearParam]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (month && year && countryName) {
            fetchTableData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [month, year, countryName]);

    const handleDownload = () => {
        const exportRows = filteredRows.map((row) => {
            const out: Record<string, any> = {};
            columns.forEach((c) => {
                const label = COLUMN_LABELS[c] || (c as string);
                out[label] = (row as any)[c];
            });
            return out;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Referral-fees-${month}-${year}-${countryName}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="font-sans text-[#414042]">
            <h2 className="text-base md:text-lg font-bold bg-white rounded-md">
                Referral Fees Error Status Recon{" "}
                <span className="text-[#60a68e]">
                    {countryName ? countryName.toUpperCase() : ""}
                </span>
            </h2>

            {/* Dropdowns */}
           
            <MonthYearPickerTable
                month={month}                             // could be lowercase like "november"
                year={year}
                yearOptions={years}
                onMonthChange={(v) => setMonth(v)}        // v will be lowercase because of valueMode="lower"
                onYearChange={(v) => setYear(v)}
                valueMode="lower"                         // emit lowercase to match backend/URL
            />

            {/* Loader & Errors */}
            {loading && <div className="text-sm">Loading...</div>}
            {!loading && error && tableData.length === 0 && (
                <div className="text-sm text-red-600">Error: {error}</div>
            )}

            {!loading && month && year && countryName && (
                <>
                    {/* Data table (filtered to VISIBLE_COLUMNS) */}
                    <div className="w-full overflow-x-auto overflow-y-auto mt-2 max-h-[65vh] scrollbar-thin scrollbar-thumb-[#5EA68E] scrollbar-track-gray-100">
                        <table className="min-w-max border-collapse text-sm">
                            <thead className="sticky top-0 z-10">
                                <tr>
                                    {columns.map((key) => (
                                        <th
                                            key={key as string}
                                            className="px-4 py-3 text-center bg-[#5EA68E] text-[#f8edcf] border border-[#747070] first:text-left"
                                        >
                                            {COLUMN_LABELS[key] || (key as string)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="odd:bg-white even:bg-[#f9f9f9] hover:bg-[rgb(72,168,135)]"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={`${index}-${String(col)}`}
                                                className="px-4 py-3 text-center border border-[#747070] whitespace-nowrap overflow-hidden text-ellipsis hover:bg-[#f8f8f8] first:text-left"
                                            >
                                                {(row as any)[col] ?? ""}
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                {!filteredRows.length && (
                                    <tr>
                                        <td
                                            className="text-center py-6 text-slate-500"
                                            colSpan={Math.max(columns.length, 1)}
                                        >
                                            {month && year
                                                ? "No data to display."
                                                : "Please select Month & Year."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {tableData.length > 0 && (
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded bg-[#2c3e50] text-[#f8edcf] shadow hover:bg-[#34495e] active:shadow-sm active:translate-y-[1px] mt-3"
                        >
                            Referral Fees sheet for {month} {year} {countryName.toUpperCase()}
                            <i className="fa-solid fa-download fa-beat" />
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
