import { baseApi } from "./baseApi";

export type LoginReq = { email: string; password: string };
export type LoginRes = { token: string; message?: string };

// --- Register types ---
export type RegisterReq = {
  email: string;
  password: string;
  phone_number: string;     // formatted, e.g. "+1 5551234567"
  phone_number_raw: string; // raw from phone input
};
export type RegisterRes = {
  success: boolean;
  message?: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginRes, LoginReq>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["User"], // optional
    }),

    // NEW: register
    register: build.mutation<RegisterRes, RegisterReq>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["User"], // optional
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;














