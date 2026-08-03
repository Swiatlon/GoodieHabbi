import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import DayPicker from '../../reusable/add-quest-modal/day-picker';
import DifficultyPicker from '../../reusable/add-quest-modal/difficulty-picker';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import TimePickerModal from '../../reusable/add-quest-modal/time-picker-modal';
import { useMonthlyQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import dayjs from '@/configs/day-js-config';
import { IMonthlyQuest, IPostMonthlyQuestRequest } from '@/contract/quests/quests-types/monthly-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useUpdateMonthlyQuestMutation } from '@/redux/api/quests/monthly-quests-api';
import { toIsoDate } from '@/utils/utils/utils';
interface UpdateMonthlyQuestModalProps extends IBaseModalProps {
  quest: IMonthlyQuest;
}

const UpdateMonthlyQuestModal: React.FC<UpdateMonthlyQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateMonthlyQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const monthlyQuestValidationSchema = useMonthlyQuestValidationSchema();

  const methods = useForm<IPostMonthlyQuestRequest>({
    resolver: yupResolver(monthlyQuestValidationSchema),
    defaultValues: {
      title: quest.title,
      description: quest.description,
      startDate: toIsoDate(quest.startDate),
      endDate: toIsoDate(quest.endDate),
      priority: quest.priority,
      isCompleted: quest.isCompleted,
      emoji: quest.emoji,
      startDay: quest.startDay,
      endDay: quest.endDay,
      labels: [],
      difficulty: quest.difficulty,
      scheduledTime: quest.scheduledTime,
    },
    context: { initialStartDate: quest.startDate },
  });

  const { handleSubmit, watch } = methods;
  const startDate = watch('startDate');
  const startDay = watch('startDay');

  const onSubmit = async (data: IPostMonthlyQuestRequest) => {
    try {
      await updateQuest({ id: quest.id, ...data }).unwrap();
      showSnackbar({ text: t('quests.monthly.updateModal.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('quests.monthly.updateModal.updatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => onClose()}
      key={quest.id}
      isLoading={isLoading}
      loadingMessage={t('quests.monthly.updateModal.loadingMessage')}
      footer={
        <View className="flex-row justify-between">
          <Button
            label={t('quests.monthly.form.cancelButton')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label={t('quests.monthly.updateModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">{t('quests.monthly.updateModal.heading')}</Text>
          <ControlledInput
            name="title"
            label={t('quests.monthly.form.titleLabel')}
            placeholder={t('quests.monthly.form.titlePlaceholder')}
            isRequired
            testID="input-title"
          />
          <DayPicker
            label={t('quests.monthly.form.startDayLabel')}
            name="startDay"
            isRequired
            placeholder={t('quests.monthly.form.startDayPlaceholder')}
          />
          <DayPicker
            label={t('quests.monthly.form.endDayLabel')}
            name="endDay"
            min={startDay}
            isRequired
            placeholder={t('quests.monthly.form.endDayPlaceholder')}
          />
          <ControlledTextArea
            name="description"
            label={t('quests.monthly.form.descriptionLabel')}
            placeholder={t('quests.monthly.form.descriptionPlaceholder')}
            testID="input-description"
          />
          <DatePickerModal
            name="startDate"
            minDate={toIsoDate(dayjs.min(dayjs(quest.startDate ?? '1970-01-01'), dayjs()))}
            label={t('quests.monthly.updateModal.startDateLabel')}
            placeholder={t('quests.monthly.form.startDatePlaceholder')}
          />
          <DatePickerModal
            name="endDate"
            minDate={startDate ? toIsoDate(startDate) : toIsoDate(quest.endDate ?? dayjs())}
            label={t('quests.monthly.form.endDateLabel')}
            placeholder={t('quests.monthly.form.endDatePlaceholder')}
          />
          <EmojiPickerComponent />
          <PriorityPicker />
          <DifficultyPicker />
          <TimePickerModal
            name="scheduledTime"
            label={t('quests.monthly.form.scheduledTimeLabel')}
            placeholder={t('quests.monthly.form.scheduledTimePlaceholder')}
          />
          <ControlledMultiSelect
            name="labels"
            label={t('quests.monthly.form.tagsLabel')}
            placeholder={t('quests.monthly.form.tagsPlaceholder')}
            noContentMessage={t('quests.monthly.form.tagsNoContent')}
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateMonthlyQuestModal;
