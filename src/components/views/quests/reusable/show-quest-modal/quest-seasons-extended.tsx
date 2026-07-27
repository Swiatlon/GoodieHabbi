import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { SeasonEnum, SeasonEnumType } from '@/contract/quests/base-quests';

interface QuestSeasonExtendedProps {
  season?: SeasonEnumType | null;
}

const seasonMeta: Record<
  SeasonEnumType,
  {
    labelKey: string;
    emoji: string;
    colorClass: string;
    descriptionKey: string;
  }
> = {
  [SeasonEnum.WINTER]: {
    labelKey: 'quests.seasonal.seasons.winter',
    emoji: '❄️',
    colorClass: 'text-blue-500',
    descriptionKey: 'quests.reusable.season.descriptions.winter',
  },
  [SeasonEnum.SPRING]: {
    labelKey: 'quests.seasonal.seasons.spring',
    emoji: '🌸',
    colorClass: 'text-green-500',
    descriptionKey: 'quests.reusable.season.descriptions.spring',
  },
  [SeasonEnum.SUMMER]: {
    labelKey: 'quests.seasonal.seasons.summer',
    emoji: '☀️',
    colorClass: 'text-yellow-500',
    descriptionKey: 'quests.reusable.season.descriptions.summer',
  },
  [SeasonEnum.AUTUMN]: {
    labelKey: 'quests.seasonal.seasons.autumn',
    emoji: '🍂',
    colorClass: 'text-orange-500',
    descriptionKey: 'quests.reusable.season.descriptions.autumn',
  },
};

const QuestSeasonExtended: React.FC<QuestSeasonExtendedProps> = ({ season }) => {
  const { t } = useTranslation();

  if (!season) return null;

  const meta = seasonMeta[season];

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className={`${meta.colorClass} text-3xl`}>{meta.emoji}</Text>
      <View>
        <Text className={`${meta.colorClass} font-semibold text-base`}>
          {t('quests.reusable.season.prefix')} {t(meta.labelKey)}
        </Text>
        <Text className="text-gray-500 text-xs">{t(meta.descriptionKey)}</Text>
      </View>
    </View>
  );
};

export default QuestSeasonExtended;
