import {
  ISeasonalQuest,
  IPostSeasonalQuestRequest,
  IPutSeasonalQuestRequest,
  IPatchSeasonalQuestRequest,
  IGetSeasonalQuestRequest,
  IDeleteSeasonalQuestRequest,
} from '@/contract/quests/quests-types/seasonal-quests';
import Api from '@/redux/config/api';

export const seasonalQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getSeasonalQuestById: builder.query<ISeasonalQuest, IGetSeasonalQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/seasonal-quests/${id}`,
      }),
      providesTags: ['seasonalQuestsGet', 'questLabelsGet'],
    }),

    getAllSeasonalQuests: builder.query<ISeasonalQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/seasonal-quests',
      }),
      providesTags: ['seasonalQuestsGet', 'questLabelsGet'],
    }),

    createSeasonalQuest: builder.mutation<void, IPostSeasonalQuestRequest>({
      query: newQuest => {
        const transformedQuest = {
          ...newQuest,
          labels: newQuest.labels.map(item => item.id),
        };

        return {
          url: '/seasonal-quests',
          method: 'POST',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['seasonalQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    updateSeasonalQuest: builder.mutation<void, IPutSeasonalQuestRequest>({
      query: newQuest => {
        const transformedQuest = {
          ...newQuest,
          labels: newQuest.labels.map(item => item.id),
        };

        return {
          url: `/seasonal-quests/${newQuest.id}`,
          method: 'PUT',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['seasonalQuestsGet', 'todayQuestsGet', 'goals'],
    }),

    patchSeasonalQuest: builder.mutation<void, IPatchSeasonalQuestRequest>({
      query: patchData => ({
        url: `/seasonal-quests/${patchData.id}/completion`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['seasonalQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    deleteSeasonalQuest: builder.mutation<void, IDeleteSeasonalQuestRequest>({
      query: ({ id }) => ({
        url: `/seasonal-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['seasonalQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),
  }),
});

export const {
  useCreateSeasonalQuestMutation,
  useDeleteSeasonalQuestMutation,
  useGetAllSeasonalQuestsQuery,
  useGetSeasonalQuestByIdQuery,
  useLazyGetAllSeasonalQuestsQuery,
  useLazyGetSeasonalQuestByIdQuery,
  useUpdateSeasonalQuestMutation,
  usePatchSeasonalQuestMutation,
} = seasonalQuestSlice;
