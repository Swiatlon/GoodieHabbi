import Api, { allTags } from '../../config/api';
import {
  IPostLoginRequest,
  IPostLoginResponse,
  IPostRefreshRequest,
  IPostRefreshResponse,
  IPostRegisterRequest,
  IPostRegisterResponse,
} from '@/contract/auth/auth';

export const authSlice = Api.injectEndpoints({
  endpoints: builder => ({
    registerAccount: builder.mutation<IPostRegisterResponse, IPostRegisterRequest>({
      query: newAccount => ({
        url: '/register',
        method: 'POST',
        body: newAccount,
      }),
    }),

    loginAccount: builder.mutation<IPostLoginResponse, IPostLoginRequest>({
      query: credentials => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: allTags,
    }),

    refreshAccessToken: builder.mutation<IPostRefreshResponse, IPostRefreshRequest>({
      query: data => ({
        url: 'auth/refresh-token',
        method: 'POST',
        body: data,
        invalidatesTags: allTags,
      }),
    }),
  }),
});

export const { useRegisterAccountMutation, useLoginAccountMutation, useRefreshAccessTokenMutation } = authSlice;
