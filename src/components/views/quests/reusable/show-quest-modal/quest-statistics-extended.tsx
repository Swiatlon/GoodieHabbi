import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { IRecurringQuestStats } from '@/contract/quests/base-quests';

interface QuestStatisticsExtendedProps {
  statistics?: IRecurringQuestStats;
  /** Only repeatable quests have analytics — omit to hide the link. */
  questId?: number;
  /** Closes the modal so the analytics screen is not pushed underneath it. */
  onClose?: () => void;
}

const STATISTICS_META = [
  {
    key: 'completionCount',
    labelKey: 'quests.reusable.statistics.completed',
    emoji: '✅',
    colorClass: 'text-green-500',
  },
  {
    key: 'occurrenceCount',
    labelKey: 'quests.reusable.statistics.occurrences',
    emoji: '📅',
    colorClass: 'text-blue-500',
  },
  {
    key: 'failureCount',
    labelKey: 'quests.reusable.statistics.failures',
    emoji: '❌',
    colorClass: 'text-red-500',
  },
  {
    key: 'currentStreak',
    labelKey: 'quests.reusable.statistics.streak',
    emoji: '🔥',
    colorClass: 'text-orange-500',
  },
  {
    key: 'longestStreak',
    labelKey: 'quests.reusable.statistics.longest',
    emoji: '🏆',
    colorClass: 'text-purple-500',
  },
] as const;

const QuestStatisticsExtended: React.FC<QuestStatisticsExtendedProps> = ({ statistics, questId, onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (!statistics) return null;

  const handleShowAnalytics = () => {
    onClose?.();
    router.push(`/(authorized)/quests/analytics/${questId}`);
  };

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-2 gap-4">
        <Text className="text-2xl">📅</Text>
        <Text className="font-semibold text-gray-700">{t('quests.reusable.statistics.heading')}</Text>
      </View>
      <View className="flex-row flex-wrap justify-between my-2">
        {STATISTICS_META.map(({ key, labelKey, emoji, colorClass }) => (
          <View key={key} className="items-center my-4">
            <Text className={`text-xl ${colorClass}`}>{emoji}</Text>
            <Text className="text-xs text-gray-600 my-2">{t(labelKey)}</Text>
            <Text className="font-bold text-base">{statistics[key]}</Text>
          </View>
        ))}
      </View>

      {questId !== undefined && (
        <TouchableOpacity onPress={handleShowAnalytics} className="flex-row items-center justify-center gap-2 pt-3 border-t border-gray-100">
          <Ionicons name="stats-chart-outline" size={16} color="#1987EE" />
          <Text className="text-sm font-semibold text-primary">{t('quests.analytics.openFromQuest')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default QuestStatisticsExtended;
