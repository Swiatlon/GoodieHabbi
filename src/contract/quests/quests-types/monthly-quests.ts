import { IQuest, IRecurringQuestStats } from '../base-quests';

export interface IMonthlyQuest extends IQuest {
  startDay: number;
  endDay: number;
  statistics: IRecurringQuestStats;
}

export interface IGetMonthlyQuestRequest {
  id: number;
}

export interface IPostMonthlyQuestRequest extends Omit<IMonthlyQuest, 'id' | 'type' | 'statistics'> {}

export interface IPutMonthlyQuestRequest extends Omit<IMonthlyQuest, 'type' | 'statistics'> {}

export interface IPatchMonthlyQuestRequest extends Partial<Omit<IMonthlyQuest, 'type'>> {
  id: number;
}

export interface IDeleteMonthlyQuestRequest {
  id: number;
}
