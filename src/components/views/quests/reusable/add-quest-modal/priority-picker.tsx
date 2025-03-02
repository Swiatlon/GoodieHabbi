import React from 'react';
import { useFormContext } from 'react-hook-form';
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
  const { watch } = useFormContext();
  const selectedPriority = watch('priority') as PriorityEnumType | null;

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">Priority:</Text>
      <ControlledSelect
        name="priority"
        placeholder="Select Priority"
        options={[
          { label: 'High', value: PriorityEnum.HIGH },
          { label: 'Medium', value: PriorityEnum.MEDIUM },
          { label: 'Low', value: PriorityEnum.LOW },
        ]}
        isModalVersion={true}
        className={`px-2`}
        textColor={getPriorityStyle(selectedPriority)}
      />
    </View>
  );
};

export default ControlledPriorityPicker;
