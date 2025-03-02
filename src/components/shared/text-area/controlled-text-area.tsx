import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View, Text } from 'react-native';
import RichTextArea, { TextAreaProps } from './rich-text-area';

interface ControlledTextAreaProps extends Omit<TextAreaProps, 'onChange'> {
  name: string;
  label: string;
  isRequired?: boolean;
}

const ControlledRichTextArea = ({ name, label, isRequired, ...otherProps }: ControlledTextAreaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View className="flex gap-1">
          <RichTextArea
            {...field}
            {...otherProps}
            onChange={field.onChange}
            onClear={() => field.onChange('')}
            label={label}
            isRequired={isRequired}
          />
          {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default ControlledRichTextArea;
