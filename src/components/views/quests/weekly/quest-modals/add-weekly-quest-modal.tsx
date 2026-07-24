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
import { IPostWeeklyQuestRequest } from '@/contract/quests/quests-types/weekly-quests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useCreateWeeklyQuestMutation } from '@/redux/api/quests/weekly-quests-api';
import { toUTCISOString } from '@/utils/utils/utils';

interface AddWeeklyQuestModalProps extends IBaseModalProps {}

const AddWeeklyTimeQuestModal: React.FC<AddWeeklyQuestModalProps> = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateWeeklyQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const weeklyQuestValidationSchema = useWeeklyQuestValidationSchema();

  const methods = useForm<IPostWeeklyQuestRequest>({
    resolver: yupResolver(weeklyQuestValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: null,
      priority: null,
      endDate: null,
      isCompleted: false,
      emoji: null,
      difficulty: null,
      scheduledTime: null,
      weekdays: [],
      labels: [],
    },
  });

  const { handleSubmit, reset, watch } = methods;

  const onSubmit = async (data: IPostWeeklyQuestRequest) => {
    try {
      await createQuest(data).unwrap();
      onClose();
      reset();
      showSnackbar({ text: t('quests.weekly.addModal.addedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: t('quests.weekly.addModal.addedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const startDate = watch('startDate');

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('quests.weekly.addModal.loadingMessage')}
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
            label={t('quests.weekly.addModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">{t('quests.weekly.addModal.heading')}</Text>
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
            minDate={toUTCISOString(dayjs())}
            label={t('quests.weekly.form.startDateLabel')}
            placeholder={t('quests.weekly.form.startDatePlaceholder')}
          />
          <DatePickerModal
            name="endDate"
            minDate={startDate ? toUTCISOString(startDate) : toUTCISOString(dayjs())}
            label={t('quests.weekly.form.endDateLabel')}
            placeholder={t('quests.weekly.form.endDatePlaceholder')}
            isEndDate
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
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default AddWeeklyTimeQuestModal;
