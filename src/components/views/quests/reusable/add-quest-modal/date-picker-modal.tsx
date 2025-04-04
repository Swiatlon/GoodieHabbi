import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { View, Text } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import ControlledSelect from '@/components/shared/select/controlled-select';
import dayjs from '@/configs/day-js-config';
import { NullableString } from '@/types/global-types';
import { safeDateFormat, toUTCISOString } from '@/utils/utils';

interface DatePickerModalProps {
  name: string;
  label: string;
  placeholder: string;
  minDate?: string | null;
  maxDate?: string | null;
  isEndDate?: boolean;
}

const DatePickerModal = ({ minDate = null, maxDate = null, label, name, placeholder, isEndDate }: DatePickerModalProps) => {
  const { setValue, watch } = useFormContext<Record<string, NullableString>>();
  const [isVisible, setIsVisible] = useState(false);

  const handleOpen = () => setIsVisible(true);
  const handleClose = () => setIsVisible(false);

  const handleDateChange = (date: DateType) => {
    const transformedDate = isEndDate ? dayjs(date).endOf('day') : date;
    setValue(name, toUTCISOString(transformedDate));
  };

  const selectedDate = watch(name);

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{label}:</Text>
      <ControlledSelect name={name} placeholder={placeholder} onPress={handleOpen} isDate />
      <Modal isVisible={isVisible} onClose={handleClose} className="pt-14 px-6">
        <DateTimePicker
          mode="single"
          date={selectedDate}
          minDate={safeDateFormat(minDate, 'YYYY-MM-DD')}
          maxDate={safeDateFormat(maxDate, 'YYYY-MM-DD')}
          onChange={({ date }) => handleDateChange(date)}
        />
        <View className="flex-row justify-between mt-6">
          <Button label="Close" onPress={handleClose} className="px-6" />
        </View>
      </Modal>
    </View>
  );
};

export default DatePickerModal;
