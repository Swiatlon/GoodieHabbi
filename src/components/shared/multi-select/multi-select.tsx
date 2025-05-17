import React, { forwardRef, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../button/button';
import { Chip, MoreChip, SelectionOption } from './elements/multi-select-elements';

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
  modalTitle?: string;
  maxVisibleChips?: number;
}

const MultiSelect = forwardRef<View, MultiSelectProps>(
  ({ placeholder, options, selectedOptions, onChange, error, className = '', modalTitle = 'Select Options', maxVisibleChips = 2 }, ref) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { visibleChips, overflowCount } = useMemo(() => {
      if (selectedOptions.length <= maxVisibleChips) {
        return {
          visibleChips: selectedOptions,
          overflowCount: 0,
        };
      }
      return {
        visibleChips: selectedOptions.slice(0, maxVisibleChips),
        overflowCount: selectedOptions.length - maxVisibleChips,
      };
    }, [selectedOptions, maxVisibleChips]);

    const handleClear = useCallback(() => {
      onChange([]);
    }, [onChange]);

    const toggleOption = useCallback(
      (id: number) => {
        const isCurrentlySelected: boolean = selectedOptions.some((option: { id: number }) => option.id === id);

        if (isCurrentlySelected) {
          onChange(selectedOptions.filter((option: { id: number }) => option.id !== id));
        } else {
          const optionToAdd: MultiSelectItem | undefined = options.find((option: MultiSelectItem) => option.id === id);
          onChange(optionToAdd ? [...selectedOptions, optionToAdd] : selectedOptions);
        }
      },
      [options, onChange, selectedOptions]
    );

    const toggleModal = useCallback(() => setIsModalVisible(prev => !prev), []);

    const renderItem = useCallback(
      ({ item }: { item: MultiSelectItem }) => {
        const isSelected = selectedOptions.some(selected => selected.id === item.id);

        return <SelectionOption item={item} isSelected={isSelected} onToggle={() => toggleOption(item.id)} />;
      },
      [selectedOptions, toggleOption]
    );

    return (
      <View className="w-full relative" ref={ref}>
        <View className={`flex-row items-center border rounded-lg relative ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}>
          <TouchableOpacity className="flex-1 py-3 min-h-10 pl-3 flex-row items-center" onPress={toggleModal}>
            <View className="flex-row flex-wrap gap-2 flex-1">
              {visibleChips.length === 0 && <Text className="text-gray-500">{placeholder}</Text>}
              {visibleChips.map(item => (
                <Chip key={item.id} item={item} />
              ))}
              {overflowCount > 0 && <MoreChip count={overflowCount} />}
            </View>
            <Ionicons name="chevron-down" size={20} color="#888" className={`${selectedOptions.length > 0 ? '' : 'mr-4'}`} />
          </TouchableOpacity>

          {selectedOptions.length > 0 && (
            <TouchableOpacity onPress={handleClear} className="px-4">
              <Ionicons name="close-circle" size={20} color={error ? '#E53E3E' : '#888'} />
            </TouchableOpacity>
          )}
        </View>

        <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={toggleModal}>
          <SafeAreaView className="flex-1 bg-black bg-opacity-50">
            <View className="flex-1 mt-4 bg-white rounded-t-xl overflow-hidden">
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <Text className="text-lg font-medium">{modalTitle}</Text>
                <TouchableOpacity onPress={toggleModal} accessibilityRole="button" accessibilityLabel="Close modal">
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList data={options} className="flex-1" renderItem={renderItem} />
              <View className="p-4 border-t border-gray-200 flex-row justify-between">
                <Button onPress={handleClear} variant="contained" styleType="secondary" className="px-4" label="Clear All" />
                <Button onPress={toggleModal} variant="contained" styleType="primary" className="px-4" label="Done" />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
);

export default MultiSelect;
