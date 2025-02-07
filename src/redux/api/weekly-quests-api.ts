import Api from '../config/api';
import {
  IWeeklyQuest,
  IPostWeeklyQuestRequest,
  IPutWeeklyQuestRequest,
  IPatchWeeklyQuestRequest,
  IGetWeeklyQuestRequest,
  IDeleteWeeklyQuestRequest,
} from '@/contract/quests/quests-types/weekly-quests';

export const weeklyQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getWeeklyQuestById: builder.query<IWeeklyQuest, IGetWeeklyQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/weekly-quests/${id}`,
      }),
      providesTags: ['weeklyQuestsGet'],
    }),

    getAllWeeklyQuests: builder.query<IWeeklyQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/weekly-quests',
      }),
      providesTags: ['weeklyQuestsGet'],
    }),

    createWeeklyQuest: builder.mutation<void, IPostWeeklyQuestRequest>({
      query: newQuest => ({
        url: '/weekly-quests',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['weeklyQuestsGet', 'todayQuestsGet'],
    }),

    updateWeeklyQuest: builder.mutation<void, IPutWeeklyQuestRequest>({
      query: updatedQuest => ({
        url: `/weekly-quests/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['weeklyQuestsGet', 'todayQuestsGet'],
    }),

    patchWeeklyQuest: builder.mutation<void, IPatchWeeklyQuestRequest>({
      query: patchData => ({
        url: `/weekly-quests/${patchData.id}`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['weeklyQuestsGet', 'todayQuestsGet'],
    }),

    deleteWeeklyQuest: builder.mutation<void, IDeleteWeeklyQuestRequest>({
      query: ({ id }) => ({
        url: `/weekly-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['weeklyQuestsGet', 'todayQuestsGet'],
    }),
  }),
});

export const {
  useCreateWeeklyQuestMutation,
  useDeleteWeeklyQuestMutation,
  useGetAllWeeklyQuestsQuery,
  useGetWeeklyQuestByIdQuery,
  useLazyGetAllWeeklyQuestsQuery,
  useLazyGetWeeklyQuestByIdQuery,
  useUpdateWeeklyQuestMutation,
  usePatchWeeklyQuestMutation,
} = weeklyQuestSlice;
