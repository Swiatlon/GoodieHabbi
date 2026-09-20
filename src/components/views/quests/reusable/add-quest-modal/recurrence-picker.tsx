import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import ControlledSeasonPicker from './season-picker';
import WeeklyPicker from './weekly-picker';
import ControlledInput from '@/components/shared/input/controlled-input';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { COUNTED_PRESETS, INTERVAL_UNIT_KEY, RecurrencePresetEnum, RecurrencePresetEnumType } from '@/utils/quests/schedule';

/**
 * The one control that replaced five quest types.
 *
 * The preset list is deliberately not the API's `PeriodUnit`: "3 times a week" and "on Mon/Wed/Fri" are
 * different habits to a user but both are a Week-or-Day schedule plus a target to the backend. Picking
 * by intent and composing the request afterwards keeps the form honest without leaking the model.
 */
const RecurrencePicker: React.FC = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext();

  const preset = watch('preset') as RecurrencePresetEnumType;
  const isCounted = COUNTED_PRESETS.includes(preset);
  const intervalUnit = INTERVAL_UNIT_KEY[preset];

  return (
    <View className="gap-5">
      <View className="flex gap-2">
        <Text className="text-sm font-semibold text-gray-500">
          {t('quests.reusable.form.recurrenceLabel')}
          <Text className="text-red-500">*</Text>
        </Text>
        <ControlledSelect
          name="preset"
          isModalVersion
          placeholder={t('quests.reusable.form.recurrencePlaceholder')}
          className="px-2"
          options={[
            { label: t('quests.reusable.form.presets.once'), value: RecurrencePresetEnum.ONCE },
            { label: t('quests.reusable.form.presets.daily'), value: RecurrencePresetEnum.DAILY },
            { label: t('quests.reusable.form.presets.weekdays'), value: RecurrencePresetEnum.WEEKDAYS },
            { label: t('quests.reusable.form.presets.everyNDays'), value: RecurrencePresetEnum.EVERY_N_DAYS },
            { label: t('quests.reusable.form.presets.timesPerWeek'), value: RecurrencePresetEnum.TIMES_PER_WEEK },
            { label: t('quests.reusable.form.presets.timesPerMonth'), value: RecurrencePresetEnum.TIMES_PER_MONTH },
            { label: t('quests.reusable.form.presets.unitsPerWeek'), value: RecurrencePresetEnum.UNITS_PER_WEEK },
            { label: t('quests.reusable.form.presets.unitsPerMonth'), value: RecurrencePresetEnum.UNITS_PER_MONTH },
            { label: t('quests.reusable.form.presets.monthWindow'), value: RecurrencePresetEnum.MONTH_WINDOW },
            { label: t('quests.reusable.form.presets.seasonal'), value: RecurrencePresetEnum.SEASONAL },
          ]}
        />
      </View>

      {preset === RecurrencePresetEnum.WEEKDAYS && <WeeklyPicker />}

      {/* The API takes `interval` on every unit, so a weekly or monthly habit can skip periods too. */}
      {intervalUnit && (
        <View className="gap-1">
          <ControlledInput
            name="periodInterval"
            label={t(`quests.reusable.form.interval${intervalUnit === 'weeks' ? 'Weeks' : intervalUnit === 'months' ? 'Months' : 'Years'}Label`)}
            keyboardType="numeric"
            testID="input-period-interval"
          />
          <Text className="text-xs text-gray-400">{t('quests.reusable.form.periodIntervalHint')}</Text>
        </View>
      )}

      {preset === RecurrencePresetEnum.EVERY_N_DAYS && (
        <View className="gap-1">
          <ControlledInput name="interval" label={t('quests.reusable.form.intervalLabel')} keyboardType="numeric" testID="input-interval" />
          <Text className="text-xs text-gray-400">{t('quests.reusable.form.intervalHint')}</Text>
        </View>
      )}

      {isCounted && (
        <View className="gap-1">
          <ControlledInput
            name="timesPerPeriod"
            label={t(
              preset === RecurrencePresetEnum.TIMES_PER_WEEK ? 'quests.reusable.form.timesPerWeekLabel' : 'quests.reusable.form.timesPerMonthLabel'
            )}
            keyboardType="numeric"
            testID="input-times-per-period"
          />
          <Text className="text-xs text-gray-400">{t('quests.reusable.form.timesPerPeriodHint')}</Text>
          <ControlledInput
            name="maxCompletionsPerDay"
            label={t('quests.reusable.form.maxPerDayLabel')}
            keyboardType="numeric"
            testID="input-max-per-day"
          />
          <Text className="text-xs text-gray-400">{t('quests.reusable.form.maxPerDayHint')}</Text>
        </View>
      )}

      {preset === RecurrencePresetEnum.MONTH_WINDOW && (
        <View className="flex-row gap-3">
          <View className="flex-1">
            <ControlledInput name="monthWindowStartDay" label={t('quests.reusable.form.startDayLabel')} keyboardType="numeric" />
          </View>
          <View className="flex-1">
            <ControlledInput name="monthWindowEndDay" label={t('quests.reusable.form.endDayLabel')} keyboardType="numeric" />
          </View>
        </View>
      )}

      {preset === RecurrencePresetEnum.SEASONAL && (
        <View className="gap-1">
          <ControlledSeasonPicker isRequired />
          <Text className="text-xs text-amber-600">{t('quests.reusable.form.seasonalEndDateWarning')}</Text>
        </View>
      )}

      {/*
        The counted presets already put their number in the target, so offering a second one here would
        let the user ask for "2 times a week, 3 per period" — two numbers for one idea.
      */}
      {!isCounted && (
        <View className="gap-3">
          <ControlledInput
            name="targetAmount"
            label={t('quests.reusable.form.targetAmountLabel')}
            keyboardType="numeric"
            testID="input-target-amount"
          />
          <ControlledInput
            name="targetUnit"
            label={t('quests.reusable.form.targetUnitLabel')}
            placeholder={t('quests.reusable.form.targetUnitPlaceholder')}
            testID="input-target-unit"
          />
          <Text className="text-xs text-gray-400">{t('quests.reusable.form.targetHint')}</Text>
        </View>
      )}
    </View>
  );
};

export default RecurrencePicker;
