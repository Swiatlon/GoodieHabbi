import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import ControlledSeasonPicker from '../../reusable/add-quest-modal/season-picker';
import { seasonalQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import { SeasonEnumType } from '@/contract/quests/base-quests';
import { ISeasonalQuest, IPostSeasonalQuestRequest } from '@/contract/quests/quests-types/seasonal-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useUpdateSeasonalQuestMutation } from '@/redux/api/seasonal-quests-api';
import { getSeasonalDateLimits } from '@/utils/get-seasonal-date-limits';

interface UpdateSeasonalQuestModalProps extends IBaseModalProps {
  quest: ISeasonalQuest;
}

interface IFormValues extends Omit<IPostSeasonalQuestRequest, 'season'> {
  season: SeasonEnumType | null;
}
const UpdateSeasonalQuestModal: React.FC<UpdateSeasonalQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateSeasonalQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();

  const methods = useForm<IFormValues>({
    resolver: yupResolver(seasonalQuestValidationSchema),
    defaultValues: {
      title: quest.title,
      description: quest.description,
      startDate: quest.startDate,
      endDate: quest.endDate,
      priority: quest.priority,
      isCompleted: quest.isCompleted,
      emoji: quest.emoji,
      season: quest.season,
      labels: [],
    },
  });

  const { handleSubmit, watch } = methods;

  const selectedSeason = watch('season');
  const watchedStartDate = watch('startDate');

  const { minStartDate, maxStartDate, minEndDate, maxEndDate } = getSeasonalDateLimits(selectedSeason, watchedStartDate);

  const onSubmit = async (data: IFormValues) => {
    try {
      await updateQuest({
        ...data,
        id: quest.id,
        season: data.season as SeasonEnumType,
      }).unwrap();
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
          <Button label="Update Quest" onPress={handleSubmit(onSubmit)} startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />} />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">Edit Quest</Text>
          <ControlledInput name="title" label="Title:" placeholder="Enter the title" isRequired />
          <ControlledTextArea name="description" label="Description:" placeholder="Enter description" />
          <DatePickerModal name="startDate" minDate={minStartDate} maxDate={maxStartDate} label="Start Date" placeholder="Tap to pick start date" />
          <DatePickerModal name="endDate" minDate={minEndDate} maxDate={maxEndDate} label="End Date" placeholder="Tap to pick end date" isEndDate />
          <EmojiPickerComponent />
          <PriorityPicker />
          <ControlledSeasonPicker />
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

export default UpdateSeasonalQuestModal;
