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
import { useDailyQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import dayjs from '@/configs/day-js-config';
import { IDailyQuest, IPostDailyQuestRequest } from '@/contract/quests/quests-types/daily-quests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useUpdateDailyQuestMutation } from '@/redux/api/quests/daily-quests-api';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { toUTCISOString } from '@/utils/utils/utils';

interface UpdateDailyQuestModalProps {
  isVisible: boolean;
  onClose: () => void;
  quest: IDailyQuest;
}

const UpdateDailyQuestModal: React.FC<UpdateDailyQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateDailyQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const dailyQuestValidationSchema = useDailyQuestValidationSchema();

  const methods = useForm<IPostDailyQuestRequest>({
    resolver: yupResolver(dailyQuestValidationSchema),
    defaultValues: {
      title: quest.title,
      description: quest.description,
      startDate: quest.startDate,
      endDate: quest.endDate,
      priority: quest.priority,
      isCompleted: quest.isCompleted,
      emoji: quest.emoji,
      labels: [],
      difficulty: quest.difficulty,
      scheduledTime: quest.scheduledTime,
    },
    context: { initialStartDate: quest.startDate },
  });

  const { handleSubmit, watch } = methods;

  const onSubmit = async (data: IPostDailyQuestRequest) => {
    try {
      await updateQuest({ id: quest.id, ...data }).unwrap();
      showSnackbar({ text: t('quests.daily.updateModal.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('quests.daily.updateModal.updatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const startDate = watch('startDate');

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => onClose()}
      key={quest.id}
      isLoading={isLoading}
      loadingMessage={t('quests.daily.updateModal.loadingMessage')}
      footer={
        <View className="flex-row justify-between">
          <Button
            label={t('quests.daily.form.cancelButton')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label={t('quests.daily.updateModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">{t('quests.daily.updateModal.heading')}</Text>
          <ControlledInput
            name="title"
            label={t('quests.daily.form.titleLabel')}
            placeholder={t('quests.daily.form.titlePlaceholder')}
            isRequired
            testID="input-title"
          />
          <ControlledTextArea
            name="description"
            label={t('quests.daily.form.descriptionLabel')}
            placeholder={t('quests.daily.form.descriptionPlaceholder')}
            testID="input-description"
          />
          <DatePickerModal
            name="startDate"
            minDate={toUTCISOString(dayjs.min(dayjs(quest.startDate ?? '1970-01-01'), dayjs()))}
            label={t('quests.daily.updateModal.startDateLabel')}
            placeholder={t('quests.daily.form.startDatePlaceholder')}
          />
          <DatePickerModal
            name="endDate"
            minDate={startDate ? toUTCISOString(startDate) : toUTCISOString(quest.endDate ?? dayjs())}
            label={t('quests.daily.form.endDateLabel')}
            placeholder={t('quests.daily.form.endDatePlaceholder')}
            isEndDate
          />
          <EmojiPickerComponent />
          <PriorityPicker />
          <DifficultyPicker />
          <TimePickerModal
            name="scheduledTime"
            label={t('quests.daily.form.scheduledTimeLabel')}
            placeholder={t('quests.daily.form.scheduledTimePlaceholder')}
          />
          <ControlledMultiSelect
            name="labels"
            label={t('quests.daily.form.tagsLabel')}
            placeholder={t('quests.daily.form.tagsPlaceholder')}
            noContentMessage={t('quests.daily.form.tagsNoContent')}
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateDailyQuestModal;
