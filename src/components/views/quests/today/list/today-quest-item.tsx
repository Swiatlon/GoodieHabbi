import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import ShowDailyQuestItemModal from '../../daily/quest-modals/show-daily-quest-modal';
import QuestItemDate from '../../reusable/quest-item/quest-item-date';
import QuestItemDateMonthly from '../../reusable/quest-item/quest-item-date-monthly';
import QuestItemDifficulty from '../../reusable/quest-item/quest-item-difficulty';
import QuestItemScheduledTime from '../../reusable/quest-item/quest-item-scheduled-time';
import QuestItemSeason from '../../reusable/quest-item/quest-item-season';
import QuestItemTag from '../../reusable/quest-item/quest-item-tag';
import QuestItemDateWeekly from '../../reusable/quest-item/quest-item-weekly';
import Loader from '@/components/shared/loader/loader';
import QuestItemCheckmark from '@/components/views/quests/reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '@/components/views/quests/reusable/quest-item/quest-item-container';
import QuestItemEmoji from '@/components/views/quests/reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '@/components/views/quests/reusable/quest-item/quest-item-priority';
import QuestItemTitle from '@/components/views/quests/reusable/quest-item/quest-item-title';
import { IDailyQuest } from '@/contract/quests/quests-types/daily-quests';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { IOneTimeQuest } from '@/contract/quests/quests-types/one-time-quests';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';
import { AllQuestsUnion, useQuestMutations } from '@/hooks/quests/useGetAllQuests';
import { isSeasonalQuest, isWeeklyQuest, isMonthlyQuest } from '@/utils/quests/quests';

interface TodayQuestItemProps {
  quest: AllQuestsUnion;
}

const TodayQuestItem: React.FC<TodayQuestItemProps> = ({ quest }) => {
  const [isShowQuestModalVisible, setIsShowQuestModalVisible] = useState(false);
  const [isUpdateQuestModalVisible, setIsUpdateQuestModalVisible] = useState(false);
  const { patchQuest, deleteQuest, updateModal: UpdateQuestModal } = useQuestMutations(quest.questType);
  const [patchQuestMutation, { isLoading: isPatching }] = patchQuest();
  const [delteQuestMutation, { isLoading: isDeleting }] = deleteQuest();

  const openShowModal = () => setIsShowQuestModalVisible(true);
  const openUpdateModal = () => setIsUpdateQuestModalVisible(true);

  const closeShowModal = () => setIsShowQuestModalVisible(false);
  const closeUpdateModal = () => setIsUpdateQuestModalVisible(false);

  const isLoading = isPatching || isDeleting;

  return (
    <>
      {isLoading && <Loader fullscreen />}
      <QuestItemContainer completed={quest.isCompleted}>
        <View className="flex-1 flex-row items-center">
          <TouchableOpacity onPress={openShowModal} className="flex-1">
            <View className="flex-row items-center gap-2">
              <QuestItemEmoji emoji={quest.emoji} />
              <View className="flex-1 gap-2">
                <QuestItemTitle title={quest.title} isCompleted={quest.isCompleted} />
                {isSeasonalQuest(quest) && <QuestItemSeason season={quest.season} />}
                {isWeeklyQuest(quest) && <QuestItemDateWeekly weekdays={quest.weekdays} onPress={openShowModal} />}
                {isMonthlyQuest(quest) && <QuestItemDateMonthly startDay={quest.startDay} endDay={quest.endDay} />}
                <QuestItemPriority priority={quest.priority} />
                <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
                <QuestItemScheduledTime scheduledTime={quest.scheduledTime} />
                <QuestItemDifficulty difficulty={quest.difficulty} />
                <QuestItemTag tags={quest.labels} onPress={openShowModal} />
              </View>
            </View>
          </TouchableOpacity>
          <QuestItemCheckmark completed={quest.isCompleted} questId={quest.id} patchQuest={patchQuestMutation} isLoading={isLoading} />
        </View>
      </QuestItemContainer>
      <ShowDailyQuestItemModal
        quest={quest}
        isVisible={isShowQuestModalVisible}
        onClose={closeShowModal}
        deleteQuest={delteQuestMutation}
        onUpdate={() => {
          closeShowModal();
          openUpdateModal();
        }}
      />
      {isUpdateQuestModalVisible && (
        <UpdateQuestModal
          isVisible={isUpdateQuestModalVisible}
          onClose={closeUpdateModal}
          quest={quest as IOneTimeQuest & ISeasonalQuest & IMonthlyQuest & IDailyQuest & IWeeklyQuest}
        />
      )}
    </>
  );
};

export default TodayQuestItem;
