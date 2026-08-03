import {
  IGetHabitsOverviewRequest,
  IGetHabitsOverviewResponse,
  IGetQuestAnalyticsRequest,
  IGetQuestAnalyticsResponse,
} from '@/contract/quests/analytics/quests-analytics.contract';
import Api from '@/redux/config/api';

export const questsAnalyticsApi = Api.injectEndpoints({
  endpoints: builder => ({
    /** Repeatable quests only — Daily, Weekly and Monthly. Anything else answers 400. */
    getQuestAnalytics: builder.query<IGetQuestAnalyticsResponse, IGetQuestAnalyticsRequest>({
      query: ({ questId, from, to, granularity }) => ({
        url: `/quests/${questId}/analytics`,
        method: 'GET',
        params: { from, to, granularity },
      }),
      providesTags: ['questAnalytics'],
    }),

    getHabitsOverview: builder.query<IGetHabitsOverviewResponse, IGetHabitsOverviewRequest | void>({
      query: (args = {}) => ({
        url: '/quests/analytics/overview',
        method: 'GET',
        params: { from: args?.from, to: args?.to },
      }),
      providesTags: ['habitsOverview'],
    }),
  }),
});

export const { useGetQuestAnalyticsQuery, useGetHabitsOverviewQuery, useLazyGetQuestAnalyticsQuery } = questsAnalyticsApi;
