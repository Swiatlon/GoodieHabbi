import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base-query';

const Api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({}),
  tagTypes: ['dailyQuestsGet', 'monthlyQuestsGet', 'oneTimeQuestsGet', 'seasonalQuestsGet', 'weeklyQuestsGet', 'todayQuestsGet', 'questLabelsGet'],
});

export default Api;
