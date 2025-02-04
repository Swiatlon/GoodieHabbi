import Api from '../config/api';
import {
  IDailyQuest,
  IPostDailyQuestRequest,
  IPutDailyQuestRequest,
  IPatchDailyQuestRequest,
  IGetDailyQuestRequest,
  IDeleteDailyQuestRequest,
} from '@/contract/quests/quests-types/daily-quests';

export const dailyQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getDailyQuestById: builder.query<IDailyQuest, IGetDailyQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/daily-quests/${id}`,
      }),
      providesTags: ['dailyQuestsGet'],
    }),

    getAllDailyQuests: builder.query<IDailyQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/daily-quests',
      }),
      providesTags: ['dailyQuestsGet'],
    }),

    createDailyQuest: builder.mutation<void, IPostDailyQuestRequest>({
      query: newQuest => ({
        url: '/daily-quests',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['dailyQuestsGet'],
    }),

    updateDailyQuest: builder.mutation<void, IPutDailyQuestRequest>({
      query: updatedQuest => ({
        url: `/daily-quests/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['dailyQuestsGet'],
    }),

    patchDailyQuest: builder.mutation<void, IPatchDailyQuestRequest>({
      query: patchData => ({
        url: `/daily-quests/${patchData.id}`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['dailyQuestsGet'],
    }),

    deleteDailyQuest: builder.mutation<void, IDeleteDailyQuestRequest>({
      query: ({ id }) => ({
        url: `/daily-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['dailyQuestsGet'],
    }),
  }),
});

export const {
  useCreateDailyQuestMutation,
  useDeleteDailyQuestMutation,
  useGetAllDailyQuestsQuery,
  useGetDailyQuestByIdQuery,
  useLazyGetAllDailyQuestsQuery,
  useLazyGetDailyQuestByIdQuery,
  useUpdateDailyQuestMutation,
  usePatchDailyQuestMutation,
} = dailyQuestSlice;
