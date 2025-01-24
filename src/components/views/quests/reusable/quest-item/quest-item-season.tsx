import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuestItemSeasonProps {
  season: 'winter' | 'spring' | 'summer' | 'autumn';
}

const seasonData = {
  winter: {
    icon: <MaterialCommunityIcons name="snowflake" size={16} color="#00bcd4" />,
    label: 'Winter',
    color: '#00bcd4',
  },
  spring: {
    icon: <MaterialCommunityIcons name="flower" size={16} color="#4caf50" />,
    label: 'Spring',
    color: '#4caf50',
  },
  summer: {
    icon: <MaterialCommunityIcons name="white-balance-sunny" size={16} color="#ffeb3b" />,
    label: 'Summer',
    color: '#ffeb3b',
  },
  autumn: {
    icon: <MaterialCommunityIcons name="leaf" size={16} color="#ff9800" />,
    label: 'Autumn',
    color: '#ff9800',
  },
};

const QuestItemSeason: React.FC<QuestItemSeasonProps> = ({ season }) => {
  const { icon, label } = seasonData[season];

  return (
    <View className="flex-row items-center gap-2 mt-1">
      {icon}
      <Text className="text-xs text-gray-600 capitalize">{label}</Text>
    </View>
  );
};

export default QuestItemSeason;
