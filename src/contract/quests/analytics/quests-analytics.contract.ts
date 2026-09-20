import { WeekdayEnumType } from '../base-quests';
import { IsoDate, PeriodUnitEnumType, QuestPeriodOutcomeEnumType } from '../quest.contract';
import { NullableString } from '@/types/global-types';

export { QuestPeriodOutcomeEnum } from '../quest.contract';
export type { QuestPeriodOutcomeEnumType } from '../quest.contract';

/** Bucket size of the trend series on the single-quest analytics endpoint. */
export const AnalyticsGranularityEnum = {
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
} as const;

export type AnalyticsGranularityEnumType = (typeof AnalyticsGranularityEnum)[keyof typeof AnalyticsGranularityEnum];

/**
 * Headline metrics over a set of periods.
 *
 * `completionRate` is a 0..1 fraction over `evaluatedPeriods` (completed + missed + partial), which
 * excludes pending periods — that is why the percentage does not sink during the day just because
 * today's habit has not been ticked off yet. `null` means "no data", NOT 0%.
 *
 * `progressRate` is the partial-credit companion, capped at the target per period: for "brush twice a
 * day", `completionRate` answers "on how many days did I do both?" and `progressRate` answers "what
 * share of all the brushings did I do?".
 */
export interface IQuestAnalyticsSummary {
  totalPeriods: number;
  completedPeriods: number;
  /**
   * ⚠️ Disjoint from `partialPeriods` here — `evaluatedPeriods` is the sum of completed, missed and
   * partial. Note this is the opposite of `IQuestTrendBucket.missedPeriods`, which folds partial in.
   */
  missedPeriods: number;
  partialPeriods: number;
  pendingPeriods: number;
  skippedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
  progressRate: number | null;
  /** Individual taps in the window, off-schedule ones included. */
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAtUtc: NullableString;
}

/** One calendar/heatmap cell. `progress` / `target` let a `Partial` cell render "1 / 2". */
export interface IQuestCalendarEntry {
  periodStart: IsoDate;
  /** Inclusive — a Month or Year period spans several cells. */
  periodEnd: IsoDate;
  outcome: QuestPeriodOutcomeEnumType;
  progress: number;
  target: number;
  completedAtUtc: NullableString;
  /** Completion recorded after the period had already elapsed. */
  isBackfilled: boolean;
}

/** One point of the trend series. Buckets with no scheduled periods are omitted entirely. */
export interface IQuestTrendBucket {
  /** Week buckets start on Monday. */
  bucketStart: IsoDate;
  bucketEnd: IsoDate;
  completedPeriods: number;
  /** Includes partial. */
  missedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

/**
 * Counted from the completion log, not from periods, so it works for "3x a week, any days" too — where
 * the period is the week but the doing happens on days.
 */
export interface IQuestWeekdayBreakdown {
  weekday: WeekdayEnumType;
  /** Taps recorded on this weekday. */
  completions: number;
  /** Days of this weekday with at least one tap. */
  daysWithActivity: number;
  /** How many times this weekday occurred in the window — the fallback denominator. */
  daysInRange: number;
  /**
   * How many of those the quest was actually due on — the better denominator when it exists.
   * `null` when the schedule pins no weekdays (Week / Month / Year units).
   */
  daysScheduled: number | null;
}

/** When in the day the habit actually happens. Rows migrated from the old model are excluded. */
export interface IQuestHourBreakdown {
  /** 0..23, in the user's local time. */
  hour: number;
  completions: number;
}

/** All-time figures. Use these for streak widgets — the range figures are clipped to the window. */
export interface ILifetimeQuestStats {
  completionCount: number;
  failureCount: number;
  partialCount: number;
  occurrenceCount: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number | null;
  lastCompletedAtUtc: NullableString;
}

export interface IGetQuestAnalyticsRequest {
  questId: number;
  /** "YYYY-MM-DD", inclusive. Defaults server-side to `to` − 90 days. */
  from?: IsoDate;
  /** "YYYY-MM-DD", inclusive. Defaults server-side to the user's local today. */
  to?: IsoDate;
  granularity?: AnalyticsGranularityEnumType;
}

export interface IGetQuestAnalyticsResponse {
  questId: number;
  title: string;
  /** What one unit of a streak means here — a streak of 5 on a Week habit is five weeks, not five days. */
  streakUnit: PeriodUnitEnumType;
  /** The range actually used — the only way to learn the user's "today" without guessing. */
  from: IsoDate;
  to: IsoDate;
  granularity: AnalyticsGranularityEnumType;
  range: IQuestAnalyticsSummary;
  lifetime: ILifetimeQuestStats | null;
  calendar: IQuestCalendarEntry[];
  trend: IQuestTrendBucket[];
  byWeekday: IQuestWeekdayBreakdown[];
  byHourOfDay: IQuestHourBreakdown[];
}

export interface IHabitSummary {
  questId: number;
  streakUnit: PeriodUnitEnumType;
  title: string;
  emoji: string | null;
  summary: IQuestAnalyticsSummary;
}

/** Per-calendar-day completion rate. Days with nothing scheduled are omitted. */
export interface IDailyCompletionRate {
  date: IsoDate;
  completedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

export interface IGetHabitsOverviewRequest {
  /** "YYYY-MM-DD", inclusive. Defaults server-side to a 30 day window. */
  from?: IsoDate;
  to?: IsoDate;
}

export interface IGetHabitsOverviewResponse {
  from: IsoDate;
  to: IsoDate;
  /** Every period pooled together. */
  overall: IQuestAnalyticsSummary;
  /** Sorted by completionRate descending, then title. Quests with a null rate land last. */
  quests: IHabitSummary[];
  /** Built from Day-schedule periods only — a missed weekly target no longer paints seven days red. */
  dailyCompletionRate: IDailyCompletionRate[];
  /** The Week / Month / Year periods, which have no sensible place on a per-day axis. */
  periodic: IQuestAnalyticsSummary;
}

/** Server-side caps — exceeding them is a 400. */
export const ANALYTICS_MAX_RANGE_DAYS = {
  singleQuest: 1830,
  overview: 732,
} as const;
