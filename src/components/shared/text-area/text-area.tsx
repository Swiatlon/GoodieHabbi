import React from 'react';
import { TextInput, TextInputProps, Text, View } from 'react-native';

interface TextAreaProps extends TextInputProps {
  className?: string;
  label?: string;
  isRequired?: boolean;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className = '', label, isRequired, error, ...props }) => {
  return (
    <View className="flex gap-2">
      {label && (
        <Text className="text-sm font-semibold text-gray-500">
          {label}
          {isRequired && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      <View className="flex gap-1">
        <TextInput
          className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 h-24 text-base ${className}`}
          multiline
          {...props}
        />
        {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      </View>
    </View>
  );
};

export default TextArea;
