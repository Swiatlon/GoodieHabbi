import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const Api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://goodiehabits.runasp.net/api' }),
  endpoints: builder => ({}),
  tagTypes: ['questsGet'],
});

export default Api;
