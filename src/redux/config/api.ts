import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const Api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://goodiehabits.runasp.net/api', credentials: 'include' }),
  endpoints: builder => ({}),
  tagTypes: [
    'dailyQuestsGet',
    'monthlyQuestsGet',
    'oneTimeQuestsGet',
    'seasonalQuestsGet',
    'weeklyQuestsGet',
    'todayQuestsGet',
  ],
});

export default Api;
