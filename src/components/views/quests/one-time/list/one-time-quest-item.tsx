import React from 'react';
import { View } from 'react-native';
import QuestItemCheckmark from '../../reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '../../reusable/quest-item/quest-item-container';
import QuestItemDate from '../../reusable/quest-item/quest-item-date';
import QuestItemEmoji from '../../reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '../../reusable/quest-item/quest-item-priority';
import QuestItemTitle from '../../reusable/quest-item/quest-item-title';
import { IOneTimeQuest } from '@/contract/quest';

interface OneTimeQuestItemProps {
  quest: IOneTimeQuest;
  setQuests: React.Dispatch<React.SetStateAction<IOneTimeQuest[]>>;
}

const OneTimeQuestItem: React.FC<OneTimeQuestItemProps> = ({ quest, setQuests }) => {
  const toggleComplete = (): void => {
    setQuests(prev => prev.map(q => (q.id === quest.id ? { ...q, completed: !q.completed } : q)));
  };
  return (
    <QuestItemContainer completed={quest.completed}>
      <View className="flex-1 flex-row items-center">
        <QuestItemEmoji emoji={quest.emoji} />
        <View className="flex-1 gap-1">
          <QuestItemTitle title={quest.title} description={quest.description} completed={quest.completed} />
          <QuestItemPriority priority={quest.priority} />
          <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
        </View>
      </View>
      <QuestItemCheckmark completed={quest.completed} onToggle={toggleComplete} />
    </QuestItemContainer>
  );
};

export default OneTimeQuestItem;
