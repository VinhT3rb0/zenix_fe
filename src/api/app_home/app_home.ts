import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginRequest, LoginResponse } from "@/types/loginTypes";

export const apiLogin = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/apis/v1/` }),
  reducerPath: "loginApi",
  tagTypes: ["Function"],
  endpoints: (builder) => ({
    userLogin: builder.mutation<LoginResponse, Partial<LoginRequest>>({
      query: ({ username, password }) => ({
        url: "user-login/",
        method: "POST",
        body: { username, password },
      }),
      invalidatesTags: [{ type: "Function" }],
    }),
  }),
});

export const { useUserLoginMutation } = apiLogin;
