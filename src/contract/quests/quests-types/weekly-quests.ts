import { IQuest, WeekdayEnumType } from '../base-quests';

export interface IWeeklyQuest extends IQuest {
  weekdays: WeekdayEnumType[];
}

export interface IGetWeeklyQuestRequest {
  id: number;
}

export interface IPostWeeklyQuestRequest extends Omit<IWeeklyQuest, 'id' | 'type'> {}

export interface IPutWeeklyQuestRequest extends Omit<IWeeklyQuest, 'type'> {}

export interface IPatchWeeklyQuestRequest extends Partial<Omit<IWeeklyQuest, 'type'>> {
  id: number;
}

export interface IDeleteWeeklyQuestRequest {
  id: number;
}
