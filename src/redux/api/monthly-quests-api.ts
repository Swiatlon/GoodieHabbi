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
      providesTags: ['monthlyQuestsGet', 'questLabelsGet'],
    }),

    getAllMonthlyQuests: builder.query<IMonthlyQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/monthly-quests',
      }),
      providesTags: ['monthlyQuestsGet', 'questLabelsGet'],
    }),

    createMonthlyQuest: builder.mutation<void, IPostMonthlyQuestRequest>({
      query: newQuest => {
        const transformedQuest = {
          ...newQuest,
          labels: newQuest.labels.map(item => item.id),
        };

        return {
          url: '/monthly-quests',
          method: 'POST',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet'],
    }),

    updateMonthlyQuest: builder.mutation<void, IPutMonthlyQuestRequest>({
      query: updatedQuest => {
        const transformedQuest = {
          ...updatedQuest,
          labels: updatedQuest.labels.map(item => item.id),
        };

        return {
          url: `/monthly-quests/${updatedQuest.id}`,
          method: 'PUT',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet'],
    }),

    patchMonthlyQuest: builder.mutation<void, IPatchMonthlyQuestRequest>({
      query: patchData => {
        const transformedPatchData = {
          ...patchData,
          labels: patchData.labels?.map(item => item.id),
        };

        return {
          url: `/monthly-quests/${patchData.id}/completion`,
          method: 'PATCH',
          body: transformedPatchData,
        };
      },
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet', 'statsProfile'],
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
