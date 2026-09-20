import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from '@/configs/day-js-config';
import { ICatchUpQuest, IsoDate } from '@/contract/quests/quest.contract';
import { useQuestCompletion } from '@/hooks/quests/use-quest-completion';
import { useGetCatchUpQuery } from '@/redux/api/quests/quests-api';
import { formatAmount } from '@/utils/quests/schedule';
import { toIsoDate } from '@/utils/utils/utils';

/**
 * "I did it, I just forgot to tick it."
 *
 * The endpoint only returns periods where a tap would still change the outcome, so an empty `days` means
 * there is genuinely nothing to ask about and the card hides itself rather than showing an empty state.
 * Ticking an item calls the ordinary completions endpoint with `completedOn` set to that day — there is
 * no separate backfill route, and the period rebuilds the streak exactly as a same-day tap would.
 *
 * `includeCompleted` is deliberately left off here: turning it on would keep finished days in the list
 * and break the "empty means hide me" rule the card is built on.
 */
const CatchUpCard: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetCatchUpQuery();
  const { complete, isLoading: isCompleting } = useQuestCompletion();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const days = data?.days ?? [];
  const pendingCount = days.reduce((total, day) => total + day.quests.length, 0);

  if (isLoading || isDismissed || pendingCount === 0) {
    return null;
  }

  const labelForDate = (date: IsoDate): string => {
    const today = toIsoDate(dayjs());
    const yesterday = toIsoDate(dayjs().subtract(1, 'day'));

    if (date === today) return t('quests.catchUp.today');
    if (date === yesterday) return t('quests.catchUp.yesterday');

    return dayjs(date).format('DD.MM');
  };

  const renderQuest = (quest: ICatchUpQuest, date: IsoDate) => (
    <View key={`${date}-${quest.questId}`} className="flex-row items-center justify-between py-2">
      <View className="flex-1 flex-row items-center gap-2">
        {quest.emoji && <Text className="text-base">{quest.emoji}</Text>}
        <Text className="flex-1 text-sm text-gray-700" numberOfLines={1}>
          {quest.title}
        </Text>
        {/* A partial period is not a fresh start — say how far it already got. */}
        {quest.progress > 0 && (
          <Text className="text-[11px] text-amber-600 font-bold">
            {t('quests.catchUp.progress', { progress: formatAmount(quest.progress), target: formatAmount(quest.target) })}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={async () => complete(quest.questId, { completedOn: date })}
        disabled={isCompleting}
        className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-primary ml-3"
        testID={`catch-up-complete-${quest.questId}`}
      >
        <Ionicons name="checkmark" size={14} color="#fff" />
        <Text className="text-white text-xs font-bold">{t('quests.catchUp.markDone')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="mx-4 mb-4 rounded-2xl bg-amber-50 border border-amber-200 p-4" testID="catch-up-card">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity className="flex-1 flex-row items-center gap-2" onPress={() => setIsExpanded(current => !current)}>
          <Ionicons name="time-outline" size={18} color="#b45309" />
          <Text className="flex-1 text-sm font-bold text-amber-800">{t('quests.catchUp.summary', { count: pendingCount })}</Text>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#b45309" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsDismissed(true)} className="ml-3" testID="catch-up-dismiss">
          <Ionicons name="close" size={18} color="#b45309" />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View className="mt-3 gap-3">
          {days.map(day => (
            <View key={day.date}>
              <Text className="text-[11px] font-bold uppercase tracking-wide text-amber-700 mb-1">{labelForDate(day.date)}</Text>
              <View className="divide-y divide-amber-100">{day.quests.map(quest => renderQuest(quest, day.date))}</View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CatchUpCard;
