"use client";

import React from "react";

type ValueMode = "lower" | "preserve";

export interface MonthYearPickerTableProps {
  month: string;                          // current month value (string)
  year: string | number;                  // current year value
  yearOptions: (string | number)[];       // list of year options
  onMonthChange: (value: string) => void; // emitted month value
  onYearChange: (value: string) => void;  // emitted year value
  valueMode?: ValueMode;                  // 'lower' = emit lowercase months (default: 'preserve')
  className?: string;                     // extra class if needed
  monthsOverride?: string[];              // optionally pass your own months list
}

/**
 * A compact Month/Year dropdown rendered as a table with sticky headers,
 * matching your referral fees dropdown styling.
 */
const MonthYearPickerTable: React.FC<MonthYearPickerTableProps> = ({
  month,
  year,
  yearOptions,
  onMonthChange,
  onYearChange,
  valueMode = "preserve",
  className = "",
  monthsOverride,
}) => {
  // Default months (capitalized for display). Values emitted depend on valueMode.
  const DEFAULT_MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const months = monthsOverride && monthsOverride.length ? monthsOverride : DEFAULT_MONTHS;

  // Determine <select> value shown. If caller passes a lowercase like "january",
  // we still want the select to show it correctly by matching (case-insensitively).
  const normalizeForSelect = (m: string) => {
    if (!m) return "";
    const idx = months.findIndex((x) => x.toLowerCase() === m.toLowerCase());
    return idx >= 0 ? months[idx] : m; // fall back to whatever came
  };

  const selectMonthValue = normalizeForSelect(month);

  const emitMonth = (raw: string) => {
    if (!raw) {
      onMonthChange("");
      return;
    }
    const emitted = valueMode === "lower" ? raw.toLowerCase() : raw;
    onMonthChange(emitted);
  };

  return (
    <div
      className={[
        "border-collapse rounded w-auto min-w-[80px] max-w-[100px]",
        className,
      ].join(" ")}
    >
      <table className="border-collapse rounded w-auto min-w-[80px] max-w-[100px]">
        <thead>
          <tr className="bg-white text-[#5EA68E] border border-[#414042]">
            <th className="px-3 py-2 text-center border border-[#414042] text-xs">Month</th>
            <th className="px-3 py-2 text-center border border-[#414042] text-xs">Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-3 py-2 text-center border border-[#414042]">
              <select
                className="text-center text-xs outline-none"
                value={selectMonthValue}
                onChange={(e) => emitMonth(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-3 py-2 text-center border border-[#414042]">
              <select
                className="text-center text-xs outline-none"
                value={String(year ?? "")}
                onChange={(e) => onYearChange(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MonthYearPickerTable;
