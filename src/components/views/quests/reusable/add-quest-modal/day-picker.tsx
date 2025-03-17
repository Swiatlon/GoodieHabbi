import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { View, Text } from 'react-native';
import DayPickerModal from './day-picker-modal';
import ControlledSelect from '@/components/shared/select/controlled-select';

interface DayPickerProps {
  label: string;
  name: string;
  min?: number;
  max?: number;
}

const DayPicker: React.FC<DayPickerProps> = ({ label, name, min, max }) => {
  const { setValue, watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const selectedDay = watch(name) as number;

  const handleConfirm = (day: number) => {
    setValue(name, day);
    setIsOpen(false);
  };

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{label}</Text>
      <ControlledSelect name={name} placeholder={`Select ${label} Day`} clearAsNull onPress={() => setIsOpen(true)} />
      <DayPickerModal
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        selectedDay={selectedDay}
        label={`Select ${label} Day:`}
        min={min}
        max={max}
      />
    </View>
  );
};
export default DayPicker;
