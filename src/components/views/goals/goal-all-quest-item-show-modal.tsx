import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuestItemDate from '../quests/reusable/quest-item/quest-item-date';
import QuestItemPriority from '../quests/reusable/quest-item/quest-item-priority';
import QuestItemSchedule from '../quests/reusable/quest-item/quest-item-schedule';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { IQuest } from '@/contract/quests/quest.contract';

interface GoalShowItemModalProps {
  quest: IQuest;
  isVisible: boolean;
  onClose: () => void;
}

const STAT_TILES = [
  { key: 'completionCount', labelKey: 'goals.questItemModal.completed', icon: 'checkmark-done-circle-outline', color: 'green' },
  { key: 'occurrenceCount', labelKey: 'goals.questItemModal.occurrences', icon: 'calendar-outline', color: 'blue' },
  { key: 'failureCount', labelKey: 'goals.questItemModal.failures', icon: 'close-circle-outline', color: 'red' },
  { key: 'currentStreak', labelKey: 'goals.questItemModal.streak', icon: 'flame-outline', color: 'orange' },
] as const;

const ShowQuestItemModalGoals: React.FC<GoalShowItemModalProps> = ({ quest, isVisible, onClose }) => {
  const { t } = useTranslation();

  const hasDetails = Boolean(quest.priority || quest.startDate || quest.endDate || quest.description);

  return (
    <Modal isVisible={isVisible} onClose={onClose} className="min-h-[200px]">
      <View className="flex gap-6 h-full items-center px-4 py-4">
        <View className="flex-row items-center gap-4 w-full justify-center">
          <Text className="text-lg font-bold text-center">{quest.title}</Text>
          {quest.emoji && <Text className="text-2xl">{quest.emoji}</Text>}
        </View>

        <View className="w-full px-2">
          <QuestItemSchedule schedule={quest.schedule} target={quest.target} />
        </View>

        {hasDetails && (
          <View className="flex w-full gap-2 px-2">
            {quest.description && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#F59E0B" />
                <Text className="text-base text-gray-600">{quest.description}</Text>
              </View>
            )}
            <QuestItemPriority priority={quest.priority} />
            <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
          </View>
        )}

        {/* A one-off has no statistics row at all — `statistics` is null for quests with no recurrence. */}
        {quest.statistics && (
          <View className="flex-row justify-evenly gap-6 w-full pt-6 border-t border-gray-200">
            {STAT_TILES.map(({ key, labelKey, icon, color }) => (
              <View key={key} className="items-center">
                <Ionicons name={icon} size={28} color={color} />
                <Text className="text-xs text-gray-600 mt-1">{t(labelKey)}</Text>
                <Text className="font-bold text-base">
                  {quest.statistics?.[key]}
                  {key === 'currentStreak' && (
                    <Text className="text-xs font-normal text-gray-500"> {t(`quests.reusable.statistics.streakUnit.${quest.schedule.unit}`)}</Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View className="flex-row justify-center mt-auto w-full">
          <Button
            label={t('common.close')}
            styleType="primary"
            onPress={onClose}
            startIcon={<Ionicons name="close-outline" size={18} color="white" />}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ShowQuestItemModalGoals;
