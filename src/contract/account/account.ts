import { NullableString } from '@/types/global-types';

export interface IGetAccountRequest {}

export interface IBadge {
  text: string;
}

export type UserPreferencesType = Record<string, unknown>;

export interface IUserProfile {
  nickname: NullableString;
  avatar: NullableString;
  bio: NullableString;
  badges: IBadge[];
}

export interface IAccountDataResponse {
  login: string;
  email: string;
  joinDate: string;
  profile: IUserProfile;
  preferences: UserPreferencesType[];
}

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
  confirmPassword: string;
}

export interface IWipeoutDataRequest {
  password: string;
  confirmPassword: string;
}

export interface IWipeoutDataResponse {}
