import Api from '../config/api';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';

export const todayQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getAllTodayQuests: builder.query<AllQuestsUnion[], void>({
      query: () => ({
        method: 'GET',
        url: '/all-quests',
      }),
      providesTags: ['todayQuestsGet'],
    }),
  }),
});

export const { useGetAllTodayQuestsQuery, useLazyGetAllTodayQuestsQuery } = todayQuestSlice;
