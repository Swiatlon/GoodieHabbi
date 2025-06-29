import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import WeeklyPicker from '../../reusable/add-quest-modal/weekly-picker';
import { weeklyQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import dayjs from '@/configs/day-js-config';
import { IWeeklyQuest, IPostWeeklyQuestRequest } from '@/contract/quests/quests-types/weekly-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useUpdateWeeklyQuestMutation } from '@/redux/api/weekly-quests-api';
import { toUTCISOString } from '@/utils/utils/utils';

interface UpdateWeeklyQuestModalProps extends IBaseModalProps {
  quest: IWeeklyQuest;
}

const UpdateWeeklyQuestModal: React.FC<UpdateWeeklyQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateWeeklyQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();

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
    },
    context: { initialStartDate: quest.startDate },
  });

  const { handleSubmit, watch } = methods;
  const startDate = watch('startDate');

  const onSubmit = async (data: IPostWeeklyQuestRequest) => {
    try {
      await updateQuest({ id: quest.id, ...data }).unwrap();
      showSnackbar({ text: 'Quest updated successfully!', variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: 'Failed to update quest. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => onClose()}
      key={quest.id}
      isLoading={isLoading}
      loadingMessage="Updating quest..."
      footer={
        <View className="flex-row justify-between">
          <Button
            label="Cancel"
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label="Update Quest"
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">Edit Quest</Text>
          <ControlledInput name="title" label="Title:" placeholder="Enter the title" isRequired />
          <ControlledTextArea name="description" label="Description:" placeholder="Enter description" />
          <DatePickerModal
            name="startDate"
            minDate={toUTCISOString(quest.startDate ?? dayjs())}
            label="Start Date"
            placeholder="Tap to pick start date"
          />
          <DatePickerModal
            name="endDate"
            isEndDate
            minDate={startDate ? toUTCISOString(startDate) : toUTCISOString(quest.endDate ?? dayjs())}
            label="End Date"
            placeholder="Tap to pick end date"
          />
          <EmojiPickerComponent />
          <PriorityPicker />
          <WeeklyPicker />
          <ControlledMultiSelect
            name="labels"
            label="Tags:"
            placeholder="Select quest tags"
            noContentMessage="No tags available, please create some first"
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateWeeklyQuestModal;
