import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { SupplementUnitEnum } from '@/contract/supplements/supplements.contract';

interface SupplementUnitPickerProps {
  name?: string;
}

const ControlledSupplementUnitPicker: React.FC<SupplementUnitPickerProps> = ({ name = 'unit' }) => {
  const { t } = useTranslation();
  const options = Object.values(SupplementUnitEnum).map(value => ({ label: t(`supplements.enums.unit.${value}`), value }));

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{t('supplements.reusable.unitLabel')}</Text>
      <ControlledSelect name={name} placeholder={t('supplements.reusable.unitPlaceholder')} isModalVersion={true} options={options} />
    </View>
  );
};

export default ControlledSupplementUnitPicker;
