import Api from '../config/api';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';

interface ApiResponseItem {
  id: number;
  questType: string;
  quest: AllQuestsUnion;
}

export const todayQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getAllTodayQuests: builder.query<AllQuestsUnion[], void>({
      query: () => ({
        method: 'GET',
        url: '/all-quests',
      }),
      // transformResponse: (response: ApiResponseItem[]) =>
      //   response.map(({ quest }) => ({
      //     ...quest,
      //   })),
      providesTags: ['todayQuestsGet'],
    }),
  }),
});

export const { useGetAllTodayQuestsQuery, useLazyGetAllTodayQuestsQuery } = todayQuestSlice;
