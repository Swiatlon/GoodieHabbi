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
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateDailyQuestMutation } from '@/redux/api/daily-quests-api';
import { toUTCISOString } from '@/utils/utils';

interface AddDailyQuestModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddDailyQuestModal: React.FC<AddDailyQuestModalProps> = ({ isVisible, onClose }) => {
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateDailyQuestMutation();

  const methods = useForm<DailyQuestFormValues>({
    resolver: yupResolver(dailyQuestValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: null,
      priority: null,
      endDate: null,
      isCompleted: false,
      emoji: null,
      repeatInterval: {
        type: RepeatIntervalEnum.DAILY,
      },
    },
  });

  const { handleSubmit, reset, watch } = methods;

  const onSubmit = async (data: DailyQuestFormValues) => {
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
    <Modal isVisible={isVisible} onClose={onClose}>
      {isLoading && <Loader size="large" message="Adding quest..." fullscreen />}
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-center">Add New Quest</Text>
          <ControlledInput name="title" label="Title:" placeholder="Enter the title" isRequired />
          <ControlledTextArea name="description" label="Description:" placeholder="Enter description" />
          <DatePickerModal name="startDate" minDate={toUTCISOString(new Date())} label="Start Date" />
          <DatePickerModal name="endDate" minDate={toUTCISOString(startDate)} label="End Date" />
          <EmojiPickerComponent name="emoji" formVersion label="Emoji:" />
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
            <Button label="Add Quest" onPress={handleSubmit(onSubmit)} className="bg-blue-500 text-white rounded-lg" />
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default AddDailyQuestModal;
