import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { View, Text } from 'react-native';
import DateTimePicker, { DateType, useDefaultClassNames } from 'react-native-ui-datepicker';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { SelectItemValue } from '@/components/shared/select/select';
import dayjs from '@/configs/day-js-config';
import { NullableString } from '@/types/global-types';
import { safeDateFormat, toUTCISOString } from '@/utils/utils/utils';

interface DatePickerModalProps {
  name: string;
  label: string;
  placeholder: string;
  minDate?: string | null;
  maxDate?: string | null;
  isEndDate?: boolean;
}

const formatOfDate = 'YYYY-MM-DD';

const DatePickerModal = ({ minDate = null, maxDate = null, label, name, placeholder, isEndDate }: DatePickerModalProps) => {
  const defaultClassNames = useDefaultClassNames();
  const { setValue, watch } = useFormContext<Record<string, SelectItemValue>>();
  const [isVisible, setIsVisible] = useState(false);

  const handleOpen = () => setIsVisible(true);
  const handleClose = () => setIsVisible(false);

  const handleDateChange = (date: DateType) => {
    const transformedDate = isEndDate ? dayjs(date).endOf('day') : date;
    setValue(name, toUTCISOString(transformedDate));
  };

  const selectedDate = watch(name) as NullableString;

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{label}</Text>
      <ControlledSelect name={name} placeholder={placeholder} onPress={handleOpen} isDate />
      <Modal isVisible={isVisible} onClose={handleClose} className="pt-14 px-6">
        <DateTimePicker
          classNames={{
            ...defaultClassNames,
            header: 'flex-row justify-between items-center mb-2',
            weekdays: 'border-b border-gray-200 flex-row justify-between my-2 pb-2',
            weekday_label: 'text-gray-500 text-sm font-semibold',
            today: 'bg-white border border-primary rounded-full m-1',
            selected: 'bg-primary border-primary rounded-full m-1',
            selected_label: 'text-white font-bold',
            disabled: 'opacity-50',
          }}
          mode="single"
          date={safeDateFormat(selectedDate, formatOfDate)}
          minDate={safeDateFormat(minDate, formatOfDate)}
          maxDate={safeDateFormat(maxDate, formatOfDate)}
          onChange={({ date }) => handleDateChange(date)}
        />
        <View className="flex-row justify-between mt-2">
          <Button label="Close" onPress={handleClose} className="px-6" />
        </View>
      </Modal>
    </View>
  );
};

export default DatePickerModal;
