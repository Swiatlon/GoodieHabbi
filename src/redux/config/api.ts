import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const Api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: builder => ({}),
});

export default Api;
