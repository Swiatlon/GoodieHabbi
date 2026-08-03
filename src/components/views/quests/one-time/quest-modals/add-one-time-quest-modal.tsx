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
import { useOneTimeQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import dayjs from '@/configs/day-js-config';
import { IPostOneTimeQuestRequest } from '@/contract/quests/quests-types/one-time-quests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useCreateOneTimeQuestMutation } from '@/redux/api/quests/one-time-quests-api';
import { toIsoDate } from '@/utils/utils/utils';

interface AddOneTimeQuestModalProps extends IBaseModalProps {}

const AddOneTimeQuestModal: React.FC<AddOneTimeQuestModalProps> = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateOneTimeQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const oneTimeQuestValidationSchema = useOneTimeQuestValidationSchema();

  const methods = useForm<IPostOneTimeQuestRequest>({
    resolver: yupResolver(oneTimeQuestValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: null,
      priority: null,
      endDate: null,
      isCompleted: false,
      emoji: null,
      labels: [],
      difficulty: null,
      scheduledTime: null,
    },
  });

  const { handleSubmit, reset, watch } = methods;

  const onSubmit = async (data: IPostOneTimeQuestRequest) => {
    try {
      await createQuest(data).unwrap();
      onClose();
      reset();
      showSnackbar({ text: t('quests.oneTime.addModal.addedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: t('quests.oneTime.addModal.addedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const startDate = watch('startDate');

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('quests.oneTime.addModal.loadingMessage')}
      footer={
        <View className="flex-row justify-between" testID="modal-footer">
          <Button
            label={t('quests.oneTime.form.cancelButton')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
            testID="btn-cancel"
          />
          <Button
            label={t('quests.oneTime.addModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
            testID="btn-add-quest"
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0" testID="add-quest-modal-content">
          <Text className="text-lg font-bold text-center" testID="modal-title">
            {t('quests.oneTime.addModal.heading')}
          </Text>
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
            minDate={toIsoDate(dayjs())}
            label={t('quests.oneTime.form.startDateLabel')}
            placeholder={t('quests.oneTime.form.startDatePlaceholder')}
          />
          <DatePickerModal
            name="endDate"
            minDate={startDate ? toIsoDate(startDate) : toIsoDate(dayjs())}
            label={t('quests.oneTime.form.endDateLabel')}
            placeholder={t('quests.oneTime.form.endDatePlaceholder')}
          />
          <EmojiPickerComponent testID="emoji-picker" />
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

export default AddOneTimeQuestModal;
