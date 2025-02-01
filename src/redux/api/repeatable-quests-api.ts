import Api from '../config/api';
import {
  IRepeatableQuest,
  IPatchRepeatableQuestRequest,
  IPostRepeatableQuestRequest,
  IPutRepeatableQuestRequest,
} from '@/contract/repeatable-quests';

export const repeatableQuestsSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getRepeatableQuestById: builder.query<IRepeatableQuest, { id: number }>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/repeatable-quests/${id}`,
      }),
      providesTags: ['repeatableQuestsGet'],
    }),

    getAllRepeatableQuests: builder.query<IRepeatableQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/repeatable-quests',
      }),
      providesTags: ['repeatableQuestsGet'],
    }),

    getRepeatableQuestsByTypes: builder.query<IRepeatableQuest[], { types: string[] }>({
      query: ({ types }) => ({
        method: 'GET',
        url: '/repeatable-quests/by-types',
        params: { types },
      }),
      providesTags: ['repeatableQuestsGet'],
    }),

    createRepeatableQuest: builder.mutation<void, IPostRepeatableQuestRequest>({
      query: newQuest => ({
        url: '/repeatable-quests',
        method: 'POST',
        body: newQuest,
      }),
      invalidatesTags: ['repeatableQuestsGet'],
    }),

    updateRepeatableQuest: builder.mutation<void, IPutRepeatableQuestRequest>({
      query: updatedQuest => ({
        url: `/repeatable-quests/${updatedQuest.id}`,
        method: 'PUT',
        body: updatedQuest,
      }),
      invalidatesTags: ['repeatableQuestsGet'],
    }),

    patchRepeatableQuest: builder.mutation<void, IPatchRepeatableQuestRequest>({
      query: patchData => ({
        url: `/repeatable-quests/${patchData.id}`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: ['repeatableQuestsGet'],
    }),

    deleteRepeatableQuest: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/repeatable-quests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['repeatableQuestsGet'],
    }),
  }),
});

export const {
  useCreateRepeatableQuestMutation,
  useDeleteRepeatableQuestMutation,
  useGetAllRepeatableQuestsQuery,
  useGetRepeatableQuestByIdQuery,
  useLazyGetAllRepeatableQuestsQuery,
  useLazyGetRepeatableQuestByIdQuery,
  useGetRepeatableQuestsByTypesQuery,
  useUpdateRepeatableQuestMutation,
  usePatchRepeatableQuestMutation,
} = repeatableQuestsSlice;
