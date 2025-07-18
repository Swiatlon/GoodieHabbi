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
  passwordField?: {
    visibilityValue: boolean;
    onPasswordVisibilityChange?: () => void;
  };
  testID?: string;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ className = '', label, onChange, isRequired, error, value, onClear, passwordField, testID = 'input', ...props }, ref) => {
    return (
      <View className="flex gap-2" testID={`${testID}-container`}>
        {label && (
          <View className="flex-row items-center">
            <Text testID={`${testID}-label`} className="text-sm font-semibold text-gray-500">
              {label}
            </Text>
            {isRequired && (
              <Text className="text-red-500 text-xs" testID="asteriks">
                {' '}
                *
              </Text>
            )}
          </View>
        )}
        <View testID={`${testID}-wrapper`} className={`pl-1 flex-row items-center border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}>
          <TextInput
            ref={ref}
            testID={`${testID}-input`}
            className={`flex-1 px-2 py-3 ${className}`}
            value={value ?? ''}
            onChangeText={text => onChange(text)}
            {...props}
          />
          {value && passwordField && (
            <TouchableOpacity testID={`${testID}-password-toggle`} onPress={passwordField.onPasswordVisibilityChange} className="pr-4">
              <Ionicons name={passwordField.visibilityValue ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
            </TouchableOpacity>
          )}
          {value && onClear && (
            <TouchableOpacity testID={`${testID}-clear-button`} onPress={onClear} className="pr-4">
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

export default Input;
