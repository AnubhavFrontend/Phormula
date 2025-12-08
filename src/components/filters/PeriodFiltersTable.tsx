// // // "use client";

// // // import React from "react";
// // // import { FaAngleDown } from "react-icons/fa";

// // // export type Range = "monthly" | "quarterly" | "yearly";

// // // interface Props {
// // //   range: "monthly" | "quarterly" | "yearly";
// // //   selectedMonth: string;
// // //   selectedQuarter: string;
// // //   selectedYear: string | number;
// // //   yearOptions: (string | number)[];
// // //   onRangeChange: (v: Range) => void;
// // //   onMonthChange: (v: string) => void;
// // //   onQuarterChange: (v: string) => void;
// // //   onYearChange: (v: string) => void;
// // //   allowedRanges?: Range[];
// // // }

// // // const ALL_RANGES: Range[] = ["monthly", "quarterly", "yearly"];

// // // const PeriodFiltersTable: React.FC<Props> = (props) => {
// // //   const {
// // //     range,
// // //     selectedMonth,
// // //     selectedQuarter,
// // //     selectedYear,
// // //     yearOptions,
// // //     onRangeChange,
// // //     onMonthChange,
// // //     onQuarterChange,
// // //     onYearChange,
// // //     allowedRanges = ALL_RANGES,
// // //   } = props;

// // //   const months = [
// // //     "january",
// // //     "february",
// // //     "march",
// // //     "april",
// // //     "may",
// // //     "june",
// // //     "july",
// // //     "august",
// // //     "september",
// // //     "october",
// // //     "november",
// // //     "december",
// // //   ];

// // //   const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

// // //   const safeRange: Range | "" =
// // //     range && allowedRanges.includes(range as Range) ? (range as Range) : "";

// // //   const showMonthly = allowedRanges.includes("monthly");
// // //   const showQuarterly = allowedRanges.includes("quarterly");
// // //   const showYearly = allowedRanges.includes("yearly");

// // //   return (
// // //     <>
// // //       {/* Global styles for <option> */}
// // //       <style jsx global>{`
// // //         select option {
// // //           text-align: center;
// // //         }
// // //         /* mimic Tailwind: bg-green-500 + text-yellow-200 */
// // //         select option:hover {
// // //           background-color: #22c55e; /* bg-green-500 */
// // //           color: #fef08a; /* text-yellow-200 */
// // //         }
// // //       `}</style>

// // //       <div className="inline-flex overflow-hidden rounded-md border border-[#414042] bg-white font-[Lato] text-[clamp(12px,0.729vw,16px)]">
// // //         {/* PERIOD SELECT */}
// // //         <div className="relative flex items-center">
// // //           <select
// // //             value={safeRange}
// // //             onChange={(e) => onRangeChange(e.target.value as Range)}
// // //             className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
// // //           >
// // //             <option value="" disabled>
// // //               Period
// // //             </option>

// // //             {showMonthly && <option value="monthly">Monthly</option>}
// // //             {showQuarterly && <option value="quarterly">Quarterly</option>}
// // //             {showYearly && <option value="yearly">Yearly</option>}
// // //           </select>
// // //           <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
// // //             <FaAngleDown />
// // //           </span>
// // //         </div>

// // //         {/* RANGE: MONTH or QUARTER */}
// // //         {(safeRange === "monthly" || safeRange === "quarterly") && (
// // //           <div className="relative flex items-center border-l border-[#414042]">
// // //             <select
// // //               value={safeRange === "monthly" ? selectedMonth : selectedQuarter}
// // //               onChange={(e) =>
// // //                 safeRange === "monthly"
// // //                   ? onMonthChange(e.target.value)
// // //                   : onQuarterChange(e.target.value)
// // //               }
// // //               className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
// // //             >
// // //               <option value="">Range</option>

// // //               {safeRange === "monthly" &&
// // //                 months.map((m) => (
// // //                   <option key={m} value={m}>
// // //                     {cap(m)}
// // //                   </option>
// // //                 ))}

// // //               {safeRange === "quarterly" &&
// // //                 ["Q1", "Q2", "Q3", "Q4"].map((q) => (
// // //                   <option key={q} value={q}>
// // //                     {q}
// // //                   </option>
// // //                 ))}
// // //             </select>
// // //             <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
// // //               <FaAngleDown />
// // //             </span>
// // //           </div>
// // //         )}

// // //         {/* YEAR SELECT */}
// // //         <div className="relative flex items-center border-l border-[#414042]">
// // //           <select
// // //             value={selectedYear ? String(selectedYear) : ""}
// // //             onChange={(e) => onYearChange(e.target.value)}
// // //             className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
// // //           >
// // //             <option value="">Year</option>
// // //             {yearOptions.map((y) => (
// // //               <option key={y} value={y}>
// // //                 {y}
// // //               </option>
// // //             ))}
// // //           </select>
// // //           <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-charcoal-500">
// // //             <FaAngleDown />
// // //           </span>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default PeriodFiltersTable;




















// // "use client";

// // import React from "react";
// // import { FaAngleDown } from "react-icons/fa";

// // export type Range = "monthly" | "quarterly" | "yearly";

// // interface Props {
// //   range: "monthly" | "quarterly" | "yearly";
// //   selectedMonth: string;
// //   selectedQuarter: string;
// //   selectedYear: string | number;
// //   yearOptions: (string | number)[];
// //   onRangeChange: (v: Range) => void;
// //   onMonthChange: (v: string) => void;
// //   onQuarterChange: (v: string) => void;
// //   onYearChange: (v: string) => void;
// //   allowedRanges?: Range[];
// // }

// // const ALL_RANGES: Range[] = ["monthly", "quarterly", "yearly"];

// // const PeriodFiltersTable: React.FC<Props> = (props) => {
// //   const {
// //     range,
// //     selectedMonth,
// //     selectedQuarter,
// //     selectedYear,
// //     yearOptions,
// //     onRangeChange,
// //     onMonthChange,
// //     onQuarterChange,
// //     onYearChange,
// //     allowedRanges = ALL_RANGES,
// //   } = props;

// //   const months = [
// //     "january",
// //     "february",
// //     "march",
// //     "april",
// //     "may",
// //     "june",
// //     "july",
// //     "august",
// //     "september",
// //     "october",
// //     "november",
// //     "december",
// //   ];

// //   const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

// //   const safeRange: Range | "" =
// //     range && allowedRanges.includes(range as Range) ? (range as Range) : "";

// //   const showMonthly = allowedRanges.includes("monthly");
// //   const showQuarterly = allowedRanges.includes("quarterly");
// //   const showYearly = allowedRanges.includes("yearly");

// //   // Current month & year on client
// //   const now = new Date();
// //   const currentMonthValue = months[now.getMonth()]; // e.g. "december"
// //   const currentYear = now.getFullYear();

// //   return (
// //     <>
// //       {/* Global styles for <option> */}
// //       <style jsx global>{`
// //         select option {
// //           text-align: center;
// //         }
// //         /* mimic Tailwind: bg-green-500 + text-yellow-200 */
// //         select option:hover {
// //           background-color: #22c55e; /* bg-green-500 */
// //           color: #fef08a; /* text-yellow-200 */
// //         }
// //       `}</style>

// //       <div className="inline-flex overflow-hidden rounded-md border border-[#414042] bg-white font-[Lato] text-[clamp(12px,0.729vw,16px)]">
// //         {/* PERIOD SELECT */}
// //         <div className="relative flex items-center">
// //           <select
// //             value={safeRange}
// //             onChange={(e) => onRangeChange(e.target.value as Range)}
// //             className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
// //           >
// //             <option value="" disabled>
// //               Period
// //             </option>

// //             {showMonthly && <option value="monthly">Monthly</option>}
// //             {showQuarterly && <option value="quarterly">Quarterly</option>}
// //             {showYearly && <option value="yearly">Yearly</option>}
// //           </select>
// //           <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
// //             <FaAngleDown />
// //           </span>
// //         </div>

// //         {/* RANGE: MONTH or QUARTER */}
// //         {(safeRange === "monthly" || safeRange === "quarterly") && (
// //           <div className="relative flex items-center border-l border-[#414042]">
// //             <select
// //               value={safeRange === "monthly" ? selectedMonth : selectedQuarter}
// //               onChange={(e) =>
// //                 safeRange === "monthly"
// //                   ? onMonthChange(e.target.value)
// //                   : onQuarterChange(e.target.value)
// //               }
// //               className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
// //             >
// //               <option value="">Range</option>

// //               {safeRange === "monthly" &&
// //                 months.map((m) => {
// //                   const isCurrentMonthAndYear =
// //                     m === currentMonthValue &&
// //                     String(selectedYear) === String(currentYear);

// //                   // Disable current month for current year,
// //                   // but DON'T disable if it's already selected
// //                   const shouldDisableMonth =
// //                     isCurrentMonthAndYear && selectedMonth !== m;

// //                   return (
// //                     <option
// //                       key={m}
// //                       value={m}
// //                       disabled={shouldDisableMonth}
// //                     >
// //                       {cap(m)}
// //                     </option>
// //                   );
// //                 })}

// //               {safeRange === "quarterly" &&
// //                 ["Q1", "Q2", "Q3", "Q4"].map((q) => (
// //                   <option key={q} value={q}>
// //                     {q}
// //                   </option>
// //                 ))}
// //             </select>
// //             <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
// //               <FaAngleDown />
// //             </span>
// //           </div>
// //         )}

// //         {/* YEAR SELECT */}
// //         <div className="relative flex items-center border-l border-[#414042]">
// //           <select
// //             value={selectedYear ? String(selectedYear) : ""}
// //             onChange={(e) => onYearChange(e.target.value)}
// //             className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
// //           >
// //             <option value="">Year</option>
// //             {yearOptions.map((y) => {
// //               const isCurrentYearAndMonth =
// //                 String(y) === String(currentYear) &&
// //                 selectedMonth === currentMonthValue;

// //               // Disable current year when current month is selected,
// //               // but DON'T disable if it's already selected
// //               const shouldDisableYear =
// //                 isCurrentYearAndMonth &&
// //                 String(selectedYear) !== String(currentYear);

// //               return (
// //                 <option
// //                   key={y}
// //                   value={y}
// //                   disabled={shouldDisableYear}
// //                 >
// //                   {y}
// //                 </option>
// //               );
// //             })}
// //           </select>
// //           <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-charcoal-500">
// //             <FaAngleDown />
// //           </span>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default PeriodFiltersTable;



























// "use client";

// import React from "react";
// import { FaAngleDown } from "react-icons/fa";

// export type Range = "monthly" | "quarterly" | "yearly";

// interface Props {
//   range: "monthly" | "quarterly" | "yearly" | undefined;
//   selectedMonth: string;
//   selectedQuarter: string;
//   selectedYear: string | number;
//   yearOptions: (string | number)[];
//   onRangeChange: (v: Range) => void;
//   onMonthChange: (v: string) => void;
//   onQuarterChange: (v: string) => void;
//   onYearChange: (v: string) => void;
//   allowedRanges?: Range[];
// }

// const ALL_RANGES: Range[] = ["monthly", "quarterly", "yearly"];

// const PeriodFiltersTable: React.FC<Props> = (props) => {
//   const {
//     range,
//     selectedMonth,
//     selectedQuarter,
//     selectedYear,
//     yearOptions,
//     onRangeChange,
//     onMonthChange,
//     onQuarterChange,
//     onYearChange,
//     allowedRanges = ALL_RANGES,
//   } = props;

//   const months = [
//     "january",
//     "february",
//     "march",
//     "april",
//     "may",
//     "june",
//     "july",
//     "august",
//     "september",
//     "october",
//     "november",
//     "december",
//   ];

//   const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

//   const safeRange: Range | "" =
//     range && allowedRanges.includes(range as Range) ? (range as Range) : "";

//   const showMonthly = allowedRanges.includes("monthly");
//   const showQuarterly = allowedRanges.includes("quarterly");
//   const showYearly = allowedRanges.includes("yearly");

//   // current month & year (client)
//   const now = new Date();
//   const currentMonthValue = months[now.getMonth()]; // "december" etc.
//   const currentYear = now.getFullYear();

//   return (
//     <>
//       {/* Global styles for <option> */}
//       <style jsx global>{`
//         select option {
//           text-align: center;
//         }
//         select option:hover {
//           background-color: #22c55e;
//           color: #fef08a;
//         }
//       `}</style>

//       <div className="inline-flex overflow-hidden rounded-md border border-[#414042] bg-white font-[Lato] text-[clamp(12px,0.729vw,16px)]">
//         {/* PERIOD SELECT */}
//         <div className="relative flex items-center">
//           <select
//             value={safeRange}
//             onChange={(e) => onRangeChange(e.target.value as Range)}
//             className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
//           >
//             <option value="" disabled>
//               Period
//             </option>

//             {showMonthly && <option value="monthly">Monthly</option>}
//             {showQuarterly && <option value="quarterly">Quarterly</option>}
//             {showYearly && <option value="yearly">Yearly</option>}
//           </select>
//           <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
//             <FaAngleDown />
//           </span>
//         </div>

//         {/* RANGE: MONTH or QUARTER */}
//         {(safeRange === "monthly" || safeRange === "quarterly") && (
//           <div className="relative flex items-center border-l border-[#414042]">
//             <select
//               value={safeRange === "monthly" ? selectedMonth : selectedQuarter}
//               onChange={(e) =>
//                 safeRange === "monthly"
//                   ? onMonthChange(e.target.value)
//                   : onQuarterChange(e.target.value)
//               }
//               className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
//             >
//               <option value="">Range</option>

//               {safeRange === "monthly" &&
//                 months.map((m) => {
//                   const isCurrentMonthAndYear =
//                     safeRange === "monthly" &&
//                     m === currentMonthValue &&
//                     String(selectedYear) === String(currentYear);

//                   // disable current month for current year,
//                   // but DON'T disable if it's already selected
//                   const shouldDisableMonth =
//                     isCurrentMonthAndYear && selectedMonth !== m;

//                   return (
//                     <option
//                       key={m}
//                       value={m}
//                       disabled={shouldDisableMonth}
//                     >
//                       {cap(m)}
//                     </option>
//                   );
//                 })}

//               {safeRange === "quarterly" &&
//                 ["Q1", "Q2", "Q3", "Q4"].map((q) => (
//                   <option key={q} value={q}>
//                     {q}
//                   </option>
//                 ))}
//             </select>
//             <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
//               <FaAngleDown />
//             </span>
//           </div>
//         )}

//         {/* YEAR SELECT */}
//         <div className="relative flex items-center border-l border-[#414042]">
//           <select
//             value={selectedYear ? String(selectedYear) : ""}
//             onChange={(e) => onYearChange(e.target.value)}
//             className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
//           >
//             <option value="">Year</option>
//             {yearOptions.map((y) => {
//               // 🚩 Only apply the "block current year" rule in MONTHLY mode
//               const isCurrentYearAndMonth =
//                 safeRange === "monthly" &&
//                 String(y) === String(currentYear) &&
//                 selectedMonth === currentMonthValue;

//               // disable current year when current month selected,
//               // but DON'T disable if it's already selected
//               const shouldDisableYear =
//                 isCurrentYearAndMonth &&
//                 String(selectedYear) !== String(currentYear);

//               return (
//                 <option
//                   key={y}
//                   value={y}
//                   disabled={shouldDisableYear}
//                 >
//                   {y}
//                 </option>
//               );
//             })}
//           </select>
//           <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-charcoal-500">
//             <FaAngleDown />
//           </span>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PeriodFiltersTable;




















"use client";

import React from "react";
import { FaAngleDown } from "react-icons/fa";

export type Range = "monthly" | "quarterly" | "yearly";

interface Props {
  range: "monthly" | "quarterly" | "yearly" | undefined;
  selectedMonth: string;
  selectedQuarter: string;
  selectedYear: string | number;
  yearOptions: (string | number)[];
  onRangeChange: (v: Range) => void;
  onMonthChange: (v: string) => void;
  onQuarterChange: (v: string) => void;
  onYearChange: (v: string) => void;
  allowedRanges?: Range[];

  /** 👇 NEW: latest fetched period (e.g. "november" / 2025) */
  latestFetchedMonth?: string;              // lowercase month name: "november"
  latestFetchedYear?: string | number;     // e.g. 2025
}

const ALL_RANGES: Range[] = ["monthly", "quarterly", "yearly"];

const MONTHS = [
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

const PeriodFiltersTable: React.FC<Props> = (props) => {
  const {
    range,
    selectedMonth,
    selectedQuarter,
    selectedYear,
    yearOptions,
    onRangeChange,
    onMonthChange,
    onQuarterChange,
    onYearChange,
    allowedRanges = ALL_RANGES,
    latestFetchedMonth,
    latestFetchedYear,
  } = props;

  const months = MONTHS;

  const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

  const safeRange: Range | "" =
    range && allowedRanges.includes(range as Range) ? (range as Range) : "";

  const showMonthly = allowedRanges.includes("monthly");
  const showQuarterly = allowedRanges.includes("quarterly");
  const showYearly = allowedRanges.includes("yearly");

  // current month & year (client)
  const now = new Date();
  const currentMonthValue = months[now.getMonth()]; // "december" etc.
  const currentYear = now.getFullYear();

  // ---------- NEW: auto-init from latest fetched period ----------
  const normalizedLatestMonth = (latestFetchedMonth || "").toLowerCase();
  const normalizedLatestYear =
    latestFetchedYear !== undefined && latestFetchedYear !== null
      ? String(latestFetchedYear)
      : "";

  React.useEffect(() => {
    // only care about monthly range
    if (safeRange !== "monthly") return;
    if (!normalizedLatestMonth || !normalizedLatestYear) return;
    if (!months.includes(normalizedLatestMonth)) return;

    const currentMonthStr = selectedMonth || "";
    const currentYearStr =
      selectedYear !== undefined && selectedYear !== null
        ? String(selectedYear)
        : "";

    // only set defaults if both month & year are effectively empty
    if (!currentMonthStr && !currentYearStr) {
      onMonthChange(normalizedLatestMonth);
      onYearChange(normalizedLatestYear);
    }
  }, [
    safeRange,
    normalizedLatestMonth,
    normalizedLatestYear,
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
  ]);

  // also set a default year for quarterly/yearly if none chosen yet
  React.useEffect(() => {
    if (!normalizedLatestYear) return;
    const currentYearStr =
      selectedYear !== undefined && selectedYear !== null
        ? String(selectedYear)
        : "";
    if (!currentYearStr) {
      onYearChange(normalizedLatestYear);
    }
  }, [normalizedLatestYear, selectedYear, onYearChange]);

  return (
    <>
      {/* Global styles for <option> */}
      <style jsx global>{`
        select option {
          text-align: center;
        }
        select option:hover {
          background-color: #22c55e;
          color: #fef08a;
        }
      `}</style>

      <div className="inline-flex overflow-hidden rounded-md border border-[#414042] bg-white font-[Lato] text-[clamp(12px,0.729vw,16px)]">
        {/* PERIOD SELECT */}
        <div className="relative flex items-center">
          <select
            value={safeRange}
            onChange={(e) => onRangeChange(e.target.value as Range)}
            className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
          >
            <option value="" disabled>
              Period
            </option>

            {showMonthly && <option value="monthly">Monthly</option>}
            {showQuarterly && <option value="quarterly">Quarterly</option>}
            {showYearly && <option value="yearly">Yearly</option>}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
            <FaAngleDown />
          </span>
        </div>

        {/* RANGE: MONTH or QUARTER */}
        {(safeRange === "monthly" || safeRange === "quarterly") && (
          <div className="relative flex items-center border-l border-[#414042]">
            <select
              value={safeRange === "monthly" ? selectedMonth : selectedQuarter}
              onChange={(e) =>
                safeRange === "monthly"
                  ? onMonthChange(e.target.value)
                  : onQuarterChange(e.target.value)
              }
              className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
            >
              <option value="">Range</option>

              {safeRange === "monthly" &&
                months.map((m) => {
                  const isCurrentMonthAndYear =
                    safeRange === "monthly" &&
                    m === currentMonthValue &&
                    String(selectedYear) === String(currentYear);

                  // disable current month for current year,
                  // but DON'T disable if it's already selected
                  const shouldDisableMonth =
                    isCurrentMonthAndYear && selectedMonth !== m;

                  return (
                    <option
                      key={m}
                      value={m}
                      disabled={shouldDisableMonth}
                    >
                      {cap(m)}
                    </option>
                  );
                })}

              {safeRange === "quarterly" &&
                ["Q1", "Q2", "Q3", "Q4"].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-[#414042]">
              <FaAngleDown />
            </span>
          </div>
        )}

        {/* YEAR SELECT */}
        <div className="relative flex items-center border-l border-[#414042]">
          <select
            value={selectedYear ? String(selectedYear) : ""}
            onChange={(e) => onYearChange(e.target.value)}
            className="appearance-none bg-white px-3 py-2 pr-8 text-center focus:outline-none"
          >
            <option value="">Year</option>
            {yearOptions.map((y) => {
              // 🚩 Only apply the "block current year" rule in MONTHLY mode
              const isCurrentYearAndMonth =
                safeRange === "monthly" &&
                String(y) === String(currentYear) &&
                selectedMonth === currentMonthValue;

              // disable current year when current month selected,
              // but DON'T disable if it's already selected
              const shouldDisableYear =
                isCurrentYearAndMonth &&
                String(selectedYear) !== String(currentYear);

              return (
                <option
                  key={y}
                  value={y}
                  disabled={shouldDisableYear}
                >
                  {y}
                </option>
              );
            })}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-charcoal-500">
            <FaAngleDown />
          </span>
        </div>
      </div>
    </>
  );
};

export default PeriodFiltersTable;
