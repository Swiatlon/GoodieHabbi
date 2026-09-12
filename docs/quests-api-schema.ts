/**
 * GoodieHabits — Quests API schema (for the mobile/front-end team).
 *
 * Hand-written from the backend DTOs (Application/Quests/*) and verified against a running instance.
 * Companion document: docs/questy-nowy-model-frontend.md (PL) — read that first for the "why".
 *
 * Serialization conventions (match the backend's System.Text.Json setup):
 *  - Enums serialize as STRINGS ("Day", "Completed", "AtLeast").
 *  - `DateOnly` serializes as an ISO calendar date "YYYY-MM-DD" — no time, no timezone.
 *  - `DateTime` serializes as an ISO-8601 UTC timestamp ("...Z").
 *  - `TimeOnly` serializes as "HH:mm:ss".
 *  - C# `decimal` -> number. Nullable value types -> `T | null`.
 *  - All endpoints are authenticated; the user comes from the JWT, never the body.
 *  - Send `x-time-zone` (IANA, e.g. "Europe/Warsaw") on login and refresh — it decides which day the
 *    backend considers "today", and therefore which period a completion lands in.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * 🔴 BREAKING: quests no longer have a "type". A quest now has a SCHEDULE (which periods exist)
 * and a TARGET (how much counts as done inside one). Every per-type route is gone:
 *
 *   OLD                                        NEW
 *   POST   /api/quests/daily                   POST   /api/quests            (schedule in the body)
 *   PUT    /api/quests/daily/{id}              PUT    /api/quests/{id}
 *   GET    /api/quests/{questType}             GET    /api/quests?legacyType=Daily
 *   GET    /api/quests/{questType}/{id}        GET    /api/quests/{id}
 *   DELETE /api/quests/{questType}/{id}        DELETE /api/quests/{id}
 *   PATCH  /api/quests/{qt}/{id}/completion    POST   /api/quests/{id}/completions
 *
 * `?legacyType=` exists so the current per-type screens keep working unchanged. It is a bridge,
 * deprecated on arrival — see §"Migrating the existing screens" in the PL guide.
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────── Primitives ───────────────────────────────

/** ISO calendar date, "YYYY-MM-DD". Never contains a time or an offset. */
export type IsoDate = string;

/** ISO-8601 UTC instant, e.g. "2026-09-12T09:15:00.000Z". */
export type IsoDateTimeUtc = string;

/** "HH:mm:ss". */
export type IsoTime = string;

// ───────────────────────────────── Enums ──────────────────────────────────

/**
 * What one accountability period is. Replaces the old QuestType.
 *  - None  — no recurrence: a single period spanning the quest's whole active range (the old OneTime).
 *  - Day   — one period per day. With `weekdays` set, only those days (the old Weekly).
 *  - Week  — one period per week; the target may be met on any day(s) inside it.
 *  - Month — one period per month, optionally narrowed to a day range (the old Monthly).
 *  - Year  — one period per year, optionally narrowed to a date window (the old Seasonal).
 */
export type PeriodUnit = 'None' | 'Day' | 'Week' | 'Month' | 'Year';

/**
 * Which side of the target counts as success.
 *  - AtLeast — build a habit. The only value currently accepted.
 *  - AtMost  — limit a habit ("at most 2 coffees"). Reserved; sending it returns 400 for now.
 */
export type TargetMode = 'AtLeast' | 'AtMost';

export type Weekday =
  | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type Priority = 'Low' | 'Medium' | 'High';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Impossible';

/** Bucket size for the trend series on the single-quest analytics endpoint. */
export type AnalyticsGranularity = 'Day' | 'Week' | 'Month';

/** Where a completion was recorded from. Today the API only writes "App". */
export type CompletionSource = 'App' | 'Widget' | 'Calendar' | 'Import';

/**
 * How one period turned out, as of the user's local today.
 *  - Completed — progress reached the target.
 *  - Partial   — 🆕 the period elapsed with SOME progress but short of target ("1 of 2").
 *                Counts as a miss in every rate and streak; reported apart only so you can render
 *                partial credit instead of plain red.
 *  - Missed    — elapsed with no progress at all.
 *  - Pending   — in progress or still to come. NOT a failure.
 *  - Skipped   — reserved (phase 2). Excluded from rates; does not break a streak.
 */
export type QuestPeriodOutcome = 'Completed' | 'Missed' | 'Pending' | 'Partial' | 'Skipped';

/** The retired quest types. Accepted only as a filter on GET /api/quests. */
export type LegacyQuestType = 'OneTime' | 'Daily' | 'Weekly' | 'Monthly' | 'Seasonal';

// ──────────────────────────── Schedule & target ───────────────────────────

export interface QuestSchedule {
  unit: PeriodUnit;
  /** Every N units, counted from the quest's start date. 1 unless you mean "every other day". */
  interval: number;
  /** Day schedules only. `null` means every day. */
  weekdays: Weekday[] | null;
  /** Month schedules only: inclusive days of the month, clamped to each month's real length. */
  monthWindowStartDay: number | null;
  monthWindowEndDay: number | null;
  /** Year schedules only, as MMDD (21 December = 1221). An end before the start wraps past new year. */
  yearWindowStart: number | null;
  yearWindowEnd: number | null;
}

export interface QuestTarget {
  /** How much is required in one period. 1 reproduces the old tick-once behaviour exactly. */
  amount: number;
  /** `null` counts plain repetitions. Otherwise a free label you render: "L", "pages", "min". */
  unit: string | null;
  mode: TargetMode;
  /**
   * Caps how many completions ONE DAY may contribute, so "twice a week" cannot be finished twice on a
   * Monday. Exceeding it returns 409. Meaningless for Day schedules, where the period is already a day.
   */
  maxCompletionsPerDay: number | null;
}

// ───────────────────────────── Quest payload ──────────────────────────────

export interface QuestLabelDto {
  id: number;
  value: string;
  backgroundColor: string;
}

/** Lifetime figures. `null` on quests with no recurrence — a one-off has no streak. */
export interface QuestStatisticsDto {
  completionCount: number;
  /** Elapsed periods that fell short — `partialCount` included. */
  failureCount: number;
  /** How many of those failures had some progress. */
  partialCount: number;
  occurrenceCount: number;
  /** Individual taps, not completed periods. Includes off-schedule ones. */
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt: IsoDateTimeUtc | null;
}

/**
 * Everything a list row needs to render progress and urgency. `null` when the quest is not due today
 * (e.g. a Mon/Wed/Fri habit on a Tuesday) — render the row as "not scheduled", not as failed.
 *
 * Note this is returned even before the backend has materialized the period, so you can always show
 * "0 / 2" on the first day of a new habit.
 */
export interface CurrentPeriodDto {
  start: IsoDate;
  end: IsoDate;          // inclusive
  progress: number;
  target: number;
  remaining: number;     // max(0, target - progress)
  outcome: QuestPeriodOutcome;
  /** Days left in the period, today included. Always 1 for a Day schedule. */
  remainingDays: number;
  /**
   * Still achievable, but only just — what is left needs every remaining day.
   * ALWAYS false for single-day periods, where "not done yet" says nothing.
   * Use it for "2 more workouts, 2 days left" nudges on weekly/monthly habits.
   */
  isAtRisk: boolean;

  /**
   * How much of `progress` was recorded on the user's LOCAL today. Served rather than derived, because
   * "today" depends on the profile timezone and only the server resolves it.
   */
  todayProgress: number;
  /**
   * False once `target.maxCompletionsPerDay` is used up for today — i.e. the button should be disabled.
   * Computed server-side so you never re-implement the rule, and so the answer survives an app restart.
   */
  canCompleteToday: boolean;
  /**
   * This period's taps, oldest first. These ids are what `DELETE .../completions/{completionId}` needs:
   * before this existed, undo only worked inside the session that recorded the tap.
   */
  completions: PeriodCompletionDto[];
}

/** One recorded tap inside the current period — enough to undo it, or to show when it happened. */
export interface PeriodCompletionDto {
  id: number;
  completedOn: IsoDate;
  amount: number;
}

export interface QuestDetailsDto {
  id: number;
  title: string;
  description: string | null;
  startDate: IsoDate | null;
  endDate: IsoDate | null;
  emoji: string | null;
  priority: Priority | null;
  difficulty: Difficulty | null;
  scheduledTime: IsoTime | null;
  /** Only consumed by the future calendar export; safe to ignore. */
  durationMinutes: number | null;

  schedule: QuestSchedule;
  target: QuestTarget;

  /** DERIVED from the period covering today — there is no stored completed flag any more. */
  isCompleted: boolean;
  currentPeriod: CurrentPeriodDto | null;

  lastCompletedAt: IsoDateTimeUtc | null;
  statistics: QuestStatisticsDto | null;
  labels: QuestLabelDto[];

  /** Only populated by GET /api/quests (the list). Bridge for the per-type screens; do not build on it. */
  legacyQuestType: LegacyQuestType | null;
}

// ───────────────────────── Create / update requests ───────────────────────

export interface QuestWriteRequest {
  title: string;                    // 1..100
  description?: string | null;      // <= 10000, sanitized HTML
  startDate?: IsoDate | null;       // on create, must be >= yesterday
  endDate?: IsoDate | null;         // must be >= startDate
  emoji?: string | null;            // exactly one emoji
  priority?: Priority | null;
  difficulty?: Difficulty | null;
  scheduledTime?: IsoTime | null;
  durationMinutes?: number | null;  // 1..1440
  labels?: number[];                // label ids owned by the caller

  schedule: QuestScheduleWrite;
  /** Omit entirely for the ordinary "do it once per period" habit. */
  target?: QuestTargetWrite | null;
}

export interface QuestScheduleWrite {
  unit: PeriodUnit;
  /**
   * Default 1, max 366. "Every N units" is counted from `startDate`, falling back to the local date the
   * quest was created on. With `interval > 1` you probably want to force an explicit `startDate` in the
   * form, otherwise the user cannot predict which days land.
   */
  interval?: number;
  weekdays?: Weekday[] | null;      // Day only; omit for every day
  monthWindowStartDay?: number | null;  // Month only, 1..31
  monthWindowEndDay?: number | null;    // Month only, >= start
  yearWindowStart?: number | null;      // Year only, MMDD
  yearWindowEnd?: number | null;
}

export interface QuestTargetWrite {
  amount: number;                   // > 0, <= 100000; whole number unless `unit` is set
  unit?: string | null;             // <= 20 chars
  mode?: TargetMode;                // default "AtLeast"; "AtMost" currently rejected
  maxCompletionsPerDay?: number | null;  // >= 1
}

export type CreateQuestRequest = QuestWriteRequest;
export type UpdateQuestRequest = QuestWriteRequest;

/**
 * ⚠️ Update replaces the schedule wholesale. Pending periods from today onward that carry NO recorded
 * completions are dropped and regenerated; elapsed periods and any period the user has already worked
 * on are never touched, so history and streaks survive an edit. Changing the target re-points only the
 * periods that have not elapsed — last month does not retroactively fail.
 */

// ───────────────────────────── Completions ────────────────────────────────

export interface AddQuestCompletionRequest {
  /** Defaults to 1. For a measured target this is litres, pages, minutes. */
  amount?: number | null;
  /**
   * The local day this counts for. Defaults to today. May be up to `graceDays` (2) days back — that is
   * the catch-up window. A future date returns 400; too far back returns 400.
   */
  completedOn?: IsoDate | null;
  /**
   * Idempotency key. SEND A STABLE UUID PER USER ACTION. Without it a retry or a double tap records
   * twice, which now matters: on a "twice a day" habit that silently finishes the day.
   *
   * Uniqueness is scoped PER QUEST and remembered FOREVER (no TTL), so:
   *  - an offline retry the next day still de-duplicates correctly;
   *  - the same key may be reused across two different quests ticked in one gesture.
   */
  clientRequestId?: string | null;
  note?: string | null;             // <= 250
}

export interface QuestCompletionDto {
  id: number;
  questId: number;
  /** `null` for an off-schedule completion — done on a day the quest was not due. */
  occurrenceId: number | null;
  completedOn: IsoDate;
  completedAt: IsoDateTimeUtc;
  /** The user's local wall-clock time, snapshotted at the tap. `null` on rows migrated from the old model. */
  localTime: IsoTime | null;
  amount: number;
  isBackfilled: boolean;
  isOffSchedule: boolean;
  source: CompletionSource;
  note: string | null;
}

export interface QuestCompletionResponse {
  /** The quest as it now stands — re-render the row straight from this, no refetch needed. */
  quest: QuestDetailsDto;
  completion: QuestCompletionDto;
  /** true when the idempotency key matched and nothing new was written. */
  wasAlreadyRecorded: boolean;
  /** true when THIS call is what reached the period's target. Good trigger for a celebration animation. */
  periodCompleted: boolean;
  /** Paid once per period, ever. 0 on every other call, including a re-completion after an undo. */
  xpAwarded: number;
  coinsAwarded: number;
}

// ────────────────────────────── Catch-up ──────────────────────────────────

/**
 * The "did you do these?" card. Lists only periods where a tap would still change the outcome —
 * elapsed, inside the window, and Missed or Partial. An empty `days` means nothing to ask about:
 * hide the card entirely.
 *
 * Tick an item by calling the ORDINARY completions endpoint with `completedOn` set to that day.
 */
export interface GetCatchUpResponse {
  graceDays: number;   // currently 2
  days: CatchUpDayDto[];   // oldest first
}

export interface CatchUpDayDto {
  date: IsoDate;
  quests: CatchUpQuestDto[];
}

export interface CatchUpQuestDto {
  questId: number;
  title: string;
  emoji: string | null;
  periodStart: IsoDate;
  periodEnd: IsoDate;
  progress: number;
  target: number;
  outcome: 'Missed' | 'Partial';
}

// ───────────────────────────── Analytics ──────────────────────────────────

/**
 * completionRate = completedPeriods / evaluatedPeriods, where
 * evaluatedPeriods = completed + missed + partial (pending and skipped excluded).
 * `null` when evaluatedPeriods === 0 — render "no data", NEVER 0%.
 *
 * progressRate is the partial-credit companion: how much of what was asked for was actually done,
 * capped at the target per period. For "brush twice a day", completionRate answers "on how many days
 * did I do both?" and progressRate answers "what share of all the brushings did I do?".
 */
export interface QuestAnalyticsSummary {
  totalPeriods: number;
  completedPeriods: number;
  missedPeriods: number;
  partialPeriods: number;
  pendingPeriods: number;
  skippedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;   // 0..1, 4 dp
  progressRate: number | null;     // 0..1, 4 dp
  /** Individual taps in the window, off-schedule ones included. */
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAtUtc: IsoDateTimeUtc | null;
}

/** One calendar/heatmap cell. `progress`/`target` let you render "1 / 2" on a Partial cell. */
export interface QuestCalendarEntry {
  periodStart: IsoDate;
  periodEnd: IsoDate;   // inclusive
  outcome: QuestPeriodOutcome;
  progress: number;
  target: number;
  completedAtUtc: IsoDateTimeUtc | null;
  isBackfilled: boolean;
}

/** One point of the trend series. Buckets with no periods are omitted entirely. */
export interface QuestTrendBucket {
  bucketStart: IsoDate;   // Week buckets start on the user's week start (Monday by default)
  bucketEnd: IsoDate;     // inclusive
  completedPeriods: number;
  missedPeriods: number;  // includes partial
  evaluatedPeriods: number;
  completionRate: number | null;
}

/**
 * 🆕 Counted from the COMPLETION LOG, not from periods — so it now works for every schedule, including
 * "3x a week, any days", where the period is the week but the doing happens on days.
 * ⚠️ Shape changed: there is no completionRate here any more; it reports activity, not success.
 */
export interface QuestWeekdayBreakdown {
  weekday: Weekday;
  completions: number;
  daysWithActivity: number;
  /** How many times this weekday occurred in [from, to] — the denominator for normalising the bars. */
  daysInRange: number;
  /**
   * How many of those the quest was actually due on — the better denominator when it exists.
   * `null` when the schedule pins no weekdays (Week/Month/Year units); there use `daysInRange`.
   */
  daysScheduled: number | null;
}

/**
 * A row is emitted for every weekday that was either done OR scheduled, so a weekday you keep missing
 * still shows up — zero completions against a non-zero denominator, which is the point of the widget.
 */

/** 🆕 When in the day the habit actually happens. Rows migrated from the old model are excluded. */
export interface QuestHourBreakdown {
  hour: number;          // 0..23, user's local time
  completions: number;
}

export interface LifetimeQuestStatsDto {
  completionCount: number;
  failureCount: number;
  partialCount: number;
  occurrenceCount: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number | null;
  lastCompletedAtUtc: IsoDateTimeUtc | null;
}

export interface GetQuestAnalyticsResponse {
  questId: number;
  title: string;
  /**
   * 🆕 What one unit of a streak MEANS here. A streak of 5 on a Week habit is five weeks, not five
   * days — a "🔥 5" badge has no way to know that otherwise.
   */
  streakUnit: PeriodUnit;
  from: IsoDate;   // echoes the effective range; the only way to learn the user's "today"
  to: IsoDate;
  granularity: AnalyticsGranularity;
  /** Metrics restricted to [from, to]. */
  range: QuestAnalyticsSummary;
  /** All-time metrics. USE THIS for streak widgets — `range` truncates at the window edge. */
  lifetime: LifetimeQuestStatsDto | null;
  calendar: QuestCalendarEntry[];
  trend: QuestTrendBucket[];
  byWeekday: QuestWeekdayBreakdown[];
  byHourOfDay: QuestHourBreakdown[];
}

export interface HabitSummaryDto {
  questId: number;
  streakUnit: PeriodUnit;
  title: string;
  emoji: string | null;
  summary: QuestAnalyticsSummary;
}

/** Per-calendar-day completion rate. Days with nothing scheduled are omitted. */
export interface DailyCompletionRateDto {
  date: IsoDate;
  completedPeriods: number;
  evaluatedPeriods: number;
  completionRate: number | null;
}

export interface GetHabitsOverviewResponse {
  from: IsoDate;
  to: IsoDate;
  /** Every period pooled together. */
  overall: QuestAnalyticsSummary;
  /** Sorted by completionRate descending, then title. Quests with `null` rate land last. */
  quests: HabitSummaryDto[];
  /**
   * ⚠️ CHANGED: now built from DAY-schedule periods only. Previously a multi-day period was smeared
   * across every day it covered, so one missed weekly target painted seven days red.
   */
  dailyCompletionRate: DailyCompletionRateDto[];
  /** 🆕 The Week/Month/Year periods, which have no sensible place on a per-day axis. */
  periodic: QuestAnalyticsSummary;
}

// ─────────────────────────────── Routes ───────────────────────────────────

/**
 * ⚠️ SEASONAL QUESTS: do NOT set `endDate` on a recurring `Year` quest. The year window IS the
 * recurrence — an `endDate` at the end of the first season kills the quest permanently, which is exactly
 * what the old UI used to do. Leave `endDate` null unless the user genuinely wants the habit to stop.
 *
 * ⚠️ ANALYTICS SUPPORT: `/quests/{id}/analytics` accepts every repeating unit, INCLUDING `Year`.
 * Only `None` (one-off) is rejected with 400 — hide the Statistics entry point for those. A `Year` quest
 * technically works but yields one period per year, so the calendar and weekly trend buckets are thin;
 * a simplified view is worth designing if you expose it.
 */

export const QUEST_ROUTES = {
  create: '/api/quests',
  update: (id: number) => `/api/quests/${id}`,
  getById: (id: number) => `/api/quests/${id}`,
  delete: (id: number) => `/api/quests/${id}`,

  /** Query: `unit` (PeriodUnit) or `legacyType` (LegacyQuestType). Both optional. */
  list: '/api/quests',

  /** Today's list, with currentPeriod on every row. Also triggers the daily housekeeping pass. */
  getActive: '/api/quests/active',

  addCompletion: (id: number) => `/api/quests/${id}/completions`,
  removeCompletion: (id: number, completionId: number) =>
    `/api/quests/${id}/completions/${completionId}`,

  catchUp: '/api/quests/catch-up',

  /** Query: from?, to? ("YYYY-MM-DD"), granularity? (default "Week"). Repeating quests only. */
  analytics: (id: number) => `/api/quests/${id}/analytics`,
  /** Query: from?, to?. */
  analyticsOverview: '/api/quests/analytics/overview',

  eligibleForGoal: '/api/quests/eligible-for-goal',
} as const;

// ──────────────────────────────── Goals ───────────────────────────────────

/**
 * Goals were under-documented in the first pass. What actually changed:
 *
 * 1. `GET /api/goals/active/{goalType}` now returns a `QuestDetailsDto` in the NEW shape — no `season`,
 *    no `weekdays`, no `type`, no `startDay`/`endDay`. Read `schedule` instead.
 *
 * 2. ELIGIBILITY is unchanged in spirit: `/quests/eligible-for-goal` never filtered by quest type, and
 *    still does not. A goal's TYPE sets the goal's own time window; it is not a requirement on the quest,
 *    so any quest can back a Daily, Weekly, Monthly or Yearly goal. The one change: a repeating quest
 *    stays eligible even when done today (it comes round again); only a one-off that has ever been
 *    completed is spent.
 *
 * 3. ACHIEVEMENT: the goal is achieved by the FIRST period that reaches its target inside the goal's
 *    window — not once per week, and no longer by the first tap.
 *
 * 4. `PATCH /api/goals/{id}/completion` still exists but now IGNORES its body and simply records one
 *    completion on the quest; there is no un-complete path on it. ⚠️ Treat it as deprecated and call
 *    `POST /quests/{id}/completions` directly — the goal is achieved as a consequence.
 */

// ──────────────────────── Maintenance (background) ────────────────────────

/**
 * The backend has no scheduler (shared IIS, app pool recycles after 15 idle minutes), so a once-a-day
 * per-user housekeeping pass is triggered from READ endpoints. There are THREE entry points, not one:
 *
 *   GET /quests/active   ·   GET /quests/catch-up   ·   GET /quests/analytics/overview
 *
 * Whichever screen the user lands on first, one of these almost certainly fires. It is idempotent and
 * short-circuits cheaply for the rest of the day, so calling several is harmless.
 */

/** Defaults applied server-side when from/to are omitted, in the user's own timezone. */
export const ANALYTICS_DEFAULT_WINDOW_DAYS = {
  singleQuest: 90,
  overview: 30,
} as const;

// ───────────────────── Recipes for the common habits ──────────────────────

export const SCHEDULE_RECIPES = {
  /** "Umyć zęby 2x dziennie" */
  brushTeethTwiceADay: {
    schedule: { unit: 'Day' },
    target: { amount: 2 },
  },
  /** The old Daily quest. */
  everyDay: {
    schedule: { unit: 'Day' },
  },
  /** The old Weekly quest: "siłownia pon/śr/pt". */
  onWeekdays: {
    schedule: { unit: 'Day', weekdays: ['Monday', 'Wednesday', 'Friday'] },
  },
  /** "Ćwiczyć min. 2x w tygodniu, dowolne dni" — impossible in the old model. */
  twiceAWeekAnyDays: {
    schedule: { unit: 'Week' },
    target: { amount: 2, maxCompletionsPerDay: 1 },
  },
  /** "Co drugi dzień" — also impossible before. */
  everyOtherDay: {
    schedule: { unit: 'Day', interval: 2 },
  },
  /** The old Monthly quest: "rozliczenie między 1. a 5." */
  monthlyWindow: {
    schedule: { unit: 'Month', monthWindowStartDay: 1, monthWindowEndDay: 5 },
  },
  /** "Przeczytać w 20 dni miesiąca" */
  twentyDaysAMonth: {
    schedule: { unit: 'Month' },
    target: { amount: 20, maxCompletionsPerDay: 1 },
  },
  /** "Wypić 2 litry wody" */
  drinkTwoLitres: {
    schedule: { unit: 'Day' },
    target: { amount: 2, unit: 'L' },
  },
  /** The old Seasonal quest: zima, 21.12 – 20.03. Now genuinely recurs every year. */
  everyWinter: {
    schedule: { unit: 'Year', yearWindowStart: 1221, yearWindowEnd: 320 },
  },
  /** The old OneTime quest. */
  oneOff: {
    schedule: { unit: 'None' },
  },
} as const satisfies Record<string, { schedule: QuestScheduleWrite; target?: QuestTargetWrite }>;
