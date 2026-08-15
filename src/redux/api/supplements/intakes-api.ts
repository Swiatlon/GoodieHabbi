import {
  IGetChecklistRequest,
  IGetIntakesRequest,
  ILogAdHocIntakeRequest,
  ISupplementChecklist,
  ISupplementIntake,
  IToggleIntakeRequest,
} from '@/contract/supplements/supplements.contract';
import Api from '@/redux/config/api';

const INTAKES_URL = '/supplements/intakes';

export const SupplementIntakesApi = Api.injectEndpoints({
  endpoints: builder => ({
    getChecklist: builder.query<ISupplementChecklist, IGetChecklistRequest>({
      query: ({ date, timing }) => ({
        url: '/supplements/checklist',
        method: 'GET',
        params: { date, timing },
      }),
      providesTags: ['supplementChecklist'],
    }),

    getIntakes: builder.query<ISupplementIntake[], IGetIntakesRequest | void>({
      query: (args = {}) => ({
        url: INTAKES_URL,
        method: 'GET',
        params: { ...args },
      }),
      providesTags: ['supplementIntakes'],
    }),

    toggleIntake: builder.mutation<ISupplementChecklist, IToggleIntakeRequest>({
      query: data => ({
        url: INTAKES_URL,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['supplementChecklist', 'supplementIntakes', 'supplementAnalytics'],
    }),

    logAdHocIntake: builder.mutation<ISupplementChecklist, ILogAdHocIntakeRequest>({
      query: data => ({
        url: INTAKES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['supplementChecklist', 'supplementIntakes', 'supplementAnalytics'],
    }),

    deleteIntake: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `${INTAKES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['supplementChecklist', 'supplementIntakes', 'supplementAnalytics'],
    }),
  }),
});

export const { useGetChecklistQuery, useGetIntakesQuery, useToggleIntakeMutation, useLogAdHocIntakeMutation, useDeleteIntakeMutation } =
  SupplementIntakesApi;
