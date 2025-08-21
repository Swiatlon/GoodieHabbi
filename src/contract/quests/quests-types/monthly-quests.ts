import { IQuest, IRecurringQuestStats } from '../base-quests';

export interface IMonthlyQuest extends IQuest {
  startDay: number;
  endDay: number;
  statistics: IRecurringQuestStats;
}

export interface IGetMonthlyQuestRequest {
  id: number;
}

export interface IPostMonthlyQuestRequest extends Omit<IMonthlyQuest, 'id' | 'questType' | 'statistics'> {}

export interface IPutMonthlyQuestRequest extends Omit<IMonthlyQuest, 'questType' | 'statistics'> {}

export interface IPatchMonthlyQuestRequest extends Partial<Omit<IMonthlyQuest, 'questType'>> {
  id: number;
}

export interface IDeleteMonthlyQuestRequest {
  id: number;
}
