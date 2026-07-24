import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

const YearSelector: React.FC<YearSelectorProps> = ({ year, onYearChange, minYear = 2020, maxYear = 2030 }) => (
  <View className="bg-white border-b border-gray-100 flex-row items-center justify-center py-3 gap-6">
    <TouchableOpacity onPress={() => year > minYear && onYearChange(year - 1)} className="p-3" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Ionicons name="chevron-back" size={20} color={year > minYear ? '#4b465d' : '#d1d5db'} />
    </TouchableOpacity>
    <Text className="text-base font-bold text-gray-800 w-14 text-center">{year}</Text>
    <TouchableOpacity onPress={() => year < maxYear && onYearChange(year + 1)} className="p-3" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Ionicons name="chevron-forward" size={20} color={year < maxYear ? '#4b465d' : '#d1d5db'} />
    </TouchableOpacity>
  </View>
);

export default YearSelector;
