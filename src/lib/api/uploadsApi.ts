import { baseApi } from "./baseApi";

export type UploadHistory = {
  uploads?: Array<unknown>; // shape not specified; keep generic
};

export const uploadsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUploadHistory: build.query<UploadHistory, void>({
      query: () => ({ url: "/upload_history", method: "GET" }),
      providesTags: ["Uploads"],
    }),
  }),
});

export const { useGetUploadHistoryQuery, useLazyGetUploadHistoryQuery } = uploadsApi;
