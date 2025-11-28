// "use client";

// import * as React from "react";
// import clsx from "clsx";

// export type Row = Record<string, React.ReactNode>;

// export type ColumnDef<T extends Row> = {
//   key: keyof T | string;
//   header: string;
//   render?: (row: T, value: React.ReactNode, rowIndex: number) => React.ReactNode;
//   width?: string;
//   cellClassName?: string;
//   headerClassName?: string;
// };

// type DataTableProps<T extends Row> = {
//   columns: ColumnDef<T>[];
//   data: T[];

//   /** Layout & UX */
//   className?: string;
//   tableClassName?: string;
//   maxHeight?: number | string;
//   stickyHeader?: boolean;
//   zebra?: boolean;
//   emptyMessage?: string;
//   showCellTitle?: boolean;

//   /** Pagination (client-side) */
//   pageSize?: number; // default 10
//   initialPage?: number; // 1-based index
//   paginate?: boolean;
//   scrollY?: boolean;

//   /** Row styling */
//   rowClassName?: (row: T, rowIndex: number) => string;

//   /** Optional callback when page changes (1-based) */
//   onPageChange?: (page: number) => void;
// };

// export default function DataTable<T extends Row>({
//   columns,
//   data,
//   className,
//   tableClassName,
//   maxHeight = "60vh",
//   stickyHeader = true,
//   zebra = true,
//   emptyMessage = "No data found.",
//   showCellTitle = true,
//   pageSize = 10,
//   initialPage = 1,
//   paginate = true, // default on
//   scrollY = true, // default on
//   rowClassName,
//   onPageChange,
// }: DataTableProps<T>) {
//   const containerStyle: React.CSSProperties = {
//     // only limit height (and allow vertical scroll) when scrollY is true
//     maxHeight: scrollY
//       ? typeof maxHeight === "number"
//         ? `${maxHeight}px`
//         : maxHeight
//       : undefined,
//   };

//   const hasData = Array.isArray(data) && data.length > 0;

//   // Pagination state (1-based)
//   const [page, setPage] = React.useState<number>(Math.max(1, initialPage));

//   // Reset to page 1 if data changes and current page exceeds new total
//   React.useEffect(() => {
//     const totalPages = Math.max(1, Math.ceil((data?.length ?? 0) / pageSize));
//     if (page > totalPages) {
//       setPage(1);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data, pageSize]);

//   const total = data?.length ?? 0;

//   const totalPages = paginate
//     ? Math.max(1, Math.ceil(total / pageSize))
//     : 1;

//   const startIdx =
//     !paginate || total === 0
//       ? total === 0
//         ? 0
//         : 1
//       : (page - 1) * pageSize + 1;

//   const endIdx =
//     !paginate || total === 0
//       ? total
//       : Math.min(page * pageSize, total);

//   const pageRows = React.useMemo(() => {
//     if (!hasData) return [];
//     if (!paginate) return data; // no slicing when pagination disabled
//     const start = (page - 1) * pageSize;
//     return data.slice(start, start + pageSize);
//   }, [data, page, pageSize, hasData, paginate]);

//   const goToPage = (p: number) => {
//     const next = Math.min(Math.max(1, p), totalPages);
//     setPage(next);
//     onPageChange?.(next);
//   };

//   const onFirst = () => goToPage(1);
//   const onPrev = () => goToPage(page - 1);
//   const onNext = () => goToPage(page + 1);
//   const onLast = () => goToPage(totalPages);

//   return (
//     <div
//       className={clsx(
//         "overflow-hidden rounded border border-gray-200",
//         className
//       )}
//     >
//       <div
//         className={clsx(
//           "w-full",
//           scrollY ? "overflow-auto" : "overflow-x-auto", // only horizontal scroll when scrollY=false
//           stickyHeader && "scroll-pt-12"
//         )}
//         style={containerStyle}
//       >
//         <table
//           className={clsx(
//             // responsive font + nowrap + min width so it scrolls nicely on small screens
//             "min-w-[720px] w-full border-collapse text-xs md:text-sm whitespace-nowrap",
//             tableClassName
//           )}
//         >
//           <thead
//             className={clsx(
//               "bg-green-500 text-amber-100",
//               stickyHeader && "sticky top-0 z-10"
//             )}
//           >
//             <tr>
//               {columns.map((col, i) => (
//                 <th
//                   key={String(col.key) + i}
//                   className={clsx(
//                     "border border-slate-300 px-3 py-2 md:py-3 text-left",
//                     col.headerClassName
//                   )}
//                   style={col.width ? { width: col.width } : undefined}
//                 >
//                   {col.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {!hasData && (
//               <tr>
//                 <td
//                   className="px-3 py-4 text-xs md:text-sm text-gray-500"
//                   colSpan={columns.length}
//                 >
//                   {emptyMessage}
//                 </td>
//               </tr>
//             )}

//             {hasData &&
//               pageRows.map((row, ri) => (
//                 <tr
//                   key={ri}
//                   className={clsx(
//                     zebra && ri % 2 === 1 ? "bg-gray-50" : "bg-white",
//                     "hover:bg-emerald-50/70",
//                     rowClassName?.(row, (page - 1) * pageSize + ri)
//                   )}
//                 >
//                   {columns.map((col, ci) => {
//                     const value = (row as Record<string, React.ReactNode>)[
//                       String(col.key)
//                     ];
//                     return (
//                       <td
//                         key={String(col.key) + ci}
//                         className={clsx(
//                           "max-w-[240px] truncate border border-slate-200 px-3 py-2",
//                           col.cellClassName
//                         )}
//                         title={
//                           showCellTitle ? String(value ?? "\u00A0") : undefined
//                         }
//                       >
//                         {col.render
//                           ? col.render(
//                               row,
//                               value,
//                               (page - 1) * pageSize + ri
//                             )
//                           : value ?? "\u00A0"}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination footer */}
//       {paginate && (
//         <div className="flex flex-col items-center gap-2 border-t border-gray-200 p-3 sm:flex-row sm:justify-between">
//           <div className="text-xs text-gray-600">
//             {total > 0 ? (
//               <>
//                 Showing <span className="font-medium">{startIdx}</span>–
//                 <span className="font-medium">{endIdx}</span> of{" "}
//                 <span className="font-medium">{total}</span>
//               </>
//             ) : (
//               <>No records</>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={onFirst}
//               disabled={page <= 1}
//               className="rounded border px-2 py-1 text-xs disabled:opacity-50"
//               aria-label="First page"
//             >
//               « First
//             </button>
//             <button
//               onClick={onPrev}
//               disabled={page <= 1}
//               className="rounded border px-2 py-1 text-xs disabled:opacity-50"
//               aria-label="Previous page"
//             >
//               ‹ Prev
//             </button>

//             <span className="text-xs text-gray-700">
//               Page <span className="font-medium">{page}</span> of{" "}
//               <span className="font-medium">{totalPages}</span>
//             </span>

//             <button
//               onClick={onNext}
//               disabled={page >= totalPages}
//               className="rounded border px-2 py-1 text-xs disabled:opacity-50"
//               aria-label="Next page"
//             >
//               Next ›
//             </button>
//             <button
//               onClick={onLast}
//               disabled={page >= totalPages}
//               className="rounded border px-2 py-1 text-xs disabled:opacity-50"
//               aria-label="Last page"
//             >
//               Last »
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






























"use client";

import * as React from "react";
import clsx from "clsx";
import Loader from "@/components/loader/Loader"; // 👈 NEW

export type Row = Record<string, React.ReactNode>;

export type ColumnDef<T extends Row> = {
  key: keyof T | string;
  header: string;
  render?: (row: T, value: React.ReactNode, rowIndex: number) => React.ReactNode;
  width?: string;
  cellClassName?: string;
  headerClassName?: string;
};

type DataTableProps<T extends Row> = {
  columns: ColumnDef<T>[];
  data: T[];

  /** Layout & UX */
  className?: string;
  tableClassName?: string;
  maxHeight?: number | string;
  stickyHeader?: boolean;
  zebra?: boolean;
  emptyMessage?: string;
  showCellTitle?: boolean;

  /** Pagination (client-side) */
  pageSize?: number; // default 10
  initialPage?: number; // 1-based index
  paginate?: boolean;
  scrollY?: boolean;

  /** Row styling */
  rowClassName?: (row: T, rowIndex: number) => string;

  /** Optional callback when page changes (1-based) */
  onPageChange?: (page: number) => void;

  /** Loading state */
  loading?: boolean;              // 👈 NEW
  loaderHeight?: number | string; // 👈 NEW (optional custom height)
};

export default function DataTable<T extends Row>({
  columns,
  data,
  className,
  tableClassName,
  maxHeight = "60vh",
  stickyHeader = true,
  zebra = true,
  emptyMessage = "No data found.",
  showCellTitle = false,
  pageSize = 10,
  initialPage = 1,
  paginate = true, // default on
  scrollY = true, // default on
  rowClassName,
  onPageChange,
  loading = false,          // 👈 NEW default
  loaderHeight = 260,       // 👈 NEW default height
}: DataTableProps<T>) {
  const containerStyle: React.CSSProperties = {
    // only limit height (and allow vertical scroll) when scrollY is true
    maxHeight: scrollY
      ? typeof maxHeight === "number"
        ? `${maxHeight}px`
        : maxHeight
      : undefined,
  };

  const hasData = Array.isArray(data) && data.length > 0;

  // 👇 Loader handling
  const loaderStyleHeight =
    typeof loaderHeight === "number" ? `${loaderHeight}px` : loaderHeight;

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: loaderStyleHeight }}>
        <Loader
          src="/infinity-unscreen.gif"
          size={150}
          transparent
          roundedClass="rounded-full"
          backgroundClass="bg-transparent"
          respectReducedMotion
        />
      </div>
    );
  }
  // 👆 end loader

  // Pagination state (1-based)
  const [page, setPage] = React.useState<number>(Math.max(1, initialPage));

  // Reset to page 1 if data changes and current page exceeds new total
  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((data?.length ?? 0) / pageSize));
    if (page > totalPages) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageSize]);

  const total = data?.length ?? 0;

  const totalPages = paginate ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  const startIdx =
    !paginate || total === 0
      ? total === 0
        ? 0
        : 1
      : (page - 1) * pageSize + 1;

  const endIdx =
    !paginate || total === 0 ? total : Math.min(page * pageSize, total);

  const pageRows = React.useMemo(() => {
    if (!hasData) return [];
    if (!paginate) return data; // no slicing when pagination disabled
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize, hasData, paginate]);

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    onPageChange?.(next);
  };

  const onFirst = () => goToPage(1);
  const onPrev = () => goToPage(page - 1);
  const onNext = () => goToPage(page + 1);
  const onLast = () => goToPage(totalPages);

  return (
    <div
      className={clsx(
        "overflow-hidden rounded border border-gray-200",
        className
      )}
    >
      <div
        className={clsx(
          "w-full",
          scrollY ? "overflow-auto" : "overflow-x-auto", // only horizontal scroll when scrollY=false
          stickyHeader && "scroll-pt-12"
        )}
        style={containerStyle}
      >
        <table
          className={clsx(
            // let parent control width, no forced min-width, no forced nowrap
            "w-full border-collapse text-xs md:text-sm",
            tableClassName
          )}
        >

          <thead
            className={clsx(
              "bg-green-500 text-amber-100 ",
              stickyHeader && "sticky top-0 z-10"
            )}
          >
            <tr>
              {columns.map((col, i) => (
                <th
                  key={String(col.key) + i}
                  className={clsx(
                    "border border-slate-300 px-3 py-2 md:py-3",
                    col.headerClassName
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >

                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!hasData && (
              <tr>
                <td
                  className="px-3 py-4 text-xs md:text-sm text-gray-500"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {hasData &&
              pageRows.map((row, ri) => (
                <tr
                  key={ri}
                  className={clsx(
                    zebra && ri % 2 === 1 ? "bg-gray-50" : "bg-white",
                    "hover:bg-emerald-50/70",
                    rowClassName?.(row, (page - 1) * pageSize + ri)
                  )}
                >
                  {columns.map((col, ci) => {
                    const value = (row as Record<string, React.ReactNode>)[
                      String(col.key)
                    ];
                    return (
                      <td
                        key={String(col.key) + ci}
                        className={clsx(
                          "max-w-[240px] truncate border border-slate-200 px-3 py-2",
                          col.cellClassName
                        )}
                        title={
                          showCellTitle ? String(value ?? "\u00A0") : undefined
                        }
                      >
                        {col.render
                          ? col.render(
                            row,
                            value,
                            (page - 1) * pageSize + ri
                          )
                          : value ?? "\u00A0"}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {paginate && (
        <div className="flex flex-col items-center gap-2 border-t border-gray-200 p-3 sm:flex-row sm:justify-between">
          <div className="text-xs text-gray-600">
            {total > 0 ? (
              <>
                Showing <span className="font-medium">{startIdx}</span>–
                <span className="font-medium">{endIdx}</span> of{" "}
                <span className="font-medium">{total}</span>
              </>
            ) : (
              <>No records</>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onFirst}
              disabled={page <= 1}
              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              aria-label="First page"
            >
              « First
            </button>
            <button
              onClick={onPrev}
              disabled={page <= 1}
              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              aria-label="Previous page"
            >
              ‹ Prev
            </button>

            <span className="text-xs text-gray-700">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>

            <button
              onClick={onNext}
              disabled={page >= totalPages}
              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              aria-label="Next page"
            >
              Next ›
            </button>
            <button
              onClick={onLast}
              disabled={page >= totalPages}
              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              aria-label="Last page"
            >
              Last »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



// // Usage

// <DataTable
//   columns={columns}
//   data={rows}
//   loading={isLoading}      // 👈 pass your loading state here
//   loaderHeight={320}       // optional, can omit
// />
