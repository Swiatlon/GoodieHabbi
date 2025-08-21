import { IQuest, IRecurringQuestStats, WeekdayEnumType } from '../base-quests';

export interface IWeeklyQuest extends IQuest {
  weekdays: WeekdayEnumType[];
  statistics: IRecurringQuestStats;
}

export interface IGetWeeklyQuestRequest {
  id: number;
}

export interface IPostWeeklyQuestRequest extends Omit<IWeeklyQuest, 'id' | 'questType' | 'statistics'> {}

export interface IPutWeeklyQuestRequest extends Omit<IWeeklyQuest, 'questType' | 'statistics'> {}

export interface IPatchWeeklyQuestRequest extends Partial<Omit<IWeeklyQuest, 'questType'>> {
  id: number;
}

export interface IDeleteWeeklyQuestRequest {
  id: number;
}
