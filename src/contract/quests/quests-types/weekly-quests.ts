import { IQuest, WeekdayEnumType } from '../base-quests';

export interface IWeeklyQuest extends IQuest {
  days: WeekdayEnumType[];
}

export interface IGetWeeklyQuestRequest {
  id: number;
}

export interface IPostWeeklyQuestRequest extends Omit<IWeeklyQuest, 'id'> {}

export interface IPutWeeklyQuestRequest extends IWeeklyQuest {}

export interface IPatchWeeklyQuestRequest extends Partial<IWeeklyQuest> {
  id: number;
}

export interface IDeleteWeeklyQuestRequest {
  id: number;
}
