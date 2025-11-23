"use client";

import Button from "@/components/ui/button/Button";
import React, { useEffect, useCallback } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

const ICONS = {
  back: "/BackArrow.png",
  shopify: "/shopify_small.png",
  shield: "/secure.png",
  link: "/link.png",
};

type Props = {
  onClose?: () => void;
  onManual?: () => void;   // open ConnectShopifyModal
};

function sanitizeShopName(raw: string) {
  let s = (raw || "").trim().toLowerCase();
  s = s
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.myshopify\.com$/, "");
  s = s.replace(/[^a-z0-9-]/g, "");
  return s;
}

const ShopifyIntroModal: React.FC<Props> = ({ onClose, onManual }) => {
  const handleConnect = useCallback(() => {
    // ⚠️ this uses a prompt so we can still hit the same install route you use
    // in ConnectShopifyModal. You can replace this with another UI later if you like.
    const raw = window.prompt("Enter your Shopify store name (without .myshopify.com):") || "";
    const cleaned = sanitizeShopName(raw);

    if (!cleaned) {
      return;
    }

    const frontendBase = window.location.origin;
    const redirectUri = `${frontendBase}/(admin)/shopify?shop=${encodeURIComponent(
      `${cleaned}.myshopify.com`
    )}`;

    const user_token =
      (typeof window !== "undefined" && localStorage.getItem("jwtToken")) || "";

    const installUrl = `${API_BASE}/shopify/install?shop=${encodeURIComponent(
      `${cleaned}.myshopify.com`
    )}&user_token=${encodeURIComponent(
      user_token
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = installUrl;
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopify-intro-title"
      onClick={onClose}
    >
      <div
        className="relative w-11/12 sm:w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back / Close
        <button
          type="button"
          onClick={onClose}
          className="absolute left-2 top-2 sm:left-3 sm:top-3 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label="Close"
          title="Close"
        >
          <img src={ICONS.back} alt="Back" className="h-6 w-6 sm:h-8 sm:w-8" />
        </button> */}

        {/* Body */}
        <div className="max-h-[90vh] overflow-y-auto px-6 sm:px-8 pb-6 pt-12 sm:pt-14">
          {/* Logo */}
          <div className="mx-auto mb-3 sm:mb-4 flex h-10 w-10 items-center justify-center">
            <img
              src={ICONS.shopify}
              alt="Shopify"
              className="h-10 w-10 sm:h-12 sm:w-12 mx-auto"
            />
          </div>

          {/* Title & subtitle */}
          <h2
            id="shopify-intro-title"
            className="mb-1 text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-[#5EA68E]"
          >
            Connect Shopify Store
          </h2>
          <p className="mb-5 mx-auto w-[75%] text-center text-xs sm:text-sm font-bold text-[#414042]">
            Link your Shopify Store to sync products, orders, and financial data
            seamlessly
          </p>

          {/* Secure callout */}
          <div className="mb-6 rounded-md border border-[#5EA68E] border-l-[5px] bg-[#D9D9D94D] px-3 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <img
                src={ICONS.shield}
                alt="Secure"
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
              <span className="text-xs sm:text-sm font-medium text-[#5EA68E]">
                Secure Connection
              </span>
            </div>
            <p className="mt-1 ml-1 text-xs sm:text-sm text-[#414042]">
              Your credentials are encrypted and stored securely. We only access
              data necessary for analytics.
            </p>
          </div>

          {/* Connect button */}
          <div className="mt-2 flex w-full justify-center">
            <Button
              variant = "primary"
              size="sm"
              onClick={handleConnect}
              className= "w-full"
              // className="group mx-auto inline-flex w-full items-center justify-center gap-2 rounded-md
              //   px-4 py-2.5 sm:py-2 text-sm sm:text-base font-bold text-white
              //   shadow-[0_4px_4px_-1px_#00000040] transition
              //   bg-[#5EA68E] hover:bg-[#5EA68E] active:bg-[#5EA68E]"
            >
              <img
                src={ICONS.link}
                alt=""
                className="h-5 w-5 sm:h-8 sm:w-8 opacity-90"
              />
              Connect
            </Button>
          </div>

          {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="mx-2 text-[10px] sm:text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Manual store name link */}
          <div className="flex justify-center">
            <Button
              // type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onManual}
            >
              Enter Store Name Manually
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyIntroModal;
