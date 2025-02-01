import { PriorityEnumType, RepeatIntervalEnum, RepeatIntervalEnumType } from './quest';

export interface IRepeatIntervalBase {
  type: RepeatIntervalEnumType;
}

export interface IDailyRepeatInterval extends IRepeatIntervalBase {
  type: typeof RepeatIntervalEnum.DAILY;
}

export interface IWeeklyRepeatInterval extends IRepeatIntervalBase {
  type: typeof RepeatIntervalEnum.WEEKLY;
  days: string[];
}

export interface IMonthlyRepeatInterval extends IRepeatIntervalBase {
  type: typeof RepeatIntervalEnum.MONTHLY;
  dayOfMonth: number;
  repeatFrom?: string | null;
  repeatTo?: string | null;
}

export type IRepeatInterval = IDailyRepeatInterval | IWeeklyRepeatInterval | IMonthlyRepeatInterval;

export interface IRepeatableQuest {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: PriorityEnumType | null;
  isCompleted: boolean;
  emoji: string | null;
  repeatInterval: IRepeatInterval;
}

export interface IPostRepeatableQuestRequest {
  title: string;
  description: string | null;
  emoji: string | null;
  priority: PriorityEnumType | null;
  startDate: string | null;
  endDate: string | null;
  repeatInterval: IRepeatInterval;
}

export interface IPutRepeatableQuestRequest {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: PriorityEnumType | null;
  isCompleted: boolean | null;
  repeatInterval: IRepeatInterval;
}

export interface IPatchRepeatableQuestRequest {
  id: number;
  title?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  priority?: PriorityEnumType | null;
  isCompleted?: boolean | null;
  emoji?: string | null;
  repeatInterval?: IRepeatInterval;
}
