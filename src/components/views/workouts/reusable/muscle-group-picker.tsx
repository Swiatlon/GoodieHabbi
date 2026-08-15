import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import ControlledSelect from '@/components/shared/select/controlled-select';
import Select, { SelectItem } from '@/components/shared/select/select';
import { MuscleGroupEnum } from '@/contract/workouts/workouts.contract';

export const useMuscleGroupOptions = (): SelectItem[] => {
  const { t } = useTranslation();

  return Object.values(MuscleGroupEnum).map(value => ({ label: t(`workouts.enums.muscleGroup.${value}`), value }));
};

interface MuscleGroupPickerProps {
  name?: string;
}

export const ControlledMuscleGroupPicker: React.FC<MuscleGroupPickerProps> = ({ name = 'muscleGroup' }) => {
  const { t } = useTranslation();
  const options = useMuscleGroupOptions();

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{t('workouts.reusable.muscleGroupLabel')}</Text>
      <ControlledSelect name={name} placeholder={t('workouts.reusable.muscleGroupPlaceholder')} isModalVersion={true} options={options} clearAsNull />
    </View>
  );
};

interface MuscleGroupFilterProps {
  value: MuscleGroupEnum | null;
  onChange: (value: MuscleGroupEnum | null) => void;
}

export const MuscleGroupFilter: React.FC<MuscleGroupFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const options = useMuscleGroupOptions();

  return (
    <Select
      placeholder={t('workouts.reusable.muscleGroupFilterPlaceholder')}
      value={value}
      onChange={v => onChange(v as MuscleGroupEnum)}
      onClear={() => onChange(null)}
      isModalVersion={true}
      options={options}
    />
  );
};
