import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SwipeableRow from '@/components/shared/swipeable-row/swipeable-row';
import { IWorkoutRoutine, MuscleGroupEnum } from '@/contract/workouts/workouts.contract';
import { getMuscleGroupVisual } from '@/utils/workouts/muscle-group-visuals';

interface RoutineItemProps {
  routine: IWorkoutRoutine;
  onEdit: (routine: IWorkoutRoutine) => void;
  onDelete: (routine: IWorkoutRoutine) => void;
  onToggleArchived: (routine: IWorkoutRoutine) => void;
}

const MAX_MUSCLE_DOTS = 4;

const RoutineItem: React.FC<RoutineItemProps> = ({ routine, onEdit, onDelete, onToggleArchived }) => {
  const { t } = useTranslation();

  const muscleGroupVisuals = useMemo(() => {
    const seen = new Set<MuscleGroupEnum>();
    return routine.exercises.reduce<{ key: MuscleGroupEnum; emoji: string; color: string }[]>((visuals, exercise) => {
      if (!seen.has(exercise.muscleGroup)) {
        seen.add(exercise.muscleGroup);
        visuals.push({ key: exercise.muscleGroup, ...getMuscleGroupVisual(exercise.muscleGroup) });
      }
      return visuals;
    }, []);
  }, [routine.exercises]);

  const visibleDots = muscleGroupVisuals.slice(0, MAX_MUSCLE_DOTS);
  const extraCount = muscleGroupVisuals.length - visibleDots.length;

  return (
    <SwipeableRow onDelete={() => onDelete(routine)}>
      <View testID="routine-item-container" className={`flex-row items-center px-4 py-3 bg-white ${routine.isArchived ? 'opacity-50' : ''}`}>
        <TouchableOpacity className="flex-1 pr-3" onPress={() => onEdit(routine)} activeOpacity={0.7}>
          <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
            {routine.name}
          </Text>
          <View className="flex-row items-center gap-1 mt-1.5 flex-wrap">
            {visibleDots.map(visual => (
              <View key={visual.key} className="w-5 h-5 rounded-full items-center justify-center" style={{ backgroundColor: `${visual.color}20` }}>
                <Text className="text-[10px]">{visual.emoji}</Text>
              </View>
            ))}
            {extraCount > 0 && (
              <View className="w-5 h-5 rounded-full items-center justify-center bg-gray-100">
                <Text className="text-[9px] font-bold text-gray-500">{t('workouts.routines.moreExercises', { count: extraCount })}</Text>
              </View>
            )}
            <Text className="text-xs text-gray-400 ml-1">{t('workouts.routines.exerciseCount', { count: routine.exercises.length })}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onToggleArchived(routine)}
          accessibilityLabel={t('workouts.routines.toggleArchived')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={routine.isArchived ? 'archive' : 'archive-outline'} size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </SwipeableRow>
  );
};

export default RoutineItem;
