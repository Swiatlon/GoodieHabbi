import { SeasonEnum, SeasonEnumType, WeekdayEnumType } from '@/contract/quests/base-quests';
import {
  ICurrentPeriod,
  IPeriodCompletion,
  IQuest,
  IQuestSchedule,
  IQuestScheduleRequest,
  IQuestTarget,
  IQuestTargetRequest,
  PeriodUnitEnum,
  PeriodUnitEnumType,
} from '@/contract/quests/quest.contract';

/**
 * The bridge between the API's `schedule` + `target` pair and the handful of choices a user actually
 * makes in the form. The backend model is deliberately more expressive than the picker — every preset
 * maps onto it, but not every schedule maps back onto a preset, which `detectRecurrencePreset` handles
 * by falling back to the closest one.
 */

// ────────────────────────────── Seasons ───────────────────────────────────

/**
 * Season boundaries as MMDD, matching the constants the backend migration used. Winter wraps past new
 * year, which the API supports by letting the end fall before the start.
 */
export const SEASON_YEAR_WINDOWS: Record<SeasonEnumType, { start: number; end: number }> = {
  [SeasonEnum.WINTER]: { start: 1221, end: 320 },
  [SeasonEnum.SPRING]: { start: 321, end: 620 },
  [SeasonEnum.SUMMER]: { start: 621, end: 922 },
  [SeasonEnum.AUTUMN]: { start: 923, end: 1220 },
};

/**
 * The season a year window represents, or `null` for a custom range. The API has no `season` field any
 * more — a window only counts as a season when it matches the preset exactly, so nudging a date by a
 * day turns the quest into a plain custom window rather than silently staying "Winter".
 */
export const seasonFromYearWindow = (start: number | null, end: number | null): SeasonEnumType | null => {
  if (start === null || end === null) {
    return null;
  }

  const match = Object.entries(SEASON_YEAR_WINDOWS).find(([, window]) => window.start === start && window.end === end);

  return match ? (match[0] as SeasonEnumType) : null;
};

// ─────────────────────────── Recurrence presets ───────────────────────────

/** The recurrence choices the form offers. Each one composes a `schedule` and sometimes a `target`. */
export const RecurrencePresetEnum = {
  /** One-off. The old OneTime quest. */
  ONCE: 'Once',
  /** Every day. The old Daily quest. */
  DAILY: 'Daily',
  /** Only on the chosen weekdays. The old Weekly quest. */
  WEEKDAYS: 'Weekdays',
  /** Every N days, counted from the start date. */
  EVERY_N_DAYS: 'EveryNDays',
  /** N times a week, any days — impossible in the old model. */
  TIMES_PER_WEEK: 'TimesPerWeek',
  /** N days a month, any days. */
  TIMES_PER_MONTH: 'TimesPerMonth',
  /** A measured amount per week — "15 km", verified against the live API. */
  UNITS_PER_WEEK: 'UnitsPerWeek',
  /** A measured amount per month. */
  UNITS_PER_MONTH: 'UnitsPerMonth',
  /** Between two days of the month. The old Monthly quest. */
  MONTH_WINDOW: 'MonthWindow',
  /** A window of the year that returns every year. The old Seasonal quest, but recurring. */
  SEASONAL: 'Seasonal',
} as const;

export type RecurrencePresetEnumType = (typeof RecurrencePresetEnum)[keyof typeof RecurrencePresetEnum];

/** Presets whose point is "how many times", so the form asks for a count instead of a target. */
export const COUNTED_PRESETS: RecurrencePresetEnumType[] = [RecurrencePresetEnum.TIMES_PER_WEEK, RecurrencePresetEnum.TIMES_PER_MONTH];

/**
 * Presets whose point is "how much", so the number carries a unit: "15 km a week". The distinction
 * matters because in a counted preset the number means *days*, and there is nowhere to put a unit.
 */
export const MEASURED_PRESETS: RecurrencePresetEnumType[] = [RecurrencePresetEnum.UNITS_PER_WEEK, RecurrencePresetEnum.UNITS_PER_MONTH];

/**
 * Presets whose period is longer than a day and can therefore repeat every N of them — "every other
 * week", "every third month". The API takes `interval` on every unit; only the Day presets keep their
 * own field, because there "every 1 day" is just the Daily preset.
 */
export const PERIOD_INTERVAL_PRESETS: RecurrencePresetEnumType[] = [
  RecurrencePresetEnum.TIMES_PER_WEEK,
  RecurrencePresetEnum.UNITS_PER_WEEK,
  RecurrencePresetEnum.TIMES_PER_MONTH,
  RecurrencePresetEnum.UNITS_PER_MONTH,
  RecurrencePresetEnum.MONTH_WINDOW,
  RecurrencePresetEnum.SEASONAL,
];

/** Which "every N ___" wording a preset needs. */
export const INTERVAL_UNIT_KEY: Partial<Record<RecurrencePresetEnumType, 'weeks' | 'months' | 'years'>> = {
  [RecurrencePresetEnum.TIMES_PER_WEEK]: 'weeks',
  [RecurrencePresetEnum.UNITS_PER_WEEK]: 'weeks',
  [RecurrencePresetEnum.TIMES_PER_MONTH]: 'months',
  [RecurrencePresetEnum.UNITS_PER_MONTH]: 'months',
  [RecurrencePresetEnum.MONTH_WINDOW]: 'months',
  [RecurrencePresetEnum.SEASONAL]: 'years',
};

/**
 * Which preset an existing quest came from. A schedule the picker cannot express exactly still resolves
 * to its nearest preset, so opening the edit form never shows an empty recurrence.
 */
export const detectRecurrencePreset = (schedule: IQuestSchedule, target: IQuestTarget): RecurrencePresetEnumType => {
  switch (schedule.unit) {
    case PeriodUnitEnum.NONE:
      return RecurrencePresetEnum.ONCE;

    case PeriodUnitEnum.DAY:
      if (schedule.interval > 1) return RecurrencePresetEnum.EVERY_N_DAYS;
      if (schedule.weekdays && schedule.weekdays.length > 0) return RecurrencePresetEnum.WEEKDAYS;

      return RecurrencePresetEnum.DAILY;

    case PeriodUnitEnum.WEEK:
      return target.unit ? RecurrencePresetEnum.UNITS_PER_WEEK : RecurrencePresetEnum.TIMES_PER_WEEK;

    case PeriodUnitEnum.MONTH:
      if (schedule.monthWindowStartDay !== null) return RecurrencePresetEnum.MONTH_WINDOW;

      return target.unit ? RecurrencePresetEnum.UNITS_PER_MONTH : RecurrencePresetEnum.TIMES_PER_MONTH;

    case PeriodUnitEnum.YEAR:
    default:
      return RecurrencePresetEnum.SEASONAL;
  }
};

export interface IRecurrenceFormValues {
  preset: RecurrencePresetEnumType;
  weekdays: WeekdayEnumType[];
  /** For `EVERY_N_DAYS`, where 1 would just be the Daily preset. */
  interval: number;
  /** For every preset whose period is a week or longer: "every N weeks / months / years". */
  periodInterval: number;
  /** For `TIMES_PER_WEEK` and `TIMES_PER_MONTH`. */
  timesPerPeriod: number;
  /**
   * How many of `timesPerPeriod` a single day may contribute. 1 is what stops "twice a week" from
   * being finished twice on a Monday; raising it allows "6 times a week, up to 2 a day".
   */
  maxCompletionsPerDay: number;
  monthWindowStartDay: number;
  monthWindowEndDay: number;
  season: SeasonEnumType | null;
  yearWindowStart: number | null;
  yearWindowEnd: number | null;
}

/**
 * Composes the request's `schedule`. The presets that mean "N times per period" put the N in the
 * target, not here — the period still happens every week, the target is what changes.
 */
export const buildSchedule = (values: IRecurrenceFormValues): IQuestScheduleRequest => {
  switch (values.preset) {
    case RecurrencePresetEnum.ONCE:
      return { unit: PeriodUnitEnum.NONE };

    case RecurrencePresetEnum.DAILY:
      return { unit: PeriodUnitEnum.DAY };

    case RecurrencePresetEnum.WEEKDAYS:
      return { unit: PeriodUnitEnum.DAY, weekdays: values.weekdays };

    case RecurrencePresetEnum.EVERY_N_DAYS:
      return { unit: PeriodUnitEnum.DAY, interval: values.interval };

    case RecurrencePresetEnum.TIMES_PER_WEEK:
    case RecurrencePresetEnum.UNITS_PER_WEEK:
      return { unit: PeriodUnitEnum.WEEK, interval: values.periodInterval };

    case RecurrencePresetEnum.TIMES_PER_MONTH:
    case RecurrencePresetEnum.UNITS_PER_MONTH:
      return { unit: PeriodUnitEnum.MONTH, interval: values.periodInterval };

    case RecurrencePresetEnum.MONTH_WINDOW:
      return {
        unit: PeriodUnitEnum.MONTH,
        interval: values.periodInterval,
        monthWindowStartDay: values.monthWindowStartDay,
        monthWindowEndDay: values.monthWindowEndDay,
      };

    case RecurrencePresetEnum.SEASONAL:
    default: {
      const window = values.season ? SEASON_YEAR_WINDOWS[values.season] : null;

      return {
        unit: PeriodUnitEnum.YEAR,
        interval: values.periodInterval,
        yearWindowStart: window?.start ?? values.yearWindowStart,
        yearWindowEnd: window?.end ?? values.yearWindowEnd,
      };
    }
  }
};

export interface ITargetFormValues {
  /** How much counts as done in one period. 1 is the ordinary tick-once habit. */
  amount: number;
  /** A free label — "L", "stron", "min" — or null to count plain repetitions. */
  unit: string | null;
}

/**
 * Composes the request's `target`, or `null` when the quest is an ordinary tick-once habit and the
 * field should be omitted entirely.
 *
 * `maxCompletionsPerDay: 1` on the counted presets is what stops "twice a week" from being finished
 * twice on a Monday — without it the whole point of the preset is lost.
 */
export const buildTarget = (recurrence: IRecurrenceFormValues, target: ITargetFormValues): IQuestTargetRequest | null => {
  if (COUNTED_PRESETS.includes(recurrence.preset)) {
    return { amount: recurrence.timesPerPeriod, maxCompletionsPerDay: recurrence.maxCompletionsPerDay };
  }

  // A measured preset always sends its target, even at amount 1 — dropping it would lose the unit,
  // and the unit is the only thing telling "15 km a week" apart from "15 days a week".
  if (MEASURED_PRESETS.includes(recurrence.preset)) {
    return { amount: target.amount, unit: target.unit ?? null };
  }

  const hasTarget = target.amount > 1 || Boolean(target.unit);

  return hasTarget ? { amount: target.amount, unit: target.unit ?? null } : null;
};

// ──────────────────────────── Reading a quest ─────────────────────────────

/** Repeating quests are the ones the analytics endpoints accept; a one-off has no trend or streak. */
export const isRepeatingQuest = (quest: IQuest): boolean => quest.schedule.unit !== PeriodUnitEnum.NONE;

/** `null` means the quest is simply not due today — an empty state, never a failure. */
export const isScheduledToday = (quest: IQuest): boolean => quest.currentPeriod !== null;

/** The tap to undo: the most recent one in the period. `null` when there is nothing to take back. */
export const getUndoableCompletion = (period: ICurrentPeriod | null): IPeriodCompletion | null => {
  if (!period || period.completions.length === 0) {
    return null;
  }

  return period.completions[period.completions.length - 1];
};

/** A period worth showing as a counter rather than a checkbox. */
export const hasCountedTarget = (target: IQuestTarget): boolean => target.amount > 1 || Boolean(target.unit);

// ───────────────────────────── Formatting ─────────────────────────────────

/**
 * Amounts are decimals on the backend, so "2 litres" arrives as `2` but can arrive as `1.5` — and a
 * migrated row can arrive as `0.00`. Never render one raw.
 */
export const formatAmount = (value: number, locale?: string): string => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);

/** "1 / 2", or "1,5 / 2 L" once the target carries a unit. */
export const formatProgress = (progress: number, target: number, unit: string | null, locale?: string): string => {
  const base = `${formatAmount(progress, locale)} / ${formatAmount(target, locale)}`;

  return unit ? `${base} ${unit}` : base;
};

/** The unit a streak is counted in, so "🔥 5" can say whether it means days or weeks. */
export const streakUnitOf = (quest: IQuest): PeriodUnitEnumType => quest.schedule.unit;

/**
 * A year-window bound (MMDD, so 21 December is `1221`) as "21.12". Padding matters: 320 is 20 March,
 * not the 32nd of anything.
 */
export const formatMonthDay = (monthDay: number): string => {
  const month = Math.floor(monthDay / 100);
  const day = monthDay % 100;

  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}`;
};
