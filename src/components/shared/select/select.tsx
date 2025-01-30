import React, { ReactNode, forwardRef } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
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
  isDisabled?: boolean;
  isDate?: boolean;
}

const Select = forwardRef<TextInput, SelectProps>(
  ({ placeholder, value, onPress, onClear, className, isEditable, isDisabled, isDate }, ref) => {
    const formattedValue = value && dayjs(value).isValid() ? fromUTCToLocal(value) : value;

    return (
      <View
        className={`flex-row items-center border rounded-lg pl-1 py-2 ${
          isDisabled ? 'border-gray-200 bg-gray-100' : 'border-gray-300'
        } ${className}`}
      >
        <TouchableOpacity onPress={!isDisabled ? onPress : undefined} className="flex-1">
          <TextInput
            ref={ref}
            placeholder={placeholder}
            value={formattedValue ?? ''}
            editable={!isDate && isEditable && !isDisabled}
            className={`text-base ${isDisabled ? 'text-gray-400' : 'text-black'} px-2`}
            pointerEvents={isDate ? 'none' : 'auto'}
            showSoftInputOnFocus={!isDate}
          />
        </TouchableOpacity>
        {value && onClear && !isDisabled && (
          <TouchableOpacity onPress={onClear} className="pr-4">
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

export default Select;
