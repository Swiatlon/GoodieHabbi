import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import WeeklyPicker from '../../reusable/add-quest-modal/weekly-picker';
import { weeklyQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Loader from '@/components/shared/loader/loader';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import { IWeeklyQuest, IPostWeeklyQuestRequest } from '@/contract/quests/quests-types/weekly-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useUpdateWeeklyQuestMutation } from '@/redux/api/weekly-quests-api';
import { toUTCISOString } from '@/utils/utils';

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
      startDate: toUTCISOString(quest.startDate),
      endDate: toUTCISOString(quest.endDate),
      priority: quest.priority,
      isCompleted: quest.isCompleted,
      emoji: quest.emoji,
      weekdays: quest.weekdays,
      labels: [],
    },
  });

  const { handleSubmit, reset, watch } = methods;
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
    <Modal isVisible={isVisible} onClose={() => onClose()} key={quest.id}>
      {isLoading && <Loader size="large" message="Updating quest..." fullscreen />}
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-2">
          <Text className="text-lg font-bold text-center">Edit Quest</Text>
          <ControlledInput name="title" label="Title:" placeholder="Enter the title" isRequired />
          <ControlledTextArea name="description" label="Description:" placeholder="Enter description" />
          <DatePickerModal name="startDate" minDate={toUTCISOString(new Date())} label="Start Date" placeholder="Tap to pick start date" />
          <DatePickerModal
            name="endDate"
            minDate={startDate ? toUTCISOString(startDate) : toUTCISOString(new Date())}
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
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
          <View className="flex-row justify-between">
            <Button
              label="Cancel"
              onPress={() => {
                onClose();
                reset();
              }}
              className="bg-gray-200 text-gray-700 rounded-lg"
              variant="outlined"
            />
            <Button label="Save Changes" onPress={handleSubmit(onSubmit)} className="bg-blue-500 text-white rounded-lg" />
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateWeeklyQuestModal;
