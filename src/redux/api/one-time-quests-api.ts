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
      providesTags: ['oneTimeQuestsGet'],
    }),

    getAllOneTimeQuests: builder.query<IOneTimeQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/one-time-quests',
      }),
      providesTags: ['oneTimeQuestsGet'],
    }),

    createOneTimeQuest: builder.mutation<void, IPostOneTimeQuestRequest>({
      query: newQuest => ({
        url: '/one-time-quests',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet'],
    }),

    updateOneTimeQuest: builder.mutation<void, IPutOneTimeQuestRequest>({
      query: updatedQuest => ({
        url: `/one-time-quests/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['oneTimeQuestsGet', 'todayQuestsGet'],
    }),

    patchOneTimeQuest: builder.mutation<void, IPatchOneTimeQuestRequest>({
      query: patchData => ({
        url: `/one-time-quests/${patchData.id}`,
        method: 'PATCH',
        body: patchData,
      }),
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
