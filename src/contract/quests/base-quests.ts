export const PriorityEnum = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export type PriorityEnumType = (typeof PriorityEnum)[keyof typeof PriorityEnum];

export const RepeatIntervalEnum = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
} as const;

export type RepeatIntervalEnumType = (typeof RepeatIntervalEnum)[keyof typeof RepeatIntervalEnum];

export const SeasonEnum = {
  WINTER: 'Winter',
  SPRING: 'Spring',
  SUMMER: 'Summer',
  AUTUMN: 'Autumn',
} as const;

export type SeasonEnumType = (typeof SeasonEnum)[keyof typeof SeasonEnum];

export const WeekdayEnum = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
} as const;

export type WeekdayEnumType = (typeof WeekdayEnum)[keyof typeof WeekdayEnum];

export const QuestTypesEnum = {
  ONE_TIME: 'OneTime',
  SEASONAL: 'Seasonal',
  MONTHLY: 'Monthly',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
} as const;

export type QuestTypesEnumType = (typeof QuestTypesEnum)[keyof typeof QuestTypesEnum];

export interface IQuest {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: PriorityEnumType | null;
  isCompleted: boolean;
  emoji: string | null;
  type: QuestTypesEnumType;
}
