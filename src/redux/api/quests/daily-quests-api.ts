import {
  IDailyQuest,
  IPostDailyQuestRequest,
  IPutDailyQuestRequest,
  IPatchDailyQuestRequest,
  IGetDailyQuestRequest,
  IDeleteDailyQuestRequest,
} from '@/contract/quests/quests-types/daily-quests';
import Api from '@/redux/config/api';

export const dailyQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getDailyQuestById: builder.query<IDailyQuest, IGetDailyQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/quests/daily/${id}`,
      }),
      providesTags: ['dailyQuestsGet', 'questLabelsGet'],
    }),

    getAllDailyQuests: builder.query<IDailyQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/quests/daily',
      }),
      providesTags: ['dailyQuestsGet', 'questLabelsGet'],
    }),

    createDailyQuest: builder.mutation<void, IPostDailyQuestRequest>({
      query: newQuest => {
        const transformedQuest = {
          ...newQuest,
          labels: newQuest.labels.map(item => item.id),
        };

        return {
          url: '/quests/daily',
          method: 'POST',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['dailyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    updateDailyQuest: builder.mutation<void, IPutDailyQuestRequest>({
      query: updatedQuest => {
        const transformedQuest = {
          ...updatedQuest,
          labels: updatedQuest.labels.map(item => item.id),
        };

        return {
          url: `/quests/daily/${updatedQuest.id}`,
          method: 'PUT',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['dailyQuestsGet', 'todayQuestsGet', 'goals'],
    }),

    patchDailyQuest: builder.mutation<void, IPatchDailyQuestRequest>({
      query: patchData => {
        const transformedPatchData = {
          ...patchData,
          labels: patchData.labels?.map(item => item.id),
        };

        return {
          url: `/quests/daily/${patchData.id}/completion`,
          method: 'PATCH',
          body: transformedPatchData,
        };
      },
      invalidatesTags: ['dailyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    deleteDailyQuest: builder.mutation<void, IDeleteDailyQuestRequest>({
      query: ({ id }) => ({
        url: `/quests/daily/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['dailyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
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
