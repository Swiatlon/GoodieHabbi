import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';
import Api from '@/redux/config/api';

export const todayQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getAllTodayQuests: builder.query<AllQuestsUnion[], void>({
      query: () => ({
        method: 'GET',
        url: '/all-quests',
      }),
      providesTags: ['todayQuestsGet', 'questLabelsGet'],
    }),

    getEligibleQuestsForGoals: builder.query<AllQuestsUnion[], void>({
      query: () => ({
        method: 'GET',
        url: '/all-quests/eligible-for-goals',
      }),
      providesTags: ['eligibleQuestsForGoals'],
    }),
  }),
});

export const { useGetAllTodayQuestsQuery, useLazyGetAllTodayQuestsQuery, useGetEligibleQuestsForGoalsQuery, useLazyGetEligibleQuestsForGoalsQuery } =
  todayQuestSlice;
