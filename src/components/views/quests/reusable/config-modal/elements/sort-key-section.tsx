import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/icon-button';

interface SortKeySectionProps {
  actualSortKey: string | null;
  setSortKey: (key: string | null) => void;
  withoutDate?: boolean;
}

const sortKeys = ['title', 'date'];

const SortKeySection: React.FC<SortKeySectionProps> = ({ actualSortKey, withoutDate, setSortKey }) => {
  return (
    <View className="flex gap-2">
      <Text className="text-lg font-semibold text-center">Sort By:</Text>
      <View className="flex-row justify-around">
        {sortKeys.map(key => {
          if (key === 'date' && withoutDate) {
            return null;
          }

          return (
            <IconButton key={key} onPress={() => setSortKey(key)} className="flex items-center p-2">
              <Ionicons
                name={key === 'title' ? 'text-outline' : 'calendar-outline'}
                size={28}
                color={actualSortKey === key ? '#1987EE' : '#9e9e9e'}
              />
              <Text className={`text-sm ${actualSortKey === key ? 'font-bold text-blue-500' : 'text-black'}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </IconButton>
          );
        })}
      </View>
    </View>
  );
};

export default SortKeySection;
