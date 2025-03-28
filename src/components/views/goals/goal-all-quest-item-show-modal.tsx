import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuestItemDate from '../quests/reusable/quest-item/quest-item-date';
import QuestItemPriority from '../quests/reusable/quest-item/quest-item-priority';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { IOneTimeQuest } from '@/contract/quests/quests-types/one-time-quests';

interface GoalShowItemModalProps {
  quest: IOneTimeQuest;
  isVisible: boolean;
  onClose: () => void;
}

const ShowQuestItemModalGoals: React.FC<GoalShowItemModalProps> = ({ quest, isVisible, onClose }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose} className="min-h-[200px]">
      <View className="flex gap-4 h-full">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">{quest.title}</Text>
          {quest.emoji && <Text className="text-2xl">{quest.emoji}</Text>}
        </View>
        <View>
          {quest.description && <Text className="text-sm text-gray-700">{quest.description}</Text>}
          {(quest.priority || quest.startDate || quest.endDate) && (
            <View>
              <QuestItemPriority priority={quest.priority} />
              <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
            </View>
          )}
        </View>
        <View className="flex-row justify-between mt-auto">
          <Button label="Close" styleType="primary" onPress={onClose} startIcon={<Ionicons name="close-outline" size={18} color="white" />} />
        </View>
      </View>
    </Modal>
  );
};

export default ShowQuestItemModalGoals;
