import { IQuest } from '../base-quests';

export interface IMonthlyQuest extends IQuest {
  startDay: number;
  endDay: number;
}

export interface IGetMonthlyQuestRequest {
  id: number;
}

export interface IPostMonthlyQuestRequest extends Omit<IMonthlyQuest, 'id' | 'type'> {}

export interface IPutMonthlyQuestRequest extends Omit<IMonthlyQuest, 'type'> {}

export interface IPatchMonthlyQuestRequest extends Partial<Omit<IMonthlyQuest, 'type'>> {
  id: number;
}

export interface IDeleteMonthlyQuestRequest {
  id: number;
}
