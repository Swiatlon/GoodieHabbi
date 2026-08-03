import { QuestTypesEnumType, WeekdayEnumType } from '../base-quests';
import { NullableString } from '@/types/global-types';

/** Bucket size of the trend series on the single-quest analytics endpoint. */
export const AnalyticsGranularityEnum = {
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
} as const;

export type AnalyticsGranularityEnumType = (typeof AnalyticsGranularityEnum)[keyof typeof AnalyticsGranularityEnum];

/**
 * How one occurrence period turned out, as of the user's local "today".
 * `PENDING` is a period still in progress or in the future — it is not a failure.
 */
export const QuestPeriodOutcomeEnum = {
  COMPLETED: 'Completed',
  MISSED: 'Missed',
  PENDING: 'Pending',
} as const;

export type QuestPeriodOutcomeEnumType = (typeof QuestPeriodOutcomeEnum)[keyof typeof QuestPeriodOutcomeEnum];

/**
 * Headline metrics over a set of occurrence periods.
 *
 * `completionRate` is a 0..1 fraction (multiply by 100 to display) over `evaluatedPeriods`, which
 * excludes pending periods — that is why the percentage does not sink during the day just because
 * today's habit has not been ticked off yet. `null` means "no data", NOT 0%.
 */
export interface IQuestAnalyticsSummary {
  totalPeriods: number;
  completedPeriods: number;
  missedPeriods: number;
  pendingPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAtUtc: NullableString;
}

/** One calendar/heatmap cell. For Daily and Weekly quests `periodStart === periodEnd`. */
export interface IQuestCalendarEntry {
  periodStart: string;
  periodEnd: string;
  outcome: QuestPeriodOutcomeEnumType;
  completedAtUtc: NullableString;
  /** Completion recorded after the period had already elapsed. */
  isBackfilled: boolean;
}

/** One point of the trend series. Buckets with no scheduled periods are omitted entirely. */
export interface IQuestTrendBucket {
  /** Week buckets start on Monday. */
  bucketStart: string;
  bucketEnd: string;
  completedPeriods: number;
  missedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

/** Empty for Monthly quests — a weekday breakdown is meaningless for multi-day periods. */
export interface IQuestWeekdayBreakdown {
  weekday: WeekdayEnumType;
  completedPeriods: number;
  missedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

/** All-time figures. Use these for streak widgets — the range figures are clipped to the window. */
export interface ILifetimeQuestStats {
  completionCount: number;
  failureCount: number;
  occurrenceCount: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number | null;
  lastCompletedAtUtc: NullableString;
}

export interface IGetQuestAnalyticsRequest {
  questId: number;
  /** "YYYY-MM-DD", inclusive. Defaults server-side to `to` − 90 days. */
  from?: string;
  /** "YYYY-MM-DD", inclusive. Defaults server-side to the user's local today. */
  to?: string;
  granularity?: AnalyticsGranularityEnumType;
}

export interface IGetQuestAnalyticsResponse {
  questId: number;
  questType: QuestTypesEnumType;
  title: string;
  /** The range actually used — the only way to learn the user's "today" without guessing. */
  from: string;
  to: string;
  granularity: AnalyticsGranularityEnumType;
  range: IQuestAnalyticsSummary;
  lifetime: ILifetimeQuestStats | null;
  calendar: IQuestCalendarEntry[];
  trend: IQuestTrendBucket[];
  byWeekday: IQuestWeekdayBreakdown[];
}

export interface IHabitSummary {
  questId: number;
  questType: QuestTypesEnumType;
  title: string;
  emoji: string | null;
  summary: IQuestAnalyticsSummary;
}

/** Per-calendar-day completion rate pooled across every habit. Days with nothing due are omitted. */
export interface IDailyCompletionRate {
  date: string;
  completedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

export interface IGetHabitsOverviewRequest {
  /** "YYYY-MM-DD", inclusive. Defaults server-side to a 30 day window. */
  from?: string;
  to?: string;
}

export interface IGetHabitsOverviewResponse {
  from: string;
  to: string;
  /** Every repeatable quest's periods pooled together. */
  overall: IQuestAnalyticsSummary;
  /** Sorted by completionRate descending, then title. Quests with a null rate land last. */
  quests: IHabitSummary[];
  dailyCompletionRate: IDailyCompletionRate[];
}

/** Server-side caps — exceeding them is a 400. */
export const ANALYTICS_MAX_RANGE_DAYS = {
  singleQuest: 1830,
  overview: 732,
} as const;
