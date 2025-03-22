import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInputProps, View, Text } from 'react-native';
import TextArea from './text-area';

interface ControlledTextAreaProps extends TextInputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

const ControlledTextArea = ({ name, label, isRequired, ...otherProps }: ControlledTextAreaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View className="flex gap-1">
          <TextArea {...field} {...otherProps} onChange={field.onChange} onClear={() => field.onChange('')} label={label} isRequired={isRequired} />
          {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default ControlledTextArea;
