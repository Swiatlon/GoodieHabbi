import { IQuest } from '../base-quests';

export interface ITodayQuest extends IQuest {}

export interface IGetTodayQuestRequest {
  id: number;
}

export interface IPostTodayQuestRequest extends Omit<IQuest, 'id'> {}

export interface IPutTodayQuestRequest extends IQuest {}

export interface IPatchTodayQuestRequest extends Partial<IQuest> {
  id: number;
}

export interface IDeleteTodayQuestRequest {
  id: number;
}
