import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { EquipmentEnum } from '@/contract/workouts/workouts.contract';

interface EquipmentPickerProps {
  name?: string;
}

const ControlledEquipmentPicker: React.FC<EquipmentPickerProps> = ({ name = 'equipment' }) => {
  const { t } = useTranslation();
  const options = Object.values(EquipmentEnum).map(value => ({ label: t(`workouts.enums.equipment.${value}`), value }));

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{t('workouts.reusable.equipmentLabel')}</Text>
      <ControlledSelect name={name} placeholder={t('workouts.reusable.equipmentPlaceholder')} isModalVersion={true} options={options} clearAsNull />
    </View>
  );
};

export default ControlledEquipmentPicker;
