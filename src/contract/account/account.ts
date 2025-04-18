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
  level: number;
  xp: number;
  totalXP: number;
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
