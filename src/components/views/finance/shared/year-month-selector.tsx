import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MONTH_KEYS } from '@/utils/finance/month-keys';

const CHIP_WIDTH = 56;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface YearMonthSelectorProps {
  year: number;
  month: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  minYear?: number;
  maxYear?: number;
  // Rendered on the right of the year row, not layered over the month chips — keeps screen-level actions
  // (e.g. Dashboard's hide-numbers/export/recurring buttons) visually separate from date navigation instead
  // of floating on top of the horizontally scrollable chip row where they can read as extra chips.
  rightActions?: React.ReactNode;
}

const YearMonthSelector: React.FC<YearMonthSelectorProps> = ({
  year,
  month,
  onYearChange,
  onMonthChange,
  minYear = 2020,
  maxYear = 2030,
  rightActions,
}) => {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const targetX = Math.max((month - 1) * CHIP_WIDTH - SCREEN_WIDTH / 2 + CHIP_WIDTH, 0);
    scrollRef.current?.scrollTo({ x: targetX, animated: true });
  }, [month]);

  return (
    <View className="bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between py-2 px-2">
        <View className="flex-1" />
        <View className="flex-row items-center gap-6">
          <TouchableOpacity
            onPress={() => year > minYear && onYearChange(year - 1)}
            className="p-3"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={20} color={year > minYear ? '#4b465d' : '#d1d5db'} />
          </TouchableOpacity>
          <Text className="text-base font-bold text-gray-800 w-14 text-center">{year}</Text>
          <TouchableOpacity
            onPress={() => year < maxYear && onYearChange(year + 1)}
            className="p-3"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-forward" size={20} color={year < maxYear ? '#4b465d' : '#d1d5db'} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex-row items-center justify-end gap-2">{rightActions}</View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12, gap: 8 }}
      >
        {MONTH_KEYS.map((key, index) => {
          const m = index + 1;
          const active = m === month;
          return (
            <TouchableOpacity
              key={m}
              onPress={() => onMonthChange(m)}
              style={{ width: CHIP_WIDTH - 8 }}
              className={`py-2.5 rounded-full items-center ${active ? 'bg-primary' : 'bg-gray-100'}`}
            >
              <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-600'}`}>{t(`finance.months.${key}`)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default YearMonthSelector;
