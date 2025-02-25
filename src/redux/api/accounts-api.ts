import Api from '../config/api';
import {
  IPostLoginRequest,
  IPostLoginResponse,
  IPostRefreshRequest,
  IPostRefreshResponse,
  IPostRegisterRequest,
  IPostRegisterResponse,
} from '@/contract/account/account';

export const accountSlice = Api.injectEndpoints({
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
    }),

    refreshAccessToken: builder.mutation<IPostRefreshResponse, IPostRefreshRequest>({
      query: data => ({
        url: 'auth/refresh-token',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useRegisterAccountMutation, useLoginAccountMutation, useRefreshAccessTokenMutation } = accountSlice;
