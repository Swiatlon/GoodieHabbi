import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { NullableNumber, NullableString } from '@/types/global-types';
import { parseJwt } from '@/utils/jwt-utils';

export interface IAuthState {
  token: NullableString;
  accountId: NullableNumber;
  expDate: NullableString;
}

const initialState: IAuthState = {
  token: null,
  accountId: null,
  expDate: null,
};
const toAuthState = ({ accessToken }: { accessToken: NullableString }) => {
  const decoded = parseJwt(accessToken);
  const expDate = decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null;
  const accountId = decoded?.accountId ?? null;

  return { payload: { token: accessToken, expDate, accountId } };
};

const applyAuthState = (state: IAuthState, { payload }: PayloadAction<IAuthState>) => {
  state.token = payload.token;
  state.expDate = payload.expDate;
  state.accountId = payload.accountId;
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    // A new session: the store middleware also drops the API cache on this one.
    setCredentials: { prepare: toAuthState, reducer: applyAuthState },
    // Same session with a newer token: the cache stays.
    accessTokenRefreshed: { prepare: toAuthState, reducer: applyAuthState },
  },

  selectors: {
    selectCurrentToken: state => state.token,
    selectTokenExpirationTime: state => state.expDate,
    selectAccountId: state => state.accountId,
  },

  extraReducers: builder => {
    builder.addCase(logOutAsync.fulfilled, state => {
      state.token = null;
      state.expDate = null;
      state.accountId = null;
    });
  },
});

export const logOutAsync = createAsyncThunk('auth/logOut', async () => {
  await SecureStore.deleteItemAsync('refreshToken');
});

export const handleAuthSuccess = createAsyncThunk(
  'auth/handleAuthSuccess',
  async (data: { accessToken: string; refreshToken: string }, { dispatch }) => {
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    dispatch(setCredentials({ accessToken: data.accessToken }));
  }
);

export const { setCredentials, accessTokenRefreshed } = authSlice.actions;
export const { selectCurrentToken, selectTokenExpirationTime, selectAccountId } = authSlice.selectors;
export default authSlice.reducer;
