import {
  ICreateSupplementRequest,
  IDeleteSupplementSlotRequest,
  ISetActiveRequest,
  ISupplement,
  IUpdateSupplementRequest,
  IUpsertSupplementSlotRequest,
} from '@/contract/supplements/supplements.contract';
import Api from '@/redux/config/api';

const SUPPLEMENTS_URL = '/supplements';

export const SupplementsApi = Api.injectEndpoints({
  endpoints: builder => ({
    getSupplements: builder.query<ISupplement[], { includeInactive?: boolean } | void>({
      query: (args = {}) => ({
        url: SUPPLEMENTS_URL,
        method: 'GET',
        params: { ...args },
      }),
      providesTags: ['supplements'],
    }),

    createSupplement: builder.mutation<ISupplement, ICreateSupplementRequest>({
      query: data => ({
        url: SUPPLEMENTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['supplements'],
    }),

    updateSupplement: builder.mutation<ISupplement, { id: number; data: IUpdateSupplementRequest }>({
      query: ({ id, data }) => ({
        url: `${SUPPLEMENTS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['supplements', 'supplementChecklist'],
    }),

    setSupplementActive: builder.mutation<ISupplement, { id: number; data: ISetActiveRequest }>({
      query: ({ id, data }) => ({
        url: `${SUPPLEMENTS_URL}/${id}/active`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['supplements', 'supplementChecklist'],
    }),

    deleteSupplement: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `${SUPPLEMENTS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['supplements', 'supplementChecklist'],
    }),

    upsertSupplementSlot: builder.mutation<ISupplement, IUpsertSupplementSlotRequest>({
      query: ({ supplementId, slotId, slot }) => ({
        url: slotId ? `${SUPPLEMENTS_URL}/${supplementId}/slots/${slotId}` : `${SUPPLEMENTS_URL}/${supplementId}/slots`,
        method: slotId ? 'PUT' : 'POST',
        body: slot,
      }),
      invalidatesTags: ['supplements', 'supplementChecklist'],
    }),

    deleteSupplementSlot: builder.mutation<ISupplement, IDeleteSupplementSlotRequest>({
      query: ({ supplementId, slotId }) => ({
        url: `${SUPPLEMENTS_URL}/${supplementId}/slots/${slotId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['supplements', 'supplementChecklist', 'supplementIntakes'],
    }),
  }),
});

export const {
  useGetSupplementsQuery,
  useCreateSupplementMutation,
  useUpdateSupplementMutation,
  useSetSupplementActiveMutation,
  useDeleteSupplementMutation,
  useUpsertSupplementSlotMutation,
  useDeleteSupplementSlotMutation,
} = SupplementsApi;
