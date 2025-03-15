import { IQuestLabel } from '../quests/labels/labels-quests';

export interface IUserPreferences {}

// GET

export interface IGetAccountRequest {}

export interface IAccountDataResponse {
  name: string | null;
  surname: string | null;
  nickname: string | null;
  email: string | null;
  avatar: string | null;
  data: {
    questsLabels: IQuestLabel[];
  };
  preferences: IUserPreferences;
}

// PATCH

export interface IUpdateAccountRequest {
  name?: string;
  surname?: string;
  nickname?: string;
  email?: string;
  avatar?: string | null;
  data?: {
    questsLabels?: IQuestLabel[];
  };
  preferences?: IUserPreferences;
}

export interface IUpdateAccountResponse {}
