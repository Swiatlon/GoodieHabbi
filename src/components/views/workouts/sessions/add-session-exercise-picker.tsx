import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@/components/shared/select/select';
import { IWorkoutSession } from '@/contract/workouts/workouts.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetExercisesQuery } from '@/redux/api/workouts/exercises-api';
import { useAddSessionExerciseMutation } from '@/redux/api/workouts/sessions-api';
import { IApiError } from '@/types/global-types';

interface AddSessionExercisePickerProps {
  session: IWorkoutSession;
}

const AddSessionExercisePicker: React.FC<AddSessionExercisePickerProps> = ({ session }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { data: exercises = [] } = useGetExercisesQuery();
  const [addSessionExercise] = useAddSessionExerciseMutation();

  const availableExercises = exercises.filter(exercise => !exercise.isArchived && !session.exercises.some(entry => entry.exerciseId === exercise.id));

  const handleSelect = async (exerciseId: number) => {
    try {
      await addSessionExercise({ sessionId: session.id, exercise: { exerciseId } }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.sessions.addExerciseError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  if (availableExercises.length === 0) return null;

  return (
    <Select
      placeholder={t('workouts.sessions.addExercisePlaceholder')}
      value={null}
      onChange={async value => value != null && handleSelect(Number(value))}
      isModalVersion={true}
      options={availableExercises.map(exercise => ({ label: exercise.name, value: exercise.id }))}
      testID="add-session-exercise-select"
    />
  );
};

export default AddSessionExercisePicker;
