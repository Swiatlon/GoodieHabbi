import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IWorkoutRoutine } from '@/contract/workouts/workouts.contract';

interface RoutineItemProps {
  routine: IWorkoutRoutine;
  onEdit: (routine: IWorkoutRoutine) => void;
  onDelete: (routine: IWorkoutRoutine) => void;
  onToggleArchived: (routine: IWorkoutRoutine) => void;
}

const RoutineItem: React.FC<RoutineItemProps> = ({ routine, onEdit, onDelete, onToggleArchived }) => {
  const { t } = useTranslation();

  return (
    <View
      testID="routine-item-container"
      className={`flex-row items-center justify-between p-4 border-b border-gray-100 ${routine.isArchived ? 'opacity-50' : ''}`}
    >
      <TouchableOpacity className="flex-1 pr-3" onPress={() => onEdit(routine)}>
        <Text className="text-base font-semibold text-gray-800">{routine.name}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">{t('workouts.routines.exerciseCount', { count: routine.exercises.length })}</Text>
      </TouchableOpacity>

      <View className="flex-row gap-3">
        <TouchableOpacity onPress={() => onToggleArchived(routine)} accessibilityLabel={t('workouts.routines.toggleArchived')}>
          <Ionicons name={routine.isArchived ? 'archive' : 'archive-outline'} size={20} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(routine)} accessibilityLabel={t('common.delete')}>
          <Ionicons name="trash-outline" size={20} color="#e53e3e" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoutineItem;
