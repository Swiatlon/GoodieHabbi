/**
 * GoodieHabits — Quests & habit-analytics API schema (for the mobile/front-end team).
 *
 * Hand-written from the backend DTOs/commands (Application/Quests/*) and verified against
 * docs/swagger.json. Companion document: docs/questy-analityka-frontend.md (PL).
 *
 * Serialization conventions (match the backend's System.Text.Json setup):
 *  - Enums serialize as STRINGS (e.g. "Daily", "Completed") via JsonStringEnumConverter.
 *  - `DateOnly` serializes as an ISO calendar date "YYYY-MM-DD" — no time, no timezone.
 *  - `DateTime` serializes as an ISO-8601 UTC timestamp ("...Z").
 *  - `TimeOnly` serializes as "HH:mm:ss".
 *  - C# `double` -> number; nullable value types -> `T | null`.
 *  - All endpoints are authenticated; the user is taken from the JWT (never sent in the body).
 *
 * ⚠️ BREAKING CHANGE vs. the previous version: `startDate` / `endDate` on every quest request and
 * response are now calendar dates ("2026-08-01"), not timestamps ("2026-08-01T00:00:00Z").
 * Sending a timestamp will be rejected with 400.
 */

// ─────────────────────────────── Enums ───────────────────────────────

export type QuestType = 'OneTime' | 'Daily' | 'Weekly' | 'Monthly' | 'Seasonal';
export type Priority = 'Low' | 'Medium' | 'High';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Impossible';
export type Season = 'Winter' | 'Spring' | 'Summer' | 'Autumn';

export type Weekday =
  | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

/** Bucket size for the trend series on the single-quest analytics endpoint. */
export type AnalyticsGranularity = 'Day' | 'Week' | 'Month';

/**
 * How one occurrence period turned out, as of the user's local "today".
 *  - Completed — done within (or backfilled into) the period.
 *  - Missed    — the period elapsed with no completion.
 *  - Pending   — in progress or still in the future; NOT a failure yet.
 */
export type QuestPeriodOutcome = 'Completed' | 'Missed' | 'Pending';

/** ISO calendar date, "YYYY-MM-DD". Never contains a time or an offset. */
export type IsoDate = string;

/** ISO-8601 UTC instant, e.g. "2026-08-01T09:15:00.000Z". */
export type IsoDateTimeUtc = string;

// ──────────────────────────── Quest CRUD ─────────────────────────────

export interface QuestLabelDto {
  id: number;
  value: string;
  backgroundColor: string;
}

export interface RepeatableQuestStatisticsDto {
  completionCount: number;
  failureCount: number;
  occurrenceCount: number;
  currentStreak: number;
  longestStreak: number;
}

export interface QuestDetailsBase {
  id: number;
  /** Also acts as the polymorphic discriminator on this payload. */
  questType: QuestType;
  title: string;
  description: string | null;
  startDate: IsoDate | null;   // ⚠️ was a timestamp before
  endDate: IsoDate | null;     // ⚠️ was a timestamp before
  emoji: string | null;
  isCompleted: boolean;
  priority: Priority | null;
  difficulty: Difficulty | null;
  scheduledTime: string | null;      // "HH:mm:ss"
  lastCompletedAt: IsoDateTimeUtc | null;  // a real instant — unchanged
  labels: QuestLabelDto[];
}

export interface OneTimeQuestDetailsDto extends QuestDetailsBase { questType: 'OneTime' }

export interface DailyQuestDetailsDto extends QuestDetailsBase {
  questType: 'Daily';
  statistics: RepeatableQuestStatisticsDto;
}

export interface WeeklyQuestDetailsDto extends QuestDetailsBase {
  questType: 'Weekly';
  statistics: RepeatableQuestStatisticsDto;
  weekdays: Weekday[];
}

export interface MonthlyQuestDetailsDto extends QuestDetailsBase {
  questType: 'Monthly';
  statistics: RepeatableQuestStatisticsDto;
  startDay: number;  // 1..31, clamped to the real length of each month
  endDay: number;    // 1..31, >= startDay
}

export interface SeasonalQuestDetailsDto extends QuestDetailsBase {
  questType: 'Seasonal';
  season: Season;
}

export type QuestDetailsDto =
  | OneTimeQuestDetailsDto
  | DailyQuestDetailsDto
  | WeeklyQuestDetailsDto
  | MonthlyQuestDetailsDto
  | SeasonalQuestDetailsDto;

/** Only repeatable quests carry `statistics` and are accepted by the analytics endpoints. */
export type RepeatableQuestDetailsDto =
  | DailyQuestDetailsDto
  | WeeklyQuestDetailsDto
  | MonthlyQuestDetailsDto;

// ───────────────────── Create / update requests ──────────────────────

export interface QuestWriteBase {
  title: string;               // 1..100 chars
  description?: string | null; // <= 10000 chars, sanitized HTML
  startDate?: IsoDate | null;  // ⚠️ "YYYY-MM-DD"
  endDate?: IsoDate | null;    // ⚠️ "YYYY-MM-DD", must be >= startDate
  emoji?: string | null;       // exactly one emoji
  priority?: Priority | null;
  difficulty?: Difficulty | null;
  scheduledTime?: string | null; // "HH:mm:ss"
  labels?: number[];             // must be label ids owned by the caller
}

export type CreateOneTimeQuestRequest = QuestWriteBase;
export type CreateDailyQuestRequest = QuestWriteBase;
export interface CreateWeeklyQuestRequest extends QuestWriteBase { weekdays: Weekday[] }
export interface CreateMonthlyQuestRequest extends QuestWriteBase { startDay: number; endDay: number }
export interface CreateSeasonalQuestRequest extends QuestWriteBase { season: Season }

export type UpdateOneTimeQuestRequest = QuestWriteBase;
export type UpdateDailyQuestRequest = QuestWriteBase;
export interface UpdateWeeklyQuestRequest extends QuestWriteBase { weekdays: Weekday[] }
export interface UpdateMonthlyQuestRequest extends QuestWriteBase { startDay: number; endDay: number }
export interface UpdateSeasonalQuestRequest extends QuestWriteBase { season: Season }

export interface UpdateQuestCompletionRequest {
  isCompleted: boolean;
}

// ─────────────────────────── Analytics ───────────────────────────────

/**
 * Headline metrics for a set of occurrence periods.
 *
 * completionRate = completedPeriods / evaluatedPeriods, where
 * evaluatedPeriods = completedPeriods + missedPeriods (i.e. pending periods are excluded).
 * It is `null` when evaluatedPeriods === 0 — render "no data", never 0%.
 */
export interface QuestAnalyticsSummary {
  totalPeriods: number;
  completedPeriods: number;
  missedPeriods: number;
  pendingPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;  // 0..1, rounded to 4 decimals
  currentStreak: number;
  longestStreak: number;
  lastCompletedAtUtc: IsoDateTimeUtc | null;
}

/** One calendar/heatmap cell. For Daily and Weekly quests periodStart === periodEnd. */
export interface QuestCalendarEntry {
  periodStart: IsoDate;
  periodEnd: IsoDate;   // inclusive
  outcome: QuestPeriodOutcome;
  completedAtUtc: IsoDateTimeUtc | null;
  /** True when the completion was recorded after the period had already elapsed. */
  isBackfilled: boolean;
}

/** One point of the trend series. Buckets with no scheduled periods are omitted entirely. */
export interface QuestTrendBucket {
  bucketStart: IsoDate;  // Week buckets start on Monday
  bucketEnd: IsoDate;    // inclusive
  completedPeriods: number;
  missedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

/** Empty for Monthly quests — a weekday breakdown is meaningless for multi-day periods. */
export interface QuestWeekdayBreakdown {
  weekday: Weekday;
  completedPeriods: number;
  missedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

/** All-time figures from the quest's cached statistics row. */
export interface LifetimeQuestStatsDto {
  completionCount: number;
  failureCount: number;
  occurrenceCount: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number | null;
  lastCompletedAtUtc: IsoDateTimeUtc | null;
}

export interface GetQuestAnalyticsResponse {
  questId: number;
  questType: QuestType;
  title: string;
  from: IsoDate;   // echoes the effective range (useful when you omitted from/to)
  to: IsoDate;
  granularity: AnalyticsGranularity;
  /** Metrics restricted to [from, to]. */
  range: QuestAnalyticsSummary;
  /** All-time metrics. `null` only if the quest has no statistics row yet. */
  lifetime: LifetimeQuestStatsDto | null;
  calendar: QuestCalendarEntry[];
  trend: QuestTrendBucket[];
  byWeekday: QuestWeekdayBreakdown[];
}

export interface HabitSummaryDto {
  questId: number;
  questType: QuestType;
  title: string;
  emoji: string | null;
  summary: QuestAnalyticsSummary;
}

/** Per-calendar-day completion rate pooled across every habit. Days with nothing due are omitted. */
export interface DailyCompletionRateDto {
  date: IsoDate;
  completedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

export interface GetHabitsOverviewResponse {
  from: IsoDate;
  to: IsoDate;
  /** Every repeatable quest's periods pooled together. */
  overall: QuestAnalyticsSummary;
  /** Sorted by completionRate descending, then title. */
  quests: HabitSummaryDto[];
  dailyCompletionRate: DailyCompletionRateDto[];
}

// ───────────────────────────── Routes ────────────────────────────────

export const QUEST_ROUTES = {
  // CRUD (unchanged shape, but see the startDate/endDate breaking change above)
  getById: (questType: QuestType, id: number) => `/api/quests/${questType}/${id}`,
  getByType: (questType: QuestType) => `/api/quests/${questType}`,
  getActive: '/api/quests/active',
  getEligibleForGoal: '/api/quests/eligible-for-goal',
  create: (kind: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'seasonal') => `/api/quests/${kind}`,
  update: (kind: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'seasonal', id: number) =>
    `/api/quests/${kind}/${id}`,
  delete: (questType: QuestType, id: number) => `/api/quests/${questType}/${id}`,
  setCompletion: (questType: QuestType, id: number) => `/api/quests/${questType}/${id}/completion`,

  // NEW — analytics
  /** GET; query: from?, to? ("YYYY-MM-DD"), granularity? (default "Week"). Max range 1830 days. */
  analytics: (questId: number) => `/api/quests/${questId}/analytics`,
  /** GET; query: from?, to? ("YYYY-MM-DD"). Max range 732 days. */
  analyticsOverview: '/api/quests/analytics/overview',
} as const;

/** Defaults applied server-side when `from`/`to` are omitted, in the user's own timezone. */
export const ANALYTICS_DEFAULT_WINDOW_DAYS = {
  singleQuest: 90,
  overview: 30,
} as const;
