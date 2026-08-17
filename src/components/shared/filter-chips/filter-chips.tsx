import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

export interface FilterChipItem<T extends string> {
  key: T;
  label: string;
  color?: string;
  emoji?: string;
}

interface FilterChipsProps<T extends string> {
  items: FilterChipItem<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  allLabel: string;
  testID?: string;
}

const ACTIVE_COLOR = '#1987EE';

const FilterChips = <T extends string>({ items, value, onChange, allLabel, testID }: FilterChipsProps<T>) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }} testID={testID}>
    <TouchableOpacity
      onPress={() => onChange(null)}
      className="px-3.5 py-2 rounded-full"
      style={{ backgroundColor: value === null ? ACTIVE_COLOR : '#F3F4F6' }}
    >
      <Text className={`text-xs font-bold ${value === null ? 'text-white' : 'text-gray-600'}`}>{allLabel}</Text>
    </TouchableOpacity>
    {items.map(item => {
      const active = value === item.key;
      const activeColor = item.color ?? ACTIVE_COLOR;
      return (
        <TouchableOpacity
          key={item.key}
          onPress={() => onChange(active ? null : item.key)}
          className="px-3.5 py-2 rounded-full"
          style={{ backgroundColor: active ? activeColor : '#F3F4F6' }}
          testID={testID ? `${testID}-${item.key}` : undefined}
        >
          <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-gray-600'}`}>
            {item.emoji ? `${item.emoji} ` : ''}
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

export default FilterChips;
