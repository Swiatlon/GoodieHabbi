import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import qs from 'qs';
import { IAuthState, setCredentials } from '../state/auth/auth-state';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://goodiehabits.runasp.net/api',
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as { authSlice: IAuthState }).authSlice;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
  paramsSerializer: params =>
    qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false,
    }),
});

export const baseQueryWithReauth: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    if (!refreshToken) {
      return result;
    }

    const refreshResult = await baseQuery('/auth/refresh', api, {
      ...extraOptions,
      body: { refreshToken },
    });

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as { accessToken: string };

      if (accessToken) {
        api.dispatch(setCredentials({ accessToken }));
        result = await baseQuery(args, api, extraOptions);

        return result;
      }
    }
  }

  return result;
};
