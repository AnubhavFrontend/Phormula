"use client";

import React from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
  useGetFeePreviewConfirmationTextQuery,
  useUploadFeePreviewMutation,
} from "@/lib/api/feePreviewApi";
import Modalmsg from "./Modalmsg";

type Props = {
  country: string;       // e.g. "us"
  marketplace: string;   // "Amazon"
  file: File | null;     // original uploaded file
  transitTime: string;   // months (string OK; we coerce to int)
  stockUnit: string;     // months (string OK; we coerce to int)
};

// A single cell can be string/number/null/undefined
type Cell = string | number | null | undefined;
type Row = Cell[];
type TableData = Row[];

// normalize header names
const norm = (s: unknown): string =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");

const countryMap: Record<string, string> = {
  // codes → names
  CA: "Canada",
  SG: "Singapore",
  IN: "India",
  GB: "United Kingdom",
  UK: "United Kingdom",
  US: "United States",
  // names → codes
  Canada: "CA",
  Singapore: "SG",
  India: "IN",
  "United Kingdom": "GB",
  "United States": "US",
};

export default function ConfirmationFeepreview({
  country,
  marketplace,
  file,
  transitTime,
  stockUnit,
}: Props) {
  const router = useRouter();
  const { data: confirmText } = useGetFeePreviewConfirmationTextQuery();
  const [uploadFeePreview, { isLoading: isUploading }] = useUploadFeePreviewMutation();

  const [error, setError] = React.useState<string>("");
  const [tableData, setTableData] = React.useState<TableData>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>("");

  // Parse + filter rows by store/country
  React.useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (!(result instanceof ArrayBuffer)) {
          setError("Failed to read file data.");
          return;
        }

        const data = new Uint8Array(result);
        const wb = XLSX.read(data, { type: "array" });
        const first = wb.SheetNames[0];
        const ws = wb.Sheets[first];
        const json = XLSX.utils.sheet_to_json(ws, { header: 1 }) as TableData;

        if (!json.length) {
          setError("Uploaded sheet is empty.");
          return;
        }

        const headers = (json[0] ?? []) as Row;
        const normalized = headers.map(norm);

        const aliases = ["amazon-store", "amazon store", "store", "marketplace"].map(norm);
        const storeIdx = normalized.findIndex((h) => aliases.includes(h));
        if (storeIdx === -1) {
          setError('Store/country column not found (expected something like "amazon-store").');
          return;
        }

        const upper = String(country || "").toUpperCase();
        const mappedCountry = countryMap[upper] || countryMap[country] || country || "";

        const body = json.slice(1);
        const filtered = body.filter((row) => {
          const cellUp = String(row[storeIdx] ?? "").toUpperCase();
          const rowMap = countryMap[cellUp] || cellUp;
          return rowMap.toUpperCase() === String(mappedCountry).toUpperCase();
        });

        if (!filtered.length) {
          setError(
            "No rows matched the selected country in the Fee Preview file. Please verify your file and country."
          );
          return;
        }

        // Pad to max column count for neat table
        const maxCols = Math.max(...filtered.map((r) => r.length));
        const padded = filtered.map((r) =>
          r.length < maxCols ? [...r, ...Array(maxCols - r.length).fill("")] : r
        );

        setTableData([headers, ...padded]);
        setError("");
      } catch (err) {
        console.error("Failed to parse Excel:", err);
        setError("Failed to parse the Excel file. Please check the format (.xlsx/.xls).");
      }
    };

    reader.readAsArrayBuffer(file);
  }, [file, country]);

  const onUpload = async () => {
    if (!country) return setError("Country is required.");
    if (!marketplace) return setError("Marketplace is required.");
    if (!file) return setError("Please choose a file.");
    if (tableData.length <= 1) {
      return setError("No rows to upload after filtering. Please verify your file and country.");
    }

    const t = Number.parseInt(String(transitTime), 10);
    const s = Number.parseInt(String(stockUnit), 10);
    if (!Number.isFinite(t) || t <= 0) return setError("Enter a valid Transit Time (months).");
    if (!Number.isFinite(s) || s <= 0) return setError("Enter a valid Stock Keeping Unit (months).");

    try {
      // Build a workbook from filtered rows and turn into a File
      const wb = XLSX.utils.book_new();
      const filteredSheet = XLSX.utils.aoa_to_sheet(tableData);
      XLSX.utils.book_append_sheet(wb, filteredSheet, "Filtered Data");

      const base64 = XLSX.write(wb, { bookType: "xlsx", type: "base64" });
      const bin = window.atob(base64);
      const buf = new ArrayBuffer(bin.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);

      const blob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const filteredFile = new File([blob], "filtered_data.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // matches feePreviewApi upload signature below
      const res = await uploadFeePreview({
        country,
        marketplace,
        file: filteredFile,
        transit_time: t,
        stock_unit: s,
      }).unwrap();

      setModalMessage("File uploaded successfully.");
      setShowModal(true);

      if (res?.profile_id) localStorage.setItem("profileId", String(res.profile_id));
      if (res?.country) localStorage.setItem("country", String(res.country));
      localStorage.setItem("transitTime", String(t));
      localStorage.setItem("stockUnit", String(s));
    } catch (e) {
      console.error(e);
      setError("Upload failed. Please try again.");
    }
  };

  const onBack = () => {
    router.push(`/country/QTD/${country}/NA/NA`);
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[95vw]">
        <h2 className="mb-4 text-center text-2xl font-semibold text-slate-700">
          Amazon Fee-preview Information
        </h2>
        {confirmText?.message && (
          <p className="mb-4 text-center text-sm text-gray-600">{confirmText.message}</p>
        )}

        {tableData.length > 0 && (
          <div className="max-h-[60vh] w-full overflow-hidden rounded-lg border">
            <div className="max-h-[60vh] w-full overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-emerald-600 text-amber-100">
                  <tr>
                    {tableData[0].map((cell, i) => (
                      <th key={i} className="border border-slate-300 px-3 py-2 text-left">
                        {String(cell ?? "")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(1).map((row, ri) => (
                    <tr key={ri} className="odd:bg-white even:bg-gray-50 hover:bg-emerald-50/80">
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="max-w-[240px] truncate border border-slate-200 px-3 py-2"
                          title={String(cell ?? "\u00A0")}
                        >
                          {cell ?? "\u00A0"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mx-auto mt-6 flex w-full max-w-md items-center justify-center gap-3">
          <button
            onClick={onUpload}
            disabled={isUploading}
            className="rounded-md bg-slate-800 px-5 py-2 text-sm font-semibold text-amber-100 hover:opacity-95 disabled:opacity-60"
          >
            {isUploading ? "Uploading…" : "Upload"}
          </button>
          <button
            onClick={onBack}
            disabled={isUploading}
            className="rounded-md bg-slate-800 px-5 py-2 text-sm font-semibold text-amber-100 hover:opacity-95 disabled:opacity-60"
          >
            Back
          </button>
        </div>
      </div>

      <Modalmsg
        show={showModal}
        message={modalMessage}
        onClose={() => {
          setShowModal(false);
          router.push(`/country/QTD/${country}/NA/NA`);
        }}
      />
    </div>
  );
}
