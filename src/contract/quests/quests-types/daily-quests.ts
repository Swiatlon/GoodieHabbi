import { IQuest, IRecurringQuestStats } from '../base-quests';

export interface IDailyQuest extends IQuest {
  statistics: IRecurringQuestStats;
}

export interface IGetDailyQuestRequest {
  id: number;
}

export interface IPostDailyQuestRequest extends Omit<IDailyQuest, 'id' | 'questType' | 'statistics'> {}

export interface IPutDailyQuestRequest extends Omit<IDailyQuest, 'questType' | 'statistics'> {}

export interface IPatchDailyQuestRequest extends Partial<Omit<IDailyQuest, 'questType'>> {
  id: number;
}

export interface IDeleteDailyQuestRequest {
  id: number;
}
