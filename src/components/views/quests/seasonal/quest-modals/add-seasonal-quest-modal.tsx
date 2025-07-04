import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import DifficultyPicker from '../../reusable/add-quest-modal/difficulty-picker';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import ControlledSeasonPicker from '../../reusable/add-quest-modal/season-picker';
import TimePickerModal from '../../reusable/add-quest-modal/time-picker-modal';
import { seasonalQuestValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledMultiSelect from '@/components/shared/multi-select/controlled-multi-select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import { SeasonEnumType } from '@/contract/quests/base-quests';
import { IPostSeasonalQuestRequest } from '@/contract/quests/quests-types/seasonal-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { useCreateSeasonalQuestMutation } from '@/redux/api/quests/seasonal-quests-api';
import { getSeasonalDateLimits } from '@/utils/get-seasonal-date-limits';

interface AddSeasonalQuestModalProps extends IBaseModalProps {}

interface IFormValues extends Omit<IPostSeasonalQuestRequest, 'season'> {
  season: SeasonEnumType | null;
}

const AddSeasonalQuestModal: React.FC<AddSeasonalQuestModalProps> = ({ isVisible, onClose }) => {
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateSeasonalQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();

  const methods = useForm<IFormValues>({
    resolver: yupResolver(seasonalQuestValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: null,
      priority: null,
      endDate: null,
      isCompleted: false,
      emoji: null,
      season: null,
      difficulty: null,
      scheduledTime: null,
      labels: [],
    },
  });

  const { handleSubmit, reset, watch } = methods;

  const selectedSeason = watch('season');
  const watchedStartDate = watch('startDate');

  const { minStartDate, maxStartDate, minEndDate, maxEndDate } = getSeasonalDateLimits(selectedSeason, watchedStartDate);

  const onSubmit = async (data: IFormValues) => {
    try {
      await createQuest({ ...data, season: data.season as SeasonEnumType }).unwrap();
      onClose();
      reset();
      showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: 'Failed to add quest. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage="Adding quest..."
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
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">Add New Quest</Text>
          <ControlledInput name="title" label="📝 Title:" placeholder="Enter the title" isRequired testID="input-title" />
          <ControlledSeasonPicker isRequired />
          <ControlledTextArea name="description" label="📖 Description:" placeholder="Enter description" testID="input-description" />
          <DatePickerModal
            name="startDate"
            minDate={minStartDate}
            maxDate={maxStartDate}
            label="📅 Start Date:"
            placeholder="Tap to pick start date"
          />
          <DatePickerModal
            name="endDate"
            minDate={minEndDate}
            maxDate={maxEndDate}
            label="📅 End Date:"
            placeholder="Tap to pick end date"
            isEndDate
          />
          <EmojiPickerComponent />
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

export default AddSeasonalQuestModal;
