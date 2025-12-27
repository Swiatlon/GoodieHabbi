import { NullableString } from '@/types/global-types';

export interface IGetAccountRequest {}

export interface IBadge {
  text: string;
  type: string;
  colorHex: string;
  description: string;
}

export interface IUserActiveCosmetics {
  avatarFrameUrl?: NullableString;
  pet?: {
    petUrl?: NullableString;
    animation?: NullableString;
  } | null;
  title?: NullableString;
  nameEffect?: {
    effectStyle?: NullableString;
    colorHex?: NullableString;
  } | null;
}

export interface UserPreferences {
  activeCosmetics?: IUserActiveCosmetics | null;
}

export interface IUserProfile {
  nickname: NullableString;
  avatar: NullableString;
  bio: NullableString;
  coins: number;
  badges: IBadge[];
}
export interface IAccountDataResponse {
  login: string;
  email: string;
  joinDate: string;
  profile: IUserProfile;
  preferences: UserPreferences;
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
