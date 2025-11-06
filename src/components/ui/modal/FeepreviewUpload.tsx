"use client";

import React from "react";
import { useGetCountriesQuery, useGetCountryProfileQuery } from "@/lib/api/feePreviewApi";
import ConfirmationFeepreview from "@/components/ui/modal/ConfirmationFeepreview";

type FeepreviewUploadProps = {
  country: string;
  onClose: () => void;
};

export default function FeepreviewUpload({ country: initialCountry, onClose }: FeepreviewUploadProps) {
  const [country, setCountry] = React.useState<string>(initialCountry || "");
  const [file, setFile] = React.useState<File | null>(null);
  const [transitTime, setTransitTime] = React.useState<string>("");
  const [stockUnit, setStockUnit] = React.useState<string>("");
  const [showConfirm, setShowConfirm] = React.useState<boolean>(false);
  const marketplace = "Amazon";

  const { data: countriesData, isLoading: loadingCountries, isError: isCountriesError } =
    useGetCountriesQuery();
  const countries: string[] = countriesData?.countries ?? [];

  const { data: profileData, isFetching: loadingProfile } = useGetCountryProfileQuery(country, {
    skip: !country || country === "NA" || country === "global",
  });

  React.useEffect(() => {
    if (!profileData) return;
    if (profileData.transit_time != null) setTransitTime(String(profileData.transit_time));
    if (profileData.stock_unit != null) setStockUnit(String(profileData.stock_unit));
  }, [profileData]);

  const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true); // 🔁 switch the whole modal to the confirmation/table view
  };

  // ✅ Replace the form with the confirmation view
  if (showConfirm) {
    return (
      <div className="w-full">
        <ConfirmationFeepreview
          country={country}
          marketplace={marketplace}
          file={file}
          transitTime={transitTime}
          stockUnit={stockUnit}
        />
      </div>
    );
  }

  // ⬇️ Form view (shown until "Next")
  return (
    <div className="w-full">
      <h3 className="mb-4 text-xl font-semibold text-emerald-700">Fee Preview Upload</h3>

      <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
          <select
            name="country"
            id="country"
            value={country}
            onChange={onCountryChange}
            required
            className="w-full rounded-lg border border-gray-400 px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/10"
          >
            <option value="" disabled>
              {loadingCountries ? "Loading…" : "Select Country"}
            </option>
            {!loadingCountries &&
              !isCountriesError &&
              countries.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c.toUpperCase()}
                </option>
              ))}
          </select>
          {isCountriesError && (
            <p className="mt-1 text-xs text-red-500">Failed to load countries.</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Marketplace</label>
          <input
            type="text"
            value="Amazon"
            readOnly
            className="w-full rounded-lg border border-gray-400 bg-gray-50 px-4 py-2.5 text-sm"
          />
        </div>

        <div>
          <label htmlFor="transitTime" className="mb-1 block text-sm font-medium text-gray-700">
            Transit Time (in months)
          </label>
          <input
            id="transitTime"
            name="transitTime"
            type="number"
            inputMode="numeric"
            value={transitTime}
            onChange={(e) => setTransitTime(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-400 px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/10"
          />
          {loadingProfile && (
            <p className="mt-1 text-xs text-gray-500">Loading existing profile…</p>
          )}
        </div>

        <div>
          <label htmlFor="stockUnit" className="mb-1 block text-sm font-medium text-gray-700">
            Stock Keeping Unit (in months)
          </label>
          <input
            id="stockUnit"
            name="stockUnit"
            type="number"
            inputMode="numeric"
            value={stockUnit}
            onChange={(e) => setStockUnit(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-400 px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Fee Preview Details File
          </label>
          <input
            type="file"
            name="file"
            id="file"
            accept=".xlsx,.xls"
            onChange={onFileChange}
            required
            className="block w-full cursor-pointer rounded-lg border border-gray-400 bg-white text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
          />
          <p className="mt-2 text-xs text-gray-500">
            Amazon → Seller Central → Reports → Fulfillment → Fee Preview
            <br />
            Download <b>.xlsx</b> (or .xls) for current FBA inventory
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#2c3854] px-4 py-2 text-sm font-semibold text-[#f8edcf] hover:opacity-95"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
