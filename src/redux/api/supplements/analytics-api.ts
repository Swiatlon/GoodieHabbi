import { ISupplementAdherenceReport } from '@/contract/supplements/supplements.contract';
import Api from '@/redux/config/api';

export const SupplementAnalyticsApi = Api.injectEndpoints({
  endpoints: builder => ({
    getSupplementAdherence: builder.query<ISupplementAdherenceReport, { from: string; to: string }>({
      query: ({ from, to }) => ({
        url: '/supplements/analytics/adherence',
        method: 'GET',
        params: { from, to },
      }),
      providesTags: ['supplementAnalytics'],
    }),
  }),
});

export const { useGetSupplementAdherenceQuery } = SupplementAnalyticsApi;
