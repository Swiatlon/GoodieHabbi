import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import { oneTimeQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Loader from '@/components/shared/loader/loader';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import { IPostOneTimeQuestRequest } from '@/contract/quests/quests-types/one-time-quests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateOneTimeQuestMutation } from '@/redux/api/one-time-quests-api';
import { toUTCISOString } from '@/utils/utils';

interface AddOneTimeQuestModalProps extends IBaseModalProps {}

const AddOneTimeQuestModal: React.FC<AddOneTimeQuestModalProps> = ({ isVisible, onClose }) => {
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateOneTimeQuestMutation();

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
    <Modal isVisible={isVisible} onClose={onClose}>
      {isLoading && <Loader size="large" message="Adding quest..." fullscreen />}
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-2">
          <Text className="text-lg font-bold text-center">Add New Quest</Text>
          <ControlledInput name="title" label="Title:" placeholder="Enter the title" isRequired />
          <ControlledTextArea name="description" label="Description:" placeholder="Enter description" />
          <DatePickerModal name="startDate" minDate={toUTCISOString(new Date())} label="Start Date" placeholder="Tap to pick start date" />
          <DatePickerModal name="endDate" minDate={toUTCISOString(startDate)} label="End Date" placeholder="Tap to pick end date" />
          <EmojiPickerComponent />
          <PriorityPicker />
          <View className="flex-row justify-between">
            <Button
              label="Cancel"
              onPress={() => {
                onClose();
                reset();
              }}
              variant="outlined"
              className="rounded-lg"
            />
            <Button label="Add Quest" onPress={handleSubmit(onSubmit)} className="rounded-lg" />
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default AddOneTimeQuestModal;
