import {
  IAddSessionExerciseRequest,
  IAddSessionSetRequest,
  IDeleteSessionExerciseRequest,
  IDeleteSessionSetRequest,
  IGetSessionsRequest,
  ILogSessionRequest,
  IStartSessionRequest,
  IUpdateSessionRequest,
  IUpdateSessionSetRequest,
  IWorkoutSession,
  IWorkoutSessionPagedResult,
} from '@/contract/workouts/workouts.contract';
import Api from '@/redux/config/api';

const SESSIONS_URL = '/workouts/sessions';

export const WorkoutSessionsApi = Api.injectEndpoints({
  endpoints: builder => ({
    getSessions: builder.query<IWorkoutSessionPagedResult, IGetSessionsRequest | void>({
      query: (args = {}) => ({
        url: SESSIONS_URL,
        method: 'GET',
        params: { ...args },
      }),
      providesTags: ['workoutSessions'],
    }),

    getActiveSession: builder.query<IWorkoutSession | null, void>({
      query: () => ({
        url: `${SESSIONS_URL}/active`,
        method: 'GET',
        responseHandler: async (response): Promise<IWorkoutSession | null> => {
          if (response.status === 204) return null;
          return (await response.json()) as IWorkoutSession;
        },
      }),
      providesTags: ['workoutActiveSession'],
    }),

    getSessionById: builder.query<IWorkoutSession, { id: number }>({
      query: ({ id }) => ({
        url: `${SESSIONS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['workoutSessions'],
    }),

    startSession: builder.mutation<IWorkoutSession, IStartSessionRequest>({
      query: data => ({
        url: SESSIONS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession'],
    }),

    updateSession: builder.mutation<IWorkoutSession, { id: number; data: IUpdateSessionRequest }>({
      query: ({ id, data }) => ({
        url: `${SESSIONS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession'],
    }),

    logSession: builder.mutation<IWorkoutSession, { id: number; data: ILogSessionRequest }>({
      query: ({ id, data }) => ({
        url: `${SESSIONS_URL}/${id}/log`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession', 'workoutAnalytics'],
    }),

    finishSession: builder.mutation<IWorkoutSession, { id: number }>({
      query: ({ id }) => ({
        url: `${SESSIONS_URL}/${id}/finish`,
        method: 'POST',
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession', 'workoutAnalytics'],
    }),

    abandonSession: builder.mutation<IWorkoutSession, { id: number }>({
      query: ({ id }) => ({
        url: `${SESSIONS_URL}/${id}/abandon`,
        method: 'POST',
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession'],
    }),

    deleteSession: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `${SESSIONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession', 'workoutAnalytics'],
    }),

    addSessionExercise: builder.mutation<IWorkoutSession, IAddSessionExerciseRequest>({
      query: ({ sessionId, exercise }) => ({
        url: `${SESSIONS_URL}/${sessionId}/exercises`,
        method: 'POST',
        body: exercise,
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession', 'workoutAnalytics'],
    }),

    deleteSessionExercise: builder.mutation<IWorkoutSession, IDeleteSessionExerciseRequest>({
      query: ({ sessionId, entryId }) => ({
        url: `${SESSIONS_URL}/${sessionId}/exercises/${entryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession', 'workoutAnalytics'],
    }),

    addSessionSet: builder.mutation<IWorkoutSession, IAddSessionSetRequest>({
      query: ({ sessionId, entryId, set }) => ({
        url: `${SESSIONS_URL}/${sessionId}/exercises/${entryId}/sets`,
        method: 'POST',
        body: set,
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession', 'workoutAnalytics'],
    }),

    updateSessionSet: builder.mutation<IWorkoutSession, IUpdateSessionSetRequest>({
      query: ({ sessionId, entryId, setId, set }) => ({
        url: `${SESSIONS_URL}/${sessionId}/exercises/${entryId}/sets/${setId}`,
        method: 'PUT',
        body: set,
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession', 'workoutAnalytics'],
    }),

    deleteSessionSet: builder.mutation<IWorkoutSession, IDeleteSessionSetRequest>({
      query: ({ sessionId, entryId, setId }) => ({
        url: `${SESSIONS_URL}/${sessionId}/exercises/${entryId}/sets/${setId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['workoutSessions', 'workoutActiveSession', 'workoutAnalytics'],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useGetActiveSessionQuery,
  useGetSessionByIdQuery,
  useStartSessionMutation,
  useUpdateSessionMutation,
  useLogSessionMutation,
  useFinishSessionMutation,
  useAbandonSessionMutation,
  useDeleteSessionMutation,
  useAddSessionExerciseMutation,
  useDeleteSessionExerciseMutation,
  useAddSessionSetMutation,
  useUpdateSessionSetMutation,
  useDeleteSessionSetMutation,
} = WorkoutSessionsApi;
