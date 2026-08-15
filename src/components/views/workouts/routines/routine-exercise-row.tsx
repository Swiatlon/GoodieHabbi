import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MetricInputGroup from '@/components/views/workouts/reusable/metric-input-group';
import { ExerciseMetricEnum, IRoutineExerciseInput } from '@/contract/workouts/workouts.contract';

export interface RoutineExerciseDraft extends IRoutineExerciseInput {
  exerciseName: string;
  metricType: ExerciseMetricEnum;
}

interface RoutineExerciseRowProps {
  draft: RoutineExerciseDraft;
  index: number;
  count: number;
  weightUnit: string;
  onChange: (draft: RoutineExerciseDraft) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

const parseIntOrNull = (text: string): number | null => {
  if (text.trim() === '') return null;
  const parsed = parseInt(text, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const RoutineExerciseRow: React.FC<RoutineExerciseRowProps> = ({ draft, index, count, weightUnit, onChange, onMoveUp, onMoveDown, onRemove }) => {
  const { t } = useTranslation();

  const targetFieldMap = {
    reps: 'targetReps',
    weight: 'targetWeight',
    durationSeconds: 'targetDurationSeconds',
    distance: 'targetDistance',
  } as const;

  return (
    <View className="border border-gray-200 rounded-xl p-3 gap-3" testID="routine-exercise-row">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-gray-800 flex-1">{draft.exerciseName}</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={onMoveUp} disabled={index === 0}>
            <Ionicons name="chevron-up" size={20} color={index === 0 ? '#d1d5db' : '#1987EE'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onMoveDown} disabled={index === count - 1}>
            <Ionicons name="chevron-down" size={20} color={index === count - 1 ? '#d1d5db' : '#1987EE'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="trash-outline" size={20} color="#e53e3e" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-xs font-semibold text-gray-500">{t('workouts.routines.targetSetsLabel')}</Text>
          <TextInput
            keyboardType="numeric"
            value={draft.targetSets != null ? String(draft.targetSets) : ''}
            onChangeText={text => onChange({ ...draft, targetSets: parseIntOrNull(text) })}
            placeholder="0"
            className="border border-gray-300 rounded-lg px-2 py-2 text-black"
          />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-xs font-semibold text-gray-500">{t('workouts.routines.restSecondsLabel')}</Text>
          <TextInput
            keyboardType="numeric"
            value={draft.restSeconds != null ? String(draft.restSeconds) : ''}
            onChangeText={text => onChange({ ...draft, restSeconds: parseIntOrNull(text) })}
            placeholder="0"
            className="border border-gray-300 rounded-lg px-2 py-2 text-black"
          />
        </View>
      </View>

      <MetricInputGroup
        metricType={draft.metricType}
        weightUnit={weightUnit}
        optional
        values={{
          reps: draft.targetReps,
          weight: draft.targetWeight,
          durationSeconds: draft.targetDurationSeconds,
          distance: draft.targetDistance,
        }}
        onChangeField={(field, value) => onChange({ ...draft, [targetFieldMap[field]]: value })}
      />
    </View>
  );
};

export default RoutineExerciseRow;
