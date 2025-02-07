import Api from '../config/api';
import {
  IMonthlyQuest,
  IPostMonthlyQuestRequest,
  IPutMonthlyQuestRequest,
  IPatchMonthlyQuestRequest,
  IGetMonthlyQuestRequest,
  IDeleteMonthlyQuestRequest,
} from '@/contract/quests/quests-types/monthly-quests';

export const monthlyQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getMonthlyQuestById: builder.query<IMonthlyQuest, IGetMonthlyQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/monthly-quests/${id}`,
      }),
      providesTags: ['monthlyQuestsGet'],
    }),

    getAllMonthlyQuests: builder.query<IMonthlyQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/monthly-quests',
      }),
      providesTags: ['monthlyQuestsGet'],
    }),

    createMonthlyQuest: builder.mutation<void, IPostMonthlyQuestRequest>({
      query: newQuest => ({
        url: '/monthly-quests',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet'],
    }),

    updateMonthlyQuest: builder.mutation<void, IPutMonthlyQuestRequest>({
      query: updatedQuest => ({
        url: `/monthly-quests/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet'],
    }),

    patchMonthlyQuest: builder.mutation<void, IPatchMonthlyQuestRequest>({
      query: patchData => ({
        url: `/monthly-quests/${patchData.id}`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet'],
    }),

    deleteMonthlyQuest: builder.mutation<void, IDeleteMonthlyQuestRequest>({
      query: ({ id }) => ({
        url: `/monthly-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet'],
    }),
  }),
});

export const {
  useCreateMonthlyQuestMutation,
  useDeleteMonthlyQuestMutation,
  useGetAllMonthlyQuestsQuery,
  useGetMonthlyQuestByIdQuery,
  useLazyGetAllMonthlyQuestsQuery,
  useLazyGetMonthlyQuestByIdQuery,
  useUpdateMonthlyQuestMutation,
  usePatchMonthlyQuestMutation,
} = monthlyQuestSlice;
