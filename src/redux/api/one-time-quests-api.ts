import Api from '../config/api';
import {
  IOneTimeQuest,
  IPostOneTimeQuestRequest,
  IPutOneTimeQuestRequest,
  IGetOneTimeQuestRequest,
  IDeleteOneTimeQuestRequest,
  IPatchOneTimeQuestRequest,
} from '@/contract/quests/quests-types/one-time-quests';

export const questSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getOneTimeQuestById: builder.query<IOneTimeQuest, IGetOneTimeQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/one-time-quests/${id}`,
      }),
      providesTags: ['oneTimeQuestsGet', 'questLabelsGet'],
    }),

    getAllOneTimeQuests: builder.query<IOneTimeQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/one-time-quests',
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
          url: '/one-time-quests',
          method: 'POST',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet'],
    }),

    updateOneTimeQuest: builder.mutation<void, IPutOneTimeQuestRequest>({
      query: updatedQuest => {
        const transformedQuest = {
          ...updatedQuest,
          labels: updatedQuest.labels.map(item => item.id),
        };

        return {
          url: `/one-time-quests/${updatedQuest.id}`,
          method: 'PUT',
          body: transformedQuest,
        };
      },
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet'],
    }),

    patchOneTimeQuest: builder.mutation<void, IPatchOneTimeQuestRequest>({
      query: patchData => {
        const transformedPatchData = {
          ...patchData,
          labels: patchData.labels?.map(item => item.id),
        };

        return {
          url: `/one-time-quests/${patchData.id}/completion`,
          method: 'PATCH',
          body: transformedPatchData,
        };
      },
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet'],
    }),

    deleteOneTimeQuest: builder.mutation<void, IDeleteOneTimeQuestRequest>({
      query: ({ id }) => ({
        url: `/one-time-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet'],
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
