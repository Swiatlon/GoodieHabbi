import Api, { allTags } from '../../config/api';
import {
  IAccountDataResponse,
  IGetAccountRequest,
  IUpdateAccountResponse,
  IUpdateAccountRequest,
  IDeleteAccountResponse,
  IUpdatePasswordRequest,
  IUpdatePasswordResponse,
  IDeleteAccountRequest,
  IWipeoutDataResponse,
  IWipeoutDataRequest,
} from '@/contract/account/account';
import { RootStateType } from '@/redux/config/store';

export const accountSliceAPI = Api.injectEndpoints({
  endpoints: builder => ({
    getAccountData: builder.query<IAccountDataResponse, IGetAccountRequest>({
      query: () => ({
        url: `/accounts/me`,
        method: 'GET',
      }),
      providesTags: ['account'],
    }),

    updateAccountData: builder.mutation<IUpdateAccountResponse, IUpdateAccountRequest>({
      query: accountData => ({
        url: `/accounts/me`,
        method: 'PUT',
        body: accountData,
      }),
      invalidatesTags: ['account'],
    }),

    updatePassword: builder.mutation<IUpdatePasswordResponse, IUpdatePasswordRequest>({
      query: passwordData => ({
        url: `/accounts/me/password`,
        method: 'PUT',
        body: passwordData,
      }),
      invalidatesTags: ['account'],
    }),

    deleteAccount: builder.mutation<IDeleteAccountResponse, IDeleteAccountRequest>({
      query: ({ password, confirmPassword }) => ({
        url: `/accounts/me`,
        method: 'DELETE',
        body: { password, confirmPassword },
      }),
      invalidatesTags: allTags,
    }),

    wipeoutAccountData: builder.mutation<IWipeoutDataResponse, IWipeoutDataRequest>({
      query: ({ password, confirmPassword }) => ({
        url: `/accounts/me/wipeout-data`,
        method: 'POST',
        body: { password, confirmPassword },
      }),
      invalidatesTags: allTags,
    }),
  }),
});

export const {
  useGetAccountDataQuery,
  useUpdateAccountDataMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
  useWipeoutAccountDataMutation,
} = accountSliceAPI;

export const selectAccountData = (state: RootStateType) => state.api.queries;
