import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';
import Api from '@/redux/config/api';

export const todayQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getAllTodayQuests: builder.query<AllQuestsUnion[], void>({
      query: () => ({
        method: 'GET',
        url: '/quests/active',
      }),
      providesTags: ['todayQuestsGet', 'questLabelsGet'],
    }),

    getEligibleQuestsForGoals: builder.query<AllQuestsUnion[], void>({
      query: () => ({
        method: 'GET',
        url: '/quests/eligible-for-goal',
      }),
      providesTags: ['eligibleQuestsForGoals'],
    }),
  }),
});

export const { useGetAllTodayQuestsQuery, useLazyGetAllTodayQuestsQuery, useGetEligibleQuestsForGoalsQuery, useLazyGetEligibleQuestsForGoalsQuery } =
  todayQuestSlice;
