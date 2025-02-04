import { IQuest } from '../base-quests';

export interface IDailyQuest extends IQuest {}

export interface IGetDailyQuestRequest {
  id: number;
}

export interface IPostDailyQuestRequest extends Omit<IDailyQuest, 'id'> {}

export interface IPutDailyQuestRequest extends IDailyQuest {}

export interface IPatchDailyQuestRequest extends Partial<IDailyQuest> {
  id: number;
}

export interface IDeleteDailyQuestRequest {
  id: number;
}
