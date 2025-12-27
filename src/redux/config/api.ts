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
  'shopItems',
  'inventory',
];

const Api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: builder => ({}),
  tagTypes: allTags,
});

export default Api;
