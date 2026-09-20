import { ICreateGoalRequest, IGetActiveGoalResponse } from '@/contract/goals/goals.contract';
import Api from '@/redux/config/api';

/**
 * `PATCH /goals/{id}/completion` is gone from here on purpose. The backend kept the route alive for the
 * migration, but it ignores its body, has no undo path, and just records one completion on the quest.
 * Goals are completed through the ordinary completions endpoint instead, and the goal is achieved as a
 * consequence — see `useQuestCompletion`.
 */
export const goalSliceAPI = Api.injectEndpoints({
  endpoints: builder => ({
    createGoal: builder.mutation<void, { data: ICreateGoalRequest }>({
      query: ({ data }) => ({
        url: `goals`,
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
  }),
});

export const { useCreateGoalMutation, useGetActiveGoalQuery } = goalSliceAPI;
