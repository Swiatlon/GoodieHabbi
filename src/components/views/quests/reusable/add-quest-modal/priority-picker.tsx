import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { PriorityEnum, PriorityEnumType } from '@/contract/quests/base-quests';

const getPriorityStyle = (priority: PriorityEnumType | null) => {
  switch (priority) {
    case PriorityEnum.HIGH:
      return '#f56565';
    case PriorityEnum.MEDIUM:
      return '#eab308';
    case PriorityEnum.LOW:
      return '#22c55e';
    default:
      return '#6b7280';
  }
};

const ControlledPriorityPicker: React.FC = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const selectedPriority = watch('priority') as PriorityEnumType | null;

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{t('quests.reusable.form.priorityLabel')}</Text>
      <ControlledSelect
        name="priority"
        placeholder={t('quests.reusable.form.priorityPlaceholder')}
        clearAsNull
        options={[
          { label: t('quests.reusable.form.priorities.high'), value: PriorityEnum.HIGH },
          { label: t('quests.reusable.form.priorities.medium'), value: PriorityEnum.MEDIUM },
          { label: t('quests.reusable.form.priorities.low'), value: PriorityEnum.LOW },
        ]}
        isModalVersion={true}
        className={`px-2`}
        textColor={getPriorityStyle(selectedPriority)}
      />
    </View>
  );
};

export default ControlledPriorityPicker;
