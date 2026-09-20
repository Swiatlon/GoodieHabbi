import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ShowQuestItemModalGoals from './goal-all-quest-item-show-modal';
import QuestItemContainer from '@/components/views/quests/reusable/quest-item/quest-item-container';
import QuestItemDate from '@/components/views/quests/reusable/quest-item/quest-item-date';
import QuestItemEmoji from '@/components/views/quests/reusable/quest-item/quest-item-emoji';
import QuestItemPeriod from '@/components/views/quests/reusable/quest-item/quest-item-period';
import QuestItemPriority from '@/components/views/quests/reusable/quest-item/quest-item-priority';
import QuestItemSchedule from '@/components/views/quests/reusable/quest-item/quest-item-schedule';
import QuestItemTag from '@/components/views/quests/reusable/quest-item/quest-item-tag';
import QuestItemTitle from '@/components/views/quests/reusable/quest-item/quest-item-title';
import { IGetActiveGoalResponse } from '@/contract/goals/goals.contract';

interface AllQuestItemProps {
  quest: IGetActiveGoalResponse | null;
}

/** The quest behind a goal. Same row as everywhere else, minus the completion control — the goal screen
 * owns that button so it can confirm first. */
const AllQuestItemGoals: React.FC<AllQuestItemProps> = ({ quest }) => {
  const [isShowQuestModalVisible, setIsShowQuestModalVisible] = useState(false);

  const openShowModal = () => setIsShowQuestModalVisible(true);
  const closeShowModal = () => setIsShowQuestModalVisible(false);

  if (!quest) {
    return null;
  }

  return (
    <>
      <QuestItemContainer completed={quest.isCompleted} withoutDivider>
        <View className="flex-1 flex-row">
          <TouchableOpacity className="flex-row items-center gap-2" onPress={openShowModal}>
            <QuestItemEmoji emoji={quest.emoji} />
            <View className="flex-1 gap-2">
              <QuestItemTitle title={quest.title} isCompleted={quest.isCompleted} />
              <QuestItemSchedule schedule={quest.schedule} target={quest.target} onPress={openShowModal} />
              <QuestItemPeriod period={quest.currentPeriod} target={quest.target} />
              <QuestItemPriority priority={quest.priority} />
              <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
              <QuestItemTag tags={quest.labels} onPress={openShowModal} />
            </View>
          </TouchableOpacity>
        </View>
      </QuestItemContainer>

      <ShowQuestItemModalGoals quest={quest} isVisible={isShowQuestModalVisible} onClose={closeShowModal} />
    </>
  );
};

export default AllQuestItemGoals;
