import {
  IAddQuestCompletionRequest,
  ICreateQuestRequest,
  IDeleteQuestRequest,
  IGetCatchUpRequest,
  IGetCatchUpResponse,
  IGetQuestRequest,
  IGetQuestsRequest,
  IQuest,
  IQuestCompletionResponse,
  IRemoveQuestCompletionRequest,
  IUpdateQuestRequest,
} from '@/contract/quests/quest.contract';
import Api from '@/redux/config/api';

/**
 * One slice for every quest, replacing the five per-type slices. A quest has no type any more, so
 * create/update/get/delete all live on `/quests` with the schedule in the body.
 */

/** Everything a write to a quest can invalidate — quests feed goals, stats and every analytics screen. */
const QUEST_WRITE_TAGS = [
  'quests',
  'questCatchUp',
  'goals',
  'statsProfile',
  'statsExtended',
  'eligibleQuestsForGoals',
  'questAnalytics',
  'habitsOverview',
] as const;

export const questsApi = Api.injectEndpoints({
  endpoints: builder => ({
    getQuests: builder.query<IQuest[], IGetQuestsRequest | void>({
      query: (args = {}) => ({
        method: 'GET',
        url: '/quests',
        params: { unit: args?.unit },
      }),
      providesTags: ['quests', 'questLabelsGet'],
    }),

    getQuestById: builder.query<IQuest, IGetQuestRequest>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/quests/${id}`,
      }),
      providesTags: ['quests', 'questLabelsGet'],
    }),

    /** Today's quests. Also triggers the backend's daily housekeeping pass, so call it on app open. */
    getActiveQuests: builder.query<IQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/quests/active',
      }),
      providesTags: ['quests', 'questLabelsGet'],
    }),

    getEligibleQuestsForGoals: builder.query<IQuest[], void>({
      query: () => ({
        method: 'GET',
        url: '/quests/eligible-for-goal',
      }),
      providesTags: ['eligibleQuestsForGoals'],
    }),

    /**
     * Keep `includeCompleted` off for the catch-up card, so an empty `days` still means "hide it".
     * Turn it on where a mistaken catch-up tap has to stay undoable after a restart.
     */
    getCatchUp: builder.query<IGetCatchUpResponse, IGetCatchUpRequest | void>({
      query: (args = {}) => ({
        method: 'GET',
        url: '/quests/catch-up',
        params: { includeCompleted: args?.includeCompleted },
      }),
      providesTags: ['questCatchUp'],
    }),

    createQuest: builder.mutation<IQuest, ICreateQuestRequest>({
      query: quest => ({
        method: 'POST',
        url: '/quests',
        body: quest,
      }),
      invalidatesTags: [...QUEST_WRITE_TAGS],
    }),

    updateQuest: builder.mutation<IQuest, IUpdateQuestRequest>({
      query: ({ id, ...quest }) => ({
        method: 'PUT',
        url: `/quests/${id}`,
        body: quest,
      }),
      invalidatesTags: [...QUEST_WRITE_TAGS],
    }),

    deleteQuest: builder.mutation<void, IDeleteQuestRequest>({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/quests/${id}`,
      }),
      invalidatesTags: [...QUEST_WRITE_TAGS],
    }),

    /**
     * Records one tap. Send `clientRequestId` — without it a retry writes a second completion, which on
     * a "twice a day" habit silently finishes the day.
     */
    addQuestCompletion: builder.mutation<IQuestCompletionResponse, IAddQuestCompletionRequest>({
      query: ({ questId, ...body }) => ({
        method: 'POST',
        url: `/quests/${questId}/completions`,
        body,
      }),
      invalidatesTags: [...QUEST_WRITE_TAGS],
    }),

    /** Undo. The reward already granted for the period is never reclaimed, and never paid twice. */
    removeQuestCompletion: builder.mutation<void, IRemoveQuestCompletionRequest>({
      query: ({ questId, completionId }) => ({
        method: 'DELETE',
        url: `/quests/${questId}/completions/${completionId}`,
      }),
      invalidatesTags: [...QUEST_WRITE_TAGS],
    }),
  }),
});

export const {
  useGetQuestsQuery,
  useLazyGetQuestsQuery,
  useGetQuestByIdQuery,
  useLazyGetQuestByIdQuery,
  useGetActiveQuestsQuery,
  useLazyGetActiveQuestsQuery,
  useGetEligibleQuestsForGoalsQuery,
  useLazyGetEligibleQuestsForGoalsQuery,
  useGetCatchUpQuery,
  useLazyGetCatchUpQuery,
  useCreateQuestMutation,
  useUpdateQuestMutation,
  useDeleteQuestMutation,
  useAddQuestCompletionMutation,
  useRemoveQuestCompletionMutation,
} = questsApi;
