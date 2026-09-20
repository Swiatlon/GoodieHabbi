import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base-query';

export const allTags = [
  // One tag for every quest read — list, active, single. The per-type tags went with the per-type routes.
  'quests',
  'questCatchUp',
  'questLabelsGet',
  'questAnalytics',
  'habitsOverview',
  'account',
  'goals',
  'statsProfile',
  'statsExtended',
  'eligibleQuestsForGoals',
  'notifications',
  'shopItems',
  'inventory',
  'financeCategories',
  'financeTransactions',
  'financeBudgets',
  'financeAnalytics',
  'financeRecurring',
  'workoutExercises',
  'workoutRoutines',
  'workoutSessions',
  'workoutActiveSession',
  'workoutAnalytics',
  'workoutSettings',
  'supplements',
  'supplementChecklist',
  'supplementIntakes',
  'supplementAnalytics',
];

const Api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: builder => ({}),
  tagTypes: allTags,
});

export default Api;
