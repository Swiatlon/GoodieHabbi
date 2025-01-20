import React from 'react';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface PriorityPickerProps {
  priority: 'low' | 'medium' | 'high' | null;
  setPriority: (value: 'low' | 'medium' | 'high' | null) => void;
}

const getPriorityStyle = (priority: 'low' | 'medium' | 'high' | null) => {
  switch (priority) {
    case 'high':
      return '#f56565';
    case 'medium':
      return '#eab308';
    case 'low':
      return '#22c55e';
    default:
      return '#6b7280';
  }
};

const PriorityPicker: React.FC<PriorityPickerProps> = ({ priority, setPriority }) => {
  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">Priority:</Text>
      <View className={`rounded-lg border border-gray-300`}>
        <RNPickerSelect
          onValueChange={setPriority}
          items={[
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ]}
          value={priority}
          placeholder={{
            label: 'Select Priority',
            value: '',
            color: '#6b7280',
          }}
          style={{
            inputIOS: {
              marginLeft: 0,
              color: getPriorityStyle(priority),
            },
            inputAndroid: {
              marginLeft: 0,
              color: getPriorityStyle(priority),
            },
          }}
        />
      </View>
    </View>
  );
};

export default PriorityPicker;
