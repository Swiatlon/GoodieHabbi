import React, { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TextAreaProps extends Omit<TextInputProps, 'onChange'> {
  className?: string;
  label?: string;
  isRequired?: boolean;
  error?: string;
  onChange: (e: string) => void;
  onClear?: () => void;
  testID?: string;
}

const TextArea = forwardRef<TextInput, TextAreaProps>(
  ({ className = '', onChange, label, isRequired, error, value, onClear, testID = 'text-area', ...props }, ref) => {
    return (
      <View className="flex gap-2" testID={`${testID}-container`}>
        {label && (
          <Text className="text-sm font-semibold text-gray-500" testID={`${testID}-label`}>
            {label}
            {isRequired ? ' *' : ''}
          </Text>
        )}
        <View className={`pl-1 flex-row items-center border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`} testID={`${testID}-wrapper`}>
          <TextInput
            multiline
            ref={ref}
            className={`flex-1 px-2 py-3 ${className}`}
            value={value ?? ''}
            onChangeText={text => onChange(text)}
            testID={`${testID}-input`}
            {...props}
          />
          {value && onClear && (
            <TouchableOpacity onPress={onClear} className="pr-4" testID={`${testID}-clear-button`}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

export default TextArea;
