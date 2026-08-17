import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExercisePickerModal from '@/components/views/workouts/reusable/exercise-picker-modal';
import { IExercise, IWorkoutSession } from '@/contract/workouts/workouts.contract';
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
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const availableExercises = exercises.filter(exercise => !exercise.isArchived && !session.exercises.some(entry => entry.exerciseId === exercise.id));

  const handleSelect = async (exercise: IExercise) => {
    try {
      await addSessionExercise({ sessionId: session.id, exercise: { exerciseId: exercise.id } }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.sessions.addExerciseError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  if (availableExercises.length === 0) return null;

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsPickerVisible(true)}
        className="flex-row items-center justify-center gap-1.5 py-3 rounded-lg border border-dashed border-primary"
        testID="add-session-exercise-select"
      >
        <Ionicons name="add-circle-outline" size={16} color="#1987EE" />
        <Text className="text-xs font-semibold text-primary">{t('workouts.sessions.addExercisePlaceholder')}</Text>
      </TouchableOpacity>

      <ExercisePickerModal
        isVisible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        exercises={availableExercises}
        onSelect={handleSelect}
        testID="session-exercise-picker"
      />
    </>
  );
};

export default AddSessionExercisePicker;
