import { IQuest } from '../base-quests';

export interface IDailyQuest extends IQuest {}

export interface IGetDailyQuestRequest {
  id: number;
}

export interface IPostDailyQuestRequest extends Omit<IDailyQuest, 'id' | 'type'> {}

export interface IPutDailyQuestRequest extends Omit<IDailyQuest, 'type'> {}

export interface IPatchDailyQuestRequest extends Partial<Omit<IDailyQuest, 'type'>> {
  id: number;
}

export interface IDeleteDailyQuestRequest {
  id: number;
}
