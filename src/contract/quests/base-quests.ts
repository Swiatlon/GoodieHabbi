/**
 * Shared quest vocabulary. What used to live here — `QuestTypesEnum`, the old `IQuest` and
 * `IRecurringQuestStats` — went with the typed quest model; the quest itself now lives in
 * `quest.contract.ts`, keyed by schedule and target rather than by type.
 */

export const PriorityEnum = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export type PriorityEnumType = (typeof PriorityEnum)[keyof typeof PriorityEnum];

/**
 * A UI-only concept. The API has no `season` field — a season is a year window in MMDD form, and the
 * four presets here are what `SEASON_YEAR_WINDOWS` maps onto. A window outside those bounds is simply
 * a custom range with no season name.
 */
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

export const DifficultyEnum = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  IMPOSSIBLE: 'Impossible',
} as const;

export type DifficultyEnumType = (typeof DifficultyEnum)[keyof typeof DifficultyEnum];
