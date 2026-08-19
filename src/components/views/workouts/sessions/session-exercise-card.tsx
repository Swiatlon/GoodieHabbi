import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SessionAddSetRow from './session-add-set-row';
import SessionSetRow from './session-set-row';
import { MetricValues } from '@/components/views/workouts/reusable/metric-input-group';
import { ISessionSetInput, IWorkoutSessionExercise } from '@/contract/workouts/workouts.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useAddSessionSetMutation, useDeleteSessionExerciseMutation, useDeleteSessionSetMutation } from '@/redux/api/workouts/sessions-api';
import { IApiError } from '@/types/global-types';

interface SessionExerciseCardProps {
  sessionId: number;
  exercise: IWorkoutSessionExercise;
  weightUnit: string;
}

const SessionExerciseCard: React.FC<SessionExerciseCardProps> = ({ sessionId, exercise, weightUnit }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [addSessionSet, { isLoading: isAdding }] = useAddSessionSetMutation();
  const [deleteSessionSet] = useDeleteSessionSetMutation();
  const [deleteSessionExercise] = useDeleteSessionExerciseMutation();

  const handleAddSet = async (set: ISessionSetInput) => {
    try {
      await addSessionSet({ sessionId, entryId: exercise.id, set }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.sessions.addSetError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleDeleteSet = async (setId: number) => {
    try {
      await deleteSessionSet({ sessionId, entryId: exercise.id, setId }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.sessions.deleteSetError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleRemoveExercise = async () => {
    try {
      await deleteSessionExercise({ sessionId, entryId: exercise.id }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.sessions.removeExerciseError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const lastSet = exercise.sets.at(-1);
  const seedValues: MetricValues = lastSet
    ? { reps: lastSet.reps, weight: lastSet.weight, durationSeconds: lastSet.durationSeconds, distance: lastSet.distance }
    : {
        reps: exercise.targetReps,
        weight: exercise.targetWeight,
        durationSeconds: exercise.targetDurationSeconds,
        distance: exercise.targetDistance,
      };
  const seedRpe = lastSet?.rpe ?? null;

  return (
    <View className="border border-gray-200 rounded-xl p-3 gap-1" testID="session-exercise-card">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-gray-800">{exercise.exerciseName}</Text>
        <TouchableOpacity onPress={handleRemoveExercise} accessibilityLabel={t('workouts.sessions.removeExercise')}>
          <Ionicons name="trash-outline" size={18} color="#e53e3e" />
        </TouchableOpacity>
      </View>

      {exercise.sets.map(set => (
        <SessionSetRow
          key={set.id}
          set={set}
          metricType={exercise.metricType}
          weightUnit={weightUnit}
          onDelete={async () => handleDeleteSet(set.id)}
        />
      ))}

      <SessionAddSetRow
        metricType={exercise.metricType}
        weightUnit={weightUnit}
        isSubmitting={isAdding}
        seedValues={seedValues}
        seedRpe={seedRpe}
        seedKey={lastSet?.id ?? 'target'}
        onAdd={handleAddSet}
      />
    </View>
  );
};

export default SessionExerciseCard;
