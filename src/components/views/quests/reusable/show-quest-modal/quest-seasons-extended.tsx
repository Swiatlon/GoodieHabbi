import React from 'react';
import { View, Text } from 'react-native';
import { SeasonEnum, SeasonEnumType } from '@/contract/quests/base-quests';

interface QuestSeasonExtendedProps {
  season?: SeasonEnumType | null;
}

const seasonMeta: Record<
  SeasonEnumType,
  {
    label: string;
    emoji: string;
    colorClass: string;
    description: string;
  }
> = {
  [SeasonEnum.WINTER]: {
    label: 'Winter',
    emoji: '❄️',
    colorClass: 'text-blue-500',
    description: 'Cold and snowy season',
  },
  [SeasonEnum.SPRING]: {
    label: 'Spring',
    emoji: '🌸',
    colorClass: 'text-green-500',
    description: 'Season of growth and renewal',
  },
  [SeasonEnum.SUMMER]: {
    label: 'Summer',
    emoji: '☀️',
    colorClass: 'text-yellow-500',
    description: 'Hot and sunny days',
  },
  [SeasonEnum.AUTUMN]: {
    label: 'Autumn',
    emoji: '🍂',
    colorClass: 'text-orange-500',
    description: 'Cool and colorful fall',
  },
};

const QuestSeasonExtended: React.FC<QuestSeasonExtendedProps> = ({ season }) => {
  if (!season) return null;

  const meta = seasonMeta[season];

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className={`${meta.colorClass} text-3xl`}>{meta.emoji}</Text>
      <View>
        <Text className={`${meta.colorClass} font-semibold text-base`}>Season: {meta.label}</Text>
        <Text className="text-gray-500 text-xs">{meta.description}</Text>
      </View>
    </View>
  );
};

export default QuestSeasonExtended;
