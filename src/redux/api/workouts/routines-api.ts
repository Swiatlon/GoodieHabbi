import { ICreateRoutineRequest, ISetArchivedRequest, IUpdateRoutineRequest, IWorkoutRoutine } from '@/contract/workouts/workouts.contract';
import Api from '@/redux/config/api';

const ROUTINES_URL = '/workouts/routines';

export const WorkoutRoutinesApi = Api.injectEndpoints({
  endpoints: builder => ({
    getRoutines: builder.query<IWorkoutRoutine[], { includeArchived?: boolean } | void>({
      query: (args = {}) => ({
        url: ROUTINES_URL,
        method: 'GET',
        params: { ...args },
      }),
      providesTags: ['workoutRoutines'],
    }),

    getRoutineById: builder.query<IWorkoutRoutine, { id: number }>({
      query: ({ id }) => ({
        url: `${ROUTINES_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['workoutRoutines'],
    }),

    createRoutine: builder.mutation<IWorkoutRoutine, ICreateRoutineRequest>({
      query: data => ({
        url: ROUTINES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['workoutRoutines'],
    }),

    updateRoutine: builder.mutation<IWorkoutRoutine, { id: number; data: IUpdateRoutineRequest }>({
      query: ({ id, data }) => ({
        url: `${ROUTINES_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['workoutRoutines'],
    }),

    setRoutineArchived: builder.mutation<IWorkoutRoutine, { id: number; data: ISetArchivedRequest }>({
      query: ({ id, data }) => ({
        url: `${ROUTINES_URL}/${id}/archived`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['workoutRoutines'],
    }),

    deleteRoutine: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `${ROUTINES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['workoutRoutines'],
    }),
  }),
});

export const {
  useGetRoutinesQuery,
  useGetRoutineByIdQuery,
  useCreateRoutineMutation,
  useUpdateRoutineMutation,
  useSetRoutineArchivedMutation,
  useDeleteRoutineMutation,
} = WorkoutRoutinesApi;
