import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import DifficultyPicker from '../../reusable/add-quest-modal/difficulty-picker';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import TimePickerModal from '../../reusable/add-quest-modal/time-picker-modal';
import WeeklyPicker from '../../reusable/add-quest-modal/weekly-picker';
import { useWeeklyQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import dayjs from '@/configs/day-js-config';
import { IWeeklyQuest, IPostWeeklyQuestRequest } from '@/contract/quests/quests-types/weekly-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useUpdateWeeklyQuestMutation } from '@/redux/api/quests/weekly-quests-api';
import { toUTCISOString } from '@/utils/utils/utils';

interface UpdateWeeklyQuestModalProps extends IBaseModalProps {
  quest: IWeeklyQuest;
}

const UpdateWeeklyQuestModal: React.FC<UpdateWeeklyQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateWeeklyQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const weeklyQuestValidationSchema = useWeeklyQuestValidationSchema();

  const methods = useForm<IPostWeeklyQuestRequest>({
    resolver: yupResolver(weeklyQuestValidationSchema),
    defaultValues: {
      title: quest.title,
      description: quest.description,
      startDate: quest.startDate,
      endDate: quest.endDate,
      priority: quest.priority,
      isCompleted: quest.isCompleted,
      emoji: quest.emoji,
      weekdays: quest.weekdays,
      labels: [],
      difficulty: quest.difficulty,
      scheduledTime: quest.scheduledTime,
    },
    context: { initialStartDate: quest.startDate },
  });

  const { handleSubmit, watch } = methods;
  const startDate = watch('startDate');

  const onSubmit = async (data: IPostWeeklyQuestRequest) => {
    try {
      await updateQuest({ id: quest.id, ...data }).unwrap();
      showSnackbar({ text: t('quests.weekly.updateModal.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('quests.weekly.updateModal.updatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => onClose()}
      key={quest.id}
      isLoading={isLoading}
      loadingMessage={t('quests.weekly.updateModal.loadingMessage')}
      footer={
        <View className="flex-row justify-between">
          <Button
            label={t('quests.weekly.form.cancelButton')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label={t('quests.weekly.updateModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">{t('quests.weekly.updateModal.heading')}</Text>
          <ControlledInput
            name="title"
            label={t('quests.weekly.form.titleLabel')}
            placeholder={t('quests.weekly.form.titlePlaceholder')}
            isRequired
            testID="input-title"
          />
          <WeeklyPicker />
          <ControlledTextArea
            name="description"
            label={t('quests.weekly.form.descriptionLabel')}
            placeholder={t('quests.weekly.form.descriptionPlaceholder')}
            testID="input-description"
          />
          <DatePickerModal
            name="startDate"
            minDate={toUTCISOString(dayjs.min(dayjs(quest.startDate ?? '1970-01-01'), dayjs()))}
            label={t('quests.weekly.form.startDateLabel')}
            placeholder={t('quests.weekly.form.startDatePlaceholder')}
          />
          <DatePickerModal
            name="endDate"
            isEndDate
            minDate={startDate ? toUTCISOString(startDate) : toUTCISOString(quest.endDate ?? dayjs())}
            label={t('quests.weekly.form.endDateLabel')}
            placeholder={t('quests.weekly.form.endDatePlaceholder')}
          />
          <EmojiPickerComponent />
          <PriorityPicker />
          <DifficultyPicker />
          <TimePickerModal
            name="scheduledTime"
            label={t('quests.weekly.form.scheduledTimeLabel')}
            placeholder={t('quests.weekly.form.scheduledTimePlaceholder')}
          />
          <ControlledMultiSelect
            name="labels"
            label={t('quests.weekly.form.tagsLabel')}
            placeholder={t('quests.weekly.form.tagsPlaceholder')}
            noContentMessage={t('quests.weekly.form.tagsNoContent')}
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateWeeklyQuestModal;
