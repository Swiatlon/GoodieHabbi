import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoniconName } from '@/utils/icons/ionicon-name';

// A curated set instead of a full Ionicons browser (the app has no icon-picker UI elsewhere) — chosen to
// match what the category seed already uses.
export const CATEGORY_ICON_OPTIONS: IoniconName[] = [
  'home-outline',
  'car-outline',
  'heart-outline',
  'cart-outline',
  'school-outline',
  'game-controller-outline',
  'trending-up-outline',
  'wallet-outline',
  'gift-outline',
  'briefcase-outline',
  'airplane-outline',
  'paw-outline',
];

interface ControlledIconPickerProps {
  name: string;
  label: string;
  accentColor: string;
}

const ControlledIconPicker: React.FC<ControlledIconPickerProps> = ({ name, label, accentColor }) => {
  const { control } = useFormContext();

  return (
    <View className="gap-2 w-full">
      <Text className="text-sm font-semibold text-gray-500">{label}</Text>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <View className="flex-row flex-wrap gap-2">
            {CATEGORY_ICON_OPTIONS.map(icon => {
              const selected = field.value === icon;
              return (
                <TouchableOpacity
                  key={icon}
                  onPress={() => field.onChange(icon)}
                  className="w-11 h-11 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: selected ? `${accentColor}20` : '#F3F4F6',
                    borderWidth: selected ? 1.5 : 0,
                    borderColor: accentColor,
                  }}
                >
                  <Ionicons name={icon} size={18} color={selected ? accentColor : '#6b7280'} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
    </View>
  );
};

export default ControlledIconPicker;
