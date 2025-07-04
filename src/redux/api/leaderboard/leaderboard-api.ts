import Api from '@/redux/config/api';

export interface ILeaderboardXP {
  nickname: string;
  xp: number;
}

export const leaderboardApi = Api.injectEndpoints({
  endpoints: builder => ({
    getLeaderboardXP: builder.query<ILeaderboardXP[], void>({
      query: () => '/leaderboard/xp',
    }),
  }),
});

export const { useGetLeaderboardXPQuery } = leaderboardApi;
