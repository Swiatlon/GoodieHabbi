import React from 'react';
import { View, Text } from 'react-native';
import { IRecurringQuestStats } from '@/contract/quests/base-quests';

interface QuestStatisticsExtendedProps {
  statistics?: IRecurringQuestStats;
}

const STATISTICS_META = [
  {
    key: 'completionCount',
    label: 'Completed',
    emoji: '✅',
    colorClass: 'text-green-500',
  },
  {
    key: 'occurrenceCount',
    label: 'Occurrences',
    emoji: '📅',
    colorClass: 'text-blue-500',
  },
  {
    key: 'failureCount',
    label: 'Failures',
    emoji: '❌',
    colorClass: 'text-red-500',
  },
  {
    key: 'currentStreak',
    label: 'Streak',
    emoji: '🔥',
    colorClass: 'text-orange-500',
  },
  {
    key: 'longestStreak',
    label: 'Longest',
    emoji: '🏆',
    colorClass: 'text-purple-500',
  },
] as const;

const QuestStatisticsExtended: React.FC<QuestStatisticsExtendedProps> = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-2 gap-4">
        <Text className="text-2xl">📅</Text>
        <Text className="font-semibold text-gray-700">Statistics</Text>
      </View>
      <View className="flex-row flex-wrap justify-between my-2">
        {STATISTICS_META.map(({ key, label, emoji, colorClass }) => (
          <View key={key} className="items-center my-4">
            <Text className={`text-xl ${colorClass}`}>{emoji}</Text>
            <Text className="text-xs text-gray-600 my-2">{label}</Text>
            <Text className="font-bold text-base">{statistics[key]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default QuestStatisticsExtended;
