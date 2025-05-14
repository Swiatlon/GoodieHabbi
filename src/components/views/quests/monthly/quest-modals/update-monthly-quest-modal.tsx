import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import DayPicker from '../../reusable/add-quest-modal/day-picker';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import { monthlyQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import dayjs from '@/configs/day-js-config';
import { IMonthlyQuest, IPostMonthlyQuestRequest } from '@/contract/quests/quests-types/monthly-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useUpdateMonthlyQuestMutation } from '@/redux/api/monthly-quests-api';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { toUTCISOString } from '@/utils/utils/utils';

interface UpdateMonthlyQuestModalProps extends IBaseModalProps {
  quest: IMonthlyQuest;
}

const UpdateMonthlyQuestModal: React.FC<UpdateMonthlyQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateMonthlyQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();

  const methods = useForm<IPostMonthlyQuestRequest>({
    resolver: yupResolver(monthlyQuestValidationSchema),
    defaultValues: {
      title: quest.title,
      description: quest.description,
      startDate: toUTCISOString(quest.startDate),
      endDate: toUTCISOString(quest.endDate),
      priority: quest.priority,
      isCompleted: quest.isCompleted,
      emoji: quest.emoji,
      startDay: quest.startDay,
      endDay: quest.endDay,
      labels: [],
    },
    context: { initialStartDate: quest.startDate },
  });

  const { handleSubmit, watch } = methods;
  const startDate = watch('startDate');
  const startDay = watch('startDay');

  const onSubmit = async (data: IPostMonthlyQuestRequest) => {
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
            minDate={startDate ? toUTCISOString(startDate) : toUTCISOString(quest.endDate ?? dayjs())}
            label="End Date"
            placeholder="Tap to pick end date"
            isEndDate
          />
          <EmojiPickerComponent />
          <PriorityPicker />
          <ControlledMultiSelect
            name="labels"
            label="Tags:"
            placeholder="Select quest tags"
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
          <DayPicker label="Start Day:" name="startDay" isRequired placeholder="Select start day" />
          <DayPicker label="End Day:" name="endDay" min={startDay} isRequired placeholder="Select end day" />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateMonthlyQuestModal;
