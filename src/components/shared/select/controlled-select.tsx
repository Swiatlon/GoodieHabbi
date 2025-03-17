import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SelectProps } from './select';
import { NullableString } from '@/types/global-types';

interface ControlledSelectProps extends Omit<SelectProps, 'name' | 'value'> {
  name: string;
  isDate?: boolean;
  clearAsNull?: boolean;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({ name, isDate, clearAsNull, options, ...props }) => {
  const { control } = useFormContext<Record<string, NullableString>>();
  const isModal = props.isModalVersion;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const commonProps = {
          ...field,
          ...props,
          isDate,
          error: error?.message,
          onChange: field.onChange,
          onClear: () => {
            field.onChange(isDate || clearAsNull ? null : '');
            props.onClear?.();
          },
        };

        if (isModal && options) {
          return <Select {...commonProps} isModalVersion={true} options={options} />;
        }

        return <Select {...commonProps} isModalVersion={false} options={undefined} />;
      }}
    />
  );
};

export default ControlledSelect;
