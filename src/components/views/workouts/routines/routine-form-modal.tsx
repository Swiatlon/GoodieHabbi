import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import RoutineExerciseRow, { RoutineExerciseDraft } from './routine-exercise-row';
import { useRoutineValidationSchema } from './schema';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import Select from '@/components/shared/select/select';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import { IRoutineExerciseInput, IWorkoutRoutine } from '@/contract/workouts/workouts.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetExercisesQuery } from '@/redux/api/workouts/exercises-api';
import { useCreateRoutineMutation, useUpdateRoutineMutation } from '@/redux/api/workouts/routines-api';
import { useGetWorkoutSettingsQuery } from '@/redux/api/workouts/settings-api';
import { IApiError } from '@/types/global-types';

interface RoutineFormModalProps extends IBaseModalProps {
  routine: IWorkoutRoutine | null;
}

interface RoutineFormValues {
  name: string;
  description: string | null;
}

const routineToDrafts = (routine: IWorkoutRoutine | null): RoutineExerciseDraft[] =>
  routine
    ? [...routine.exercises]
        .sort((a, b) => a.order - b.order)
        .map(exercise => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          metricType: exercise.metricType,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          targetWeight: exercise.targetWeight,
          targetDurationSeconds: exercise.targetDurationSeconds,
          targetDistance: exercise.targetDistance,
          restSeconds: exercise.restSeconds,
          note: exercise.note,
        }))
    : [];

const RoutineFormModal: React.FC<RoutineFormModalProps> = ({ isVisible, onClose, routine }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createRoutine, { isLoading: isCreating }] = useCreateRoutineMutation();
  const [updateRoutine, { isLoading: isUpdating }] = useUpdateRoutineMutation();
  const { data: exercises = [] } = useGetExercisesQuery();
  const { data: settings } = useGetWorkoutSettingsQuery();
  const weightUnit = settings?.weightUnit ?? 'kg';
  const validationSchema = useRoutineValidationSchema();

  const [drafts, setDrafts] = useState<RoutineExerciseDraft[]>([]);

  const methods = useForm<RoutineFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: '', description: null },
  });
  const { handleSubmit, reset: resetForm } = methods;

  useEffect(() => {
    if (!isVisible) return;

    resetForm(routine ? { name: routine.name, description: routine.description } : { name: '', description: null });
    setDrafts(routineToDrafts(routine));
  }, [isVisible, routine, resetForm]);

  const availableExercises = exercises.filter(exercise => !exercise.isArchived && !drafts.some(d => d.exerciseId === exercise.id));

  const addExercise = (exerciseId: number) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    setDrafts(prev => [
      ...prev,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        metricType: exercise.metricType,
        targetSets: null,
        targetReps: null,
        targetWeight: null,
        targetDurationSeconds: null,
        targetDistance: null,
        restSeconds: null,
        note: null,
      },
    ]);
  };

  const moveDraft = (index: number, direction: -1 | 1) => {
    setDrafts(prev => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeDraft = (index: number) => setDrafts(prev => prev.filter((_, i) => i !== index));

  const onSubmit = async (values: RoutineFormValues) => {
    const exercisesPayload: IRoutineExerciseInput[] = drafts.map(draft => ({
      exerciseId: draft.exerciseId,
      targetSets: draft.targetSets,
      targetReps: draft.targetReps,
      targetWeight: draft.targetWeight,
      targetDurationSeconds: draft.targetDurationSeconds,
      targetDistance: draft.targetDistance,
      restSeconds: draft.restSeconds,
      note: draft.note,
    }));

    const payload = { name: values.name.trim(), description: values.description?.trim() || null, exercises: exercisesPayload };

    try {
      if (routine) {
        await updateRoutine({ id: routine.id, data: payload }).unwrap();
        showSnackbar({ text: t('workouts.routines.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      } else {
        await createRoutine(payload).unwrap();
        showSnackbar({ text: t('workouts.routines.createdSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      }
      onClose();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({
        text: error.data?.message || t(routine ? 'workouts.routines.updatedError' : 'workouts.routines.createdError'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isCreating || isUpdating}
      loadingMessage={routine ? t('workouts.routines.updating') : t('workouts.routines.creating')}
      testID="routine-form-modal"
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={onClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex-row items-center gap-1 rounded-lg px-4 py-2 bg-primary"
            testID="btn-save-routine"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text className="text-lg font-bold text-gray-800 text-center mb-4">
        {routine ? t('workouts.routines.editTitle') : t('workouts.routines.addTitle')}
      </Text>

      <FormProvider {...methods}>
        <View className="gap-5">
          <ControlledInput
            name="name"
            label={t('workouts.routines.nameLabel')}
            placeholder={t('workouts.routines.namePlaceholder')}
            isRequired
            testID="routine-name-input"
          />
          <ControlledTextArea
            name="description"
            label={t('workouts.routines.descriptionLabel')}
            placeholder={t('workouts.routines.descriptionPlaceholder')}
            testID="routine-description-input"
          />

          <View className="gap-2">
            <Text className="text-sm font-semibold text-gray-500">{t('workouts.routines.exercisesLabel')}</Text>
            {drafts.map((draft, index) => (
              <RoutineExerciseRow
                key={draft.exerciseId}
                draft={draft}
                index={index}
                count={drafts.length}
                weightUnit={weightUnit}
                onChange={updated => setDrafts(prev => prev.map((d, i) => (i === index ? updated : d)))}
                onMoveUp={() => moveDraft(index, -1)}
                onMoveDown={() => moveDraft(index, 1)}
                onRemove={() => removeDraft(index)}
              />
            ))}

            {availableExercises.length > 0 && (
              <Select
                placeholder={t('workouts.routines.addExercisePlaceholder')}
                value={null}
                onChange={value => value != null && addExercise(Number(value))}
                isModalVersion={true}
                options={availableExercises.map(exercise => ({ label: exercise.name, value: exercise.id }))}
              />
            )}
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default RoutineFormModal;
