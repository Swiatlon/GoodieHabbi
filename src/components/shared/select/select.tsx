import React, { ReactNode, forwardRef } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { fromUTCToLocal } from '@/utils/utils';

export interface SelectProps {
  placeholder: string;
  value: string | null;
  onPress: () => void;
  onClear?: () => void;
  children?: ReactNode;
  className?: string;
  isEditable?: boolean;
  isDate?: boolean;
  error?: string;
}

const Select = forwardRef<TextInput, SelectProps>(
  ({ placeholder, value, onPress, onClear, className, isEditable = true, isDate, error }, ref) => {
    const formattedValue = value && isDate && dayjs(value).isValid() ? fromUTCToLocal(value) : value;

    return (
      <View className="w-full">
        <View
          className={`flex-row items-center border rounded-lg pl-1 py-2 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
        >
          <TouchableOpacity onPress={onPress} className="flex-1">
            <TextInput
              ref={ref}
              placeholder={placeholder}
              value={formattedValue ?? ''}
              editable={isEditable}
              className={`${error ? 'text-red-500' : 'text-black'} px-2`}
              pointerEvents={!isEditable ? 'none' : 'auto'}
              showSoftInputOnFocus={!isEditable}
            />
          </TouchableOpacity>
          {value && onClear && (
            <TouchableOpacity onPress={onClear} className="pr-4">
              <Ionicons name="close-circle" size={20} color={error ? '#E53E3E' : '#888'} />
            </TouchableOpacity>
          )}
        </View>
        {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      </View>
    );
  }
);

export default Select;
