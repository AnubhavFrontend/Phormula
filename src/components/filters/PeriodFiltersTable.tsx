"use client";

import React from "react";

type Range = "monthly" | "quarterly" | "yearly";

interface Props {
  range: Range | "";
  selectedMonth: string;
  selectedQuarter: string;
  selectedYear: string | number;
  yearOptions: (string | number)[];
  onRangeChange: (v: Range) => void;
  onMonthChange: (v: string) => void;
  onQuarterChange: (v: string) => void;
  onYearChange: (v: string) => void;
}

const PeriodFiltersTable: React.FC<Props> = ({
  range,
  selectedMonth,
  selectedQuarter,
  selectedYear,
  yearOptions,
  onRangeChange,
  onMonthChange,
  onQuarterChange,
  onYearChange,
}) => {
  const months = [
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
  ];

  const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

  return (
    <div className="inline-flex rounded-md border border-[#414042] bg-white text-[clamp(12px,0.729vw,16px)] font-[Lato] overflow-hidden">
      {/* PERIOD SELECT */}
      <div className="relative flex items-center">
        <select
          value={range || ""}
          onChange={(e) => onRangeChange(e.target.value as Range)}
          className="appearance-none px-3 pr-8 py-2 text-center bg-white focus:outline-none"
        >
          <option value="" disabled>
            Period
          </option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
          ▾
        </span>
      </div>

      {/* RANGE: MONTH or QUARTER */}
      {(range === "monthly" || range === "quarterly") && (
        <div className="relative flex items-center border-l border-[#414042]">
          <select
            value={range === "monthly" ? selectedMonth : selectedQuarter}
            onChange={(e) =>
              range === "monthly"
                ? onMonthChange(e.target.value)
                : onQuarterChange(e.target.value)
            }
            className="appearance-none px-3 pr-8 py-2 text-center bg-white focus:outline-none"
          >
            <option value="">Range</option>

            {range === "monthly" &&
              months.map((m) => (
                <option key={m} value={m}>
                  {cap(m)}
                </option>
              ))}

            {range === "quarterly" &&
              ["Q1", "Q2", "Q3", "Q4"].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
            ▾
          </span>
        </div>
      )}

      {/* YEAR SELECT */}
      <div className="relative flex items-center border-l border-[#414042]">
        <select
          value={selectedYear ? String(selectedYear) : ""}
          onChange={(e) => onYearChange(e.target.value)}
          className="appearance-none px-3 pr-8 py-2 text-center bg-white focus:outline-none"
        >
          <option value="">Year</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
          ▾
        </span>
      </div>
    </div>
  );
};

export default PeriodFiltersTable;




















