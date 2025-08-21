import {
  IMonthlyQuest,
  IPostMonthlyQuestRequest,
  IPutMonthlyQuestRequest,
  IPatchMonthlyQuestRequest,
  IGetMonthlyQuestRequest,
  IDeleteMonthlyQuestRequest,
} from '@/contract/quests/quests-types/monthly-quests';
import Api from '@/redux/config/api';

export const monthlyQuestSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getMonthlyQuestById: builder.query<IMonthlyQuest, IGetMonthlyQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/quests/monthly/${id}`,
      }),
      providesTags: ['monthlyQuestsGet', 'questLabelsGet'],
    }),

    getAllMonthlyQuests: builder.query<IMonthlyQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/quests/monthly',
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
          url: '/quests/monthly',
          method: 'POST',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    updateMonthlyQuest: builder.mutation<void, IPutMonthlyQuestRequest>({
      query: updatedQuest => {
        const transformedQuest = {
          ...updatedQuest,
          labels: updatedQuest.labels.map(item => item.id),
        };

        return {
          url: `/quests/monthly/${updatedQuest.id}`,
          method: 'PUT',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet', 'goals'],
    }),

    patchMonthlyQuest: builder.mutation<void, IPatchMonthlyQuestRequest>({
      query: patchData => {
        const transformedPatchData = {
          ...patchData,
          labels: patchData.labels?.map(item => item.id),
        };

        return {
          url: `/quests/monthly/${patchData.id}/completion`,
          method: 'PATCH',
          body: transformedPatchData,
        };
      },
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    deleteMonthlyQuest: builder.mutation<void, IDeleteMonthlyQuestRequest>({
      query: ({ id }) => ({
        url: `/quests/monthly/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['monthlyQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
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
