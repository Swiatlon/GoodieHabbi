import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseMetricEnum, IWorkoutSet, WorkoutSetTypeEnum } from '@/contract/workouts/workouts.contract';
import { getRequiredFields } from '@/utils/workouts/metric';
import { formatOneRepMax } from '@/utils/workouts/one-rep-max';

interface SessionSetRowProps {
  set: IWorkoutSet;
  metricType: ExerciseMetricEnum;
  weightUnit: string;
  onDelete: () => void;
}

const SessionSetRow: React.FC<SessionSetRowProps> = ({ set, metricType, weightUnit, onDelete }) => {
  const { t } = useTranslation();
  const fields = getRequiredFields(metricType);

  const parts: string[] = [];
  if (fields.includes('reps') && set.reps != null) parts.push(`${set.reps} ${t('workouts.sessions.setFields.reps')}`);
  if (fields.includes('weight') && set.weight != null) parts.push(`${set.weight} ${weightUnit}`);
  if (fields.includes('durationSeconds') && set.durationSeconds != null) parts.push(`${set.durationSeconds}s`);
  if (fields.includes('distance') && set.distance != null) parts.push(`${set.distance}`);

  const oneRepMax = formatOneRepMax(set.estimatedOneRepMax, weightUnit);

  return (
    <View className="flex-row items-center justify-between py-2 border-b border-gray-100" testID="session-set-row">
      <View className="flex-row items-center gap-2 flex-1">
        <Text className="w-6 text-xs font-bold text-gray-400">#{set.setNumber}</Text>
        <Text className="text-sm text-gray-700 flex-1">{parts.join(' · ')}</Text>
        {set.setType === WorkoutSetTypeEnum.Warmup && (
          <Text className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{t('workouts.enums.setType.Warmup')}</Text>
        )}
        {oneRepMax && <Text className="text-xs text-gray-400">1RM ≈ {oneRepMax}</Text>}
      </View>
      <TouchableOpacity onPress={onDelete} accessibilityLabel={t('common.delete')} testID="btn-delete-set">
        <Ionicons name="close-circle-outline" size={20} color="#e53e3e" />
      </TouchableOpacity>
    </View>
  );
};

export default SessionSetRow;
