import React from 'react';
import { View, Text } from 'react-native';
import Button from '@/components/shared/button/button';

interface RepeatTypePickerProps {
  repeatType: 'weekly' | 'monthly' | null;
  setRepeatType: (type: 'weekly' | 'monthly') => void;
}

const RepeatTypePicker: React.FC<RepeatTypePickerProps> = ({ repeatType, setRepeatType }) => {
  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">Repeat type:</Text>
      <View className="flex-row gap-4">
        <Button
          label="Weekly"
          onPress={() => setRepeatType('weekly')}
          styleType={repeatType === 'weekly' ? 'primary' : 'secondary'}
          className={`rounded-lg`}
        />
        <Button
          label="Monthly"
          onPress={() => setRepeatType('monthly')}
          styleType={repeatType === 'monthly' ? 'primary' : 'secondary'}
          className={`rounded-lg `}
        />
      </View>
    </View>
  );
};

export default RepeatTypePicker;
