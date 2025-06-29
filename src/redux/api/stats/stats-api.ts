import { IStatsProfileResponse, IStatsExtendedResponse } from '@/contract/stats/stats.contract';
import Api from '@/redux/config/api';

export const statsSliceAPI = Api.injectEndpoints({
  endpoints: builder => ({
    getStatsProfile: builder.query<IStatsProfileResponse, void>({
      query: () => ({
        url: `/stats/profile`,
        method: 'GET',
      }),
      providesTags: ['statsProfile'],
    }),

    getStatsExtended: builder.query<IStatsExtendedResponse, void>({
      query: () => ({
        url: `/stats/extended`,
        method: 'GET',
      }),
      providesTags: ['statsExtended'],
    }),
  }),
});

export const { useGetStatsProfileQuery, useGetStatsExtendedQuery } = statsSliceAPI;
