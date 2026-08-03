import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { IHabitSummary } from '@/contract/quests/analytics/quests-analytics.contract';
import { COMPLETION_COLOR, formatCompletionRate } from '@/utils/quests/analytics';

interface HabitRankingItemProps {
  habit: IHabitSummary;
}

const HabitRankingItem: React.FC<HabitRankingItemProps> = ({ habit }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { summary } = habit;
  const hasData = summary.completionRate !== null;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(authorized)/quests/analytics/${habit.questId}`)}
      className="flex-row items-center gap-3 py-3"
      accessibilityLabel={habit.title}
    >
      <Text className="text-lg w-7 text-center">{habit.emoji ?? '🎯'}</Text>

      <View className="flex-1 gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-800 flex-1 mr-2" numberOfLines={1}>
            {habit.title}
          </Text>
          <Text className={`text-sm font-bold ${hasData ? 'text-gray-800' : 'text-gray-400'}`}>{formatCompletionRate(summary.completionRate)}</Text>
        </View>

        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          {hasData && (
            <View
              className="h-full rounded-full"
              style={{ width: `${Math.round((summary.completionRate ?? 0) * 100)}%`, backgroundColor: COMPLETION_COLOR }}
            />
          )}
        </View>

        {/* No streak here: the overview's per-quest streaks survive neither the range clipping nor
            the summary merge, and the quest's own screen shows the real all-time figure. */}
        <Text className="text-[10px] text-gray-400">
          {hasData
            ? t('quests.analytics.overview.questMeta', {
                completed: summary.completedPeriods,
                evaluated: summary.evaluatedPeriods,
              })
            : t('quests.analytics.overview.questNoData')}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
    </TouchableOpacity>
  );
};

export default HabitRankingItem;
