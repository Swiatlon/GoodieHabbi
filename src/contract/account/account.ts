import { NullableString } from '@/types/global-types';

export interface IUserPreferences {}

// GET
export interface IGetAccountRequest {}

export interface IBadge {
  text: string;
}

export interface IQuestsStats {
  totalCreated: number;
  completed: number;
  existingQuests: number;
  completedExistingQuests: number;
}

export interface IGoalsStats {
  totalCreated: number;
  completed: number;
  expired: number;
  active: number;
}

export interface IXpProgress {
  currentXp: number;
  level: number;
  nextLevelXpRequirement: number;
  isMaxLevel: boolean;
}

export interface IProfile {
  nickname: NullableString;
  avatar: NullableString;
  bio: NullableString;
  joinDate: string;
  questsStats: IQuestsStats;
  goalsStats: IGoalsStats;
  xpProgress: IXpProgress;
  badges: IBadge[];
}

export interface IAccountDataResponse {
  login: NullableString;
  email: string;
  profile: IProfile;
  preferences: {};
}

// PUT
export interface IUpdateAccountRequest {
  login: NullableString;
  nickname: NullableString;
  email: string;
  bio: NullableString;
}

export interface IUpdateAccountResponse {}

export interface IUpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdatePasswordResponse {}

export interface IDeleteAccountResponse {}

export interface IDeleteAccountRequest {
  password: string;
}
