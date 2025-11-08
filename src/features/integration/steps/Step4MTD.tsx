"use client";
import { StepBadge } from "@/components/common/StepBadge";
import React from "react";
import { FaCheck } from "react-icons/fa";

export function Step4MTD({
  enabled,
  completed,
  selectedCountry,
  onOpenForCountry,
}: {
  enabled: boolean;
  completed: boolean;
  selectedCountry: string;
  onOpenForCountry: (code: string) => void;
}) {
  const countries = [
    { code: "uk", label: "UK" },
    { code: "us", label: "US" },
    { code: "canada", label: "Canada" },
  ];

  return (
    <div
      className={`p-4 rounded-md border mb-4 transition-all ${
        enabled
          ? completed
            ? "bg-[#5EA68E26] border-[#5EA68E]"
            : "bg-white border-[#5EA68E]"
          : "bg-gray-100 border-gray-200 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <StepBadge completed={completed} label={4} />
          <h3 className={`font-semibold text-sm sm:text-base ${enabled ? "text-[#5EA68E]" : "text-gray-500"}`}>
            Upload MTD Report
          </h3>
        </div>
        {completed ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-[#5EA68E] px-3 py-1 rounded-full">
            <FaCheck className="w-3 h-3" /> Completed
          </span>
        ) : (
          <img src="/Favicon.png" alt="icon" className="h-5 sm:h-6" />
        )}
      </div>

      <p className={`text-[11px] sm:text-xs ml-7 ${enabled ? "text-gray-600" : "text-gray-400"}`}>
        MTD report from Amazon helps in calculating monthly P&L.
      </p>

      <div className="flex flex-wrap gap-2 ml-7 mt-2">
        {countries.map((btn) => {
          const isEnabledBtn = enabled && btn.code === selectedCountry;
          return (
            <button
              key={btn.code}
              type="button"
              disabled={!isEnabledBtn}
              onClick={() => isEnabledBtn && onOpenForCountry(btn.code)}
              className={`text-[11px] px-3 py-1 rounded-full border transition
                ${isEnabledBtn ? "border-emerald-400 text-emerald-700 hover:bg-emerald-50"
                                : "border-gray-300 text-gray-400 cursor-not-allowed"}`}
              title={
                isEnabledBtn
                  ? `Upload MTD for ${btn.label}`
                  : `Locked — available only for ${selectedCountry?.toUpperCase()}`
              }
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      <div className="text-[10px] text-gray-400 ml-7 mt-1">
        Only the country you selected in Step 3 is enabled here.
      </div>
    </div>
  );
}
