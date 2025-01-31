import React from 'react';
import { Text, View } from 'react-native';
import QuestItemDate from './quest-item-date';
import QuestItemPriority from './quest-item-priority';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { IOneTimeQuest } from '@/contract/one-time-quests';

interface QuestShowItemModalProps {
  quest: IOneTimeQuest;
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

const ShowQuestItemModal: React.FC<QuestShowItemModalProps> = ({ quest, isVisible, onClose, onDelete, onUpdate }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="flex gap-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">{quest.title}</Text>
          {quest.emoji && <Text className="text-2xl">{quest.emoji}</Text>}
        </View>
        {quest.description && <Text className="text-sm text-gray-700">{quest.description}</Text>}
        {(quest.priority || quest.startDate || quest.endDate) && (
          <View>
            <QuestItemPriority priority={quest.priority} />
            <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
          </View>
        )}
        <View className="flex-row justify-between mt-4">
          <Button label="Delete" styleType="danger" onPress={onDelete} />
          <Button label="Close" onPress={onClose} />
          <Button label="Edit" styleType="accent" onPress={onUpdate} />
        </View>
      </View>
    </Modal>
  );
};

export default ShowQuestItemModal;
