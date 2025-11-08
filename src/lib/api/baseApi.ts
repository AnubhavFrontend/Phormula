// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { RootState } from "../store";
// import { API_BASE } from "@/config/env";

// export const baseApi = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE,
//     prepareHeaders: (headers, { getState }) => {
//       const token =
//         (getState() as RootState).auth.token || (typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null);

//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }

//       // default JSON content-type for all requests; individual endpoints can override
//       if (!headers.has("Content-Type")) {
//         headers.set("Content-Type", "application/json");
//       }

//       return headers;
//     },
//     credentials: "include",
//   }),
//   tagTypes: ["User", "Uploads", "Profile"],
//   endpoints: () => ({}),
// });









// src/lib/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { API_BASE } from "@/config/env";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.token ||
        (typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      // 🚫 Do NOT set a default Content-Type here.
      // For JSON endpoints, set it per-endpoint. For FormData, let the browser set it.

      return headers;
    },
  }),
  tagTypes: ["User", "Uploads", "Profile"],
  endpoints: () => ({}),
});
