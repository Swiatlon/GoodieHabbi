import React, { useState } from 'react';
import { View } from 'react-native';
import DayPickerModal from './day-picker-modal';
import Select from '@/components/shared/select/select';

interface MonthlyPickerProps {
  monthlyStart: number | null;
  monthlyEnd: number | null;
  setMonthlyStart: (value: number | null) => void;
  setMonthlyEnd: (value: number | null) => void;
}

const MonthlyPicker: React.FC<MonthlyPickerProps> = ({ monthlyStart, monthlyEnd, setMonthlyStart, setMonthlyEnd }) => {
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);

  return (
    <View className="flex gap-4">
      <View>
        <Select
          value={monthlyStart ? String(monthlyStart) : null}
          placeholder="Select Start Day"
          placeholderWhenSelected={monthlyStart ? `Start day:` : undefined}
          onPress={() => setIsStartModalVisible(true)}
          onClear={() => setMonthlyStart(null)}
        />
        <DayPickerModal
          isVisible={isStartModalVisible}
          onClose={() => setIsStartModalVisible(false)}
          onConfirm={day => {
            setMonthlyStart(day);
            setIsStartModalVisible(false);
          }}
          selectedDay={monthlyStart}
          label="Select Start Day"
        />
      </View>

      <View>
        <Select
          value={monthlyEnd ? String(monthlyEnd) : null}
          placeholder="Select End Day"
          placeholderWhenSelected={monthlyEnd ? `End day:` : undefined}
          onPress={() => setIsEndModalVisible(true)}
          onClear={() => setMonthlyEnd(null)}
        />
        <DayPickerModal
          isVisible={isEndModalVisible}
          onClose={() => setIsEndModalVisible(false)}
          onConfirm={day => {
            setMonthlyEnd(day);
            setIsEndModalVisible(false);
          }}
          selectedDay={monthlyEnd}
          label="Select End Day"
        />
      </View>
    </View>
  );
};

export default MonthlyPicker;
