// src/lib/hooks/useConnectedPlatforms.ts
"use client";

import { useMemo } from "react";
import type { ConnectedPlatforms } from "@/lib/utils/platforms";
import { useShopifyStore } from "@/lib/utils/useShopifyStore";

export const useConnectedPlatforms = (): ConnectedPlatforms => {
  const { shopifyStore } = useShopifyStore();

  const hasShopify = !!shopifyStore?.isActive;

  // Amazon placeholders for future
  const hasAmazonUk = false;
  const hasAmazonUs = false;
  const hasAmazonCa = false;

  return useMemo(
    () => ({
      amazonUk: hasAmazonUk,
      amazonUs: hasAmazonUs,
      amazonCa: hasAmazonCa,
      shopify: hasShopify,
    }),
    [hasAmazonUk, hasAmazonUs, hasAmazonCa, hasShopify]
  );
};
