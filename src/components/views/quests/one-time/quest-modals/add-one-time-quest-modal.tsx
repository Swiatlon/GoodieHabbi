import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import DifficultyPicker from '../../reusable/add-quest-modal/difficulty-picker';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import TimePickerModal from '../../reusable/add-quest-modal/time-picker-modal';
import { oneTimeQuestValidationSchema } from './schema';
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
import { toUTCISOString } from '@/utils/utils/utils';

interface AddOneTimeQuestModalProps extends IBaseModalProps {}

const AddOneTimeQuestModal: React.FC<AddOneTimeQuestModalProps> = ({ isVisible, onClose }) => {
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateOneTimeQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();

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
      showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: 'Failed to add quest. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  const startDate = watch('startDate');

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage="Adding quest..."
      footer={
        <View className="flex-row justify-between" testID="modal-footer">
          <Button
            label="Cancel"
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
            testID="btn-cancel"
          />
          <Button
            label="Add Quest"
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
            Add New Quest
          </Text>
          <ControlledInput name="title" label="📝 Title:" placeholder="Enter the title" isRequired testID="input-title" />
          <ControlledTextArea name="description" label="📖 Description:" placeholder="Enter description" testID="input-description" />
          <DatePickerModal name="startDate" minDate={toUTCISOString(dayjs())} label="📅 Start Date:" placeholder="Tap to pick start date" />
          <DatePickerModal
            name="endDate"
            minDate={startDate ? toUTCISOString(startDate) : toUTCISOString(dayjs())}
            label="📅 End Date:"
            placeholder="Tap to pick end date"
            isEndDate
          />
          <EmojiPickerComponent testID="emoji-picker" />
          <PriorityPicker />
          <DifficultyPicker />
          <TimePickerModal name="scheduledTime" label="⏰ Scheduled Time:" placeholder="Select time" />
          <ControlledMultiSelect
            name="labels"
            label="🏷️ Tags:"
            placeholder="Select quest tags"
            noContentMessage="No tags available, please create some first"
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default AddOneTimeQuestModal;
