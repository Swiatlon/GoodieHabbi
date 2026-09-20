import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
const INACTIVE_BACKGROUND = '#F3F4F6';
const ACTIVE_LABEL_COLOR = '#FFFFFF';
const INACTIVE_LABEL_COLOR = '#4B5563';

const FilterChips = <T extends string>({ items, value, onChange, allLabel, testID }: FilterChipsProps<T>) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }} testID={testID}>
    <TouchableOpacity
      onPress={() => onChange(null)}
      className="px-3.5 py-2 rounded-full"
      style={{ backgroundColor: value === null ? ACTIVE_COLOR : INACTIVE_BACKGROUND }}
    >
      <Text className="text-xs font-bold" style={{ color: value === null ? ACTIVE_LABEL_COLOR : INACTIVE_LABEL_COLOR }}>
        {allLabel}
      </Text>
    </TouchableOpacity>
    {items.map(item => {
      const active = value === item.key;
      const activeColor = item.color ?? ACTIVE_COLOR;
      const labelColor = active ? ACTIVE_LABEL_COLOR : INACTIVE_LABEL_COLOR;
      return (
        <TouchableOpacity
          key={item.key}
          onPress={() => onChange(active ? null : item.key)}
          className="px-3.5 py-2 rounded-full"
          style={{ backgroundColor: active ? activeColor : INACTIVE_BACKGROUND }}
          testID={testID ? `${testID}-${item.key}` : undefined}
        >
          {/*
            Emoji and label are separate Text nodes rather than one interpolated string: an emoji that
            falls back to another font can otherwise take the rest of the string's metrics with it, and
            the label renders at zero width. The colour is set here, not inherited, for the same reason.
          */}
          <View className="flex-row items-center">
            {item.emoji && (
              <Text className="text-xs" style={{ color: labelColor }}>
                {item.emoji}{' '}
              </Text>
            )}
            <Text className="text-xs font-bold" style={{ color: labelColor }}>
              {item.label}
            </Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

export default FilterChips;
