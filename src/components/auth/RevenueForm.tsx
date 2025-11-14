"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "@/icons";

// RTK Query hooks
import { useSubmitSelectFormMutation, useMarkOnboardingCompleteMutation } from "@/lib/api/onboardingApi";

const REVENUE_OPTIONS = [
  "$0 - $50K",
  "$50K - $100K",
  "$100K - $500K",
  "$500K - $1M",
  "$1M+",
] as const;

export default function RevenueForm() {
  const router = useRouter();
  const search = useSearchParams();
  const forceOnboard = search.get("onboard") === "1";

  const [selectedRevenue, setSelectedRevenue] = useState<string>("");
  const [guarding, setGuarding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // RTK Query
  const [submitSelectForm] = useSubmitSelectFormMutation();
  const [markOnboardingComplete] = useMarkOnboardingCompleteMutation();

  // --- Guard: stay on page during onboarding, only check token ---
  useEffect(() => {
    let cancelled = false;

    const ensureToken = async (): Promise<string | null> => {
      // allow a short race where login just stored token
      for (let i = 0; i < 6; i++) {
        const t = localStorage.getItem("jwtToken");
        if (t) return t;
        await new Promise((r) => setTimeout(r, 100));
      }
      return localStorage.getItem("jwtToken");
    };

    (async () => {
      const token = await ensureToken();
      if (!token) {
        if (!cancelled) router.replace(`/signin?redirect=/chooserevenue?onboard=1`);
        return;
      }

      // If we’re onboarding, do not auto-redirect away.
      setGuarding(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, forceOnboard]);

  // const onSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedRevenue) {
  //     setError("Please select a revenue range.");
  //     return;
  //   }

  //   setError(null);
  //   setLoading(true);

  //   // Pull values already collected in earlier steps
  //   const countries = JSON.parse(localStorage.getItem("selectedCountries") || "[]") as string[];
  //   const companyName = localStorage.getItem("companyName") || "";
  //   const brandName = localStorage.getItem("brandName") || "";
  //   const homeCurrency = localStorage.getItem("homeCurrency") || "";

  //   try {
  //     // Submit selection to backend
  //     await submitSelectForm({
  //       annual_sales_range: selectedRevenue,
  //       country: countries.join(", "),
  //       company_name: companyName,
  //       brand_name: brandName,
  //       homeCurrency,
  //     }).unwrap();

  //     // Mark onboarding as done on client + server
  //     localStorage.setItem("onboardDone", "true");
  //     try {
  //       await markOnboardingComplete({ onboarding_complete: true }).unwrap();
  //     } catch {
  //       // non-blocking
  //     }
  //   } finally {
  //     setLoading(false);
  //   }

  //   // Safe default: go to dashboard
  //   router.push("/");
  // };

  const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedRevenue) {
    setError("Please select a revenue range.");
    return;
  }

  setError(null);
  setLoading(true);

  // Pull values already collected in earlier steps
  const countries = JSON.parse(
    localStorage.getItem("selectedCountries") || "[]"
  ) as string[];
  const companyName = localStorage.getItem("companyName") || "";
  const brandName = localStorage.getItem("brandName") || "";
  const homeCurrency = localStorage.getItem("homeCurrency") || "";

  // Mark onboarding done on client immediately
  localStorage.setItem("onboardDone", "true");

  // 🔥 Fire-and-forget submit + mark complete
  submitSelectForm({
    annual_sales_range: selectedRevenue,
    country: countries.join(", "),
    company_name: companyName,
    brand_name: brandName,
    homeCurrency,
  })
    .unwrap()
    .then(() =>
      markOnboardingComplete({ onboarding_complete: true }).unwrap()
    )
    .catch((e) => {
      console.warn("Onboarding completion failed (non-blocking):", e);
    });

  // 🚀 Go to dashboard right away
  router.push("/");

  // ❌ No setLoading(false) – component is about to unmount
};


  const onBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/brand?onboard=1");
    }
  };

  if (guarding) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">

      {/* Form column */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Estimated Revenue
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose your estimated revenue for next year.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {REVENUE_OPTIONS.map((label) => (
              <label
                key={label}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition ${
                  selectedRevenue === label
                    ? "border-[#48A887] bg-[#f5faff]"
                    : "border-gray-300 bg-white dark:bg-gray-900"
                }`}
              >
                <span className="text-base text-[#414042] dark:text-gray-200">{label}</span>
                <input
                  type="radio"
                  name="revenue"
                  className="h-5 w-5 accent-[#48A887]"
                  checked={selectedRevenue === label}
                  onChange={() => setSelectedRevenue(label)}
                />
              </label>
            ))}

            {error && (
              <p className="text-sm text-red-500" aria-live="polite">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex justify-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center rounded-lg bg-[#2c3854] px-4 py-2 text-sm font-semibold text-[#f8edcf] hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Please wait…" : "Submit"}
              </button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Want to update brand details?{" "}
              <Link
                href="/brand?onboard=1"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Go back to Company & Brand
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
