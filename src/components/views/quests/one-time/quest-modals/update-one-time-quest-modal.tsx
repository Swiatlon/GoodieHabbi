import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Loader from '@/components/shared/loader/loader';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import { oneTimeQuestValidationSchema } from '@/components/views/quests/one-time/quest-modals/schema';
import { IOneTimeQuest, IPostOneTimeQuestRequest } from '@/contract/quests/quests-types/one-time-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useUpdateOneTimeQuestMutation } from '@/redux/api/one-time-quests-api';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { toUTCISOString } from '@/utils/utils';

interface UpdateOneTimeQuestModalProps extends IBaseModalProps {
  quest: IOneTimeQuest;
}

const UpdateOneTimeQuestModal: React.FC<UpdateOneTimeQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateOneTimeQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();

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
    },
  });

  const { handleSubmit, watch } = methods;
  const startDate = watch('startDate');

  const onSubmit = async (data: IPostOneTimeQuestRequest) => {
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
            label="Add Quest"
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
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
          <ControlledMultiSelect
            name="labels"
            label="Tags:"
            placeholder="Select quest tags"
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateOneTimeQuestModal;
