import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAccountDataResponse } from '@/contract/account/account';

const initialState: IAccountDataResponse = {
  login: null,
  email: '',
  nickname: null,
  avatar: null,
  completedQuests: 0,
  totalQuests: 0,
  completedGoals: 0,
  totalGoals: 0,
  expiredGoals: 0,
  abandonedGoals: 0,
  level: 0,
  userXp: 0,
  nextLevelTotalXpRequired: 0,
  isMaxLevel: false,
  bio: null,
  joinDate: '',
  badges: [],
};

const accountSlice = createSlice({
  name: 'accountSlice',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IAccountDataResponse>) => {
      const {
        login,
        email,
        nickname,
        avatar,
        completedQuests,
        totalQuests,
        completedGoals,
        totalGoals,
        expiredGoals,
        abandonedGoals,
        level,
        userXp,
        nextLevelTotalXpRequired,
        isMaxLevel,
        bio,
        joinDate,
        badges,
      } = action.payload;

      state.login = login;
      state.email = email;
      state.nickname = nickname;
      state.avatar = avatar;
      state.completedQuests = completedQuests;
      state.totalQuests = totalQuests;
      state.completedGoals = completedGoals;
      state.totalGoals = totalGoals;
      state.expiredGoals = expiredGoals;
      state.abandonedGoals = abandonedGoals;
      state.level = level;
      state.userXp = userXp;
      state.nextLevelTotalXpRequired = nextLevelTotalXpRequired;
      state.isMaxLevel = isMaxLevel;
      state.bio = bio;
      state.joinDate = joinDate;
      state.badges = badges;
    },
  },
  selectors: {
    selectUserData: state => state,
    selectUserLogin: state => state.login,
    selectUserEmail: state => state.email,
    selectUserNickname: state => state.nickname,
    selectUserAvatar: state => state.avatar,
    selectCompletedQuests: state => state.completedQuests,
    selectTotalQuests: state => state.totalQuests,
    selectCompletedGoals: state => state.completedGoals,
    selectTotalGoals: state => state.totalGoals,
    selectExpiredGoals: state => state.expiredGoals,
    selectAbandonedGoals: state => state.abandonedGoals,
    selectUserLevel: state => state.level,
    selectUserXp: state => state.userXp,
    selectNextLevelTotalXpRequired: state => state.nextLevelTotalXpRequired,
    selectIsMaxLevel: state => state.isMaxLevel,
    selectUserBio: state => state.bio,
    selectUserJoinDate: state => state.joinDate,
    selectUserBadges: state => state.badges,
    selectIsUserDataLoaded: state => state.login !== null,
  },
});

export const { setUserData } = accountSlice.actions;
export const {
  selectUserData,
  selectUserLogin,
  selectUserEmail,
  selectUserNickname,
  selectUserAvatar,
  selectCompletedQuests,
  selectTotalQuests,
  selectCompletedGoals,
  selectTotalGoals,
  selectExpiredGoals,
  selectAbandonedGoals,
  selectUserLevel,
  selectUserXp,
  selectNextLevelTotalXpRequired,
  selectIsMaxLevel,
  selectUserBio,
  selectUserJoinDate,
  selectUserBadges,
  selectIsUserDataLoaded,
} = accountSlice.selectors;

export default accountSlice.reducer;
