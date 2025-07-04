import Api from '@/redux/config/api';

export const nicknameSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getRandomNickname: builder.query<{ nickname: string }, void>({
      query: () => ({
        url: 'nickname/random',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetRandomNicknameQuery, useLazyGetRandomNicknameQuery } = nicknameSlice;
