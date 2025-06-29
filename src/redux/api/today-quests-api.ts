import Api from '../config/api';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';

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
