import React, { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends Omit<TextInputProps, 'onChange'> {
  className?: string;
  formVersion?: boolean;
  label?: string;
  isRequired?: boolean;
  error?: string;
  onChange: (e: string) => void;
  onClear?: () => void;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ className = '', label, onChange, isRequired, error, value, onClear, ...props }, ref) => {
    return (
      <View className="flex gap-2">
        {label && (
          <Text className="text-sm font-semibold text-gray-500">
            {label}
            {isRequired && <Text className="text-red-500">*</Text>}
          </Text>
        )}
        <View
          className={`py-2 pl-1 flex-row items-center border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
          <TextInput
            ref={ref}
            className={`flex-1 px-2 ${className}`}
            value={value ?? ''}
            onChangeText={text => onChange(text)}
            {...props}
          />
          {value && onClear && (
            <TouchableOpacity onPress={onClear} className="pr-4">
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

export default Input;
