import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { PriorityEnum, PriorityEnumType } from '@/contract/quest';
interface ControlledPriorityPickerProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

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

const ControlledPriorityPicker: React.FC<ControlledPriorityPickerProps> = ({ name, label }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="flex gap-2">
          {label && <Text className="text-sm font-semibold text-gray-500">{label}</Text>}
          <View className="rounded-lg border border-gray-300">
            <RNPickerSelect
              onValueChange={onChange}
              items={[
                { label: 'High', value: PriorityEnum.HIGH },
                { label: 'Medium', value: PriorityEnum.MEDIUM },
                { label: 'Low', value: PriorityEnum.LOW },
              ]}
              value={value as string}
              placeholder={{
                label: 'Select Priority',
                value: '',
                color: '#6b7280',
              }}
              style={{
                inputIOS: {
                  marginLeft: 0,
                  color: getPriorityStyle(value),
                },
                inputAndroid: {
                  marginLeft: 0,
                  color: getPriorityStyle(value),
                },
              }}
            />
          </View>
          {error && <Text className="text-xs text-red-500">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default ControlledPriorityPicker;
