// // // src/lib/utils/platforms.ts
// // import type { RegionOption } from "@/components/sidebar/RegionSelect";

// // // Unique IDs for platforms
// // export type PlatformId = "global" | "amazon-uk" | "amazon-us" | "amazon-ca" | "shopify";

// // export type ConnectedPlatforms = {
// //   amazonUk: boolean;
// //   amazonUs: boolean;
// //   amazonCa: boolean;
// //   shopify: boolean;
// // };

// // // Always available list in the order we want them shown
// // export const ALL_PLATFORM_DEFS: { id: PlatformId; label: string }[] = [
// //   { id: "global",    label: "Global Snapshot" },
// //   { id: "amazon-uk", label: "Amazon UK" },
// //   { id: "amazon-us", label: "Amazon US" },
// //   { id: "amazon-ca", label: "Amazon CA" },
// //   { id: "shopify",   label: "Shopify" },
// // ];

// // export const buildPlatformOptions = (connected: ConnectedPlatforms): RegionOption[] => {
// //   const opts: RegionOption[] = [];

// //   // 1. Global Snapshot is ALWAYS present
// //   opts.push({ value: "global", label: "Global Snapshot" });

// //   // 2. Conditionally add each platform if connected
// //   if (connected.amazonUk) {
// //     opts.push({ value: "amazon-uk", label: "Amazon UK" });
// //   }
// //   if (connected.amazonUs) {
// //     opts.push({ value: "amazon-us", label: "Amazon US" });
// //   }
// //   if (connected.amazonCa) {
// //     opts.push({ value: "amazon-ca", label: "Amazon CA" });
// //   }
// //   if (connected.shopify) {
// //     opts.push({ value: "shopify", label: "Shopify" });
// //   }

// //   return opts;
// // };

// // // Map from selected platform -> countryName param for your routes
// // export const platformToCountryName = (platform: PlatformId): string => {
// //   switch (platform) {
// //     case "global":
// //       return "global";   // or whatever your backend expects
// //     case "amazon-uk":
// //       return "uk";
// //     case "amazon-us":
// //       return "us";
// //     case "amazon-ca":
// //       return "ca";
// //     case "shopify":
// //       // decide what "countryName" you want to use for Shopify routes
// //       return "global";   // example
// //     default:
// //       return "global";
// //   }
// // };







// // src/lib/utils/platforms.ts
// import type { RegionOption } from "@/components/sidebar/RegionSelect";

// export type PlatformId =
//   | "global"
//   | "amazon-uk"
//   | "amazon-us"
//   | "amazon-ca"
//   | "shopify";

// export type ConnectedPlatforms = {
//   amazonUk: boolean;
//   amazonUs: boolean;
//   amazonCa: boolean;
//   shopify: boolean;
// };

// export const ALL_PLATFORM_DEFS: { id: PlatformId; label: string }[] = [
//   { id: "global",    label: "Global Snapshot" },
//   { id: "amazon-uk", label: "Amazon UK" },
//   { id: "amazon-us", label: "Amazon US" },
//   { id: "amazon-ca", label: "Amazon CA" },
//   { id: "shopify",   label: "Shopify" },
// ];

// export const buildPlatformOptions = (
//   connected: ConnectedPlatforms
// ): RegionOption[] => {
//   const opts: RegionOption[] = [];

//   // Always show Global
//   opts.push({ value: "global", label: "Global Snapshot" });

//   if (connected.amazonUk) {
//     opts.push({ value: "amazon-uk", label: "Amazon UK" });
//   }
//   if (connected.amazonUs) {
//     opts.push({ value: "amazon-us", label: "Amazon US" });
//   }
//   if (connected.amazonCa) {
//     opts.push({ value: "amazon-ca", label: "Amazon CA" });
//   }
//   if (connected.shopify) {
//     opts.push({ value: "shopify", label: "Shopify" });
//   }

//   return opts;
// };

// // Map platform → countryName used in your existing routes
// export const platformToCountryName = (platform: PlatformId): string => {
//   switch (platform) {
//     case "global":
//       return "global";
//     case "amazon-uk":
//       return "uk";
//     case "amazon-us":
//       return "us";
//     case "amazon-ca":
//       return "ca";
//     case "shopify":
//       // Shopify can map to any logical "countryName" for your pages
//       return "global";
//     default:
//       return "global";
//   }
// };






























// src/lib/utils/platforms.ts
import type { RegionOption } from "@/components/sidebar/RegionSelect";

export type PlatformId =
  | "global"
  | "amazon-uk"
  | "amazon-us"
  | "amazon-ca"
  | "shopify";

export type ConnectedPlatforms = {
  amazonUk: boolean;
  amazonUs: boolean;
  amazonCa: boolean;
  shopify: boolean;
};

export const ALL_PLATFORM_DEFS: { id: PlatformId; label: string }[] = [
  { id: "global", label: "Global Snapshot" },
  { id: "amazon-uk", label: "Amazon UK" },
  { id: "amazon-us", label: "Amazon US" },
  { id: "amazon-ca", label: "Amazon CA" },
  { id: "shopify", label: "Shopify" },
];

export const buildPlatformOptions = (
  connected: ConnectedPlatforms
): RegionOption[] => {
  const opts: RegionOption[] = [];

  // Always show Global
  opts.push({ value: "global", label: "Global Snapshot" });

  if (connected.amazonUk) {
    opts.push({ value: "amazon-uk", label: "Amazon UK" });
  }
  if (connected.amazonUs) {
    opts.push({ value: "amazon-us", label: "Amazon US" });
  }
  if (connected.amazonCa) {
    opts.push({ value: "amazon-ca", label: "Amazon CA" });
  }
  if (connected.shopify) {
    opts.push({ value: "shopify", label: "Shopify" });
  }

  return opts;
};

// Map platform → countryName used in your existing routes
export const platformToCountryName = (platform: PlatformId): string => {
  switch (platform) {
    case "global":
      return "global";
    case "amazon-uk":
      return "uk";
    case "amazon-us":
      return "us";
    case "amazon-ca":
      return "ca";
    case "shopify":
      // Shopify can map to any logical "countryName" for your pages
      return "global";
    default:
      return "global";
  }
};
