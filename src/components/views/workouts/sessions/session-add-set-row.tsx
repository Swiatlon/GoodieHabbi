import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MetricInputGroup, { MetricValues } from '@/components/views/workouts/reusable/metric-input-group';
import { ExerciseMetricEnum, ISessionSetInput, WorkoutSetTypeEnum } from '@/contract/workouts/workouts.contract';
import { getRequiredFields } from '@/utils/workouts/metric';

interface SessionAddSetRowProps {
  metricType: ExerciseMetricEnum;
  weightUnit: string;
  isSubmitting: boolean;
  seedValues: MetricValues;
  seedRpe: number | null;
  seedKey: number | string;
  onAdd: (set: ISessionSetInput) => void;
}

const SessionAddSetRow: React.FC<SessionAddSetRowProps> = ({ metricType, weightUnit, isSubmitting, seedValues, seedRpe, seedKey, onAdd }) => {
  const { t } = useTranslation();
  const [values, setValues] = useState<MetricValues>(seedValues);
  const [rpe, setRpe] = useState<string>(seedRpe != null ? String(seedRpe) : '');
  const [isWarmup, setIsWarmup] = useState(false);

  // Re-primes the inputs with the last logged set (or the routine's target) so the next set
  // is a one-tap repeat instead of retyping the same reps/weight every time.
  useEffect(() => {
    setValues(seedValues);
    setRpe(seedRpe != null ? String(seedRpe) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);

  const requiredFields = getRequiredFields(metricType);
  const canSubmit = requiredFields.every(field => values[field] != null) && !isSubmitting;

  const handleAdd = () => {
    if (!canSubmit) return;

    onAdd({
      reps: values.reps ?? null,
      weight: values.weight ?? null,
      durationSeconds: values.durationSeconds ?? null,
      distance: values.distance ?? null,
      rpe: rpe.trim() === '' ? null : Number(rpe),
      setType: isWarmup ? WorkoutSetTypeEnum.Warmup : WorkoutSetTypeEnum.Normal,
    });
    setIsWarmup(false);
  };

  return (
    <View className="gap-2 pt-2" testID="session-add-set-row">
      <View className="flex-row items-end gap-2">
        <View className="flex-1">
          <MetricInputGroup
            metricType={metricType}
            values={values}
            onChangeField={(field, value) => setValues(prev => ({ ...prev, [field]: value }))}
            weightUnit={weightUnit}
          />
        </View>
        <View className="w-14 gap-1">
          <Text className="text-xs font-semibold text-gray-500">RPE</Text>
          <TextInput
            keyboardType="numeric"
            value={rpe}
            onChangeText={setRpe}
            placeholder="-"
            className="border border-gray-300 rounded-lg px-2 py-2 text-black text-center"
          />
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={() => setIsWarmup(prev => !prev)} className="flex-row items-center gap-1">
          <Ionicons name={isWarmup ? 'checkbox' : 'square-outline'} size={18} color={isWarmup ? '#d97706' : '#9ca3af'} />
          <Text className="text-xs text-gray-500">{t('workouts.enums.setType.Warmup')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAdd}
          disabled={!canSubmit}
          className={`flex-row items-center gap-1 rounded-lg px-3 py-2 ${canSubmit ? 'bg-primary' : 'bg-gray-200'}`}
          testID="btn-add-set"
        >
          <Ionicons name="add-circle-outline" size={18} color={canSubmit ? 'white' : '#9ca3af'} />
          <Text className={`font-semibold text-sm ${canSubmit ? 'text-white' : 'text-gray-400'}`}>{t('workouts.sessions.addSet')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SessionAddSetRow;
