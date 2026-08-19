import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useExerciseValidationSchema } from './schema';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import ControlledEquipmentPicker from '@/components/views/workouts/reusable/equipment-picker';
import ControlledMetricTypePicker from '@/components/views/workouts/reusable/metric-type-picker';
import { ControlledMuscleGroupPicker } from '@/components/views/workouts/reusable/muscle-group-picker';
import { EquipmentEnum, ExerciseMetricEnum, IExercise, MuscleGroupEnum } from '@/contract/workouts/workouts.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateExerciseMutation, useUpdateExerciseMutation } from '@/redux/api/workouts/exercises-api';
import { IApiError } from '@/types/global-types';

interface ExerciseFormModalProps extends IBaseModalProps {
  exercise: IExercise | null;
  duplicateFrom?: IExercise | null;
}

interface ExerciseFormValues {
  name: string;
  metricType: ExerciseMetricEnum;
  muscleGroup: MuscleGroupEnum | null;
  equipment: EquipmentEnum | null;
  note: string | null;
}

const DEFAULT_VALUES: ExerciseFormValues = {
  name: '',
  metricType: ExerciseMetricEnum.Reps,
  muscleGroup: MuscleGroupEnum.Other,
  equipment: EquipmentEnum.None,
  note: null,
};

const ExerciseFormModal: React.FC<ExerciseFormModalProps> = ({ isVisible, onClose, exercise, duplicateFrom }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createExercise, { isLoading: isCreating }] = useCreateExerciseMutation();
  const [updateExercise, { isLoading: isUpdating }] = useUpdateExerciseMutation();
  const validationSchema = useExerciseValidationSchema();

  const methods = useForm<ExerciseFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const { handleSubmit, reset: resetForm } = methods;

  useEffect(() => {
    if (!isVisible) return;

    if (exercise) {
      resetForm({
        name: exercise.name,
        metricType: exercise.metricType,
        muscleGroup: exercise.muscleGroup,
        equipment: exercise.equipment,
        note: exercise.note,
      });
    } else if (duplicateFrom) {
      resetForm({
        name: `${duplicateFrom.name}${t('workouts.exercises.duplicateSuffix')}`,
        metricType: duplicateFrom.metricType,
        muscleGroup: duplicateFrom.muscleGroup,
        equipment: duplicateFrom.equipment,
        note: duplicateFrom.note,
      });
    } else {
      resetForm(DEFAULT_VALUES);
    }
  }, [isVisible, exercise, duplicateFrom, resetForm, t]);

  const onSubmit = async (values: ExerciseFormValues) => {
    const payload = {
      name: values.name.trim(),
      metricType: values.metricType,
      muscleGroup: values.muscleGroup ?? undefined,
      equipment: values.equipment ?? undefined,
      note: values.note?.trim() || null,
    };

    try {
      if (exercise) {
        await updateExercise({ id: exercise.id, data: payload }).unwrap();
        showSnackbar({ text: t('workouts.exercises.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      } else {
        await createExercise(payload).unwrap();
        showSnackbar({ text: t('workouts.exercises.createdSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      }
      onClose();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({
        text: error.data?.message || t(exercise ? 'workouts.exercises.updatedError' : 'workouts.exercises.createdError'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isCreating || isUpdating}
      loadingMessage={exercise ? t('workouts.exercises.updating') : t('workouts.exercises.creating')}
      testID="exercise-form-modal"
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={onClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex-row items-center gap-1 rounded-lg px-4 py-2 bg-primary"
            testID="btn-save-exercise"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text className="text-lg font-bold text-gray-800 text-center mb-4">
        {exercise ? t('workouts.exercises.editTitle') : t('workouts.exercises.addTitle')}
      </Text>

      <FormProvider {...methods}>
        <View className="gap-5">
          <ControlledInput
            name="name"
            label={t('workouts.exercises.nameLabel')}
            placeholder={t('workouts.exercises.namePlaceholder')}
            isRequired
            testID="exercise-name-input"
          />
          <ControlledMetricTypePicker />
          <ControlledMuscleGroupPicker />
          <ControlledEquipmentPicker />
          <ControlledTextArea
            name="note"
            label={t('workouts.exercises.noteLabel')}
            placeholder={t('workouts.exercises.notePlaceholder')}
            testID="exercise-note-input"
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default ExerciseFormModal;
