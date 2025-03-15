import { IQuestLabel, IPostQuestLabelRequest, IPatchQuestLabelRequest, IDeleteQuestLabelRequest } from '@/contract/quests/labels/labels-quests';
import Api from '@/redux/config/api';

export const questLabelSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getQuestLabels: builder.query<IQuestLabel[], void>({
      query: () => ({
        method: 'GET',
        url: '/quest-labels',
      }),
      providesTags: ['questLabelsGet'],
    }),

    createQuestLabel: builder.mutation<number, IPostQuestLabelRequest>({
      query: newLabel => ({
        url: '/quest-labels',
        method: 'POST',
        body: newLabel,
      }),
      invalidatesTags: ['questLabelsGet'],
    }),

    updateQuestLabel: builder.mutation<void, IPatchQuestLabelRequest>({
      query: updatedLabel => ({
        url: `/quest-labels/${updatedLabel.id}`,
        method: 'PATCH',
        body: updatedLabel,
      }),
      invalidatesTags: ['questLabelsGet'],
    }),

    deleteQuestLabel: builder.mutation<void, IDeleteQuestLabelRequest>({
      query: ({ id }) => ({
        url: `/quest-labels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['questLabelsGet'],
    }),
  }),
});

export const {
  useCreateQuestLabelMutation,
  useDeleteQuestLabelMutation,
  useGetQuestLabelsQuery,
  useLazyGetQuestLabelsQuery,
  useUpdateQuestLabelMutation,
} = questLabelSlice;
