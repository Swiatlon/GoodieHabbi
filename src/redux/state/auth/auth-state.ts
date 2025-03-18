import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import Api from '@/redux/config/api';
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
const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setCredentials: {
      prepare: ({ accessToken }: { accessToken: NullableString }) => {
        const decoded = parseJwt(accessToken);
        const expDate = decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null;
        const accountId = decoded?.accountId ?? null;

        return { payload: { token: accessToken, expDate, accountId } };
      },

      reducer: (state, action: PayloadAction<IAuthState>) => {
        const { token, expDate, accountId } = action.payload;

        state.token = token;
        state.expDate = expDate;
        state.accountId = accountId;
      },
    },
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
    dispatch(Api.util.resetApiState());
    dispatch(setCredentials({ accessToken: data.accessToken }));
  }
);

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
