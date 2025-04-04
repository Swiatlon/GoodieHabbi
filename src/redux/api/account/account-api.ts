import Api from '../../config/api';
import {
  IAccountDataResponse,
  IGetAccountRequest,
  IUpdateAccountResponse,
  IUpdateAccountRequest,
  IDeleteAccountResponse,
  IUpdatePasswordRequest,
  IUpdatePasswordResponse,
} from '@/contract/account/account';
import { RootStateType } from '@/redux/config/store';

export const accountSliceAPI = Api.injectEndpoints({
  endpoints: builder => ({
    getAccountData: builder.query<IAccountDataResponse, IGetAccountRequest>({
      query: () => ({
        url: `/accounts/me`,
        method: 'GET',
      }),
    }),

    updateAccountData: builder.mutation<IUpdateAccountResponse, IUpdateAccountRequest>({
      query: accountData => ({
        url: `/accounts/me`,
        method: 'PUT',
        body: accountData,
      }),
    }),

    updatePassword: builder.mutation<IUpdatePasswordResponse, IUpdatePasswordRequest>({
      query: passwordData => ({
        url: `/accounts/me/password`,
        method: 'PUT',
        body: passwordData,
      }),
    }),

    deleteAccount: builder.mutation<IDeleteAccountResponse, void>({
      query: () => ({
        url: `/accounts/me`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetAccountDataQuery, useUpdateAccountDataMutation, useUpdatePasswordMutation, useDeleteAccountMutation } = accountSliceAPI;

export const selectAccountData = (state: RootStateType) => state.api.queries;
