import { useFormContext, Controller } from 'react-hook-form';
import { View, Text } from 'react-native';
import MultiSelect, { MultiSelectItem } from './multi-select';

interface ControlledMultiSelectProps {
  name: string;
  placeholder: string;
  options: MultiSelectItem[];
  label?: string;
  error?: string;
  className?: string;
}

const ControlledMultiSelect: React.FC<ControlledMultiSelectProps> = ({ label, name, ...props }) => {
  const { control } = useFormContext<Record<string, MultiSelectItem[]>>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <View className="flex gap-1 w-full">
            {label && <Text className="text-sm font-semibold text-gray-500">{label}</Text>}
            <MultiSelect {...field} {...props} selectedOptions={field.value} onChange={field.onChange} error={error ? error.message : undefined} />
            {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

export default ControlledMultiSelect;
