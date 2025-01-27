import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import moment from 'moment';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import Select from '@/components/shared/select/select';

interface DatePickerModalProps {
  onConfirm: (date: Date | null) => void;
  onClearInput?: () => void;
  selectedDate: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  label?: string;
  formVersion?: boolean;
  isDisabled?: boolean;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  onConfirm,
  onClearInput,
  selectedDate,
  minDate,
  maxDate,
  label,
  formVersion,
  isDisabled,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleOpen = () => setIsVisible(true);
  const handleClose = () => setIsVisible(false);

  const handleDateChange = (date: DateType) => {
    if (date) {
      const parsedDate = moment(date.toLocaleString()).toDate();
      onConfirm(parsedDate);
    } else {
      onConfirm(null);
    }
  };

  const handleClear = () => {
    onClearInput?.();
    onConfirm(null);
  };

  const momentDate = moment(selectedDate);

  return (
    <View className="flex gap-2">
      {formVersion && label && <Text className="text-sm font-semibold text-gray-500">{label}:</Text>}
      <Select
        placeholder="Select date"
        placeholderWhenSelected=" "
        value={momentDate.isValid() ? momentDate.format('DD.MM.YYYY') : null}
        onPress={handleOpen}
        onClear={handleClear}
        isEditable={false}
        isDisabled={isDisabled}
      />

      <Modal isVisible={isVisible} onClose={handleClose}>
        <Text className="text-lg font-bold text-center mb-4">Select Date:</Text>
        <DateTimePicker
          mode="single"
          date={selectedDate}
          minDate={minDate ? moment(minDate).toLocaleString() : null}
          maxDate={maxDate ? moment(maxDate).toLocaleString() : null}
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
