import { baseApi } from "./baseApi";

export type UserData = {
  id?: string;
  email?: string;
  brand_name?: string;
  onboarding_complete?: boolean;
  // …add more fields as your backend returns
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserData: build.query<UserData, void>({
      query: () => ({ url: "/get_user_data", method: "GET" }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserDataQuery, useLazyGetUserDataQuery } = profileApi;
