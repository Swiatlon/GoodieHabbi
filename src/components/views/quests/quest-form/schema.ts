import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useBaseQuestSchema } from '../reusable/schema/schema';
import { SeasonEnumType, WeekdayEnum, WeekdayEnumType } from '@/contract/quests/base-quests';
import { COUNTED_PRESETS, PERIOD_INTERVAL_PRESETS, RecurrencePresetEnum, RecurrencePresetEnumType } from '@/utils/quests/schedule';

const validWeekdays = Object.values(WeekdayEnum);

/** Text inputs hand back strings; an empty one must stay undefined rather than become `NaN`. */
const numberFromInput = (value: unknown, original: unknown): number | undefined => {
  if (original === '' || original === null || original === undefined) {
    return undefined;
  }

  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined;
};

/** The sibling fields the cross-field tests read off `this.parent`. */
interface IRecurrenceSiblings {
  monthWindowStartDay?: number;
  targetUnit?: string | null;
  timesPerPeriod?: number;
}

/**
 * One schema for every quest, with the recurrence deciding which fields are required. Each `when`
 * mirrors a rule the backend enforces anyway — the point is to say so before the request is sent, in
 * the words of the choice the user made rather than of the model underneath.
 */
export const useQuestFormSchema = () => {
  const { t } = useTranslation();
  const baseQuestSchema = useBaseQuestSchema();

  const recurrenceRequired = t('quests.reusable.schema.recurrenceRequired');
  const intervalRange = t('quests.reusable.schema.intervalRange');
  const timesPerWeekRange = t('quests.reusable.schema.timesPerWeekRange');
  const timesPerMonthRange = t('quests.reusable.schema.timesPerMonthRange');
  const monthDayRange = t('quests.reusable.schema.monthDayRange');
  const targetAmountRange = t('quests.reusable.schema.targetAmountRange');
  const maxPerDayRange = t('quests.reusable.schema.maxPerDayRange');
  const durationRange = t('quests.reusable.schema.durationRange');
  const periodIntervalRange = t('quests.reusable.schema.periodIntervalRange');

  return (
    baseQuestSchema
      .shape({
        preset: Yup.mixed<RecurrencePresetEnumType>().oneOf(Object.values(RecurrencePresetEnum), recurrenceRequired).required(recurrenceRequired),

        weekdays: Yup.array()
          .of(Yup.mixed<WeekdayEnumType>().oneOf(validWeekdays).required())
          .when('preset', {
            is: RecurrencePresetEnum.WEEKDAYS,
            then: schema => schema.min(1, t('quests.reusable.schema.weekdaysMin')),
          })
          .default([]),

        interval: Yup.number()
          .transform(numberFromInput)
          .when('preset', {
            is: RecurrencePresetEnum.EVERY_N_DAYS,
            then: schema => schema.min(2, intervalRange).max(366, intervalRange).integer(intervalRange).required(intervalRange),
          })
          .default(2),

        periodInterval: Yup.number()
          .transform(numberFromInput)
          .when('preset', {
            is: (preset: RecurrencePresetEnumType) => PERIOD_INTERVAL_PRESETS.includes(preset),
            then: schema =>
              schema.min(1, periodIntervalRange).max(366, periodIntervalRange).integer(periodIntervalRange).required(periodIntervalRange),
          })
          .default(1),

        timesPerPeriod: Yup.number()
          .transform(numberFromInput)
          .when('preset', {
            is: RecurrencePresetEnum.TIMES_PER_WEEK,
            then: schema => schema.min(1, timesPerWeekRange).max(7, timesPerWeekRange).integer(timesPerWeekRange).required(timesPerWeekRange),
          })
          .when('preset', {
            is: RecurrencePresetEnum.TIMES_PER_MONTH,
            then: schema => schema.min(1, timesPerMonthRange).max(31, timesPerMonthRange).integer(timesPerMonthRange).required(timesPerMonthRange),
          })
          .default(2),

        monthWindowStartDay: Yup.number()
          .transform(numberFromInput)
          .when('preset', {
            is: RecurrencePresetEnum.MONTH_WINDOW,
            then: schema => schema.min(1, monthDayRange).max(31, monthDayRange).integer(monthDayRange).required(monthDayRange),
          })
          .default(1),

        monthWindowEndDay: Yup.number()
          .transform(numberFromInput)
          .when('preset', {
            is: RecurrencePresetEnum.MONTH_WINDOW,
            then: schema =>
              schema
                .min(1, monthDayRange)
                .max(31, monthDayRange)
                .integer(monthDayRange)
                .required(monthDayRange)
                .test('is-after-start', t('quests.reusable.schema.monthWindowOrder'), function (value) {
                  const { monthWindowStartDay } = this.parent as IRecurrenceSiblings;

                  return !monthWindowStartDay || !value || value >= monthWindowStartDay;
                }),
          })
          .default(5),

        season: Yup.mixed<SeasonEnumType>()
          .nullable()
          .when('preset', {
            is: RecurrencePresetEnum.SEASONAL,
            then: schema => schema.required(t('quests.reusable.schema.seasonRequired')),
          })
          .default(null),

        targetAmount: Yup.number()
          .transform(numberFromInput)
          .min(1, targetAmountRange)
          .max(100000, targetAmountRange)
          .required(targetAmountRange)
          /* A measured target may be fractional ("1.5 L"); a plain repeat count may not be. */
          .test('whole-without-unit', t('quests.reusable.schema.targetAmountWhole'), function (value) {
            const { targetUnit } = this.parent as IRecurrenceSiblings;

            return Boolean(targetUnit) || Number.isInteger(value);
          })
          .default(1),

        targetUnit: Yup.string().nullable().max(20, t('quests.reusable.schema.targetUnitTooLong')).default(null),

        /*
         * A cap above the target itself would be meaningless — "3 times a week, up to 5 a day" is just
         * "3 times a week" — so it is bounded by the count it constrains rather than by a fixed maximum.
         */
        maxCompletionsPerDay: Yup.number()
          .transform(numberFromInput)
          .when('preset', {
            is: (preset: RecurrencePresetEnumType) => COUNTED_PRESETS.includes(preset),
            then: schema =>
              schema
                .min(1, maxPerDayRange)
                .integer(maxPerDayRange)
                .required(maxPerDayRange)
                .test('not-above-target', maxPerDayRange, function (value) {
                  const { timesPerPeriod } = this.parent as IRecurrenceSiblings;

                  return !timesPerPeriod || !value || value <= timesPerPeriod;
                }),
          })
          .default(1),

        durationMinutes: Yup.number()
          .transform(numberFromInput)
          .nullable()
          .min(1, durationRange)
          .max(1440, durationRange)
          .integer(durationRange)
          .default(null),
      })
      /*
       * The two date rules live at object level rather than in `shape()` on purpose: re-declaring
       * `startDate` or `endDate` there would replace the base schema's own checks — "not before
       * yesterday" and "end after start" — instead of adding to them.
       */
      .test('seasonal-has-no-end-date', '', function (values) {
        if (values.preset !== RecurrencePresetEnum.SEASONAL || !values.endDate) {
          return true;
        }

        return this.createError({ path: 'endDate', message: t('quests.reusable.schema.seasonalEndDateForbidden') });
      })
      .test('interval-needs-start-date', '', function (values) {
        if (values.preset !== RecurrencePresetEnum.EVERY_N_DAYS || values.startDate) {
          return true;
        }

        return this.createError({ path: 'startDate', message: t('quests.reusable.schema.intervalNeedsStartDate') });
      })
  );
};
