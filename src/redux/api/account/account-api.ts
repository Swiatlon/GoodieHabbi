import Api from '../../config/api';
import { IAccountDataResponse, IGetAccountRequest, IUpdateAccountResponse, IUpdateAccountRequest } from '@/contract/account/account';
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
        method: 'PATCH',
        body: accountData,
      }),
    }),
  }),
});

export const { useGetAccountDataQuery, useUpdateAccountDataMutation } = accountSliceAPI;

export const selectAccountData = (state: RootStateType) => state.api.queries;
