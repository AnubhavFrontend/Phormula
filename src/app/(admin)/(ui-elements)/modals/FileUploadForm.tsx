// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Modalmsg from "@/components/ui/modal/Modalmsg";




// type Profile = {
//   id?: number | string;
//   transitTime?: string | number;
//   stockUnit?: string | number;
//   country?: string;
//   category?: string;
//   subcategory?: string;
//   months?: string[];
// };


// const FileUploadForm: React.FC = () => {
//   // ------- Next.js routing -------
//   const router = useRouter();
//   const params = useParams<{ countryName?: string }>();
//   const urlCountry = params?.countryName ?? "";


//   const profile: Profile = useMemo(() => {
//     try {
//       if (typeof window === "undefined") return {};
//       const raw = localStorage.getItem("profile");
//       return raw ? (JSON.parse(raw) as Profile) : {};
//     } catch {
//       return {};
//     }
//   }, []);

//   // ------- UI / state -------
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState("");

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 2 }, (_, i) => currentYear - 1 + i);

//   const [file1, setFile1] = useState<File | null>(null);
//   const [file2, setFile2] = useState<File | null>(null);

//   const [transitTime] = useState(String(profile.transitTime ?? ""));
//   const [stockUnit] = useState(String(profile.stockUnit ?? ""));

//   const [country] = useState(String(profile.country ?? ""));
//   const [category, setCategory] = useState(String(profile.category ?? ""));
//   const [subcategory, setSubcategory] = useState(String(profile.subcategory ?? ""));
//   const [categories, setCategories] = useState<string[]>([]);
//   const [subcategories, setSubcategories] = useState<string[]>([]);

//   const [year, setYear] = useState<string>("");
//   const [month, setMonth] = useState<string>("");
//   // kept for parity with JS code
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [, setUploadedMonths] = useState<string[]>(Array.isArray(profile.months) ? profile.months : []);

//   // ------- inline confirm modal (replacing window.confirm UI) -------
//   const [modalMessage, setModalMessage] = useState<string>("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalResolver, setModalResolver] = useState<null | ((ok: boolean) => void)>(null);

//   // 🔑 One source of truth for country: profile -> URL param
//   const effectiveCountry = useMemo(() => (country || urlCountry || "").toLowerCase(), [country, urlCountry]);

//   useEffect(() => {
//     updateCategories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [effectiveCountry]);

//   useEffect(() => {
//     updateSubcategories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [category]);

//   const capitalizeFirstLetter = (str: unknown) =>
//     typeof str === "string" && str.length ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

//   // ------- CSV heuristics (month/year extraction + mismatch guard) -------
//   const [file1Month, setFile1Month] = useState("");
//   const [file2Month, setFile2Month] = useState("");
//   const [file1Year, setFile1Year] = useState("");
//   const [file2Year, setFile2Year] = useState("");

//   const monthMap: Record<string, string> = {
//     Jan: "january",
//     Feb: "february",
//     Mar: "march",
//     Apr: "april",
//     May: "may",
//     Jun: "june",
//     Jul: "july",
//     Aug: "august",
//     Sep: "september",
//     Oct: "october",
//     Nov: "november",
//     Dec: "december",
//   };

//   const getAvailableMonths = () => [
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

//   const safeMonthIndexValue = (m: string) => {
//     if (!m) return "";
//     const idx = getAvailableMonths().findIndex((mon) => mon.toLowerCase() === String(m).toLowerCase());
//     return idx >= 0 ? String(idx + 1) : "";
//   };

//   // ------- File handlers -------
//   const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     setFile1(file);

//     if (file?.type === "text/csv") {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         try {
//           const content = event.target?.result;
//           if (typeof content !== "string") throw new Error("Invalid file content");

//           const rows = content
//             .split("\n")
//             .map((row) => row.trim())
//             .filter((row) => row !== "");

//           if (rows.length <= 8) {
//             alert("CSV file doesn't have enough data. Please check your file.");
//             return;
//           }

//           const firstDataRow = rows[105];
//           if (!firstDataRow) throw new Error("Expected data row not found at index 105.");

//           const columns = firstDataRow.split(",").map((col) => col.replace(/"/g, "").trim());

//           let monthName: string | undefined;
//           let parsedYear: number | undefined;

//           if (effectiveCountry === "uk") {
//             const dateParts = columns[0]?.split(" ") || [];
//             if (dateParts.length < 3) {
//               alert("UK date format not recognized. You might've uploaded the wrong file.");
//               return;
//             }
//             monthName = dateParts[1];
//             parsedYear = parseInt(dateParts[2], 10);
//           } else if (effectiveCountry === "us") {
//             const dateValue = `${columns[0] ?? ""} ${columns[1] ?? ""}`;
//             const dateRegex = /^([A-Za-z]+) (\d{1,2}),? (\d{4})/;
//             const match = dateValue.match(dateRegex);
//             if (!match) {
//               alert("US date format not recognized. Please check the file.");
//               return;
//             }
//             monthName = match[1];
//             parsedYear = parseInt(match[3], 10);
//           } else {
//             alert("Unsupported country format.");
//             return;
//           }

//           const monthFullName = monthMap[monthName!];
//           if (!monthFullName) {
//             alert("Month name not recognized. Please check if the file is correct.");
//             return;
//           }

//           setYear(String(parsedYear));
//           setMonth(monthFullName);
//           setFile1Month(monthFullName);
//           setFile1Year(String(parsedYear));
//         } catch (err) {
//           console.error("Error while parsing file:", err);
//           alert(
//             "⚠️ You might have mistakenly uploaded an **Inventory** file in the **MTD Sales** section. Please upload the correct file."
//           );
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;

//     const allowedTypes = [
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "text/csv",
//     ];
//     if (file && !allowedTypes.includes(file.type)) {
//       alert("Please upload a valid Excel or CSV file.");
//       return;
//     }

//     setFile2(file);

//     if (file?.type === "text/csv") {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const content = event.target?.result;
//         if (typeof content !== "string") return;

//         const rows = content
//           .split("\n")
//           .map((row) => row.trim())
//           .filter((row) => row !== "");
//         const firstRow = rows[1] || "";
//         const columns = firstRow.split(",");

//         const dateValue = columns[0];
//         if (dateValue) {
//           const date = new Date(dateValue);
//           if (!isNaN(date.getTime())) {
//             const parsedMonth = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
//             const parsedYear = String(date.getFullYear());
//             setYear(parsedYear);
//             setMonth(parsedMonth);
//             setFile2Month(parsedMonth);
//             setFile2Year(parsedYear);
//           }
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   // ------- mismatch warning -------
//   useEffect(() => {
//     const bothMonthsLoaded = !!file1Month && !!file2Month;
//     const bothYearsLoaded = !!file1Year && !!file2Year;

//     if (bothMonthsLoaded || bothYearsLoaded) {
//       const monthMismatch = file1Month !== file2Month;
//       const yearMismatch = file1Year !== file2Year;

//       if (monthMismatch || yearMismatch) {
//         const alertParts: string[] = [];
//         if (monthMismatch)
//           alertParts.push(`🚫 You are uploading MTD file of '${file1Month}' but Inventory file of '${file2Month}'.`);
//         if (yearMismatch)
//           alertParts.push(`🚫 The year in MTD file is '${file1Year}' but in Inventory file it's '${file2Year}'.`);

//         const confirmed = window.confirm(`${alertParts.join("\n")}\nAre you sure you want to proceed with the upload?`);

//         if (!confirmed) {
//           alert(`We prefer not to proceed this way!`);
//           window.location.reload();
//         } else {
//           console.log("User confirmed, proceeding...");
//         }
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [file1Month, file2Month, file1Year, file2Year]);

//   // ------- selects -------
//   const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const numeric = Number(e.target.value); // 1..12
//     if (!numeric) {
//       setMonth("");
//       return;
//     }
//     const idx = numeric - 1;
//     const months = getAvailableMonths();
//     setMonth(months[idx]);
//   };

//   const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedYear = e.target.value;
//     setYear(selectedYear);
//     if (selectedYear === String(currentYear)) {
//       setMonth("");
//     }
//   };

//   const updateCategories = () => {
//     let options: string[] = [];
//     if ((effectiveCountry || "").toUpperCase() === "INDIA") {
//       options = ["Health", "Beauty"];
//     } else {
//       options = ["Select Category"];
//     }
//     setCategories(options);
//     setCategory(options.includes(category) ? category : "");
//   };

//   const updateSubcategories = () => {
//     let options: string[] = [];
//     if (category === "Health") {
//       options = ["Lubricants", "Intimate Hygiene"];
//     } else if (category === "Beauty") {
//       options = ["Shampoo", "Soap"];
//     } else {
//       options = ["Select Subcategory"];
//     }
//     setSubcategories(options);
//     setSubcategory(options.includes(subcategory) ? subcategory : "");
//   };

//   // ------- modal promise helpers (for replace confirmation) -------
//   const confirmWithModal = (message: string) =>
//     new Promise<boolean>((resolve) => {
//       setModalMessage(message);
//       setShowModal(true);
//       setModalResolver(() => resolve);
//     });

//   // ------- submit -------
//   const handleCombinedSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!file1 || !file2) {
//       setError("Please upload both files.");
//       return;
//     }
//     if (!effectiveCountry) {
//       setError("Country is missing. Please open this page with a country selected.");
//       return;
//     }

//     const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

//     try {
//       const historyResponse = await fetch("http://127.0.0.1:5000/upload_history", {
//         method: "GET",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });

//       const historyData = await historyResponse.json();

//       const existingUpload = Array.isArray(historyData?.uploads)
//         ? historyData.uploads.find(
//             (upload: any) =>
//               String(upload?.year) === String(year) &&
//               String(upload?.month || "").toLowerCase() === String(month || "").toLowerCase() &&
//               String(upload?.country || "").toLowerCase() === effectiveCountry
//           )
//         : null;

//       if (existingUpload) {
//         const confirmed = await confirmWithModal(`You have already uploaded data for ${capitalizeFirstLetter(month)}/${year} in ${effectiveCountry.toUpperCase()}.
// Do you want to replace the previous file?`);

//         if (!confirmed) {
//           window.location.reload();
//           return;
//         }
//       }

//       setIsUploading(true);
//       const responseData = await submitForm();

//       // Persist important fields similar to JS version
//       if (typeof window !== "undefined") {
//         localStorage.setItem("excelFileData", responseData.excel_file ?? "");
//         localStorage.setItem("pnlReport", responseData.pnl_report ?? "");
//         localStorage.setItem("totalSales", responseData.total_sales ?? "");
//         localStorage.setItem("totalProfit", responseData.total_profit ?? "");
//         localStorage.setItem("totalFbaFees", responseData.total_fba_fees ?? "");
//         localStorage.setItem("totalExpense", responseData.total_expense ?? "");
//         localStorage.setItem(
//           "platformfee",
//           responseData.platform_fee ?? responseData.otherwplatform ?? ""
//         );
//         localStorage.setItem("expenseChart", responseData.expense_chart_img ?? "");
//         localStorage.setItem("salesChart", responseData.sales_chart_img ?? "");
//         localStorage.setItem(
//           "mergedInventoryData",
//           JSON.stringify(responseData.merged_inventory ?? null)
//         );
//       }

//       // Clear stale forecasts keyed by URL param (parity with JS)
//       if (urlCountry) {
//         localStorage.removeItem(`forecast-${urlCountry}`);
//         localStorage.removeItem(`forecast-time-${urlCountry}`);
//       }

//       const ranged = "MTD";
//       router.push(`/country/${ranged}/${effectiveCountry}/${month}/${year}`);
//     } catch (err) {
//       console.error("There was a problem with the file upload:", err);
//       setError("Upload failed. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const submitForm = async () => {
//     if (!file1 || !file2) throw new Error("Both files are required");

//     const formData = new FormData();
//     formData.append("file1", file1);
//     formData.append("file2", file2);
//     formData.append("transit_time", String(transitTime));
//     formData.append("stock_unit", String(stockUnit));
//     formData.append("country", effectiveCountry);
//     formData.append("category", category);
//     formData.append("subcategory", subcategory);
//     formData.append("year", year);
//     formData.append("month", month);
//     if (profile?.id != null) formData.append("profile_id", String(profile.id));

//     const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

//     const response = await fetch("http://127.0.0.1:5000/upload", {
//       method: "POST",
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//       body: formData,
//     });

//     const contentType = response.headers.get("Content-Type") || "";

//     if (!response.ok) {
//       if (contentType.includes("application/json")) {
//         const errJson = await response.json();
//         throw new Error(errJson?.message || "Server error");
//       }
//       throw new Error(`HTTP ${response.status}`);
//     }

//     if (contentType.includes("application/json")) {
//       return await response.json();
//     }
//     throw new Error("Unexpected response from server");
//   };

//   // ------- Render -------
//   return (
//     <>
//       <div className="w-full h-full overflow-y-auto flex flex-col items-center">
//         <div className="w-full flex justify-center ">
//           <div className="w-full max-w-full border-2 border-emerald-500 shadow-md shadow-emerald-500/40 rounded-xl bg-white  p-4 md:p-5 lg:p-6 text-[13px] md:text-[14px]">
//             <h2 className="text-center !text-3xl !font-bold !text-[#5EA68E] my-3 md:my-4">
//               Upload File <i className="fa-solid fa-cloud-arrow-up" />
//             </h2>

//             <form onSubmit={handleCombinedSubmit} encType="multipart/form-data" className="space-y-5 md:space-y-6">
//               {/* File inputs */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
//                 {/* File 1 */}
//                 <div className="space-y-1.5">
//                   <label className="block text-xs font-medium">Month to Date Amazon Report:</label>

//                   <div
//                     className={`relative h-[160px] md:h-[170px] w-full border border-neutral-700 rounded-xl bg-white flex items-center justify-center overflow-hidden ${
//                       file1 ? "ring-2 ring-emerald-500" : ""
//                     }`}
//                   >
//                     <input
//                       type="file"
//                       id="file1"
//                       name="file1"
//                       onChange={handleFileChange1}
//                       accept=".xls,.xlsx,.csv"
//                       required
//                       className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-20"
//                     />
//                     <img
//                       src="/images/user/uploadBox.png"
//                       alt="file-icon"
//                       className="pointer-events-none w-[36vw] max-w-[180px] min-w-[90px] opacity-70"
//                     />
//                     {file1 && (
//                       <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] text-center px-2 text-neutral-800 font-medium break-words text-xs md:text-sm">
//                         {file1.name}
//                       </p>
//                     )}
//                   </div>

//                   <p className="text-emerald-600 font-semibold text-[11px] md:text-xs m-0">
//                     Amazon → Seller Central → Payments → Reports Repository → Report Type Transactions → Select Month
//                   </p>
//                 </div>

//                 {/* File 2 */}
//                 <div className="space-y-1.5">
//                   <label className="block text-xs font-medium">Monthly End Inventory File:</label>

//                   <div
//                     className={`relative h-[160px] md:h-[170px] w-full border border-neutral-700 rounded-xl bg-white flex items-center justify-center overflow-hidden ${
//                       file2 ? "ring-2 ring-emerald-500" : ""
//                     }`}
//                   >
//                     <input
//                       type="file"
//                       id="file2"
//                       name="file2"
//                       onChange={handleFileChange2}
//                       accept=".xls,.xlsx,.csv"
//                       required
//                       className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-20"
//                     />
//                     <img
//                        src="/images/user/uploadBox.png"
//                       alt="file-icon"
//                       className="pointer-events-none w-[36vw] max-w-[180px] min-w-[90px] opacity-70"
//                     />
//                     {file2 && (
//                       <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] text-center px-2 text-neutral-800 font-medium break-words text-xs md:text-sm">
//                         {file2.name}
//                       </p>
//                     )}
//                   </div>

//                   <p className="text-emerald-600 font-semibold text-[11px] md:text-xs m-0">
//                     Amazon → Seller Central → Reports → Fulfilment by amazon → Inventory Ledger → Download
//                   </p>
//                   <p className="italic text-neutral-600 text-[11px] md:text-xs m-0">
//                     *Summary View - Aggregate report by Country. Select last day of the previous month and download in .csv format
//                   </p>
//                 </div>
//               </div>

//               {error && <p className="text-red-600 text-xs">{error}</p>}

//               {/* Country (read-only) */}
//               <div className="relative">
//                 <img  src="/images/user/country.png" aria-hidden className="h-5 md:h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//                 <input
//                   type="text"
//                   name="country"
//                   id="country"
//                   value={(effectiveCountry || "").toUpperCase()}
//                   readOnly
//                   className="mt-2 w-full rounded-xl border border-neutral-700 pl-11 pr-3 py-2.5 text-sm md:text-[15px] focus:outline-none"
//                 />
//               </div>

//               {/* Year + Month */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
//                 <div className="relative">
//                   <img  src="/images/user/month.png" aria-hidden className="h-5 md:h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//                   <select
//                     id="year"
//                     name="year"
//                     value={year}
//                     onChange={handleYearChange}
//                     required
//                     className="mt-2 w-full rounded-xl border border-neutral-700 pl-11 pr-3 py-2.5 text-sm md:text-[15px] focus:outline-none"
//                   >
//                     <option value="">Select Year</option>
//                     {years.map((yy) => (
//                       <option key={yy} value={yy}>
//                         {yy}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="relative">
//                   <img  src="/images/user/year.png" aria-hidden className="h-5 md:h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//                   <select
//                     id="month"
//                     name="month"
//                     value={safeMonthIndexValue(month)}
//                     onChange={handleMonthChange}
//                     required
//                     className="mt-2 w-full rounded-xl border border-neutral-700 pl-11 pr-3 py-2.5 text-sm md:text-[15px] focus:outline-none"
//                   >
//                     <option value="">Select Month</option>
//                     {getAvailableMonths().map((m, index) => (
//                       <option key={m} value={index + 1}>
//                         {capitalizeFirstLetter(m)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full rounded-md bg-slate-700 text-[#f8edcf] shadow-md py-2.5 md:py-3 text-sm md:text-[15px] font-medium hover:bg-slate-800 transition disabled:opacity-60"
//                 disabled={isUploading}
//               >
//                 Upload
//               </button>

//               {isUploading && (
//                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md bg-black/30">
//                   <div className="w-[120px] md:w-[140px] h-auto flex items-center justify-center overflow-hidden">
//                     <video src="/infinity2.webm" autoPlay muted loop playsInline className="w-full h-auto" />
//                   </div>
//                   <div className="mt-4 text-white text-sm md:text-base">Uploading...</div>
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Small confirm modal using your Modalmsg component */}
//       <Modalmsg
//         show={showModal}
//         message={modalMessage}
//         onClose={() => {
//           setShowModal(false);
//           if (modalResolver) modalResolver(true);
//         }}
//         onCancel={() => {
//           setShowModal(false);
//           if (modalResolver) modalResolver(false);
//         }}
//       />
//     </>
//   );
// };

// export default FileUploadForm;






















































"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Modalmsg from "@/components/ui/modal/Modalmsg";

type Profile = {
  id?: number | string;
  transitTime?: string | number;
  stockUnit?: string | number;
  country?: string;
  category?: string;
  subcategory?: string;
  months?: string[];
};

// Props used from IntegrationDashboard
type FileUploadFormProps = {
  initialCountry?: string;
  onClose?: () => void;
  onComplete?: () => void;
};

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  initialCountry,
  onClose,
  onComplete,
}) => {
  // ------- Next.js routing -------
  const router = useRouter();
  const params = useParams<{ countryName?: string }>();
  const urlCountry = params?.countryName ?? "";

  const profile: Profile = useMemo(() => {
    try {
      if (typeof window === "undefined") return {};
      const raw = localStorage.getItem("profile");
      return raw ? (JSON.parse(raw) as Profile) : {};
    } catch {
      return {};
    }
  }, []);

  // ------- UI / state -------
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) => currentYear - 1 + i);

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);

  const [transitTime] = useState(String(profile.transitTime ?? ""));
  const [stockUnit] = useState(String(profile.stockUnit ?? ""));

  const [country] = useState(String(profile.country ?? ""));
  const [category, setCategory] = useState(String(profile.category ?? ""));
  const [subcategory, setSubcategory] = useState(String(profile.subcategory ?? ""));
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  // kept for parity with JS code
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setUploadedMonths] = useState<string[]>(
    Array.isArray(profile.months) ? profile.months : []
  );

  // ------- inline confirm modal (replacing window.confirm UI) -------
  const [modalMessage, setModalMessage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [modalResolver, setModalResolver] =
    useState<null | ((ok: boolean) => void)>(null);

  // 🔑 One source of truth for country: profile -> initialCountry (from props) -> URL param
  const effectiveCountry = useMemo(
    () => (country || initialCountry || urlCountry || "").toLowerCase(),
    [country, initialCountry, urlCountry]
  );

  useEffect(() => {
    updateCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCountry]);

  useEffect(() => {
    updateSubcategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const capitalizeFirstLetter = (str: unknown) =>
    typeof str === "string" && str.length
      ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      : "";

  // ------- CSV heuristics (month/year extraction + mismatch guard) -------
  const [file1Month, setFile1Month] = useState("");
  const [file2Month, setFile2Month] = useState("");
  const [file1Year, setFile1Year] = useState("");
  const [file2Year, setFile2Year] = useState("");

  const monthMap: Record<string, string> = {
    Jan: "january",
    Feb: "february",
    Mar: "march",
    Apr: "april",
    May: "may",
    Jun: "june",
    Jul: "july",
    Aug: "august",
    Sep: "september",
    Oct: "october",
    Nov: "november",
    Dec: "december",
  };

  const getAvailableMonths = () => [
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

  const safeMonthIndexValue = (m: string) => {
    if (!m) return "";
    const idx = getAvailableMonths().findIndex(
      (mon) => mon.toLowerCase() === String(m).toLowerCase()
    );
    return idx >= 0 ? String(idx + 1) : "";
  };

  // ------- File handlers -------
  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile1(file);

    if (file?.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result;
          if (typeof content !== "string") throw new Error("Invalid file content");

          const rows = content
            .split("\n")
            .map((row) => row.trim())
            .filter((row) => row !== "");

          if (rows.length <= 8) {
            alert("CSV file doesn't have enough data. Please check your file.");
            return;
          }

          const firstDataRow = rows[105];
          if (!firstDataRow)
            throw new Error("Expected data row not found at index 105.");

          const columns = firstDataRow
            .split(",")
            .map((col) => col.replace(/"/g, "").trim());

          let monthName: string | undefined;
          let parsedYear: number | undefined;

          if (effectiveCountry === "uk") {
            const dateParts = columns[0]?.split(" ") || [];
            if (dateParts.length < 3) {
              alert(
                "UK date format not recognized. You might've uploaded the wrong file."
              );
              return;
            }
            monthName = dateParts[1];
            parsedYear = parseInt(dateParts[2], 10);
          } else if (effectiveCountry === "us") {
            const dateValue = `${columns[0] ?? ""} ${columns[1] ?? ""}`;
            const dateRegex = /^([A-Za-z]+) (\d{1,2}),? (\d{4})/;
            const match = dateValue.match(dateRegex);
            if (!match) {
              alert(
                "US date format not recognized. Please check the file."
              );
              return;
            }
            monthName = match[1];
            parsedYear = parseInt(match[3], 10);
          } else {
            alert("Unsupported country format.");
            return;
          }

          const monthFullName = monthMap[monthName!];
          if (!monthFullName) {
            alert(
              "Month name not recognized. Please check if the file is correct."
            );
            return;
          }

          setYear(String(parsedYear));
          setMonth(monthFullName);
          setFile1Month(monthFullName);
          setFile1Year(String(parsedYear));
        } catch (err) {
          console.error("Error while parsing file:", err);
          alert(
            "⚠️ You might have mistakenly uploaded an **Inventory** file in the **MTD Sales** section. Please upload the correct file."
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (file && !allowedTypes.includes(file.type)) {
      alert("Please upload a valid Excel or CSV file.");
      return;
    }

    setFile2(file);

    if (file?.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content !== "string") return;

        const rows = content
          .split("\n")
          .map((row) => row.trim())
          .filter((row) => row !== "");
        const firstRow = rows[1] || "";
        const columns = firstRow.split(",");

        const dateValue = columns[0];
        if (dateValue) {
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            const parsedMonth = date
              .toLocaleString("en-US", { month: "long" })
              .toLowerCase();
            const parsedYear = String(date.getFullYear());
            setYear(parsedYear);
            setMonth(parsedMonth);
            setFile2Month(parsedMonth);
            setFile2Year(parsedYear);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // ------- mismatch warning -------
  useEffect(() => {
    const bothMonthsLoaded = !!file1Month && !!file2Month;
    const bothYearsLoaded = !!file1Year && !!file2Year;

    if (bothMonthsLoaded || bothYearsLoaded) {
      const monthMismatch = file1Month !== file2Month;
      const yearMismatch = file1Year !== file2Year;

      if (monthMismatch || yearMismatch) {
        const alertParts: string[] = [];
        if (monthMismatch)
          alertParts.push(
            `🚫 You are uploading MTD file of '${file1Month}' but Inventory file of '${file2Month}'.`
          );
        if (yearMismatch)
          alertParts.push(
            `🚫 The year in MTD file is '${file1Year}' but in Inventory file it's '${file2Year}'.`
          );

        const confirmed = window.confirm(
          `${alertParts.join(
            "\n"
          )}\nAre you sure you want to proceed with the upload?`
        );

        if (!confirmed) {
          alert(`We prefer not to proceed this way!`);
          window.location.reload();
        } else {
          console.log("User confirmed, proceeding...");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file1Month, file2Month, file1Year, file2Year]);

  // ------- selects -------
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const numeric = Number(e.target.value); // 1..12
    if (!numeric) {
      setMonth("");
      return;
    }
    const idx = numeric - 1;
    const months = getAvailableMonths();
    setMonth(months[idx]);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    if (selectedYear === String(currentYear)) {
      setMonth("");
    }
  };

  const updateCategories = () => {
    let options: string[] = [];
    if ((effectiveCountry || "").toUpperCase() === "INDIA") {
      options = ["Health", "Beauty"];
    } else {
      options = ["Select Category"];
    }
    setCategories(options);
    setCategory(options.includes(category) ? category : "");
  };

  const updateSubcategories = () => {
    let options: string[] = [];
    if (category === "Health") {
      options = ["Lubricants", "Intimate Hygiene"];
    } else if (category === "Beauty") {
      options = ["Shampoo", "Soap"];
    } else {
      options = ["Select Subcategory"];
    }
    setSubcategories(options);
    setSubcategory(options.includes(subcategory) ? subcategory : "");
  };

  // ------- modal promise helpers (for replace confirmation) -------
  const confirmWithModal = (message: string) =>
    new Promise<boolean>((resolve) => {
      setModalMessage(message);
      setShowModal(true);
      setModalResolver(() => resolve);
    });

  // ------- submit -------
  const handleCombinedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file1 || !file2) {
      setError("Please upload both files.");
      return;
    }
    if (!effectiveCountry) {
      setError(
        "Country is missing. Please open this page with a country selected."
      );
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

    try {
      const historyResponse = await fetch("http://127.0.0.1:5000/upload_history", {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const historyData = await historyResponse.json();

      const existingUpload = Array.isArray(historyData?.uploads)
        ? historyData.uploads.find(
            (upload: any) =>
              String(upload?.year) === String(year) &&
              String(upload?.month || "").toLowerCase() ===
                String(month || "").toLowerCase() &&
              String(upload?.country || "").toLowerCase() === effectiveCountry
          )
        : null;

      if (existingUpload) {
        const confirmed = await confirmWithModal(
          `You have already uploaded data for ${capitalizeFirstLetter(
            month
          )}/${year} in ${effectiveCountry.toUpperCase()}.
Do you want to replace the previous file?`
        );

        if (!confirmed) {
          window.location.reload();
          return;
        }
      }

      setIsUploading(true);
      const responseData = await submitForm();

      // Persist important fields
      if (typeof window !== "undefined") {
        localStorage.setItem("excelFileData", responseData.excel_file ?? "");
        localStorage.setItem("pnlReport", responseData.pnl_report ?? "");
        localStorage.setItem("totalSales", responseData.total_sales ?? "");
        localStorage.setItem("totalProfit", responseData.total_profit ?? "");
        localStorage.setItem("totalFbaFees", responseData.total_fba_fees ?? "");
        localStorage.setItem("totalExpense", responseData.total_expense ?? "");
        localStorage.setItem(
          "platformfee",
          responseData.platform_fee ?? responseData.otherwplatform ?? ""
        );
        localStorage.setItem("expenseChart", responseData.expense_chart_img ?? "");
        localStorage.setItem("salesChart", responseData.sales_chart_img ?? "");
        localStorage.setItem(
          "mergedInventoryData",
          JSON.stringify(responseData.merged_inventory ?? null)
        );
      }

      // Clear stale forecasts keyed by URL param (parity with JS)
      if (urlCountry) {
        localStorage.removeItem(`forecast-${urlCountry}`);
        localStorage.removeItem(`forecast-time-${urlCountry}`);
      }

      const ranged = "MTD";
      router.push(`/country/${ranged}/${effectiveCountry}/${month}/${year}`);

      // ✅ Notify parent that MTD upload is done
      if (onComplete) onComplete();
    } catch (err) {
      console.error("There was a problem with the file upload:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const submitForm = async () => {
    if (!file1 || !file2) throw new Error("Both files are required");

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    formData.append("transit_time", String(transitTime));
    formData.append("stock_unit", String(stockUnit));
    formData.append("country", effectiveCountry);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("year", year);
    formData.append("month", month);
    if (profile?.id != null) formData.append("profile_id", String(profile.id));

    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

    const response = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const contentType = response.headers.get("Content-Type") || "";

    if (!response.ok) {
      if (contentType.includes("application/json")) {
        const errJson = await response.json();
        throw new Error(errJson?.message || "Server error");
      }
      throw new Error(`HTTP ${response.status}`);
    }

    if (contentType.includes("application/json")) {
      return await response.json();
    }
    throw new Error("Unexpected response from server");
  };

  // ------- Render -------
  return (
    <>
      <div className="w-full h-full overflow-y-auto flex flex-col items-center">
        <div className="w-full flex justify-center ">
          <div className="w-full max-w-full border-2 border-emerald-500 shadow-md shadow-emerald-500/40 rounded-xl bg-white  p-4 md:p-5 lg:p-6 text-[13px] md:text[14px]">
            <h2 className="text-center !text-3xl !font-bold !text-[#5EA68E] my-3 md:my-4">
              Upload File <i className="fa-solid fa-cloud-arrow-up" />
            </h2>

            <form
              onSubmit={handleCombinedSubmit}
              encType="multipart/form-data"
              className="space-y-5 md:space-y-6"
            >
              {/* File inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {/* File 1 */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">
                    Month to Date Amazon Report:
                  </label>

                  <div
                    className={`relative h-[160px] md:h-[170px] w-full border border-neutral-700 rounded-xl bg-white flex items-center justify-center overflow-hidden ${
                      file1 ? "ring-2 ring-emerald-500" : ""
                    }`}
                  >
                    <input
                      type="file"
                      id="file1"
                      name="file1"
                      onChange={handleFileChange1}
                      accept=".xls,.xlsx,.csv"
                      required
                      className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-20"
                    />
                    <img
                      src="/images/user/uploadBox.png"
                      alt="file-icon"
                      className="pointer-events-none w-[36vw] max-w-[180px] min-w-[90px] opacity-70"
                    />
                    {file1 && (
                      <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] text-center px-2 text-neutral-800 font-medium break-words text-xs md:text-sm">
                        {file1.name}
                      </p>
                    )}
                  </div>

                  <p className="text-emerald-600 font-semibold text-[11px] md:text-xs m-0">
                    Amazon → Seller Central → Payments → Reports Repository →
                    Report Type Transactions → Select Month
                  </p>
                </div>

                {/* File 2 */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">
                    Monthly End Inventory File:
                  </label>

                  <div
                    className={`relative h-[160px] md:h-[170px] w-full border border-neutral-700 rounded-xl bg-white flex items-center justify-center overflow-hidden ${
                      file2 ? "ring-2 ring-emerald-500" : ""
                    }`}
                  >
                    <input
                      type="file"
                      id="file2"
                      name="file2"
                      onChange={handleFileChange2}
                      accept=".xls,.xlsx,.csv"
                      required
                      className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-20"
                    />
                    <img
                      src="/images/user/uploadBox.png"
                      alt="file-icon"
                      className="pointer-events-none w-[36vw] max-w-[180px] min-w-[90px] opacity-70"
                    />
                    {file2 && (
                      <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] text-center px-2 text-neutral-800 font-medium break-words text-xs md:text-sm">
                        {file2.name}
                      </p>
                    )}
                  </div>

                  <p className="text-emerald-600 font-semibold text-[11px] md:text-xs m-0">
                    Amazon → Seller Central → Reports → Fulfilment by amazon →
                    Inventory Ledger → Download
                  </p>
                  <p className="italic text-neutral-600 text-[11px] md:text-xs m-0">
                    *Summary View - Aggregate report by Country. Select last day
                    of the previous month and download in .csv format
                  </p>
                </div>
              </div>

              {error && <p className="text-red-600 text-xs">{error}</p>}

              {/* Country (read-only) */}
              <div className="relative">
                <img
                  src="/images/user/country.png"
                  aria-hidden
                  className="h-5 md:h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={(effectiveCountry || "").toUpperCase()}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-neutral-700 pl-11 pr-3 py-2.5 text-sm md:text-[15px] focus:outline-none"
                />
              </div>

              {/* Year + Month */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
                <div className="relative">
                  <img
                    src="/images/user/month.png"
                    aria-hidden
                    className="h-5 md:h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <select
                    id="year"
                    name="year"
                    value={year}
                    onChange={handleYearChange}
                    required
                    className="mt-2 w-full rounded-xl border border-neutral-700 pl-11 pr-3 py-2.5 text-sm md:text-[15px] focus:outline-none"
                  >
                    <option value="">Select Year</option>
                    {years.map((yy) => (
                      <option key={yy} value={yy}>
                        {yy}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <img
                    src="/images/user/year.png"
                    aria-hidden
                    className="h-5 md:h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <select
                    id="month"
                    name="month"
                    value={safeMonthIndexValue(month)}
                    onChange={handleMonthChange}
                    required
                    className="mt-2 w-full rounded-xl border border-neutral-700 pl-11 pr-3 py-2.5 text-sm md:text-[15px] focus:outline-none"
                  >
                    <option value="">Select Month</option>
                    {getAvailableMonths().map((m, index) => (
                      <option key={m} value={index + 1}>
                        {capitalizeFirstLetter(m)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-slate-700 text-[#f8edcf] shadow-md py-2.5 md:py-3 text-sm md:text-[15px] font-medium hover:bg-slate-800 transition disabled:opacity-60"
                disabled={isUploading}
              >
                Upload
              </button>

              {isUploading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md bg-black/30">
                  <div className="w-[120px] md:w-[140px] h-auto flex items-center justify-center overflow-hidden">
                    <video
                      src="/infinity2.webm"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="mt-4 text-white text-sm md:text-base">
                    Uploading...
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Small confirm modal using your Modalmsg component */}
      <Modalmsg
        show={showModal}
        message={modalMessage}
        onClose={() => {
          setShowModal(false);
          if (modalResolver) modalResolver(true);
        }}
        onCancel={() => {
          setShowModal(false);
          if (modalResolver) modalResolver(false);
        }}
      />
    </>
  );
};

export default FileUploadForm;
