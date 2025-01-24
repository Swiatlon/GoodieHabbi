import React, { ReactNode } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectProps {
  placeholder: string;
  placeholderWhenSelected?: string;
  value: string | null;
  onPress: () => void;
  onClear?: () => void;
  children?: ReactNode;
  className?: string;
  isEditable?: boolean;
  isDisabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  placeholder,
  placeholderWhenSelected,
  value,
  onPress,
  onClear,
  className,
  isEditable,
  isDisabled,
}) => {
  return (
    <View
      className={`flex-row items-center border rounded-lg pl-1 py-2 ${
        isDisabled ? 'border-gray-200 bg-gray-100' : 'border-gray-300'
      } ${className}`}
    >
      <TouchableOpacity onPress={!isDisabled ? onPress : undefined} className="flex-1">
        <TextInput
          placeholder={placeholder}
          value={value ? `${placeholderWhenSelected || 'Selected'} ${value}` : undefined}
          editable={isEditable && !isDisabled}
          className={`text-base ${isDisabled ? 'text-gray-400' : 'text-black'}`}
        />
      </TouchableOpacity>
      {value && onClear && !isDisabled && (
        <TouchableOpacity onPress={onClear} className="pr-2">
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Select;
