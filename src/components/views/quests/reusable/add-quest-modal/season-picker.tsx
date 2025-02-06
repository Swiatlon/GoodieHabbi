import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { SeasonEnum, SeasonEnumType } from '@/contract/quests/base-quests';

interface ControlledSeasonPickerProps {
  name: string;
  label?: string;
}

const getSeasonStyle = (season: SeasonEnumType | null) => {
  switch (season) {
    case SeasonEnum.WINTER:
      return '#00bcd4';
    case SeasonEnum.SPRING:
      return '#4caf50';
    case SeasonEnum.SUMMER:
      return '#ffeb3b';
    case SeasonEnum.AUTUMN:
      return '#ff9800';
    default:
      return '#6b7280';
  }
};

const ControlledSeasonPicker: React.FC<ControlledSeasonPickerProps> = ({ name, label }) => {
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
                { label: 'Winter', value: SeasonEnum.WINTER },
                { label: 'Spring', value: SeasonEnum.SPRING },
                { label: 'Summer', value: SeasonEnum.SUMMER },
                { label: 'Autumn', value: SeasonEnum.AUTUMN },
              ]}
              value={value as SeasonEnumType}
              placeholder={{
                label: 'Select Season:',
                value: '',
                color: '#6b7280',
              }}
              style={{
                inputIOS: {
                  marginLeft: 0,
                  color: getSeasonStyle(value),
                },
                inputAndroid: {
                  marginLeft: 0,
                  color: getSeasonStyle(value),
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

export default ControlledSeasonPicker;
