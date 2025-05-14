import accountReducer, {
  setUserData,
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
} from './account-state';
import { IAccountDataResponse } from '@/contract/account/account';

describe('accountSlice actions', () => {
  it('should set user data correctly when setUserData action is dispatched', () => {
    const initialState = {
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

    const userData: IAccountDataResponse = {
      login: 'user123',
      email: 'user@example.com',
      nickname: 'UserNickname',
      avatar: 'avatar_url',
      completedQuests: 10,
      totalQuests: 20,
      completedGoals: 5,
      totalGoals: 10,
      expiredGoals: 1,
      abandonedGoals: 2,
      level: 3,
      userXp: 1500,
      nextLevelTotalXpRequired: 2000,
      isMaxLevel: false,
      bio: 'This is my bio.',
      joinDate: '2022-01-01',
      badges: [{ text: 'Badge 1' }, { text: 'Badge 2' }],
    };

    const action = setUserData(userData);

    const newState = accountReducer(initialState, action);

    expect(newState.login).toBe(userData.login);
    expect(newState.email).toBe(userData.email);
    expect(newState.nickname).toBe(userData.nickname);
    expect(newState.avatar).toBe(userData.avatar);
    expect(newState.completedQuests).toBe(userData.completedQuests);
    expect(newState.totalQuests).toBe(userData.totalQuests);
    expect(newState.completedGoals).toBe(userData.completedGoals);
    expect(newState.totalGoals).toBe(userData.totalGoals);
    expect(newState.expiredGoals).toBe(userData.expiredGoals);
    expect(newState.abandonedGoals).toBe(userData.abandonedGoals);
    expect(newState.level).toBe(userData.level);
    expect(newState.userXp).toBe(userData.userXp);
    expect(newState.nextLevelTotalXpRequired).toBe(userData.nextLevelTotalXpRequired);
    expect(newState.isMaxLevel).toBe(userData.isMaxLevel);
    expect(newState.bio).toBe(userData.bio);
    expect(newState.joinDate).toBe(userData.joinDate);
    expect(newState.badges).toEqual(userData.badges);
  });
});

describe('accountSlice selectors', () => {
  const state = {
    accountSlice: {
      login: 'user123',
      email: 'user@example.com',
      nickname: 'UserNickname',
      avatar: 'avatar_url',
      completedQuests: 10,
      totalQuests: 20,
      completedGoals: 5,
      totalGoals: 10,
      expiredGoals: 1,
      abandonedGoals: 2,
      level: 3,
      userXp: 1500,
      nextLevelTotalXpRequired: 2000,
      isMaxLevel: false,
      bio: 'This is my bio.',
      joinDate: '2022-01-01',
      badges: [{ text: 'Badge 1' }, { text: 'Badge 2' }],
    },
  };

  it('should select user data correctly using selectors', () => {
    expect(selectUserData(state)).toEqual(state.accountSlice);
    expect(selectUserLogin(state)).toBe(state.accountSlice.login);
    expect(selectUserEmail(state)).toBe(state.accountSlice.email);
    expect(selectUserNickname(state)).toBe(state.accountSlice.nickname);
    expect(selectUserAvatar(state)).toBe(state.accountSlice.avatar);
    expect(selectCompletedQuests(state)).toBe(state.accountSlice.completedQuests);
    expect(selectTotalQuests(state)).toBe(state.accountSlice.totalQuests);
    expect(selectCompletedGoals(state)).toBe(state.accountSlice.completedGoals);
    expect(selectTotalGoals(state)).toBe(state.accountSlice.totalGoals);
    expect(selectExpiredGoals(state)).toBe(state.accountSlice.expiredGoals);
    expect(selectAbandonedGoals(state)).toBe(state.accountSlice.abandonedGoals);
    expect(selectUserLevel(state)).toBe(state.accountSlice.level);
    expect(selectUserXp(state)).toBe(state.accountSlice.userXp);
    expect(selectNextLevelTotalXpRequired(state)).toBe(state.accountSlice.nextLevelTotalXpRequired);
    expect(selectIsMaxLevel(state)).toBe(state.accountSlice.isMaxLevel);
    expect(selectUserBio(state)).toBe(state.accountSlice.bio);
    expect(selectUserJoinDate(state)).toBe(state.accountSlice.joinDate);
    expect(selectUserBadges(state)).toEqual(state.accountSlice.badges);
    expect(selectIsUserDataLoaded(state)).toBe(true);
  });

  it('should return false for selectIsUserDataLoaded if login is null', () => {
    const newState = { ...state, accountSlice: { ...state.accountSlice, login: null } };
    expect(selectIsUserDataLoaded(newState)).toBe(false);
  });
});
