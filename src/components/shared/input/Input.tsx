import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
  formVersion?: boolean;
  label?: string;
}

const Input: React.FC<InputProps> = ({ className = '', formVersion, label, ...props }) => {
  return (
    <View className="flex gap-2">
      {formVersion && label && <Text className="text-sm font-semibold text-gray-500">{label}</Text>}
      <TextInput className={`border border-gray-300 rounded-md p-3 ${className}`} {...props} />
    </View>
  );
};

export default Input;
