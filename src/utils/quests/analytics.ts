import dayjs from '@/configs/day-js-config';
import {
  IHabitSummary,
  IQuestCalendarEntry,
  QuestPeriodOutcomeEnum,
  QuestPeriodOutcomeEnumType,
} from '@/contract/quests/analytics/quests-analytics.contract';
import { WeekdayEnumType } from '@/contract/quests/base-quests';
import { toIsoDate } from '@/utils/utils/utils';

/**
 * Outcome colours. Green/red is the classic colour-blind trap, so the pair was checked under
 * simulated deuteranopia rather than picked by eye — these two sit at ΔE 8.1, clearing the ≥8
 * target. A lighter green for backfilled completions was rejected: it collapsed onto the pending
 * grey (ΔE 4.4). Backfill is marked with a dot instead, so nothing rests on hue alone.
 */
export const OUTCOME_COLORS: Record<QuestPeriodOutcomeEnumType, string> = {
  [QuestPeriodOutcomeEnum.COMPLETED]: '#10B981',
  [QuestPeriodOutcomeEnum.MISSED]: '#EF4444',
  [QuestPeriodOutcomeEnum.PENDING]: '#9CA3AF',
};

/** A day the quest was never scheduled on — deliberately not an outcome, and never red. */
export const UNSCHEDULED_COLOR = '#F3F4F6';

/** Every completion-rate mark across the analytics screens shares this hue. */
export const COMPLETION_COLOR = OUTCOME_COLORS[QuestPeriodOutcomeEnum.COMPLETED];

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * `completionRate` is a 0..1 fraction, and `null` means "nothing evaluated yet" — which must not
 * render as 0%, or every fresh habit would look like a total failure.
 */
export const formatCompletionRate = (rate: number | null): string => (rate === null ? '—' : `${Math.round(rate * 100)}%`);

export const toRatePercent = (rate: number | null): number => (rate === null ? 0 : rate * 100);

/**
 * WORKAROUND for a backend bug — remove once `/quests/analytics/overview` is fixed.
 *
 * The contract promises one entry per quest in `quests`, but the endpoint currently emits one entry
 * per occurrence *period*: a daily habit three days old comes back three times, each with
 * `totalPeriods: 1`. That both duplicated React keys and made the ranking meaningless.
 *
 * Counts are additive and the rate is recomputed from the merged totals, so those come out exactly
 * right. Streaks cannot be rebuilt from per-period rows — the best available value is the largest
 * one seen, which is a lower bound — so the ranking list does not display them. Once the backend
 * aggregates properly, every group holds a single row and this function returns its input unchanged.
 */
export const mergeHabitSummaries = (quests: IHabitSummary[]): IHabitSummary[] => {
  const byQuestId = new Map<number, IHabitSummary>();

  quests.forEach(habit => {
    const existing = byQuestId.get(habit.questId);

    if (!existing) {
      byQuestId.set(habit.questId, habit);

      return;
    }

    const a = existing.summary;
    const b = habit.summary;
    const evaluatedPeriods = a.evaluatedPeriods + b.evaluatedPeriods;
    const completedPeriods = a.completedPeriods + b.completedPeriods;

    byQuestId.set(habit.questId, {
      ...existing,
      summary: {
        totalPeriods: a.totalPeriods + b.totalPeriods,
        completedPeriods,
        missedPeriods: a.missedPeriods + b.missedPeriods,
        pendingPeriods: a.pendingPeriods + b.pendingPeriods,
        evaluatedPeriods,
        completionRate: evaluatedPeriods === 0 ? null : Number((completedPeriods / evaluatedPeriods).toFixed(4)),
        currentStreak: Math.max(a.currentStreak, b.currentStreak),
        longestStreak: Math.max(a.longestStreak, b.longestStreak),
        lastCompletedAtUtc: [a.lastCompletedAtUtc, b.lastCompletedAtUtc].filter(Boolean).sort().pop() ?? null,
      },
    });
  });

  // Merging changes the rates, so the backend's ordering no longer holds: re-apply the documented
  // sort (rate descending, then title, quests with no data last).
  return [...byQuestId.values()].sort((first, second) => {
    const firstRate = first.summary.completionRate;
    const secondRate = second.summary.completionRate;

    if (firstRate === secondRate) return first.title.localeCompare(second.title);
    if (firstRate === null) return 1;
    if (secondRate === null) return -1;

    return secondRate - firstRate;
  });
};

/**
 * Flattens periods onto the calendar days they cover. Monthly periods span several days, so one
 * entry lands on every day of its range; Daily and Weekly periods cover exactly one day.
 */
export const buildDayOutcomeMap = (calendar: IQuestCalendarEntry[]): Map<string, IQuestCalendarEntry> => {
  const byDay = new Map<string, IQuestCalendarEntry>();

  calendar.forEach(entry => {
    let day = dayjs(entry.periodStart);
    const end = dayjs(entry.periodEnd);

    while (!day.isAfter(end, 'day')) {
      byDay.set(day.format(ISO_DATE_FORMAT), entry);
      day = day.add(1, 'day');
    }
  });

  return byDay;
};

export interface IHeatmapWeek {
  /** Monday of the week, "YYYY-MM-DD" — stable key for the column. */
  key: string;
  /** Always 7 slots, Monday..Sunday. `null` marks a day outside the requested range. */
  days: (string | null)[];
}

/**
 * Lays the range out as Monday-first week columns, so the grid keeps its weekday rows aligned the
 * way the rest of the app renders weeks.
 */
export const buildHeatmapWeeks = (from: string, to: string): IHeatmapWeek[] => {
  const weeks: IHeatmapWeek[] = [];
  const rangeStart = dayjs(from);
  const rangeEnd = dayjs(to);

  let cursor = rangeStart.startOf('isoWeek');

  while (!cursor.isAfter(rangeEnd, 'day')) {
    const days = Array.from({ length: 7 }, (_, index) => {
      const day = cursor.add(index, 'day');
      const isInRange = !day.isBefore(rangeStart, 'day') && !day.isAfter(rangeEnd, 'day');

      return isInRange ? day.format(ISO_DATE_FORMAT) : null;
    });

    weeks.push({ key: cursor.format(ISO_DATE_FORMAT), days });
    cursor = cursor.add(1, 'week');
  }

  return weeks;
};

/** Weekday order used by every breakdown, matching the Monday-first heatmap rows. */
export const WEEKDAY_ORDER: WeekdayEnumType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ANALYTICS_RANGE_DAYS = [30, 90, 365] as const;

export type AnalyticsRangeDays = (typeof ANALYTICS_RANGE_DAYS)[number];

/**
 * Only `from` is sent: the backend defaults `to` to the user's own "today", which is more reliable
 * than whatever the device clock thinks the date is.
 */
export const rangeStartFor = (days: AnalyticsRangeDays): string => toIsoDate(dayjs().subtract(days - 1, 'day')) as string;
