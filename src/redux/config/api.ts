import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base-query';

export const allTags = [
  'dailyQuestsGet',
  'monthlyQuestsGet',
  'oneTimeQuestsGet',
  'seasonalQuestsGet',
  'weeklyQuestsGet',
  'todayQuestsGet',
  'questLabelsGet',
  'account',
  'goals',
  'statsProfile',
  'statsExtended',
  'eligibleQuestsForGoals',
  'notifications',
];

const Api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({}),
  tagTypes: allTags,
});

export default Api;
