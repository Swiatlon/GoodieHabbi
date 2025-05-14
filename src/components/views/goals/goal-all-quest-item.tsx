import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import QuestItemDateMonthly from '../quests/reusable/quest-item/quest-item-date-monthly';
import QuestItemSeason from '../quests/reusable/quest-item/quest-item-season';
import QuestItemTag from '../quests/reusable/quest-item/quest-item-tag';
import QuestItemDateWeekly from '../quests/reusable/quest-item/quest-item-weekly';
import ShowQuestItemModalGoals from './goal-all-quest-item-show-modal';
import QuestItemContainer from '@/components/views/quests/reusable/quest-item/quest-item-container';
import QuestItemDate from '@/components/views/quests/reusable/quest-item/quest-item-date';
import QuestItemEmoji from '@/components/views/quests/reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '@/components/views/quests/reusable/quest-item/quest-item-priority';
import QuestItemTitle from '@/components/views/quests/reusable/quest-item/quest-item-title';
import { IGetActiveGoalResponse } from '@/contract/goals/goals.contract';
import { isMonthlyQuest, isSeasonalQuest, isWeeklyQuest } from '@/utils/quests/quests';

interface AllQuestItemProps {
  quest: IGetActiveGoalResponse | null;
}

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
              <QuestItemTitle title={quest.title} description={quest.description} isCompleted={quest.isCompleted} />
              <QuestItemPriority priority={quest.priority} />
              {isSeasonalQuest(quest) && <QuestItemSeason season={quest.season} />}
              <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
              {isWeeklyQuest(quest) && <QuestItemDateWeekly weekdays={quest.weekdays} onPress={openShowModal} />}
              {isMonthlyQuest(quest) && <QuestItemDateMonthly startDay={quest.startDay} endDay={quest.endDay} />}
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
