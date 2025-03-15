import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, LayoutChangeEvent, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useComponentSize } from '@/hooks/use-component-size';

export interface MultiSelectItem {
  id: number;
  value: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface MultiSelectProps {
  placeholder: string;
  options: MultiSelectItem[];
  selectedOptions: MultiSelectItem[];
  onChange: (selectedValues: MultiSelectItem[]) => void;
  error?: string;
  className?: string;
}

const getVisibleChips = (availableWidth: number, chipWidths: number[], selectedOptions: MultiSelectItem[], counterWidth = 0) => {
  let widthUsed = 0;
  let visibleChipsCount = 0;

  for (let i = 0; i < chipWidths.length; i++) {
    widthUsed += chipWidths[i];

    if (widthUsed + counterWidth > availableWidth) {
      break;
    }

    visibleChipsCount = i + 1;
  }

  return selectedOptions.slice(0, visibleChipsCount);
};

const MultiSelect = forwardRef<View, MultiSelectProps>(({ placeholder, options, selectedOptions, onChange, error, className }, ref) => {
  const [containerWidth, onLayoutContainer] = useComponentSize();
  const [counterWidth, onLayoutCounter] = useComponentSize();
  const chipWidths = useRef<number[]>([]);
  const [visibleChips, setVisibleChips] = useState(selectedOptions);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const difference = selectedOptions.length - visibleChips.length;

  const handleClear = () => {
    onChange([]);
  };

  const handleChipLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    chipWidths.current[index] = width;
  };

  const toggleOption = (id: number) => {
    const isSelected = selectedOptions.some(option => option.id === id);
    let updatedSelectedOptions: MultiSelectItem[];

    if (isSelected) {
      updatedSelectedOptions = selectedOptions.filter(option => option.id !== id);
    } else {
      const optionToAdd = options.find(option => option.id === id);
      updatedSelectedOptions = [...selectedOptions, optionToAdd!];
    }

    onChange(updatedSelectedOptions);
  };

  useEffect(() => {
    setVisibleChips(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    setTimeout(() => {
      const availableWidth = containerWidth?.width ?? 0;

      if (availableWidth && chipWidths.current.length > 0) {
        const filteredSelectedChips = getVisibleChips(availableWidth, chipWidths.current, selectedOptions, counterWidth?.width);
        setVisibleChips(filteredSelectedChips);
      }
    });
  }, [containerWidth, selectedOptions, chipWidths]);

  return (
    <View className="w-full relative">
      <View className={`flex-row items-center border rounded-lg relative ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}>
        <TouchableOpacity
          className="w-[86%] py-3 min-h-10 overflow-hidden pl-3"
          onLayout={onLayoutContainer}
          onPress={() => setIsDropdownVisible(prev => !prev)}
        >
          <View className="flex-row gap-2 w-full" ref={ref}>
            {visibleChips.length === 0 && <Text className="text-gray-500">{placeholder}</Text>}
            {visibleChips.map(({ id, value, backgroundColor, textColor }, index) => {
              return (
                <View
                  key={id}
                  className="bg-primary rounded-full py-1 px-3"
                  style={{ backgroundColor: backgroundColor }}
                  onLayout={handleChipLayout(index)}
                >
                  <Text className="text-white text-[12px]" style={{ color: textColor }} numberOfLines={1}>
                    {value}
                  </Text>
                </View>
              );
            })}

            {difference > 0 && (
              <View className="bg-gray-300 rounded-full py-1 px-4" onLayout={onLayoutCounter}>
                <Text className="text-white text-[12px]">+{difference} more</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {selectedOptions.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="px-4">
            <Ionicons name="close-circle" size={20} color={error ? '#E53E3E' : '#888'} />
          </TouchableOpacity>
        )}
      </View>

      {isDropdownVisible && (
        <View className="fixed top-0 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ScrollView className="max-h-30">
            {options.map(option => {
              const isChecked = selectedOptions.some(selected => selected.id === option.id);

              return (
                <TouchableOpacity key={option.id} className="flex-row items-center py-2 px-4" onPress={() => toggleOption(option.id)}>
                  <Ionicons name={isChecked ? 'checkbox' : 'square-outline'} size={24} color={isChecked ? '#1987EE' : 'gray'} />
                  <Text className="ml-2">{option.value}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Error message */}
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
});

export default MultiSelect;
