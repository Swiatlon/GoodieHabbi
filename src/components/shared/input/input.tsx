import React, { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'onChange'> {
  className?: string;
  formVersion?: boolean;
  label?: string;
  isRequired?: boolean;
  error?: string;
  onChange: (e: string) => void;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ className = '', label, onChange, isRequired, error, ...props }, ref) => {
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
            className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 ${className}`}
            value={props.value ?? ''}
            onChangeText={text => {
              onChange(text);
            }}
            {...props}
          />
          {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>
      </View>
    );
  }
);

export default Input;
