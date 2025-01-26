import React from 'react';
import { View, Text } from 'react-native';
import Button from '@/components/shared/button/button';

interface WeeklyPickerProps {
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
}

const daysOfWeek = [
  { label: 'Mon', value: 'monday' },
  { label: 'Tues', value: 'tuesday' },
  { label: 'Wed', value: 'wednesday' },
  { label: 'Thu', value: 'thursday' },
  { label: 'Fri', value: 'friday' },
  { label: 'Sat', value: 'saturday' },
  { label: 'Sun', value: 'sunday' },
];

const WeeklyPicker: React.FC<WeeklyPickerProps> = ({ selectedDays, toggleDaySelection }) => {
  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">Select days:</Text>
      <View className="flex-row flex-wrap gap-2">
        {daysOfWeek.map(day => (
          <Button
            key={day.value}
            label={day.label}
            onPress={() => toggleDaySelection(day.value)}
            styleType={selectedDays.includes(day.value) ? 'primary' : 'secondary'}
            className={`px-3 py-2 rounded-lg`}
          />
        ))}
      </View>
    </View>
  );
};

export default WeeklyPicker;
