import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/IconButton';

interface SortKeySectionProps {
  actualSortKey: string | null;
  setSortKey: (key: string | null) => void;
}

const sortKeys = ['title', 'date'];

const SortKeySection: React.FC<SortKeySectionProps> = ({ actualSortKey, setSortKey }) => {
  return (
    <View className="mt-6">
      <Text className="text-lg font-semibold mb-4">Sort By:</Text>
      <View className="flex-row justify-around">
        {sortKeys.map(key => (
          <IconButton key={key} onPress={() => setSortKey(key)} className="flex items-center p-2">
            <Ionicons
              name={key === 'title' ? 'text-outline' : 'calendar-outline'}
              size={28}
              color={actualSortKey === key ? '#1987EE' : '#9e9e9e'}
            />
            <Text className={`mt-2 text-sm ${actualSortKey === key ? 'font-bold text-blue-500' : 'text-black'}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
          </IconButton>
        ))}
      </View>
    </View>
  );
};

export default SortKeySection;
