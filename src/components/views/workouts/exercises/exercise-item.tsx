import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SwipeableRow from '@/components/shared/swipeable-row/swipeable-row';
import { IExercise } from '@/contract/workouts/workouts.contract';
import { getMuscleGroupVisual } from '@/utils/workouts/muscle-group-visuals';

interface ExerciseItemProps {
  exercise: IExercise;
  onEdit: (exercise: IExercise) => void;
  onDelete: (exercise: IExercise) => void;
  onToggleArchived: (exercise: IExercise) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onEdit, onDelete, onToggleArchived }) => {
  const { t } = useTranslation();
  const canEdit = !exercise.isSystem;
  const visual = getMuscleGroupVisual(exercise.muscleGroup);

  const row = (
    <View testID="exercise-item-container" className={`flex-row items-center px-4 py-3 bg-white ${exercise.isArchived ? 'opacity-50' : ''}`}>
      <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: `${visual.color}20` }}>
        <Text className="text-lg">{visual.emoji}</Text>
      </View>

      <TouchableOpacity className="flex-1 pr-3" onPress={() => canEdit && onEdit(exercise)} disabled={!canEdit} activeOpacity={0.7}>
        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
          {exercise.name}
        </Text>
        <Text className="text-xs text-gray-500 mt-0.5">
          {t(`workouts.enums.metricType.${exercise.metricType}`)} · {t(`workouts.enums.equipment.${exercise.equipment}`)}
        </Text>
      </TouchableOpacity>

      {exercise.isSystem ? (
        <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" />
      ) : (
        <TouchableOpacity
          onPress={() => onToggleArchived(exercise)}
          accessibilityLabel={t('workouts.exercises.toggleArchived')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={exercise.isArchived ? 'archive' : 'archive-outline'} size={18} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (!canEdit) {
    return row;
  }

  return <SwipeableRow onDelete={() => onDelete(exercise)}>{row}</SwipeableRow>;
};

export default ExerciseItem;
