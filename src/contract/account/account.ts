import { NullableString } from '@/types/global-types';

export interface IUserPreferences {}

// GET
export interface IGetAccountRequest {}

export interface IBadge {
  text: string;
}

export interface IAccountDataResponse {
  login: NullableString;
  email: string;
  nickname: NullableString;
  avatar: NullableString;
  completedQuests: number;
  totalQuests: number;
  completedGoals: number;
  totalGoals: number;
  expiredGoals: number;
  abandonedGoals: number;
  level: number;
  userXp: number;
  nextLevelTotalXpRequired: number;
  isMaxLevel: boolean;
  bio: NullableString;
  joinDate: string;
  badges: IBadge[];
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
