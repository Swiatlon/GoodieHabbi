import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import DifficultyPicker from '../../reusable/add-quest-modal/difficulty-picker';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import ControlledSeasonPicker from '../../reusable/add-quest-modal/season-picker';
import TimePickerModal from '../../reusable/add-quest-modal/time-picker-modal';
import { useSeasonalQuestSchema } from './schema';
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
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateSeasonalQuestMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const seasonalQuestValidationSchema = useSeasonalQuestSchema();

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
      showSnackbar({ text: t('quests.seasonal.addModal.addedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: t('quests.seasonal.addModal.addedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('quests.seasonal.addModal.loadingMessage')}
      footer={
        <View className="flex-row justify-between">
          <Button
            label={t('quests.seasonal.form.cancelButton')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label={t('quests.seasonal.addModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-5 py-0">
          <Text className="text-lg font-bold text-center">{t('quests.seasonal.addModal.heading')}</Text>
          <ControlledInput
            name="title"
            label={t('quests.seasonal.form.titleLabel')}
            placeholder={t('quests.seasonal.form.titlePlaceholder')}
            isRequired
            testID="input-title"
          />
          <ControlledSeasonPicker isRequired />
          <ControlledTextArea
            name="description"
            label={t('quests.seasonal.form.descriptionLabel')}
            placeholder={t('quests.seasonal.form.descriptionPlaceholder')}
            testID="input-description"
          />
          <DatePickerModal
            name="startDate"
            minDate={minStartDate}
            maxDate={maxStartDate}
            label={t('quests.seasonal.form.startDateLabel')}
            placeholder={t('quests.seasonal.form.startDatePlaceholder')}
          />
          <DatePickerModal
            name="endDate"
            minDate={minEndDate}
            maxDate={maxEndDate}
            label={t('quests.seasonal.form.endDateLabel')}
            placeholder={t('quests.seasonal.form.endDatePlaceholder')}
          />
          <EmojiPickerComponent />
          <PriorityPicker />
          <DifficultyPicker />
          <TimePickerModal
            name="scheduledTime"
            label={t('quests.seasonal.form.scheduledTimeLabel')}
            placeholder={t('quests.seasonal.form.scheduledTimePlaceholder')}
          />
          <ControlledMultiSelect
            name="labels"
            label={t('quests.seasonal.form.tagsLabel')}
            placeholder={t('quests.seasonal.form.tagsPlaceholder')}
            noContentMessage={t('quests.seasonal.form.tagsNoContent')}
            options={questLabels.map(item => ({ ...item, label: item.value }))}
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default AddSeasonalQuestModal;
