import { IQuest } from '../base-quests';

export interface IMonthlyQuest extends IQuest {
  startDay: number;
  endDay: number;
}

export interface IGetMonthlyQuestRequest {
  id: number;
}

export interface IPostMonthlyQuestRequest extends Omit<IMonthlyQuest, 'id'> {}

export interface IPutMonthlyQuestRequest extends IMonthlyQuest {}

export interface IPatchMonthlyQuestRequest extends Partial<IMonthlyQuest> {
  id: number;
}

export interface IDeleteMonthlyQuestRequest {
  id: number;
}
