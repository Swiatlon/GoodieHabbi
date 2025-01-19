import React from 'react';
import { TextInput, TextInputProps, Text, View } from 'react-native';

interface TextAreaProps extends TextInputProps {
  className?: string;
  formVersion?: boolean;
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className = '', label, formVersion, ...props }) => {
  return (
    <View className="flex gap-2">
      {formVersion && label && <Text className="text-sm font-semibold text-gray-500">{label}:</Text>}
      <TextInput className={`border border-gray-300 rounded-md p-3 h-24 text-base ${className}`} multiline {...props} />
    </View>
  );
};

export default TextArea;
