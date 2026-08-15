import { IUpdateWeightUnitRequest, IWorkoutSettings } from '@/contract/workouts/workouts.contract';
import Api from '@/redux/config/api';

export const WorkoutSettingsApi = Api.injectEndpoints({
  endpoints: builder => ({
    getWorkoutSettings: builder.query<IWorkoutSettings, void>({
      query: () => ({
        url: '/workouts/settings',
        method: 'GET',
      }),
      providesTags: ['workoutSettings'],
    }),

    updateWeightUnit: builder.mutation<IWorkoutSettings, IUpdateWeightUnitRequest>({
      query: data => ({
        url: '/workouts/settings/weight-unit',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['workoutSettings'],
    }),
  }),
});

export const { useGetWorkoutSettingsQuery, useUpdateWeightUnitMutation } = WorkoutSettingsApi;
