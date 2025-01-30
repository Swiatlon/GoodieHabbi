import Api from '../config/api';
import {
  IOneTimeQuest,
  IPatchQuestRequest,
  IPostOneTimeQuestRequest,
  IPutOneTimeQuestRequest,
} from '@/contract/one-time-quests';

export const questSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getOneTimeQuestById: builder.query<IOneTimeQuest, { id: number }>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/one-time-quests/${id}`,
      }),
      providesTags: ['questsGet'],
    }),

    getAllOneTimeQuests: builder.query<IOneTimeQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/one-time-quests',
      }),
      providesTags: ['questsGet'],
    }),

    createQuest: builder.mutation<void, IPostOneTimeQuestRequest>({
      query: newQuest => ({
        url: '/one-time-quests',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['questsGet'],
    }),

    updateQuest: builder.mutation<void, IPutOneTimeQuestRequest>({
      query: updatedQuest => ({
        url: `/one-time-quests/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['questsGet'],
    }),

    patchQuest: builder.mutation<void, IPatchQuestRequest>({
      query: patchData => ({
        url: `/one-time-quests/${patchData.id}`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['questsGet'],
    }),

    deleteQuest: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/one-time-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['questsGet'],
    }),
  }),
});

export const {
  useCreateQuestMutation,
  useDeleteQuestMutation,
  useGetAllOneTimeQuestsQuery,
  useGetOneTimeQuestByIdQuery,
  useLazyGetAllOneTimeQuestsQuery,
  useLazyGetOneTimeQuestByIdQuery,
  useUpdateQuestMutation,
  usePatchQuestMutation,
} = questSlice;
