import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QuestItemCheckmark from '../reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '../reusable/quest-item/quest-item-container';
import QuestItemDate from '../reusable/quest-item/quest-item-date';
import QuestItemEmoji from '../reusable/quest-item/quest-item-emoji';
import QuestItemModal from '../reusable/quest-item/quest-item-modal';
import QuestItemPriority from '../reusable/quest-item/quest-item-priority';
import QuestItemTitle from '../reusable/quest-item/quest-item-title';
import { ITodayQuest } from '@/contract/quest';

interface TodayQuestItemProps {
  quest: ITodayQuest;
  setQuests: React.Dispatch<React.SetStateAction<ITodayQuest[]>>;
}

const TodayQuestItem: React.FC<TodayQuestItemProps> = ({ quest, setQuests }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleComplete = (): void => {
    setQuests(prev => prev.map(q => (q.id === quest.id ? { ...q, completed: !q.completed } : q)));
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <>
      <QuestItemContainer completed={quest.completed}>
        <View className="flex-1 flex-row items-center">
          <TouchableOpacity onPress={openModal} className="flex-1">
            <View className="flex-row items-center gap-2">
              <QuestItemEmoji emoji={quest.emoji} />
              <View className="flex-1 gap-1">
                <QuestItemTitle title={quest.title} description={quest.description} completed={quest.completed} />
                <QuestItemPriority priority={quest.priority} />
                <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
              </View>
            </View>
          </TouchableOpacity>
          <QuestItemCheckmark completed={quest.completed} onToggle={toggleComplete} />
        </View>
      </QuestItemContainer>
      <QuestItemModal quest={quest} isVisible={isModalVisible} onClose={closeModal} />
    </>
  );
};
export default TodayQuestItem;
