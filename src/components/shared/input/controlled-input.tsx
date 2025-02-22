import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TextInputProps, View } from 'react-native';
import Input from './input';

interface ControlledInputProps extends TextInputProps {
  name: string;
  shouldValidate?: boolean;
  label?: string;
  isRequired?: boolean;
}

const ControlledInput = ({ name, label, isRequired, ...otherProps }: ControlledInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View className="flex gap-1 w-full">
          <Input
            {...field}
            {...otherProps}
            onChange={field.onChange}
            onClear={() => field.onChange('')}
            label={label}
            isRequired={isRequired}
            error={error ? error.message : undefined}
          />
          {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default ControlledInput;
