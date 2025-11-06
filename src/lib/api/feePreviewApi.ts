// src/lib/api/feePreviewApi.ts
import { baseApi } from "./baseApi";

/* ================== Types ================== */
export type CountriesResponse = {
  countries: string[];
};

export type CountryProfileRes = {
  exists: boolean;
  transit_time?: number;
  stock_unit?: number;
};

export type ConfirmationTextRes = {
  message?: string;
};

export type FeePreviewUploadReq = {
  country: string;                 // e.g., "us"
  marketplace: string;             // e.g., "Amazon"
  file: File;                      // filtered .xlsx file
  transit_time: number | string;   // months
  stock_unit: number | string;     // months
};

export type FeePreviewUploadRes = {
  profile_id: string;
  country: string;
  transit_time: number;
  stock_unit: number;
  message?: string;
};

/* ================== API ================== */
export const feePreviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    getCountries: build.query<CountriesResponse, void>({
      query: () => ({ url: "/passcountry", method: "GET" }),
      providesTags: ["Profile"],
    }),

    getProfileCountries: build.query<CountriesResponse, void>({
      query: () => ({ url: "/passcountryfromprofiles", method: "GET" }),
      providesTags: ["Profile"],
    }),

    getCountryProfile: build.query<CountryProfileRes, string>({
      query: (country: string) => ({
        url: `/check_country_profile/profile-check/${country}`,
        method: "GET",
      }),
      providesTags: (
        _res: CountryProfileRes | undefined,
        _err: unknown,
        country: string
      ) => [{ type: "Profile" as const, id: `country-${country}` }],
    }),

    getFeePreviewConfirmationText: build.query<ConfirmationTextRes, void>({
      query: () => ({ url: "/ConfirmationFeepreview", method: "GET" }),
    }),

    uploadFeePreview: build.mutation<FeePreviewUploadRes, FeePreviewUploadReq>({
      query: (args: FeePreviewUploadReq) => {
        const { country, marketplace, file, transit_time, stock_unit } = args;
        const fd = new FormData();
        fd.append("country", country);
        fd.append("marketplace", marketplace);
        fd.append("file", file);
        fd.append("transit_time", String(transit_time));
        fd.append("stock_unit", String(stock_unit));

        return {
          url: "/feepreviewupload",
          method: "POST",
          body: fd,
        };
      },
      invalidatesTags: (
        _res: FeePreviewUploadRes | undefined,
        _err: unknown,
        arg: FeePreviewUploadReq
      ) => [
        "Uploads",
        { type: "Profile" as const, id: `country-${arg.country}` },
      ],
      transformResponse: (res: FeePreviewUploadRes): FeePreviewUploadRes => ({
        ...res,
        transit_time: Number(res.transit_time),
        stock_unit: Number(res.stock_unit),
      }),
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetProfileCountriesQuery,
  useGetCountryProfileQuery,
  useGetFeePreviewConfirmationTextQuery,
  useUploadFeePreviewMutation,
} = feePreviewApi;
