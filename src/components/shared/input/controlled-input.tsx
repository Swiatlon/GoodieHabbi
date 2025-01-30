import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import Input from './input';

interface ControlledInputProps extends TextInputProps {
  name: string;
  shouldValidate?: boolean;
  label?: string;
  isRequired?: boolean;
}

const ControlledInput = ({ name, shouldValidate = true, label, isRequired, ...otherProps }: ControlledInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...field}
          {...otherProps}
          onChange={field.onChange}
          label={label}
          isRequired={isRequired}
          error={shouldValidate && error ? error.message : undefined}
        />
      )}
    />
  );
};

export default ControlledInput;
