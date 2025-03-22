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
  isRequired?: boolean;
  placeholder: string;
}

const DayPicker: React.FC<DayPickerProps> = ({ label, name, min, max, isRequired, placeholder }) => {
  const { setValue, watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const selectedDay = watch(name) as number;

  const handleConfirm = (day: number) => {
    setValue(name, day);
    setIsOpen(false);
  };

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">
        {label}
        {isRequired && <Text className="text-red-500">*</Text>}
      </Text>
      <ControlledSelect name={name} placeholder={placeholder} clearAsNull onPress={() => setIsOpen(true)} />
      <DayPickerModal
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        selectedDay={selectedDay}
        label={placeholder}
        min={min}
        max={max}
      />
    </View>
  );
};
export default DayPicker;
