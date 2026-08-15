import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IExercise } from '@/contract/workouts/workouts.contract';

interface ExerciseItemProps {
  exercise: IExercise;
  onEdit: (exercise: IExercise) => void;
  onDelete: (exercise: IExercise) => void;
  onToggleArchived: (exercise: IExercise) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onEdit, onDelete, onToggleArchived }) => {
  const { t } = useTranslation();
  const canEdit = !exercise.isSystem;

  return (
    <View
      testID="exercise-item-container"
      className={`flex-row items-center justify-between p-4 border-b border-gray-100 ${exercise.isArchived ? 'opacity-50' : ''}`}
    >
      <TouchableOpacity className="flex-1 pr-3" onPress={() => canEdit && onEdit(exercise)} disabled={!canEdit}>
        <Text className="text-base font-semibold text-gray-800">{exercise.name}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">
          {t(`workouts.enums.muscleGroup.${exercise.muscleGroup}`)} · {t(`workouts.enums.metricType.${exercise.metricType}`)}
        </Text>
      </TouchableOpacity>

      {exercise.isSystem ? (
        <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" />
      ) : (
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => onToggleArchived(exercise)} accessibilityLabel={t('workouts.exercises.toggleArchived')}>
            <Ionicons name={exercise.isArchived ? 'archive' : 'archive-outline'} size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(exercise)} accessibilityLabel={t('common.delete')}>
            <Ionicons name="trash-outline" size={20} color="#e53e3e" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ExerciseItem;
