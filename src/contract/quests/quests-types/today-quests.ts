import { IQuest } from '../base-quests';

export interface ITodayQuest extends IQuest {}

export interface IGetTodayQuestRequest {
  id: number;
}

export interface IPostTodayQuestRequest extends Omit<IQuest, 'id' | 'type'> {}

export interface IPutTodayQuestRequest extends Omit<IQuest, 'type'> {}

export interface IPatchTodayQuestRequest extends Partial<Omit<IQuest, 'type'>> {
  id: number;
}

export interface IDeleteTodayQuestRequest {
  id: number;
}
