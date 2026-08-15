import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { ExerciseMetricEnum } from '@/contract/workouts/workouts.contract';

interface MetricTypePickerProps {
  name?: string;
}

const ControlledMetricTypePicker: React.FC<MetricTypePickerProps> = ({ name = 'metricType' }) => {
  const { t } = useTranslation();

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{t('workouts.reusable.metricTypeLabel')}</Text>
      <ControlledSelect
        name={name}
        placeholder={t('workouts.reusable.metricTypePlaceholder')}
        isModalVersion={true}
        testID="metric-type-select"
        options={[
          { label: t('workouts.enums.metricType.Reps'), value: ExerciseMetricEnum.Reps },
          { label: t('workouts.enums.metricType.RepsAndWeight'), value: ExerciseMetricEnum.RepsAndWeight },
          { label: t('workouts.enums.metricType.Time'), value: ExerciseMetricEnum.Time },
          { label: t('workouts.enums.metricType.Distance'), value: ExerciseMetricEnum.Distance },
          { label: t('workouts.enums.metricType.DistanceAndTime'), value: ExerciseMetricEnum.DistanceAndTime },
        ]}
      />
    </View>
  );
};

export default ControlledMetricTypePicker;
