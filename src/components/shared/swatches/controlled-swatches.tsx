import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import Swatches from './swatches';

interface ControlledSwatchesProps {
  name: string;
  label: string;
  onChange?: (value: string) => void;
}

const ControlledSwatches: React.FC<ControlledSwatchesProps> = ({ name, label, onChange }) => {
  const { control } = useFormContext();

  return (
    <View className="flex gap-4 w-full">
      {label && <Text className="text-sm font-semibold text-gray-500">{label}</Text>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <View className="flex">
            <Swatches
              selectedColor={field.value as string}
              onSelect={color => {
                field.onChange(color);
                onChange?.(color);
              }}
            />
            {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
          </View>
        )}
      />
    </View>
  );
};

export default ControlledSwatches;
