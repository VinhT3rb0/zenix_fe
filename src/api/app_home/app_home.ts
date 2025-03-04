import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse } from '@/types/loginTypes';
import { getAccessTokenFromCookie } from '@/utils/token';

export const apiLogin = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/apis/v1/`,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = getAccessTokenFromCookie();
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  reducerPath: 'loginApi',
  tagTypes: ['Function', 'User'],
  endpoints: (builder) => ({
    userLogin: builder.mutation<LoginResponse, Partial<LoginRequest>>({
      query: ({ username, password }) => ({
        url: 'user-login/',
        method: 'POST',
        body: { username, password },
      }),
      invalidatesTags: [{ type: 'Function' }],
    }),
    getAllUsers: builder.query<any, void>({
      query: () => 'staff-manager-relationship/',
      providesTags: ['User'],
    }),
  }),
});

export const { useUserLoginMutation, useGetAllUsersQuery } = apiLogin;
