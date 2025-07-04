import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { View, Text } from 'react-native';
import { TimerPickerModal as RNTimerPickerModal } from 'react-native-timer-picker';
import dayjs from 'dayjs';
import ControlledSelect from '@/components/shared/select/controlled-select';

interface TimerPickerFieldProps {
  name: string;
  label: string;
  placeholder: string;
}

const TimerPickerField = ({ name, label, placeholder }: TimerPickerFieldProps) => {
  const { setValue } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);

  const handleTimeChange = (hours: number, minutes: number) => {
    const formattedTime = dayjs().hour(hours).minute(minutes).format('HH:mm');
    setValue(name, formattedTime);
    setIsVisible(false);
  };

  return (
    <View className="flex gap-2">
      {label && <Text className="text-sm font-semibold text-gray-500">{label}</Text>}
      <ControlledSelect name={name} placeholder={placeholder} onPress={() => setIsVisible(true)} />
      <RNTimerPickerModal
        visible={isVisible}
        setIsVisible={setIsVisible}
        onConfirm={({ hours, minutes }) => handleTimeChange(hours, minutes)}
        onCancel={() => setIsVisible(false)}
        confirmButtonText="Set Time"
        cancelButtonText="Cancel"
        hideSeconds
        closeOnOverlayPress
        use12HourPicker={false}
        styles={{
          button: {
            fontSize: 14,
          },
          cancelButton: {
            borderColor: '#3b82f6',
            color: '#3b82f6',
          },
          confirmButton: {
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            color: 'white',
          },
        }}
        buttonTouchableOpacityProps={{
          activeOpacity: 0.7,
        }}
      />
    </View>
  );
};

export default TimerPickerField;
