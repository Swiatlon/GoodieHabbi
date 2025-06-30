import {
  IWeeklyQuest,
  IPostWeeklyQuestRequest,
  IPutWeeklyQuestRequest,
  IPatchWeeklyQuestRequest,
  IGetWeeklyQuestRequest,
  IDeleteWeeklyQuestRequest,
} from '@/contract/quests/quests-types/weekly-quests';
import Api from '@/redux/config/api';

export const weeklyQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getWeeklyQuestById: builder.query<IWeeklyQuest, IGetWeeklyQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/weekly-quests/${id}`,
      }),
      providesTags: ['weeklyQuestsGet', 'questLabelsGet'],
    }),

    getAllWeeklyQuests: builder.query<IWeeklyQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/weekly-quests',
      }),
      providesTags: ['weeklyQuestsGet', 'questLabelsGet'],
    }),

    createWeeklyQuest: builder.mutation<void, IPostWeeklyQuestRequest>({
      query: newQuest => {
        const transformedQuest = {
          ...newQuest,
          labels: newQuest.labels.map(item => item.id),
        };

        return {
          url: '/weekly-quests',
          method: 'POST',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['weeklyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    updateWeeklyQuest: builder.mutation<void, IPutWeeklyQuestRequest>({
      query: newQuest => {
        const transformedQuest = {
          ...newQuest,
          labels: newQuest.labels.map(item => item.id),
        };

        return {
          url: `/weekly-quests/${newQuest.id}`,
          method: 'PUT',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['weeklyQuestsGet', 'todayQuestsGet', 'goals'],
    }),

    patchWeeklyQuest: builder.mutation<void, IPatchWeeklyQuestRequest>({
      query: patchData => ({
        url: `/weekly-quests/${patchData.id}/completion`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['weeklyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    deleteWeeklyQuest: builder.mutation<void, IDeleteWeeklyQuestRequest>({
      query: ({ id }) => ({
        url: `/weekly-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['weeklyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
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
