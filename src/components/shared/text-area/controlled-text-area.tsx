import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import TextArea from './text-area';

interface ControlledTextAreaProps extends Omit<TextInputProps, 'name'> {
  name: string;
  shouldValidate?: boolean;
  label?: string;
  isRequired?: boolean;
}

const ControlledTextArea = ({
  name,
  shouldValidate = true,
  label,
  isRequired,
  ...otherProps
}: ControlledTextAreaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextArea
          {...field}
          {...otherProps}
          label={label}
          isRequired={isRequired}
          error={shouldValidate && error ? error.message : undefined}
        />
      )}
    />
  );
};

export default ControlledTextArea;
