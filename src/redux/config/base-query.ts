import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import qs from 'qs';
import { accessTokenRefreshed, IAuthState, logOutAsync } from '../state/auth/auth-state';
import { IPostRefreshResponse } from '@/contract/auth/auth';

const REFRESH_URL = 'auth/refresh-token';
// A 401 from these means the submitted credentials were refused, not that the access token expired.
const ANONYMOUS_URLS = ['auth/login', REFRESH_URL, 'register'];
// How the refresh endpoint says the refresh token is no good. Anything else (offline, 5xx) keeps the session.
const REJECTED_REFRESH_STATUSES: FetchBaseQueryError['status'][] = [400, 401, 403, 404];

const getUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://goodiehabits.runasp.net/api',
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as { authSlice: IAuthState }).authSlice;
    const timeZone = getUserTimeZone();

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    if (timeZone) {
      headers.set('x-time-zone', timeZone);
    }

    return headers;
  },
  // Keys stay readable (`ids[]`), values are encoded so that `&`, `#` or `+` in them survive the trip.
  paramsSerializer: params =>
    qs.stringify(params, {
      arrayFormat: 'brackets',
      encodeValuesOnly: true,
    }),
});

type BaseQueryApiArg = Parameters<typeof baseQuery>[1];
type ExtraOptionsArg = Parameters<typeof baseQuery>[2];

const hasSession = (api: BaseQueryApiArg) => Boolean((api.getState() as { authSlice: IAuthState }).authSlice.token);

const isAnonymousRequest = (args: FetchArgs | string) => {
  const url = typeof args === 'string' ? args : args.url;

  return ANONYMOUS_URLS.includes(url.replace(/^\//, ''));
};

const refreshAccessToken = async (api: BaseQueryApiArg, extraOptions: ExtraOptionsArg): Promise<boolean> => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');

  if (!refreshToken) {
    await api.dispatch(logOutAsync());
    return false;
  }

  const { data, error } = await baseQuery({ url: REFRESH_URL, method: 'POST', body: { refreshToken } }, api, extraOptions);
  const accessToken = (data as IPostRefreshResponse | undefined)?.accessToken;

  // The user may have logged out while the request was in flight; a late token must not sign them back in.
  if (!hasSession(api)) {
    return false;
  }

  if (accessToken) {
    api.dispatch(accessTokenRefreshed({ accessToken }));
    return true;
  }

  if (error && REJECTED_REFRESH_STATUSES.includes(error.status)) {
    await api.dispatch(logOutAsync());
  }

  return false;
};

// Requests that expire together share one refresh call.
let pendingRefresh: Promise<boolean> | null = null;

export const baseQueryWithReauth: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || isAnonymousRequest(args) || !hasSession(api)) {
    return result;
  }

  pendingRefresh ??= refreshAccessToken(api, extraOptions).finally(() => {
    pendingRefresh = null;
  });

  const isRefreshed = await pendingRefresh;

  return isRefreshed ? baseQuery(args, api, extraOptions) : result;
};
