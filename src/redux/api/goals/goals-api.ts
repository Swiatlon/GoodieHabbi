import { ICreateGoalRequest, IGetActiveGoalResponse } from '@/contract/goals/goals.contract';
import Api from '@/redux/config/api';

export const goalSliceAPI = Api.injectEndpoints({
  endpoints: builder => ({
    createGoal: builder.mutation<void, { id: number; data: ICreateGoalRequest }>({
      query: ({ id, data }) => ({
        url: `goals/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['goals'],
    }),

    getActiveGoal: builder.query<IGetActiveGoalResponse, string>({
      query: goalType => ({
        url: `goals/active/${goalType}`,
        method: 'GET',
      }),
      providesTags: ['goals'],
    }),

    updateActiveGoal: builder.mutation<void, { goalType: string; data: string }>({
      query: ({ goalType, data }) => ({
        url: `goals/active/${goalType}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['goals'],
    }),
  }),
});

export const { useCreateGoalMutation, useGetActiveGoalQuery, useUpdateActiveGoalMutation } = goalSliceAPI;
