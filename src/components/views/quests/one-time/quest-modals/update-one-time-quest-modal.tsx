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
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import { useOneTimeQuestValidationSchema } from '@/components/views/quests/one-time/quest-modals/schema';
import dayjs from '@/configs/day-js-config';
import { IOneTimeQuest, IPostOneTimeQuestRequest } from '@/contract/quests/quests-types/one-time-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useUpdateOneTimeQuestMutation } from '@/redux/api/quests/one-time-quests-api';
import { toIsoDate } from '@/utils/utils/utils';

interface UpdateOneTimeQuestModalProps extends IBaseModalProps {
  quest: IOneTimeQuest;
}

const UpdateOneTimeQuestModal: React.FC<UpdateOneTimeQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateOneTimeQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const oneTimeQuestValidationSchema = useOneTimeQuestValidationSchema();

  const methods = useForm<IPostOneTimeQuestRequest>({
    resolver: yupResolver(oneTimeQuestValidationSchema),
    defaultValues: {
      title: quest.title,
      description: quest.description,
      startDate: quest.startDate,
      endDate: quest.endDate,
      priority: quest.priority,
      isCompleted: quest.isCompleted,
      emoji: quest.emoji,
      labels: quest.labels,
      difficulty: quest.difficulty,
      scheduledTime: quest.scheduledTime,
    },
    context: { initialStartDate: quest.startDate },
  });

  const { handleSubmit, watch } = methods;
  const startDate = watch('startDate');

  const onSubmit = async (data: IPostOneTimeQuestRequest) => {
    try {
      await updateQuest({ id: quest.id, ...data }).unwrap();
      showSnackbar({ text: t('quests.oneTime.updateModal.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('quests.oneTime.updateModal.updatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => onClose()}
      key={quest.id}
      isLoading={isLoading}
      loadingMessage={t('quests.oneTime.updateModal.loadingMessage')}
      footer={
        <View className="flex-row justify-between">
          <Button
            label={t('quests.oneTime.form.cancelButton')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label={t('quests.oneTime.updateModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">{t('quests.oneTime.updateModal.heading')}</Text>
          <ControlledInput
            name="title"
            label={t('quests.oneTime.form.titleLabel')}
            placeholder={t('quests.oneTime.form.titlePlaceholder')}
            isRequired
            testID="input-title"
          />
          <ControlledTextArea
            name="description"
            label={t('quests.oneTime.form.descriptionLabel')}
            placeholder={t('quests.oneTime.form.descriptionPlaceholder')}
            testID="input-description"
          />
          <DatePickerModal
            name="startDate"
            minDate={toIsoDate(dayjs.min(dayjs(quest.startDate ?? '1970-01-01'), dayjs()))}
            label={t('quests.oneTime.form.startDateLabel')}
            placeholder={t('quests.oneTime.form.startDatePlaceholder')}
          />
          <DatePickerModal
            name="endDate"
            minDate={startDate ? toIsoDate(startDate) : toIsoDate(quest.endDate ?? dayjs())}
            label={t('quests.oneTime.form.endDateLabel')}
            placeholder={t('quests.oneTime.form.endDatePlaceholder')}
          />
          <EmojiPickerComponent />
          <PriorityPicker />
          <DifficultyPicker />
          <TimePickerModal
            name="scheduledTime"
            label={t('quests.oneTime.form.scheduledTimeLabel')}
            placeholder={t('quests.oneTime.form.scheduledTimePlaceholder')}
          />
          <ControlledMultiSelect
            name="labels"
            label={t('quests.oneTime.form.tagsLabel')}
            placeholder={t('quests.oneTime.form.tagsPlaceholder')}
            noContentMessage={t('quests.oneTime.form.tagsNoContent')}
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateOneTimeQuestModal;
