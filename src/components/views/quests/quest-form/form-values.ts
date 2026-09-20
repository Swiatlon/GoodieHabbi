import { DifficultyEnumType, PriorityEnumType, SeasonEnumType, WeekdayEnumType } from '@/contract/quests/base-quests';
import { IQuestLabel } from '@/contract/quests/labels/labels-quests';
import { IQuest, IQuestWriteRequest } from '@/contract/quests/quest.contract';
import {
  buildSchedule,
  buildTarget,
  COUNTED_PRESETS,
  detectRecurrencePreset,
  PERIOD_INTERVAL_PRESETS,
  RecurrencePresetEnum,
  RecurrencePresetEnumType,
  seasonFromYearWindow,
} from '@/utils/quests/schedule';

/**
 * The shape the single quest form works in. It is deliberately flatter than the API payload: the user
 * picks one recurrence and fills whichever fields that recurrence needs, and the composition into
 * `schedule` + `target` happens once, on submit.
 *
 * Labels stay as objects because that is what the shared multi-select understands; only the ids go out.
 */
export interface IQuestFormValues {
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  emoji: string | null;
  priority: PriorityEnumType | null;
  difficulty: DifficultyEnumType | null;
  scheduledTime: string | null;
  /** Not read by the app yet — it exists for the planned calendar export. */
  durationMinutes: number | null;
  labels: IQuestLabel[];

  preset: RecurrencePresetEnumType;
  weekdays: WeekdayEnumType[];
  /** Days, for `EVERY_N_DAYS` only — "every 1 day" is just the Daily preset. */
  interval: number;
  /** "Every N weeks / months / years", for presets whose period is longer than a day. */
  periodInterval: number;
  timesPerPeriod: number;
  maxCompletionsPerDay: number;
  monthWindowStartDay: number;
  monthWindowEndDay: number;
  season: SeasonEnumType | null;

  targetAmount: number;
  targetUnit: string | null;
}

export const DEFAULT_QUEST_FORM_VALUES: IQuestFormValues = {
  title: '',
  description: '',
  startDate: null,
  endDate: null,
  emoji: null,
  priority: null,
  difficulty: null,
  scheduledTime: null,
  durationMinutes: null,
  labels: [],

  preset: RecurrencePresetEnum.DAILY,
  weekdays: [],
  interval: 2,
  periodInterval: 1,
  timesPerPeriod: 2,
  maxCompletionsPerDay: 1,
  monthWindowStartDay: 1,
  monthWindowEndDay: 5,
  season: null,

  targetAmount: 1,
  targetUnit: null,
};

/**
 * Fills the form from an existing quest. A schedule the picker cannot express exactly resolves to its
 * nearest preset, so editing never opens on an empty recurrence — and the sub-fields keep their
 * defaults rather than zeros, so switching preset mid-edit lands somewhere sensible.
 */
export const questToFormValues = (quest: IQuest): IQuestFormValues => {
  const preset = detectRecurrencePreset(quest.schedule, quest.target);
  const isCounted = COUNTED_PRESETS.includes(preset);

  return {
    title: quest.title,
    description: quest.description ?? '',
    startDate: quest.startDate,
    endDate: quest.endDate,
    emoji: quest.emoji,
    priority: quest.priority,
    difficulty: quest.difficulty,
    scheduledTime: quest.scheduledTime,
    durationMinutes: quest.durationMinutes,
    labels: quest.labels,

    preset,
    weekdays: quest.schedule.weekdays ?? [],
    interval: quest.schedule.interval > 1 ? quest.schedule.interval : DEFAULT_QUEST_FORM_VALUES.interval,
    periodInterval: PERIOD_INTERVAL_PRESETS.includes(preset) ? quest.schedule.interval : DEFAULT_QUEST_FORM_VALUES.periodInterval,
    timesPerPeriod: isCounted ? quest.target.amount : DEFAULT_QUEST_FORM_VALUES.timesPerPeriod,
    maxCompletionsPerDay: quest.target.maxCompletionsPerDay ?? DEFAULT_QUEST_FORM_VALUES.maxCompletionsPerDay,
    monthWindowStartDay: quest.schedule.monthWindowStartDay ?? DEFAULT_QUEST_FORM_VALUES.monthWindowStartDay,
    monthWindowEndDay: quest.schedule.monthWindowEndDay ?? DEFAULT_QUEST_FORM_VALUES.monthWindowEndDay,
    season: seasonFromYearWindow(quest.schedule.yearWindowStart, quest.schedule.yearWindowEnd),

    targetAmount: isCounted ? DEFAULT_QUEST_FORM_VALUES.targetAmount : quest.target.amount,
    targetUnit: isCounted ? null : quest.target.unit,
  };
};

/** Composes the API payload. The recurrence decides where the numbers land, not the user. */
export const formValuesToRequest = (values: IQuestFormValues): IQuestWriteRequest => {
  const recurrence = {
    preset: values.preset,
    weekdays: values.weekdays,
    interval: values.interval,
    periodInterval: values.periodInterval,
    timesPerPeriod: values.timesPerPeriod,
    maxCompletionsPerDay: values.maxCompletionsPerDay,
    monthWindowStartDay: values.monthWindowStartDay,
    monthWindowEndDay: values.monthWindowEndDay,
    season: values.season,
    yearWindowStart: null,
    yearWindowEnd: null,
  };

  return {
    title: values.title.trim(),
    description: values.description || null,
    startDate: values.startDate,
    endDate: values.endDate,
    emoji: values.emoji,
    priority: values.priority,
    difficulty: values.difficulty,
    scheduledTime: values.scheduledTime,
    durationMinutes: values.durationMinutes,
    labels: values.labels.map(label => label.id),
    schedule: buildSchedule(recurrence),
    target: buildTarget(recurrence, { amount: values.targetAmount, unit: values.targetUnit }),
  };
};
