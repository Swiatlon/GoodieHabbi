import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';
import { ExerciseMetricEnum } from '@/contract/workouts/workouts.contract';
import { MetricField, getRequiredFields } from '@/utils/workouts/metric';

export type MetricValues = Partial<Record<MetricField, number | null>>;

interface MetricInputGroupProps {
  metricType: ExerciseMetricEnum;
  values: MetricValues;
  onChangeField: (field: MetricField, value: number | null) => void;
  weightUnit: string;
  optional?: boolean;
}

const parseNumeric = (text: string): number | null => {
  if (text.trim() === '') return null;
  const parsed = Number(text.replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
};

const MetricInputGroup: React.FC<MetricInputGroupProps> = ({ metricType, values, onChangeField, weightUnit, optional }) => {
  const { t } = useTranslation();
  const fields = getRequiredFields(metricType);

  const fieldLabel = (field: MetricField) => {
    switch (field) {
      case 'reps':
        return t('workouts.reusable.metricFields.reps');
      case 'weight':
        return `${t('workouts.reusable.metricFields.weight')} (${weightUnit})`;
      case 'durationSeconds':
        return t('workouts.reusable.metricFields.durationSeconds');
      case 'distance':
        return t('workouts.reusable.metricFields.distance');
    }
  };

  return (
    <View className="flex-row gap-3">
      {fields.map(field => (
        <View key={field} className="flex-1 gap-1">
          <Text className="text-xs font-semibold text-gray-500">
            {fieldLabel(field)}
            {!optional && <Text className="text-red-500"> *</Text>}
          </Text>
          <TextInput
            keyboardType="numeric"
            value={values[field] != null ? String(values[field]) : ''}
            onChangeText={text => onChangeField(field, parseNumeric(text))}
            placeholder="0"
            className="border border-gray-300 rounded-lg px-2 py-2 text-black"
            testID={`metric-input-${field}`}
          />
        </View>
      ))}
    </View>
  );
};

export default MetricInputGroup;
