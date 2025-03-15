import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View, Text } from 'react-native';
import Button from '@/components/shared/button/button';
import { WeekdayEnum, WeekdayEnumType } from '@/contract/quests/base-quests';

const DAYS_OF_WEEK = [
  { label: 'Mon', value: WeekdayEnum.MONDAY },
  { label: 'Tues', value: WeekdayEnum.TUESDAY },
  { label: 'Wed', value: WeekdayEnum.WEDNESDAY },
  { label: 'Thu', value: WeekdayEnum.THURSDAY },
  { label: 'Fri', value: WeekdayEnum.FRIDAY },
  { label: 'Sat', value: WeekdayEnum.SATURDAY },
  { label: 'Sun', value: WeekdayEnum.SUNDAY },
];

const WeeklyPicker: React.FC = () => {
  const { control } = useFormContext();

  const toggleSelection = (selectedDays: string[], day: string) => {
    return selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day];
  };

  return (
    <Controller
      name="weekdays"
      control={control}
      render={({ field: { value = [], onChange }, fieldState: { error } }) => {
        const selectedDays = value as WeekdayEnumType[];

        return (
          <View className="flex gap-2">
            <Text className="text-sm font-semibold text-gray-500">
              Days:<Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {DAYS_OF_WEEK.map(({ label, value: dayValue }) => (
                <Button
                  key={dayValue}
                  label={label}
                  onPress={() => onChange(toggleSelection(selectedDays, dayValue))}
                  styleType={selectedDays.includes(dayValue) ? 'primary' : 'secondary'}
                  className="px-3 py-2 rounded-lg"
                />
              ))}
            </View>
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

export default WeeklyPicker;
