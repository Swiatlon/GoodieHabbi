import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { View, Text } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { NullableString } from '@/types/global-types';
import { toUTCISOString } from '@/utils/utils';

interface DatePickerModalProps {
  name: string;
  label: string;
  placeholder: string;
  minDate?: string;
  maxDate?: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ minDate, maxDate, label, name, placeholder }) => {
  const { setValue, watch } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);

  const handleOpen = () => setIsVisible(true);
  const handleClose = () => setIsVisible(false);

  const handleDateChange = (date: DateType) => {
    setValue(name, toUTCISOString(date));
  };

  const selectedDate = watch(name) as NullableString;

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{label}:</Text>
      <ControlledSelect name={name} placeholder={placeholder} onPress={handleOpen} isDate />

      <Modal isVisible={isVisible} onClose={handleClose}>
        <Text className="text-lg font-bold text-center mb-4">Select Date:</Text>
        <DateTimePicker
          mode="single"
          date={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          onChange={({ date }) => handleDateChange(date)}
        />
        <View className="flex-row justify-between">
          <Button label="Close" onPress={handleClose} className="bg-primary rounded-lg px-4 py-2" />
        </View>
      </Modal>
    </View>
  );
};

export default DatePickerModal;
