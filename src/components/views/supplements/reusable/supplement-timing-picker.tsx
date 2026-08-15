import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { SupplementTimingEnum } from '@/contract/supplements/supplements.contract';

interface SupplementTimingPickerProps {
  name?: string;
}

const ControlledSupplementTimingPicker: React.FC<SupplementTimingPickerProps> = ({ name = 'timing' }) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const timing = watch(name) as SupplementTimingEnum | null;

  const options = Object.values(SupplementTimingEnum).map(value => ({ label: t(`supplements.enums.timing.${value}`), value }));

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{t('supplements.reusable.timingLabel')}</Text>
      <ControlledSelect name={name} placeholder={t('supplements.reusable.timingPlaceholder')} isModalVersion={true} options={options} />
      {timing === SupplementTimingEnum.Custom && <Text className="text-xs text-gray-400">{t('supplements.reusable.customTimingHint')}</Text>}
    </View>
  );
};

export default ControlledSupplementTimingPicker;
