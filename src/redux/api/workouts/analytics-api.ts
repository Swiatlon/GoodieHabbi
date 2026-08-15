import { IExerciseHistory, IPersonalRecord, IWorkoutSummary } from '@/contract/workouts/workouts.contract';
import Api from '@/redux/config/api';

export const WorkoutAnalyticsApi = Api.injectEndpoints({
  endpoints: builder => ({
    getWorkoutSummary: builder.query<IWorkoutSummary, { from: string; to: string }>({
      query: ({ from, to }) => ({
        url: '/workouts/analytics/summary',
        method: 'GET',
        params: { from, to },
      }),
      providesTags: ['workoutAnalytics'],
    }),

    getExerciseHistory: builder.query<IExerciseHistory, { exerciseId: number; from: string; to: string }>({
      query: ({ exerciseId, from, to }) => ({
        url: '/workouts/analytics/exercise-history',
        method: 'GET',
        params: { exerciseId, from, to },
      }),
      providesTags: ['workoutAnalytics'],
    }),

    getPersonalRecords: builder.query<IPersonalRecord[], void>({
      query: () => ({
        url: '/workouts/analytics/personal-records',
        method: 'GET',
      }),
      providesTags: ['workoutAnalytics'],
    }),
  }),
});

export const { useGetWorkoutSummaryQuery, useGetExerciseHistoryQuery, useGetPersonalRecordsQuery } = WorkoutAnalyticsApi;
