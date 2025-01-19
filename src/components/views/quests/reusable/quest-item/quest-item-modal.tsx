import React from 'react';
import { Text, View } from 'react-native';
import QuestItemDate from './quest-item-date';
import QuestItemPriority from './quest-item-priority';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { IOneTimeQuest, ISeasonalQuest } from '@/contract/quest';

interface QuestItemModalProps {
  quest: IOneTimeQuest | null | ISeasonalQuest;
  isVisible: boolean;
  onClose: () => void;
}

const QuestItemModal: React.FC<QuestItemModalProps> = ({ quest, isVisible, onClose }) => {
  if (!quest) {
    return null;
  }

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="flex gap-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl">{quest.emoji}</Text>
          <Text className="text-lg font-bold">{quest.title}</Text>
        </View>
        <Text className="text-sm text-gray-700">{quest.description}</Text>
        <View>
          <QuestItemPriority priority={quest.priority} />
          <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
        </View>
        <Button label="Close" onPress={onClose} className="mx-auto px-4" />
      </View>
    </Modal>
  );
};

export default QuestItemModal;
