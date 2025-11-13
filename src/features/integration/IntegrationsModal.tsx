"use client";

import React from "react";
import { StepBadge } from "@/components/common/StepBadge";
import { FaCheck } from "react-icons/fa";

type Provider = "amazon" | "shopify";

type Props = {
    open: boolean;
    onClose: () => void;
};

const options: { key: Provider; title: string; icon: string }[] = [
    { key: "amazon", title: "Amazon Integration", icon: "/amazon.png" },
    { key: "shopify", title: "Shopify Integration", icon: "/shopify.png" },
];

const IntegrationsModal: React.FC<Props> = ({ open, onClose }) => {
    if (!open) return null;

    const handleChoose = (key: Provider) => {
        window.dispatchEvent(
            new CustomEvent("integration:choose", { detail: { provider: key, origin: "header" } }) // 👈 add origin
        );
        onClose();
    };


    // You can wire these from props/state later if needed
    const locked = false;
    const completed = false;

    const containerCls = locked
        ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
        : completed
            ? "bg-[#5EA68E26] border-[#5EA68E]"
            : "bg-white border-[#5EA68E] hover:bg-gray-50";

    return (
        <div
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                {/* Modal header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Integrations
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        aria-label="Close"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M6 6l12 12M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Inlined Step 2 block */}
                <div className={`p-4 rounded-md border mb-4 transition-all ${containerCls}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <StepBadge completed={completed} label={2} />
                            <h3
                                className={`font-semibold text-sm sm:text-base ${locked ? "text-gray-500" : "text-[#5EA68E]"
                                    }`}
                            >
                                Select Your Integration Method
                            </h3>
                        </div>

                        {locked ? (
                            <i className="fa-solid fa-lock text-gray-500 text-xs" />
                        ) : completed ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-[#5EA68E] px-3 py-1 rounded-full">
                                <FaCheck className="w-3 h-3" /> Completed
                            </span>
                        ) : (
                            <img src="/Favicon.png" alt="icon" className="h-5 sm:h-6" />
                        )}
                    </div>

                    <div className="flex gap-5 ml-8">
                        {options.map((opt) => (
                            <button
                                key={opt.key}
                                type="button"
                                disabled={locked}
                                onClick={() => !locked && handleChoose(opt.key)}
                                title={opt.title}
                                aria-label={opt.title}
                                className={`aspect-square w-14 rounded-md border border-[#5EA68E] flex items-center justify-center
                  ${locked ? "opacity-60 cursor-not-allowed" : "hover:bg-emerald-50"}`}
                            >
                                <img src={opt.icon} alt={opt.title} className="h-7 w-7 object-contain" />
                            </button>
                        ))}
                    </div>
                </div>
                {/* /Inlined Step 2 block */}
            </div>
        </div>
    );
};

export default IntegrationsModal;
