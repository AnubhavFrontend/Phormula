// src/components/sidebar/RegionSelect.tsx
"use client";
import * as React from "react";
import { FiMapPin, FiChevronDown } from "react-icons/fi";

export type RegionOption = { value: string; label: string };

type Props = {
  label?: string;
  selectedCountry: string;
  options: RegionOption[];
  onChange: (value: string) => void;
  className?: string;
};

export default function RegionSelect({
  label = "REGION",
  selectedCountry,
  options,
  onChange,
  className = "",
}: Props) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-center gap-2 text-xs text-[var(--color-green-500)] mb-1">
        <FiMapPin className="h-5 w-5" />
        <span className="tracking-wide">{label}</span>
      </label>

      <div className="relative">
        <select
          value={selectedCountry}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="
            w-full rounded-md border border-gray-300 bg-white text-sm text-gray-800
            pl-3 pr-9 py-1 shadow-sm outline-none
            focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500
            transition appearance-none
          "
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <FiChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
