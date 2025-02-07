import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QuestItemCheckmark from '@/components/views/quests/reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '@/components/views/quests/reusable/quest-item/quest-item-container';
import QuestItemDate from '@/components/views/quests/reusable/quest-item/quest-item-date';
import QuestItemEmoji from '@/components/views/quests/reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '@/components/views/quests/reusable/quest-item/quest-item-priority';
import QuestItemTitle from '@/components/views/quests/reusable/quest-item/quest-item-title';
import ShowQuestItemModal from '@/components/views/quests/reusable/quest-item/quest-show-item-modal';
import { IDailyQuest } from '@/contract/quests/quests-types/daily-quests';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { IOneTimeQuest } from '@/contract/quests/quests-types/one-time-quests';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';
import { AllQuestsUnion, useQuestMutations } from '@/hooks/quests/useGetAllQuests';

interface AllQuestItemProps {
  quest: AllQuestsUnion;
}

const AllQuestItem: React.FC<AllQuestItemProps> = ({ quest }) => {
  const [isShowQuestModalVisible, setIsShowQuestModalVisible] = useState(false);
  const [isUpdateQuestModalVisible, setIsUpdateQuestModalVisible] = useState(false);

  const { patchQuest, deleteQuest, updateModal: UpdateQuestModal } = useQuestMutations(quest.type);
  const [patchQuestMutation, { isLoading }] = patchQuest();
  const [delteQuestMutation] = deleteQuest();

  const openShowModal = () => setIsShowQuestModalVisible(true);
  const openUpdateModal = () => setIsUpdateQuestModalVisible(true);
  const closeShowModal = () => setIsShowQuestModalVisible(false);
  const closeUpdateModal = () => setIsUpdateQuestModalVisible(false);

  return (
    <>
      <QuestItemContainer completed={quest.isCompleted}>
        <View className="flex-1 flex-row items-center">
          <TouchableOpacity onPress={openShowModal} className="flex-1">
            <View className="flex-row items-center gap-2">
              <QuestItemEmoji emoji={quest.emoji} />
              <View className="flex-1 gap-1">
                <QuestItemTitle title={quest.title} description={quest.description} isCompleted={quest.isCompleted} />
                <QuestItemPriority priority={quest.priority} />
                <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
              </View>
            </View>
          </TouchableOpacity>
          <QuestItemCheckmark completed={quest.isCompleted} questId={quest.id} patchQuest={patchQuestMutation} isLoading={isLoading} />
        </View>
      </QuestItemContainer>
      <ShowQuestItemModal
        quest={quest}
        isVisible={isShowQuestModalVisible}
        onClose={closeShowModal}
        deleteQuest={delteQuestMutation}
        onUpdate={() => {
          closeShowModal();
          openUpdateModal();
        }}
      />
      <UpdateQuestModal
        isVisible={isUpdateQuestModalVisible}
        onClose={closeUpdateModal}
        quest={quest as IOneTimeQuest & ISeasonalQuest & IMonthlyQuest & IDailyQuest & IWeeklyQuest}
      />
    </>
  );
};

export default AllQuestItem;
