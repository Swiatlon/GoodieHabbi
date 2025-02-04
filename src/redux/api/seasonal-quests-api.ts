import Api from '../config/api';
import {
  ISeasonalQuest,
  IPostSeasonalQuestRequest,
  IPutSeasonalQuestRequest,
  IPatchSeasonalQuestRequest,
  IGetSeasonalQuestRequest,
  IDeleteSeasonalQuestRequest,
} from '@/contract/quests/quests-types/seasonal-quests';

export const seasonalQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getSeasonalQuestById: builder.query<ISeasonalQuest, IGetSeasonalQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/seasonal-quests/${id}`,
      }),
      providesTags: ['seasonalQuestsGet'],
    }),

    getAllSeasonalQuests: builder.query<ISeasonalQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/seasonal-quests',
      }),
      providesTags: ['seasonalQuestsGet'],
    }),

    createSeasonalQuest: builder.mutation<void, IPostSeasonalQuestRequest>({
      query: newQuest => ({
        url: '/seasonal-quests',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['seasonalQuestsGet'],
    }),

    updateSeasonalQuest: builder.mutation<void, IPutSeasonalQuestRequest>({
      query: updatedQuest => ({
        url: `/seasonal-quests/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['seasonalQuestsGet'],
    }),

    patchSeasonalQuest: builder.mutation<void, IPatchSeasonalQuestRequest>({
      query: patchData => ({
        url: `/seasonal-quests/${patchData.id}`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['seasonalQuestsGet'],
    }),

    deleteSeasonalQuest: builder.mutation<void, IDeleteSeasonalQuestRequest>({
      query: ({ id }) => ({
        url: `/seasonal-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['seasonalQuestsGet'],
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
