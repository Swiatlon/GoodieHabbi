import React, { ReactNode, forwardRef, useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../modal/modal';
import dayjs from '@/configs/day-js-config';
import { fromUTCToLocal, safeDateFormat } from '@/utils/utils';

export interface OptionsItem {
  label: string;
  value: string;
}

export interface BaseSelectProps {
  placeholder: string;
  value: string | null;
  onPress?: () => void;
  onClear?: () => void;
  onChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
  isDate?: boolean;
  error?: string;
  textColor?: string;
  isModalVersion?: boolean;
}

interface ModalSelectProps extends BaseSelectProps {
  isModalVersion: true;
  options: OptionsItem[];
}

interface NonModalSelectProps extends BaseSelectProps {
  isModalVersion?: false;
  options?: never;
}

export type SelectProps = ModalSelectProps | NonModalSelectProps;

const Select = forwardRef<TextInput, SelectProps>(
  ({ placeholder, value, onPress, onClear, onChange, className, isDate, error, isModalVersion, options, textColor }, ref) => {
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const formattedValue = getFormattedValue(value, isDate);

    const onClose = () => {
      setIsVisibleModal(false);
    };

    const onPressHandler = () => {
      onPress?.();

      if (isModalVersion) {
        setIsVisibleModal(true);
      }
    };

    return (
      <>
        <View className="w-full">
          <View className={`flex-row items-center border rounded-lg pl-1 ${error ? 'border-red-500' : 'border-gray-300'}`}>
            <TouchableOpacity onPress={onPressHandler} className="flex-1">
              <TextInput
                ref={ref}
                placeholder={placeholder}
                value={formattedValue}
                editable={false}
                className={`${error ? 'text-red-500' : 'text-black'} px-2 py-3 ${className}`}
                style={{ color: textColor }}
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
          {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>

        {isModalVersion && (
          <Modal isVisible={isVisibleModal} onClose={onClose} className="py-2">
            <Text className="text-[16px] font-semibold mb-3 text-gray-500">Select an option:</Text>
            <ScrollView className="max-h-60">
              {options.map(item => (
                <TouchableOpacity
                  key={item.value}
                  className="ml-1 py-3 border-gray-300"
                  onPress={() => {
                    onChange?.(item.value);
                    setIsVisibleModal(false);
                  }}
                >
                  <Text className="text-gray-800">{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Modal>
        )}
      </>
    );
  }
);

export default Select;

const getFormattedValue = (value: string | null | undefined | number, isDate?: boolean): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (isDate && dayjs(value).isValid()) {
    return safeDateFormat(fromUTCToLocal(value as string)) ?? '';
  }

  return String(value);
};
