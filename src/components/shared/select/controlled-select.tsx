import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SelectProps } from './select';

interface ControlledSelectProps extends Omit<SelectProps, 'name' | 'value'> {
  name: string;
  isDate?: boolean;
  clearAsNull?: boolean;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({ name, isDate, clearAsNull, ...props }) => {
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
            error={error?.message}
            onClear={() => {
              field.onChange(isDate || clearAsNull ? null : '');
              props.onClear?.();
            }}
          />
        </>
      )}
    />
  );
};

export default ControlledSelect;
