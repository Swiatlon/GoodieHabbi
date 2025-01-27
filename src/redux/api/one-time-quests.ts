import Api from '../config/api';
import {
  IGetOneTimeQuestsResponse,
  IGetAllQuestsQueryParams,
  ICreateQuestResponse,
  ICreateQuestRequest,
  IUpdateQuestResponse,
  IUpdateQuestRequest,
  IDeleteQuestResponse,
  IDeleteQuestRequest,
} from '@/contract/one-time-quests';

export const questSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getAllQuests: builder.query<IGetOneTimeQuestsResponse[], IGetAllQuestsQueryParams>({
      query: () => ({
        url: '/OneTimeQuest',
      }),
      providesTags: ['questsGet'],
    }),

    createQuest: builder.mutation<ICreateQuestResponse, ICreateQuestRequest>({
      query: newQuest => ({
        url: '/OneTimeQuest',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['questsGet'],
    }),

    updateQuest: builder.mutation<IUpdateQuestResponse, IUpdateQuestRequest>({
      query: updatedQuest => ({
        url: `/OneTimeQuest/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['questsGet'],
    }),

    deleteQuest: builder.mutation<IDeleteQuestResponse, IDeleteQuestRequest>({
      query: ({ id }) => ({
        url: `/OneTimeQuest/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['questsGet'],
    }),
  }),
});

export const { useGetAllQuestsQuery, useCreateQuestMutation, useUpdateQuestMutation, useDeleteQuestMutation } =
  questSlice;
