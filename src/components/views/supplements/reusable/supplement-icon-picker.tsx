import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import { SUPPLEMENT_EMOJI_OPTIONS } from '@/utils/supplements/supplement-visuals';

interface ControlledSupplementIconPickerProps {
  name: string;
  label: string;
  accentColor: string;
}

const ControlledSupplementIconPicker: React.FC<ControlledSupplementIconPickerProps> = ({ name, label, accentColor }) => {
  const { control } = useFormContext();

  return (
    <View className="gap-2 w-full">
      <Text className="text-sm font-semibold text-gray-500">{label}</Text>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <View className="flex-row flex-wrap gap-2">
            {SUPPLEMENT_EMOJI_OPTIONS.map(emoji => {
              const selected = field.value === emoji;
              return (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => field.onChange(emoji)}
                  className="w-11 h-11 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: selected ? `${accentColor}20` : '#F3F4F6',
                    borderWidth: selected ? 1.5 : 0,
                    borderColor: accentColor,
                  }}
                >
                  <Text className="text-lg">{emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
    </View>
  );
};

export default ControlledSupplementIconPicker;
