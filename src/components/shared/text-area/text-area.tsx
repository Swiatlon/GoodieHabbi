import React, { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface TextAreaProps extends Omit<TextInputProps, 'onChange'> {
  className?: string;
  label?: string;
  isRequired?: boolean;
  error?: string;
  onChange: (e: string) => void;
}

const TextArea = forwardRef<TextInput, TextAreaProps>(
  ({ className = '', onChange, label, isRequired, error, ...props }, ref) => {
    return (
      <View className="flex gap-2">
        {label && (
          <Text className="text-sm font-semibold text-gray-500">
            {label}
            {isRequired && <Text className="text-red-500">*</Text>}
          </Text>
        )}
        <View className="flex gap-1">
          <TextInput
            ref={ref}
            multiline
            className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 ${className}`}
            {...props}
            onChangeText={text => {
              onChange(text);
            }}
          />
          {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>
      </View>
    );
  }
);

export default TextArea;
