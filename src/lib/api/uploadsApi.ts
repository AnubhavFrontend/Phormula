// src/lib/api/uploadsApi.ts
import { baseApi } from "./baseApi";

export type UploadHistory = {
  uploads?: Array<any>;
};

export const uploadsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUploadHistory: build.query<UploadHistory, void>({
      query: () => ({ url: "/upload_history", method: "GET" }),
      providesTags: ["Uploads"],
    }),

    // ⬇️ This must pass FormData directly; no Content-Type!
    uploadFiles: build.mutation<any, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData, // <- browser will set multipart/form-data with boundary
        // do NOT set headers here
      }),
      invalidatesTags: ["Uploads"],
    }),
  }),
});

export const {
  useGetUploadHistoryQuery,
  useLazyGetUploadHistoryQuery,
  useUploadFilesMutation,
} = uploadsApi;
