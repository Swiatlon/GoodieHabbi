import {
  ICreateExerciseRequest,
  IExercise,
  IGetExercisesRequest,
  ISetArchivedRequest,
  IUpdateExerciseRequest,
} from '@/contract/workouts/workouts.contract';
import Api from '@/redux/config/api';

const EXERCISES_URL = '/workouts/exercises';

export const WorkoutExercisesApi = Api.injectEndpoints({
  endpoints: builder => ({
    getExercises: builder.query<IExercise[], IGetExercisesRequest | void>({
      query: (args = {}) => ({
        url: EXERCISES_URL,
        method: 'GET',
        params: { ...args },
      }),
      providesTags: ['workoutExercises'],
    }),

    createExercise: builder.mutation<IExercise, ICreateExerciseRequest>({
      query: data => ({
        url: EXERCISES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['workoutExercises'],
    }),

    updateExercise: builder.mutation<IExercise, { id: number; data: IUpdateExerciseRequest }>({
      query: ({ id, data }) => ({
        url: `${EXERCISES_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['workoutExercises', 'workoutRoutines'],
    }),

    setExerciseArchived: builder.mutation<IExercise, { id: number; data: ISetArchivedRequest }>({
      query: ({ id, data }) => ({
        url: `${EXERCISES_URL}/${id}/archived`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['workoutExercises'],
    }),

    deleteExercise: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `${EXERCISES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['workoutExercises', 'workoutRoutines'],
    }),
  }),
});

export const {
  useGetExercisesQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useSetExerciseArchivedMutation,
  useDeleteExerciseMutation,
} = WorkoutExercisesApi;
