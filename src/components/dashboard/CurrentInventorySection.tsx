"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Loader from "@/components/loader/Loader";
import { getISTYearMonth } from "@/lib/dashboard/date";
import { toNumberSafe } from "@/lib/dashboard/format";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

type InventoryRow = Record<string, string | number>;

type Props = {
  /** Country name used for fetching / labelling, e.g. "global", "uk", "us" */
  inventoryCountry: string;
};

export default function CurrentInventorySection({
  inventoryCountry,
}: Props) {
  const [invLoading, setInvLoading] = useState(false);
  const [invError, setInvError] = useState<string>("");
  const [invRows, setInvRows] = useState<InventoryRow[]>([]);

  // current IST month/year for request
  const invMonthYear = useMemo(() => {
    const { monthName, year } = getISTYearMonth();
    return { month: monthName.toLowerCase(), year: String(year) };
  }, []);

  const getCurrentInventoryEndpoint = useCallback(() => {
    return inventoryCountry.toLowerCase() === "global"
      ? `${baseURL}/current_inventory_global`
      : `${baseURL}/current_inventory`;
  }, [inventoryCountry]);

  // column name helpers coming from backend
  const findMtdKey = useCallback((row: InventoryRow) => {
    const key = Object.keys(row).find((k) =>
      k.toLowerCase().startsWith("current month units sold")
    );
    return key || "";
  }, []);

  const findSales30Key = useCallback((row: InventoryRow) => {
    const keys = Object.keys(row);

    const exactOthers = keys.find(
      (k) => k.trim().toLowerCase() === "others"
    );
    if (exactOthers) return exactOthers;

    const past30 = keys.find((k) =>
      k.toLowerCase().includes("past 30")
    );
    if (past30) return past30;

    const days30 = keys.find((k) =>
      k.toLowerCase().includes("30 days")
    );
    if (days30) return days30;

    const same = keys.find(
      (k) =>
        k.trim().toLowerCase() === "sales for past 30 days"
    );
    if (same) return same;

    return "";
  }, []);

  const invDisplayedColumns = useMemo(
    () => [
      "Sno.",
      ...(inventoryCountry.toLowerCase() !== "global" ? ["SKU"] : []),
      "Product Name",
      "Current Inventory",
      "MTD Sales",
      "Sales for past 30 days",
      "Inventory Coverage Ratio (In Months)",
      "Inventory Alerts",
    ],
    [inventoryCountry]
  );

  const getInvCellValue = useCallback(
    (row: InventoryRow, col: string) => {
      const beginningKey = "Inventory at the beginning of the month";
      const inwardKey = "Inventory Inwarded";

      const mtdKey = findMtdKey(row);
      const sales30Key = findSales30Key(row);

      const currentInventory = toNumberSafe(row[beginningKey]);
      const mtdSales = toNumberSafe(mtdKey ? row[mtdKey] : 0);
      const sales30 = toNumberSafe(
        sales30Key ? row[sales30Key] : 0
      );
      const inwarded = toNumberSafe(row[inwardKey]);

      switch (col) {
        case "SKU":
          return row["SKU"];
        case "Product Name":
          return row["Product Name"];
        case "Current Inventory":
          return currentInventory;
        case "MTD Sales":
          return mtdSales;
        case "Sales for past 30 days":
          return sales30;
        case "Inventory Coverage Ratio (In Months)": {
          const denom = mtdSales + sales30;
          if (!denom || denom <= 0) return "—";
          const ratio = currentInventory / denom;
          return Number.isFinite(ratio) ? ratio : "—";
        }
        case "Inventory Alerts": {
          const denom = mtdSales + sales30;
          if (!denom || denom <= 0) return "";
          const ratio = currentInventory / denom;
          if (ratio < 1) return "Low";
          if (ratio < 2) return "Watch";
          return "";
        }
        default:
          return row[col as keyof InventoryRow];
      }
    },
    [findMtdKey, findSales30Key]
  );

  const splitInventoryRows = useMemo(() => {
    if (!invRows?.length)
      return {
        top5: [] as InventoryRow[],
        other: [] as InventoryRow[],
      };

    const usable = invRows.filter((r) => {
      const name = String(r["Product Name"] ?? "").trim();
      const sku = String(r["SKU"] ?? "").trim();
      return name.length > 0 || sku.length > 0;
    });

    const withMtd = usable.map((r) => {
      const mtdKey = findMtdKey(r);
      const mtd = toNumberSafe(mtdKey ? r[mtdKey] : 0);
      return { row: r, mtd };
    });

    withMtd.sort((a, b) => b.mtd - a.mtd);

    return {
      top5: withMtd.slice(0, 5).map((x) => x.row),
      other: withMtd.slice(5).map((x) => x.row),
    };
  }, [invRows, findMtdKey]);

  const fetchCurrentInventory = useCallback(async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("jwtToken")
        : null;

    if (!token) {
      setInvError("Authorization token is missing");
      setInvRows([]);
      return;
    }

    setInvLoading(true);
    setInvError("");

    try {
      const endpoint = getCurrentInventoryEndpoint();
      const { month, year } = invMonthYear;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month,
          year,
          country: inventoryCountry,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(
          errJson?.error || "Failed to fetch CurrentInventory data"
        );
      }

      const json = await res.json();
      const fileData: string | undefined = json?.data;
      if (!fileData) {
        throw new Error(
          json?.message || "Empty file received from server"
        );
      }

      // decode base64 → ArrayBuffer
      const byteCharacters = atob(fileData);
      const buffers: ArrayBuffer[] = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += 1024
      ) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        buffers.push(
          new Uint8Array(byteNumbers).buffer as ArrayBuffer
        );
      }

      const blob = new Blob(buffers, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(arr, { type: "array" });
        const sheetName = wb.SheetNames[0];
        const sheet = wb.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<InventoryRow>(
          sheet,
          { defval: "" }
        );
        setInvRows(jsonData);
      };

      reader.readAsArrayBuffer(blob);
    } catch (e: any) {
      setInvError(e?.message || "Unknown error");
      setInvRows([]);
    } finally {
      setInvLoading(false);
    }
  }, [
    getCurrentInventoryEndpoint,
    invMonthYear,
    inventoryCountry,
  ]);

  useEffect(() => {
    fetchCurrentInventory();
  }, [fetchCurrentInventory]);

  // label for heading: "Dec '25" etc
  const monthLabel = useMemo(() => {
    const { monthName, year } = getISTYearMonth();
    const shortMon = new Date(
      `${monthName} 1, ${year}`
    ).toLocaleString("en-US", {
      month: "short",
      timeZone: "Asia/Kolkata",
    });
    return `${shortMon} '${String(year).slice(-2)}`;
  }, []);

  return (
    <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <PageBreadcrumb
            pageTitle="Current Inventory -"
            variant="page"
            align="left"
          />
          <span className="text-[#5EA68E] text-lg font-semibold">
            {monthLabel}
          </span>
        </div>
        <p className="mt-1 text-sm text-charcoal-500">
          Auto-loaded for the current month
        </p>
      </div>

      {/* Content */}
      {invLoading ? (
        <div className="py-10 flex justify-center">
          <Loader
            src="/infinity-unscreen.gif"
            size={40}
            transparent
            roundedClass="rounded-full"
            backgroundClass="bg-transparent"
            respectReducedMotion
          />
        </div>
      ) : invError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {invError}
        </div>
      ) : invRows.length > 0 ? (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-[900px] w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {invDisplayedColumns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-center text-sm font-semibold border border-gray-300 bg-[#5EA68E] text-[#f8edcf]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* TOP 5 HEADER */}
              <tr className="bg-white">
                <td
                  colSpan={invDisplayedColumns.length}
                  className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border-0 border-t border-gray-300"
                >
                  Top 5 Products
                </td>
              </tr>

              {splitInventoryRows.top5.map((row, index) => (
                <tr key={`top-${index}`} className="bg-white">
                  {invDisplayedColumns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2 text-center text-sm text-gray-800 border border-gray-300"
                    >
                      {col === "Sno."
                        ? index + 1
                        : (() => {
                            const v = getInvCellValue(row, col);

                            if (typeof v === "number") {
                              if (
                                col ===
                                "Inventory Coverage Ratio (In Months)"
                              )
                                return v.toFixed(1);
                              return v.toLocaleString();
                            }
                            return String(v ?? "");
                          })()}
                    </td>
                  ))}
                </tr>
              ))}

              {/* OTHER HEADER */}
              <tr className="bg-white">
                <td
                  colSpan={invDisplayedColumns.length}
                  className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border-0 border-t border-gray-300"
                >
                  Other Products
                </td>
              </tr>

              {splitInventoryRows.other.map((row, index) => (
                <tr key={`other-${index}`} className="bg-white">
                  {invDisplayedColumns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2 text-center text-sm text-gray-800 border border-gray-300"
                    >
                      {col === "Sno."
                        ? index + 1
                        : (() => {
                            const v = getInvCellValue(row, col);

                            if (typeof v === "number") {
                              if (
                                col ===
                                "Inventory Coverage Ratio (In Months)"
                              )
                                return v.toFixed(1);
                              return v.toLocaleString();
                            }
                            return String(v ?? "");
                          })()}
                    </td>
                  ))}
                </tr>
              ))}

              {/* TOTAL ROW */}
              <tr className="bg-white">
                <td
                  className="px-3 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300"
                  colSpan={
                    inventoryCountry.toLowerCase() !== "global"
                      ? 3
                      : 2
                  }
                >
                  Total
                </td>

                {invDisplayedColumns
                  .slice(
                    inventoryCountry.toLowerCase() !== "global"
                      ? 3
                      : 2
                  )
                  .map((col) => {
                    const all = splitInventoryRows.top5.concat(
                      splitInventoryRows.other
                    );

                    if (
                      col ===
                      "Inventory Coverage Ratio (In Months)"
                    ) {
                      const totalInv = all.reduce(
                        (s, r) =>
                          s +
                          toNumberSafe(
                            getInvCellValue(
                              r,
                              "Current Inventory"
                            )
                          ),
                        0
                      );
                      const totalMtd = all.reduce(
                        (s, r) =>
                          s +
                          toNumberSafe(
                            getInvCellValue(r, "MTD Sales")
                          ),
                        0
                      );
                      const total30 = all.reduce(
                        (s, r) =>
                          s +
                          toNumberSafe(
                            getInvCellValue(
                              r,
                              "Sales for past 30 days"
                            )
                          ),
                        0
                      );

                      const denom = totalMtd + total30;
                      const ratio =
                        denom > 0 ? totalInv / denom : 0;

                      return (
                        <td
                          key={col}
                          className="px-3 py-2 text-center text-sm font-semibold text-gray-900 border border-gray-300"
                        >
                          {denom > 0 ? ratio.toFixed(1) : "—"}
                        </td>
                      );
                    }

                    if (col === "Inventory Alerts") {
                      return (
                        <td
                          key={col}
                          className="px-3 py-2 text-center text-sm font-semibold text-gray-900 border border-gray-300"
                        />
                      );
                    }

                    const total = all.reduce(
                      (s, r) =>
                        s +
                        toNumberSafe(
                          getInvCellValue(r, col)
                        ),
                      0
                    );

                    return (
                      <td
                        key={col}
                        className="px-3 py-2 text-center text-sm font-semibold text-gray-900 border border-gray-300"
                      >
                        {total.toLocaleString()}
                      </td>
                    );
                  })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          No inventory data.
        </div>
      )}
    </div>
  );
}
