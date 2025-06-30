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
      invalidatesTags: ['goals', 'statsProfile', 'statsExtended', 'eligibleQuestsForGoals'],
    }),

    getActiveGoal: builder.query<IGetActiveGoalResponse, string>({
      query: goalType => ({
        url: `goals/active/${goalType}`,
        method: 'GET',
      }),
      providesTags: ['goals'],
    }),

    updateActiveGoal: builder.mutation<void, { id: number; isCompleted: boolean }>({
      query: ({ id, isCompleted }) => ({
        url: `goals/${id}/complete`,
        method: 'PATCH',
        body: {
          isCompleted,
        },
      }),
      invalidatesTags: [
        'goals',
        'statsProfile',
        'statsExtended',
        'dailyQuestsGet',
        'monthlyQuestsGet',
        'oneTimeQuestsGet',
        'seasonalQuestsGet',
        'weeklyQuestsGet',
        'todayQuestsGet',
      ],
    }),
  }),
});

export const { useCreateGoalMutation, useGetActiveGoalQuery, useUpdateActiveGoalMutation } = goalSliceAPI;
