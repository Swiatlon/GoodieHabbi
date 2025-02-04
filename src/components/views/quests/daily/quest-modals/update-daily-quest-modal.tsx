import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import { DailyQuestFormValues, dailyQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Loader from '@/components/shared/loader/loader';
import Modal from '@/components/shared/modal/modal';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import { RepeatIntervalEnum } from '@/contract/quests/base-quests';
import { IDailyQuest } from '@/contract/quests/quests-types/daily-quests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useUpdateDailyQuestMutation } from '@/redux/api/daily-quests-api';
import { toUTCISOString } from '@/utils/utils';

interface UpdateDailyQuestModalProps {
  isVisible: boolean;
  onClose: () => void;
  quest: IDailyQuest;
}

const UpdateDailyQuestModal: React.FC<UpdateDailyQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateDailyQuestMutation();

  const methods = useForm<DailyQuestFormValues>({
    resolver: yupResolver(dailyQuestValidationSchema),
    defaultValues: {
      title: quest.title,
      description: quest.description,
      startDate: toUTCISOString(quest.startDate),
      endDate: toUTCISOString(quest.endDate),
      priority: quest.priority,
      isCompleted: quest.isCompleted,
      emoji: quest.emoji,
      repeatInterval: {
        type: RepeatIntervalEnum.DAILY,
      },
    },
  });

  const { handleSubmit, reset, watch } = methods;
  const startDate = watch('startDate');

  const onSubmit = async (data: DailyQuestFormValues) => {
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
        <View className="bg-white rounded-lg px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-center">Edit Quest</Text>
          <ControlledInput name="title" label="Title:" placeholder="Enter the title" isRequired />
          <ControlledTextArea name="description" label="Description:" placeholder="Enter description" />
          <DatePickerModal name="startDate" minDate={toUTCISOString(new Date())} label="Start Date" />
          <DatePickerModal name="endDate" minDate={toUTCISOString(startDate)} label="End Date" />
          <EmojiPickerComponent name="emoji" formVersion label="Emoji" />
          <PriorityPicker label="Priority:" name="priority" />
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
            <Button
              label="Save Changes"
              onPress={handleSubmit(onSubmit)}
              className="bg-blue-500 text-white rounded-lg"
            />
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateDailyQuestModal;
