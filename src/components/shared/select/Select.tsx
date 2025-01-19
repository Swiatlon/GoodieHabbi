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
}

const Select: React.FC<SelectProps> = ({
  placeholder,
  placeholderWhenSelected,
  value,
  onPress,
  onClear,
  className,
}) => {
  return (
    <View className={`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 ${className}`}>
      <TouchableOpacity onPress={onPress} className="flex-1">
        <TextInput
          placeholder={placeholder}
          value={value ? `${placeholderWhenSelected || 'Selected'} ${value}` : undefined}
          editable={false}
          className="text-base text-black"
        />
      </TouchableOpacity>
      {value && onClear && (
        <TouchableOpacity onPress={onClear} className="ml-2">
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Select;
