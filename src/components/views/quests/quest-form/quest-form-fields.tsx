import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import DatePickerModal from '../reusable/add-quest-modal/date-picker-modal';
import DifficultyPicker from '../reusable/add-quest-modal/difficulty-picker';
import EmojiPickerComponent from '../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../reusable/add-quest-modal/priority-picker';
import RecurrencePicker from '../reusable/add-quest-modal/recurrence-picker';
import TimePickerModal from '../reusable/add-quest-modal/time-picker-modal';
import ControlledInput from '@/components/shared/input/controlled-input';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import dayjs from '@/configs/day-js-config';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { RecurrencePresetEnum, RecurrencePresetEnumType } from '@/utils/quests/schedule';
import { toIsoDate } from '@/utils/utils/utils';

/**
 * The body shared by the add and edit modals. Everything that used to differ between the five per-type
 * forms now lives inside `RecurrencePicker`, so there is exactly one field order to maintain.
 */
const QuestFormFields: React.FC = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();

  const startDate = watch('startDate') as string | null;
  const preset = watch('preset') as RecurrencePresetEnumType;

  return (
    <View className="bg-white rounded-lg px-4 gap-5 py-0">
      <ControlledInput
        name="title"
        label={t('quests.reusable.form.titleLabel')}
        placeholder={t('quests.reusable.form.titlePlaceholder')}
        isRequired
        testID="input-title"
      />
      <ControlledTextArea
        name="description"
        label={t('quests.reusable.form.descriptionLabel')}
        placeholder={t('quests.reusable.form.descriptionPlaceholder')}
        testID="input-description"
      />

      <RecurrencePicker />

      <DatePickerModal
        name="startDate"
        minDate={toIsoDate(dayjs())}
        label={t('quests.reusable.form.startDateLabel')}
        placeholder={t('quests.reusable.form.startDatePlaceholder')}
      />
      {/*
        A seasonal quest recurs through its year window, so an end date would retire it after the first
        season — the mistake the old seasonal form made by filling this in automatically.
      */}
      {preset !== RecurrencePresetEnum.SEASONAL && (
        <DatePickerModal
          name="endDate"
          minDate={startDate ? toIsoDate(startDate) : toIsoDate(dayjs())}
          label={t('quests.reusable.form.endDateLabel')}
          placeholder={t('quests.reusable.form.endDatePlaceholder')}
        />
      )}

      <EmojiPickerComponent />
      <PriorityPicker />
      <DifficultyPicker />
      <TimePickerModal
        name="scheduledTime"
        label={t('quests.reusable.form.scheduledTimeLabel')}
        placeholder={t('quests.reusable.form.scheduledTimePlaceholder')}
      />
      <View className="gap-1">
        <ControlledInput
          name="durationMinutes"
          label={t('quests.reusable.form.durationLabel')}
          placeholder={t('quests.reusable.form.durationPlaceholder')}
          keyboardType="numeric"
          testID="input-duration-minutes"
        />
        <Text className="text-xs text-gray-400">{t('quests.reusable.form.durationHint')}</Text>
      </View>
      <ControlledMultiSelect
        name="labels"
        label={t('quests.reusable.form.tagsLabel')}
        placeholder={t('quests.reusable.form.tagsPlaceholder')}
        noContentMessage={t('quests.reusable.form.tagsNoContent')}
        options={questLabels.map(item => ({ ...item, label: item.value }))}
      />
    </View>
  );
};

export default QuestFormFields;
