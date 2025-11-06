"use client";

import React from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { FiDownload } from "react-icons/fi";
import { useUploadSkuMultiCountryMutation } from "@/lib/api/skuApi";

type Row = Record<string, string | number | null | undefined>;
type Props = { onClose: () => void };

export default function SkuMultiCountryUpload({ onClose }: Props) {
  const [error, setError] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState<string>("No File Chosen");

  // second-step modal state
  const [showConfirm, setShowConfirm] = React.useState<boolean>(false);
  const [tableColumns, setTableColumns] = React.useState<string[]>([]);
  const [tableRows, setTableRows] = React.useState<Row[]>([]);

  const [uploadSku, { isLoading: isUploading }] = useUploadSkuMultiCountryMutation();

  // ---------- helpers ----------
  const cleanParsedData = React.useCallback((data: unknown[]): Row[] => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return (data as Row[])
      .filter((row) => row && Object.values(row).some((v) => v !== "" && v != null))
      .map((row) => {
        const out: Row = {};
        Object.keys(row as object).forEach((k) => {
          const normalizedKey = k.trim().toLowerCase().replace(/\s+/g, "_");
          let value = (row as Row)[k];
          if (typeof value === "string") value = value.trim();
          if (value === "undefined" || value === "NaN") value = "";
          out[normalizedKey] = value;
        });
        return out;
      });
  }, []);

  const buildColumns = (rows: Row[]): string[] =>
    rows.length ? Object.keys(rows[0]) : [];

  const parseCSVFile = (f: File) => {
    Papa.parse<Row>(f, {
      complete: (result) => {
        const cleaned = cleanParsedData(result.data as unknown[]);
        setTableRows(cleaned);
        setTableColumns(buildColumns(cleaned));
        setShowConfirm(true);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const parseXLSXFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target?.result as ArrayBuffer, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as unknown[];
      const cleaned = cleanParsedData(json);
      setTableRows(cleaned);
      setTableColumns(buildColumns(cleaned));
      setShowConfirm(true);
    };
    reader.readAsArrayBuffer(f);
  };

  // ---------- events ----------
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setError("");
    setShowConfirm(false);
    setTableRows([]);
    setTableColumns([]);

    if (!selected) {
      setFile(null);
      setFileName("No File Chosen");
      return;
    }

    const isValidType =
      selected.type === "application/vnd.ms-excel" ||
      selected.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      selected.name.toLowerCase().endsWith(".csv");

    if (!isValidType) {
      setError("Invalid file type. Please upload a CSV or XLSX file.");
      setFile(null);
      setFileName("No File Chosen");
      return;
    }

    setFile(selected);
    setFileName(selected.name);

    if (selected.name.toLowerCase().endsWith(".csv")) parseCSVFile(selected);
    else parseXLSXFile(selected);
  };

  const onDownloadTemplate = () => {
    // make sure this file is present in /public
    const a = document.createElement("a");
    a.href = `/SKU%20Information%20global%20file.xlsx`;
    a.download = "SKU Information Global file format.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onConfirmUpload = async () => {
    if (!file) return setError("Please select a file first.");
    try {
      await uploadSku({ file }).unwrap();
      // reset + close after success
      setShowConfirm(false);
      setTableRows([]);
      setTableColumns([]);
      setFile(null);
      setFileName("No File Chosen");
      onClose();
      // Optionally hard refresh:
      // window.location.reload();
    } catch (e: unknown) {
      const err = e as { data?: { error?: string; message?: string } };
      setError(err?.data?.error || err?.data?.message || "Upload failed.");
    }
  };

  // ---------- UI ----------
  return (
    <div className="w-full">
      {/* Step 1: Uploader (shown when confirm modal is hidden) */}
      {!showConfirm && (
        <div className="w-full max-w-[520px] mx-auto">
          <h2 className="text-center text-[28px] font-semibold text-[#5EA68E] mb-5">
            Upload SKU Data
          </h2>

          <div className="rounded-2xl p-3">
            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1.5">
              <label
                htmlFor="sku-file"
                className="shrink-0 cursor-pointer rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                Upload File
              </label>
              <input
                id="sku-file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={onFileChange}
                className="hidden"
              />
              <span className="block w-full truncate px-2 text-xs text-gray-500">
                {fileName}
              </span>
            </div>

            <button
              type="button"
              onClick={onDownloadTemplate}
              className="mx-auto mt-3 flex items-center gap-1 text-[13px] font-medium text-[#5EA68E] hover:text-[#4a907a]"
            >
              Download format here <FiDownload className="relative top-[1px]" />
            </button>
          </div>

          {error && (
            <p className="mt-3 text-center text-sm text-red-600">{error}</p>
          )}

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!file}
              className="rounded-md bg-[#2c3e50] px-6 py-2 text-sm font-bold text-[#fdf6e4] shadow hover:opacity-95 disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Confirmation modal with parsed table */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4">
          <div
            className="w-[90vw] max-w-5xl rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-center text-2xl font-semibold text-[#5EA68E]">
              Confirm SKU Data
            </h3>

            <div className="max-h-[60vh] overflow-auto rounded border border-gray-200">
              <table className="min-w-[720px] w-max border-collapse text-sm">
                <thead className="sticky top-0 bg-[#5EA68E] text-white">
                  <tr>
                    {tableColumns.map((col) => (
                      <th key={col} className="border px-3 py-2 text-left">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      {tableColumns.map((col) => (
                        <td
                          key={col}
                          className="max-w-xs truncate border px-3 py-2"
                          title={String(row[col] ?? "")}
                        >
                          {String(row[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
            )}

            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={onConfirmUpload}
                disabled={isUploading || !file}
                className="rounded-md bg-[#2c3e50] px-5 py-2 text-sm font-semibold text-[#fdf6e4] hover:opacity-95 disabled:opacity-60"
              >
                {isUploading ? "Uploading…" : "Confirm & Upload"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isUploading}
                className="rounded-md bg-[#2c3e50] px-5 py-2 text-sm font-semibold text-[#fdf6e4] hover:opacity-95 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
