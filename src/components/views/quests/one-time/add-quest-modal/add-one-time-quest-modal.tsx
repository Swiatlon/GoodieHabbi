import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Loader from '@/components/shared/loader/loader';
import Modal from '@/components/shared/modal/modal';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import {
  OneTimeQuestFormValues,
  oneTimeQuestValidationSchema,
} from '@/components/views/quests/one-time/add-quest-modal/schema';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateQuestMutation } from '@/redux/api/one-time-quests-api';

interface AddOneTimeQuestModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddOneTimeQuestModal: React.FC<AddOneTimeQuestModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateQuestMutation();

  const methods = useForm<OneTimeQuestFormValues>({
    resolver: yupResolver(oneTimeQuestValidationSchema),
    defaultValues: {
      title: '',
      description: null,
      selectedEmoji: null,
      priority: null,
      startDate: null,
      endDate: null,
      isCompleted: false,
      emoji: null,
    },
  });

  const { handleSubmit, reset, watch } = methods;

  const onSubmit = async (data: OneTimeQuestFormValues) => {
    try {
      await createQuest(data).unwrap();
      showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
      setIsModalVisible(false);
      reset();
    } catch {
      showSnackbar({ text: 'Failed to add quest. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  const startDate = watch('startDate');

  return (
    <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
      {isLoading && <Loader size="large" message="Adding quest..." fullscreen />}
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-center">Add New Quest</Text>
          <ControlledInput name="title" label="Title:" placeholder="Enter the title" isRequired />
          <ControlledTextArea name="description" label="Description" placeholder="Enter description" />

          {/*

          <Controller
            name="startDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePickerModal
                onConfirm={onChange}
                onClearInput={() => onChange(null)}
                selectedDate={value}
                label="Start Date"
                formVersion
                minDate={new Date()}
                // error={errors.startDate?.message}
              />
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePickerModal
                onConfirm={onChange}
                onClearInput={() => onChange(null)}
                selectedDate={value}
                label="End Date"
                formVersion
                minDate={startDate}
                // error={errors.endDate?.message}
              />
            )}
          />

          <Controller
            name="selectedEmoji"
            control={control}
            render={({ field: { onChange, value } }) => (
              <EmojiPickerComponent selectedEmoji={value} onEmojiSelected={onChange} formVersion label="Emoji" />
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PriorityPicker
                priority={value}
                setPriority={onChange}
                //  error={errors.priority?.message}
              />
            )}
          /> */}

          <View className="flex-row justify-between">
            <Button
              label="Cancel"
              onPress={() => {
                setIsModalVisible(false);
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

export default AddOneTimeQuestModal;
