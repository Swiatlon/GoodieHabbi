import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SeasonEnum, SeasonEnumType } from '@/contract/quests/base-quests';

interface QuestItemSeasonProps {
  season: SeasonEnumType | null;
}

const seasonData: Record<SeasonEnumType, { icon: JSX.Element; labelKey: string; color: string }> = {
  [SeasonEnum.WINTER]: {
    icon: <MaterialCommunityIcons name="snowflake" size={16} color="#00bcd4" />,
    labelKey: 'quests.seasonal.seasons.winter',
    color: '#00bcd4',
  },
  [SeasonEnum.SPRING]: {
    icon: <MaterialCommunityIcons name="flower" size={16} color="#4caf50" />,
    labelKey: 'quests.seasonal.seasons.spring',
    color: '#4caf50',
  },
  [SeasonEnum.SUMMER]: {
    icon: <MaterialCommunityIcons name="white-balance-sunny" size={16} color="#ffeb3b" />,
    labelKey: 'quests.seasonal.seasons.summer',
    color: '#ffeb3b',
  },
  [SeasonEnum.AUTUMN]: {
    icon: <MaterialCommunityIcons name="leaf" size={16} color="#ff9800" />,
    labelKey: 'quests.seasonal.seasons.autumn',
    color: '#ff9800',
  },
};

const QuestItemSeason: React.FC<QuestItemSeasonProps> = ({ season }) => {
  const { t } = useTranslation();

  if (!season) {
    return null;
  }

  const { icon, labelKey } = seasonData[season];

  return (
    <View className="flex-row items-center gap-2 mt-1">
      {icon}
      <Text className="text-sm text-gray-600 capitalize">{t(labelKey)}</Text>
    </View>
  );
};

export default QuestItemSeason;
