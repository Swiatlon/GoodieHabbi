/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuestItemDate from '../quests/reusable/quest-item/quest-item-date';
import QuestItemPriority from '../quests/reusable/quest-item/quest-item-priority';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';

interface GoalShowItemModalProps {
  quest: AllQuestsUnion;
  isVisible: boolean;
  onClose: () => void;
}

const ShowQuestItemModalGoals: React.FC<GoalShowItemModalProps> = ({ quest, isVisible, onClose }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose} className="min-h-[200px]">
      <View className="flex gap-6 h-full items-center px-4 py-4">
        <View className="flex-row items-center gap-4 w-full justify-center">
          <Text className="text-lg font-bold text-center">{quest.title}</Text>
          {quest.emoji && <Text className="text-2xl">{quest.emoji}</Text>}
        </View>

        {(quest.priority || quest.startDate || quest.endDate || quest.description) && (
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

        {'statistics' in quest && quest.statistics !== null && (
          <View className="flex-row justify-evenly gap-6 w-full pt-6 border-t border-gray-200">
            <View className="items-center">
              <Ionicons name="checkmark-done-circle-outline" size={28} color="green" />
              <Text className="text-xs text-gray-600 mt-1">Completed</Text>
              <Text className="font-bold text-base">{(quest.statistics as { completionCount: number }).completionCount}</Text>
            </View>
            <View className="items-center">
              <Ionicons name="calendar-outline" size={28} color="blue" />
              <Text className="text-xs text-gray-600 mt-1">Occurrences</Text>
              <Text className="font-bold text-base">{(quest.statistics as { occurrenceCount: number }).occurrenceCount}</Text>
            </View>
            <View className="items-center">
              <Ionicons name="close-circle-outline" size={28} color="red" />
              <Text className="text-xs text-gray-600 mt-1">Failures</Text>
              <Text className="font-bold text-base">{(quest.statistics as { failureCount: number }).failureCount}</Text>
            </View>
            <View className="items-center">
              <Ionicons name="flame-outline" size={28} color="orange" />
              <Text className="text-xs text-gray-600 mt-1">Streak</Text>
              <Text className="font-bold text-base">{(quest.statistics as { currentStreak: number }).currentStreak}</Text>
            </View>
          </View>
        )}

        <View className="flex-row justify-center mt-auto w-full">
          <Button label="Close" styleType="primary" onPress={onClose} startIcon={<Ionicons name="close-outline" size={18} color="white" />} />
        </View>
      </View>
    </Modal>
  );
};

export default ShowQuestItemModalGoals;
