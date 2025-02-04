import Api from '../config/api';
import { IPatchQuestRequest } from '@/contract/quests/quests-types/one-time-quests';
import {
  ITodayQuest,
  IGetTodayQuestRequest,
  IPostTodayQuestRequest,
  IPutTodayQuestRequest,
  IDeleteTodayQuestRequest,
} from '@/contract/quests/quests-types/today-quests';

export const todayQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getTodayQuestById: builder.query<ITodayQuest, IGetTodayQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/today-quests/${id}`,
      }),
      providesTags: ['todayQuestsGet'],
    }),

    getAllTodayQuests: builder.query<ITodayQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/today-quests',
      }),
      providesTags: ['todayQuestsGet'],
    }),

    createTodayQuest: builder.mutation<void, IPostTodayQuestRequest>({
      query: newQuest => ({
        url: '/today-quests',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['todayQuestsGet'],
    }),

    updateTodayQuest: builder.mutation<void, IPutTodayQuestRequest>({
      query: updatedQuest => ({
        url: `/today-quests/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['todayQuestsGet'],
    }),

    patchTodayQuest: builder.mutation<void, IPatchQuestRequest>({
      query: patchData => ({
        url: `/today-quests/${patchData.id}`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['todayQuestsGet'],
    }),

    deleteTodayQuest: builder.mutation<void, IDeleteTodayQuestRequest>({
      query: ({ id }) => ({
        url: `/today-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['todayQuestsGet'],
    }),
  }),
});

export const {
  useCreateTodayQuestMutation,
  useDeleteTodayQuestMutation,
  useGetAllTodayQuestsQuery,
  useGetTodayQuestByIdQuery,
  useLazyGetAllTodayQuestsQuery,
  useLazyGetTodayQuestByIdQuery,
  useUpdateTodayQuestMutation,
  usePatchTodayQuestMutation,
} = todayQuestSlice;
