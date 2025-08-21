import {
  IOneTimeQuest,
  IPostOneTimeQuestRequest,
  IPutOneTimeQuestRequest,
  IGetOneTimeQuestRequest,
  IDeleteOneTimeQuestRequest,
  IPatchOneTimeQuestRequest,
} from '@/contract/quests/quests-types/one-time-quests';
import Api from '@/redux/config/api';

export const questSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getOneTimeQuestById: builder.query<IOneTimeQuest, IGetOneTimeQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/quests/one-time/${id}`,
      }),
      providesTags: ['oneTimeQuestsGet', 'questLabelsGet'],
    }),

    getAllOneTimeQuests: builder.query<IOneTimeQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/quests/one-time',
      }),
      providesTags: ['oneTimeQuestsGet', 'questLabelsGet'],
    }),

    createOneTimeQuest: builder.mutation<void, IPostOneTimeQuestRequest>({
      query: newQuest => {
        const transformedQuest = {
          ...newQuest,
          labels: newQuest.labels.map(item => item.id),
        };

        return {
          url: '/quests/one-time',
          method: 'POST',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    updateOneTimeQuest: builder.mutation<void, IPutOneTimeQuestRequest>({
      query: updatedQuest => {
        const transformedQuest = {
          ...updatedQuest,
          labels: updatedQuest.labels.map(item => item.id),
        };

        return {
          url: `/quests/one-time/${updatedQuest.id}`,
          method: 'PUT',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet', 'goals'],
    }),

    patchOneTimeQuest: builder.mutation<void, IPatchOneTimeQuestRequest>({
      query: patchData => {
        const transformedPatchData = {
          ...patchData,
          labels: patchData.labels?.map(item => item.id),
        };

        return {
          url: `/quests/oneTime/${patchData.id}/completion`,
          method: 'PATCH',
          body: transformedPatchData,
        };
      },
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet', 'statsProfile', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    deleteOneTimeQuest: builder.mutation<void, IDeleteOneTimeQuestRequest>({
      query: ({ id }) => ({
        url: `/quests/one-time/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet', 'goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),
  }),
});

export const {
  useCreateOneTimeQuestMutation,
  useDeleteOneTimeQuestMutation,
  useGetAllOneTimeQuestsQuery,
  useGetOneTimeQuestByIdQuery,
  useLazyGetAllOneTimeQuestsQuery,
  useLazyGetOneTimeQuestByIdQuery,
  useUpdateOneTimeQuestMutation,
  usePatchOneTimeQuestMutation,
} = questSlice;
