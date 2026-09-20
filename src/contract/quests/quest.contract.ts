import { DifficultyEnumType, PriorityEnumType, WeekdayEnumType } from './base-quests';
import { IQuestLabel } from './labels/labels-quests';
import { NullableNumber, NullableString } from '@/types/global-types';

/**
 * The quest model after the 2026-09-12 rebuild. A quest no longer has a type — it has a SCHEDULE
 * (which periods exist) and a TARGET (how much counts as done inside one). The period is the unit of
 * accountability: streaks, rates and rewards are all judged per period, never per tap.
 *
 * Source of truth: `docs/quests-api-schema.ts` and `docs/questy-nowy-model-frontend.md`.
 */

/** ISO calendar date, "YYYY-MM-DD" — a day in the user's own calendar, never a UTC instant. */
export type IsoDate = string;

/** "HH:mm:ss". */
export type IsoTime = string;

// ───────────────────────────────── Enums ──────────────────────────────────

/**
 * What one accountability period is.
 *  - `NONE`  — no recurrence; a single period spanning the quest's whole active range.
 *  - `DAY`   — one period per day, narrowed to `weekdays` when set.
 *  - `WEEK`  — one period per week; the target may be met on any day(s) inside it.
 *  - `MONTH` — one period per month, optionally narrowed to a day range.
 *  - `YEAR`  — one period per year, optionally narrowed to a date window (seasons).
 */
export const PeriodUnitEnum = {
  NONE: 'None',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
} as const;

export type PeriodUnitEnumType = (typeof PeriodUnitEnum)[keyof typeof PeriodUnitEnum];

/** `AT_MOST` ships as an enum slot only — the backend rejects it until phase 2. */
export const TargetModeEnum = {
  AT_LEAST: 'AtLeast',
  AT_MOST: 'AtMost',
} as const;

export type TargetModeEnumType = (typeof TargetModeEnum)[keyof typeof TargetModeEnum];

/**
 * How one period turned out, as of the user's local today.
 *  - `PARTIAL` — elapsed with some progress but short of target. **Counts as a miss** in every rate and
 *    streak; reported apart only so the UI can draw partial credit instead of plain red.
 *  - `PENDING` — in progress or still to come. Not a failure.
 *  - `SKIPPED` — reserved for phase 2. Excluded from rates, does not break a streak.
 */
export const QuestPeriodOutcomeEnum = {
  COMPLETED: 'Completed',
  MISSED: 'Missed',
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  SKIPPED: 'Skipped',
} as const;

export type QuestPeriodOutcomeEnumType = (typeof QuestPeriodOutcomeEnum)[keyof typeof QuestPeriodOutcomeEnum];

/** Where a completion was recorded from. The API only writes `APP` today. */
export const CompletionSourceEnum = {
  APP: 'App',
  WIDGET: 'Widget',
  CALENDAR: 'Calendar',
  IMPORT: 'Import',
} as const;

export type CompletionSourceEnumType = (typeof CompletionSourceEnum)[keyof typeof CompletionSourceEnum];

// ──────────────────────────── Schedule & target ───────────────────────────

export interface IQuestSchedule {
  unit: PeriodUnitEnumType;
  /** Every N units, counted from `startDate` — or the creation day when it is null. */
  interval: number;
  /** Day schedules only. `null` means every day. */
  weekdays: WeekdayEnumType[] | null;
  /** Month schedules only: inclusive days of the month, clamped to each month's real length. */
  monthWindowStartDay: NullableNumber;
  monthWindowEndDay: NullableNumber;
  /** Year schedules only, as MMDD (21 December = 1221). An end before the start wraps past new year. */
  yearWindowStart: NullableNumber;
  yearWindowEnd: NullableNumber;
}

export interface IQuestTarget {
  /** How much is required in one period. `1` is the ordinary tick-once habit. */
  amount: number;
  /** `null` counts plain repetitions. Otherwise a free label to render: "L", "stron", "min". */
  unit: NullableString;
  mode: TargetModeEnumType;
  /**
   * Caps how many completions one day may contribute, so "twice a week" cannot be finished twice on a
   * Monday. Exceeding it answers 409 — but prefer `currentPeriod.canCompleteToday` over catching that.
   */
  maxCompletionsPerDay: NullableNumber;
}

// ───────────────────────────── Quest payload ──────────────────────────────

/** Lifetime figures. `null` on quests with no recurrence — a one-off has no streak. */
export interface IQuestStatistics {
  completionCount: number;
  /** Elapsed periods that fell short, `partialCount` included. */
  failureCount: number;
  partialCount: number;
  occurrenceCount: number;
  /** Individual taps, not completed periods. Includes off-schedule ones. */
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt: NullableString;
}

/** One recorded tap — enough to undo it, or to show when it happened. */
export interface IPeriodCompletion {
  id: number;
  completedOn: IsoDate;
  amount: number;
}

/**
 * Everything a list row needs to render progress and urgency. `null` when the quest is not due today —
 * render the row as "not scheduled", never as failed.
 */
export interface ICurrentPeriod {
  start: IsoDate;
  /** Inclusive. */
  end: IsoDate;
  progress: number;
  target: number;
  /** `max(0, target - progress)`. */
  remaining: number;
  outcome: QuestPeriodOutcomeEnumType;
  /** Days left in the period, today included. Always 1 for a Day schedule. */
  remainingDays: number;
  /**
   * Still achievable, but only just — what is left needs every remaining day. Always `false` for
   * single-day periods, where "not done yet" says nothing.
   */
  isAtRisk: boolean;
  /** How much of `progress` was recorded on the user's local today. Resolved server-side. */
  todayProgress: number;
  /**
   * `false` once the daily cap is used up, and on a finished one-off. Drive the button from this rather
   * than re-implementing the rule — a local flag does not survive an app restart.
   */
  canCompleteToday: boolean;
  /** This period's taps, oldest first. The ids are what undo needs. */
  completions: IPeriodCompletion[];
}

export interface IQuest {
  id: number;
  title: string;
  description: NullableString;
  startDate: IsoDate | null;
  /** Inclusive. Leave null on seasonal quests — the year window is the recurrence. */
  endDate: IsoDate | null;
  emoji: NullableString;
  priority: PriorityEnumType | null;
  difficulty: DifficultyEnumType | null;
  scheduledTime: IsoTime | null;
  /** Only consumed by the future calendar export. */
  durationMinutes: NullableNumber;

  schedule: IQuestSchedule;
  target: IQuestTarget;

  /** Derived from the period covering today — there is no stored completed flag any more. */
  isCompleted: boolean;
  currentPeriod: ICurrentPeriod | null;

  /** A real instant ("...Z"), unlike the calendar dates above. */
  lastCompletedAt: NullableString;
  statistics: IQuestStatistics | null;
  labels: IQuestLabel[];
}

// ───────────────────────── Create / update requests ───────────────────────

export interface IQuestScheduleRequest {
  unit: PeriodUnitEnumType;
  /** Default 1, max 366. Force an explicit `startDate` above 1, or the user cannot predict the days. */
  interval?: number;
  /** Day only; omit for every day. */
  weekdays?: WeekdayEnumType[] | null;
  monthWindowStartDay?: NullableNumber;
  monthWindowEndDay?: NullableNumber;
  /** Year only, as MMDD. */
  yearWindowStart?: NullableNumber;
  yearWindowEnd?: NullableNumber;
}

export interface IQuestTargetRequest {
  /** > 0, <= 100000. Whole number unless `unit` is set. */
  amount: number;
  /** <= 20 chars. */
  unit?: NullableString;
  mode?: TargetModeEnumType;
  maxCompletionsPerDay?: NullableNumber;
}

export interface IQuestWriteRequest {
  title: string;
  description?: NullableString;
  /** On create, must be >= yesterday. */
  startDate?: IsoDate | null;
  endDate?: IsoDate | null;
  emoji?: NullableString;
  priority?: PriorityEnumType | null;
  difficulty?: DifficultyEnumType | null;
  scheduledTime?: IsoTime | null;
  durationMinutes?: NullableNumber;
  /** Label ids, not the label objects. */
  labels?: number[];

  schedule: IQuestScheduleRequest;
  /** Omit entirely for the ordinary "do it once per period" habit. */
  target?: IQuestTargetRequest | null;
}

export type ICreateQuestRequest = IQuestWriteRequest;

export interface IUpdateQuestRequest extends IQuestWriteRequest {
  id: number;
}

export interface IGetQuestRequest {
  id: number;
}

export interface IDeleteQuestRequest {
  id: number;
}

/** Both filters are optional; `legacyType` is deliberately unused — see the migration notes. */
export interface IGetQuestsRequest {
  unit?: PeriodUnitEnumType;
}

// ───────────────────────────── Completions ────────────────────────────────

export interface IAddQuestCompletionRequest {
  questId: number;
  /** Defaults to 1. For a measured target this is litres, pages, minutes. */
  amount?: NullableNumber;
  /** The local day this counts for. Defaults to today, up to `graceDays` back. */
  completedOn?: IsoDate | null;
  /** Idempotency key — a stable UUID per user action, reused on retry. Scoped per quest, never expires. */
  clientRequestId?: NullableString;
  note?: NullableString;
}

export interface IRemoveQuestCompletionRequest {
  questId: number;
  completionId: number;
}

export interface IQuestCompletion {
  id: number;
  questId: number;
  /** `null` for an off-schedule completion — done on a day the quest was not due. */
  occurrenceId: NullableNumber;
  completedOn: IsoDate;
  completedAt: string;
  /** The user's local wall-clock time, snapshotted at the tap. */
  localTime: IsoTime | null;
  amount: number;
  isBackfilled: boolean;
  isOffSchedule: boolean;
  source: CompletionSourceEnumType;
  note: NullableString;
}

export interface IQuestCompletionResponse {
  /** The quest as it now stands — re-render the row straight from this, no refetch needed. */
  quest: IQuest;
  completion: IQuestCompletion;
  /** The idempotency key matched and nothing new was written. Treat as success. */
  wasAlreadyRecorded: boolean;
  /** This call is what reached the period's target — the moment to celebrate. */
  periodCompleted: boolean;
  /** Paid once per period, ever. 0 on every other call, including a re-completion after an undo. */
  xpAwarded: number;
  coinsAwarded: number;
}

// ────────────────────────────── Catch-up ──────────────────────────────────

export interface ICatchUpQuest {
  questId: number;
  title: string;
  emoji: NullableString;
  periodStart: IsoDate;
  periodEnd: IsoDate;
  progress: number;
  target: number;
  /** `Completed` only appears when the request asked for `includeCompleted`. */
  outcome: QuestPeriodOutcomeEnumType;
  /** That period's taps, with the ids needed to undo one. */
  completions: IPeriodCompletion[];
}

export interface ICatchUpDay {
  date: IsoDate;
  quests: ICatchUpQuest[];
}

export interface IGetCatchUpRequest {
  /**
   * Keep this off for the card itself, so "empty `days`" still means "hide it". Turn it on for the
   * history view, where a mistaken catch-up tap has to stay undoable after a restart.
   */
  includeCompleted?: boolean;
}

export interface IGetCatchUpResponse {
  /** Currently 2 — today, yesterday, the day before. */
  graceDays: number;
  /** Oldest first. Empty means there is nothing to ask about. */
  days: ICatchUpDay[];
}
