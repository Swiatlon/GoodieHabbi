import { buildDayOutcomeMap, buildHeatmapWeeks, formatCompletionRate, mergeHabitSummaries } from './analytics';
import {
  IHabitSummary,
  IQuestAnalyticsSummary,
  IQuestCalendarEntry,
  QuestPeriodOutcomeEnum,
} from '@/contract/quests/analytics/quests-analytics.contract';

const MONDAY = '2026-08-03';
/** 2026-08-05 is a Wednesday — used to prove the grid snaps back to its Monday column. */
const WEDNESDAY = '2026-08-05';
const NEXT_WEDNESDAY = '2026-08-12';
const HABIT_TITLE = 'Poranna medytacja';

const entry = (overrides: Partial<IQuestCalendarEntry>): IQuestCalendarEntry => ({
  periodStart: MONDAY,
  periodEnd: MONDAY,
  outcome: QuestPeriodOutcomeEnum.COMPLETED,
  completedAtUtc: null,
  isBackfilled: false,
  ...overrides,
});

describe('formatCompletionRate', () => {
  it('renders a dash for no data, so a fresh habit never reads as 0%', () => {
    expect(formatCompletionRate(null)).toBe('—');
  });

  it('distinguishes a genuine zero from no data', () => {
    expect(formatCompletionRate(0)).toBe('0%');
  });

  it('converts the 0..1 fraction to a percentage', () => {
    expect(formatCompletionRate(0.8667)).toBe('87%');
    expect(formatCompletionRate(1)).toBe('100%');
  });
});

describe('buildDayOutcomeMap', () => {
  it('maps a single-day period onto its one day', () => {
    const byDay = buildDayOutcomeMap([entry({})]);

    expect(byDay.size).toBe(1);
    expect(byDay.get(MONDAY)?.outcome).toBe(QuestPeriodOutcomeEnum.COMPLETED);
  });

  it('spreads a multi-day Monthly period across every day it covers', () => {
    const byDay = buildDayOutcomeMap([entry({ periodStart: '2026-08-01', periodEnd: WEDNESDAY })]);

    expect(byDay.size).toBe(5);
    expect(byDay.get('2026-08-01')).toBeDefined();
    expect(byDay.get(WEDNESDAY)).toBeDefined();
    expect(byDay.get('2026-08-06')).toBeUndefined();
  });

  it('leaves unscheduled days absent rather than marking them missed', () => {
    const byDay = buildDayOutcomeMap([entry({ periodStart: MONDAY, periodEnd: MONDAY })]);

    expect(byDay.has('2026-08-04')).toBe(false);
  });
});

describe('buildHeatmapWeeks', () => {
  it('starts every column on a Monday', () => {
    const weeks = buildHeatmapWeeks(WEDNESDAY, NEXT_WEDNESDAY);

    expect(weeks[0].key).toBe(MONDAY);
  });

  it('pads days outside the range with nulls but keeps seven slots per column', () => {
    const weeks = buildHeatmapWeeks(WEDNESDAY, NEXT_WEDNESDAY);

    expect(weeks[0].days).toHaveLength(7);
    // Mon-Tue precede the range start, so they are padding.
    expect(weeks[0].days[0]).toBeNull();
    expect(weeks[0].days[1]).toBeNull();
    expect(weeks[0].days[2]).toBe(WEDNESDAY);
  });

  it('covers the whole range inclusively', () => {
    const weeks = buildHeatmapWeeks(WEDNESDAY, NEXT_WEDNESDAY);
    const days = weeks.flatMap(week => week.days).filter(Boolean);

    expect(days[0]).toBe(WEDNESDAY);
    expect(days[days.length - 1]).toBe(NEXT_WEDNESDAY);
    expect(days).toHaveLength(8);
  });

  it('handles a single-day range', () => {
    const weeks = buildHeatmapWeeks(WEDNESDAY, WEDNESDAY);

    expect(weeks).toHaveLength(1);
    expect(weeks[0].days.filter(Boolean)).toEqual([WEDNESDAY]);
  });
});

describe('mergeHabitSummaries', () => {
  const summary = (overrides: Partial<IQuestAnalyticsSummary>): IQuestAnalyticsSummary => ({
    totalPeriods: 1,
    completedPeriods: 0,
    missedPeriods: 0,
    pendingPeriods: 0,
    evaluatedPeriods: 0,
    completionRate: null,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedAtUtc: null,
    ...overrides,
  });

  const habit = (questId: number, title: string, over: Partial<IQuestAnalyticsSummary>): IHabitSummary => ({
    questId,
    questType: 'Daily',
    title,
    emoji: null,
    summary: summary(over),
  });

  it('collapses the per-period rows the endpoint currently returns into one row per quest', () => {
    // Exactly the payload observed for a 3-day-old daily habit: done, missed, still pending.
    const merged = mergeHabitSummaries([
      habit(1328, HABIT_TITLE, { completedPeriods: 1, evaluatedPeriods: 1, completionRate: 1, lastCompletedAtUtc: '2026-08-01T21:30:03Z' }),
      habit(1328, HABIT_TITLE, { missedPeriods: 1, evaluatedPeriods: 1, completionRate: 0 }),
      habit(1328, HABIT_TITLE, { pendingPeriods: 1 }),
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0].summary).toMatchObject({
      totalPeriods: 3,
      completedPeriods: 1,
      missedPeriods: 1,
      pendingPeriods: 1,
      evaluatedPeriods: 2,
      completionRate: 0.5,
      lastCompletedAtUtc: '2026-08-01T21:30:03Z',
    });
  });

  it('leaves an already-aggregated response untouched, so it is a no-op once the backend is fixed', () => {
    const input = [
      habit(1, 'A', { completedPeriods: 3, evaluatedPeriods: 4, completionRate: 0.75 }),
      habit(2, 'B', { completedPeriods: 1, evaluatedPeriods: 4, completionRate: 0.25 }),
    ];

    expect(mergeHabitSummaries(input)).toEqual(input);
  });

  it('keeps quests with no evaluated periods at a null rate rather than 0%', () => {
    const merged = mergeHabitSummaries([habit(7, 'Nowy', { pendingPeriods: 1 }), habit(7, 'Nowy', { pendingPeriods: 1 })]);

    expect(merged[0].summary.completionRate).toBeNull();
    expect(merged[0].summary.pendingPeriods).toBe(2);
  });

  it('re-sorts by the recomputed rate, pushing quests with no data last', () => {
    const merged = mergeHabitSummaries([
      habit(1, 'Slaby', { completedPeriods: 1, evaluatedPeriods: 4, completionRate: 0.25 }),
      habit(2, 'Bez danych', { pendingPeriods: 1 }),
      habit(3, 'Dobry', { completedPeriods: 4, evaluatedPeriods: 4, completionRate: 1 }),
    ]);

    expect(merged.map(item => item.questId)).toEqual([3, 1, 2]);
  });
});
