import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QuestItemCheckmark from '../../reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '../../reusable/quest-item/quest-item-container';
import QuestItemDate from '../../reusable/quest-item/quest-item-date';
import QuestItemDateMonthly from '../../reusable/quest-item/quest-item-date-monthly';
import QuestItemEmoji from '../../reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '../../reusable/quest-item/quest-item-priority';
import QuestItemTitle from '../../reusable/quest-item/quest-item-title';
import ShowQuestItemModal from '../../reusable/quest-item/quest-show-item-modal';
import UpdateMonthlyQuestModal from '../quest-modals/update-monthly-quest-modal';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { useDeleteMonthlyQuestMutation, usePatchMonthlyQuestMutation } from '@/redux/api/monthly-quests-api';

interface MonthlyQuestItemProps {
  quest: IMonthlyQuest;
}

const MonthlyQuestItem: React.FC<MonthlyQuestItemProps> = ({ quest }) => {
  const [patchQuest, { isLoading: isPatching }] = usePatchMonthlyQuestMutation();
  const [deleteQuest] = useDeleteMonthlyQuestMutation();

  const [isShowQuestModalVisible, setIsShowQuestModalVisible] = useState(false);
  const [isUpdateQuestModalVisible, setIsUpdateQuestModalVisible] = useState(false);

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
                <QuestItemDateMonthly startDay={quest.startDay} endDay={quest.endDay} />
              </View>
            </View>
          </TouchableOpacity>
          <QuestItemCheckmark completed={quest.isCompleted} questId={quest.id} patchQuest={patchQuest} isLoading={isPatching} />
        </View>
      </QuestItemContainer>
      <ShowQuestItemModal
        quest={quest}
        isVisible={isShowQuestModalVisible}
        onClose={closeShowModal}
        deleteQuest={deleteQuest}
        onUpdate={() => {
          closeShowModal();
          openUpdateModal();
        }}
      />

      <UpdateMonthlyQuestModal isVisible={isUpdateQuestModalVisible} onClose={closeUpdateModal} quest={quest} />
    </>
  );
};

export default MonthlyQuestItem;
