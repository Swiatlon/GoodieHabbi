import React, { forwardRef, useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RichTextAreaModal from './rich-text-area-modal';

export interface TextAreaProps extends Omit<TextInputProps, 'onChange'> {
  className?: string;
  placeholder: string;
  label: string;
  isRequired?: boolean;
  error?: string;
  onChange: (e: string) => void;
  onClear?: () => void;
}

const RichTextArea = forwardRef<TextInput, TextAreaProps>(({ error, label, value, isRequired, className, onClear, onChange, ...props }, ref) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const onClose = () => {
    setIsVisibleModal(false);
  };

  const onPressHandler = () => {
    setIsVisibleModal(true);
  };

  return (
    <>
      <View className="flex gap-2">
        <Text className="text-sm font-semibold text-gray-500">
          {label}
          {isRequired && <Text className="text-red-500">*</Text>}
        </Text>
        <View className={`flex-row items-center border rounded-lg pl-1 ${error ? 'border-red-500' : 'border-gray-300'}`}>
          <TouchableOpacity onPress={onPressHandler} className="flex-1">
            <TextInput
              ref={ref}
              {...props}
              onChange={() => {}}
              value={value ?? ''}
              editable={false}
              className={`${error ? 'text-red-500' : 'text-black'} px-2 py-3 ${className}`}
              pointerEvents={'none'}
              showSoftInputOnFocus={false}
            />
          </TouchableOpacity>
          {value && onClear && (
            <TouchableOpacity onPress={onClear} className="pr-4">
              <Ionicons name="close-circle" size={20} color={error ? '#E53E3E' : '#888'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isVisibleModal && <RichTextAreaModal isVisible={isVisibleModal} onClose={onClose} label={label} onChange={onChange} value={value} />}
    </>
  );
});

export default RichTextArea;
