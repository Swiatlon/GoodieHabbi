import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text } from 'react-native';
import Select, { SelectProps } from './select';

interface ControlledSelectProps extends Omit<SelectProps, 'name' | 'value'> {
  name: string;
  isDate?: boolean;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({ name, isDate, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Select
            {...field}
            {...props}
            isDate={isDate}
            onClear={() => {
              field.onChange(isDate ? null : '');
              props.onClear?.();
            }}
          />
          {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
        </>
      )}
    />
  );
};

export default ControlledSelect;
