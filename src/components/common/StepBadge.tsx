"use client";
import React from "react";

export function StepBadge({
  completed,
  label,
}: {
  completed: boolean;
  label: number | string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold border-2 w-6 h-6 text-[10px]
        ${completed
          ? "bg-[#5EA68E] border-[#5EA68E] text-white shadow-md"
          : "bg-white text-[#414042] border-[#D9D9D9]"}`}
    >
      {completed ? (
        <img src="/Tick_small.png" alt="Done" className="h-3 w-3" />
      ) : (
        label
      )}
    </div>
  );
}
