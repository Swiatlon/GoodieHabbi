import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QuestItemCheckmark from '../../reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '../../reusable/quest-item/quest-item-container';
import QuestItemEmoji from '../../reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '../../reusable/quest-item/quest-item-priority';
import QuestItemTitle from '../../reusable/quest-item/quest-item-title';
import ShowQuestItemModal from '../../reusable/quest-item/quest-show-item-modal';
import { ITodayQuest } from '@/contract/quests/quests-types/today-quests';
import { usePatchTodayQuestMutation, useDeleteTodayQuestMutation } from '@/redux/api/today-quests-api';
interface TodayQuestItemProps {
  quest: ITodayQuest;
}

const TodayQuestItem: React.FC<TodayQuestItemProps> = ({ quest }) => {
  const [patchQuest, { isLoading: isPatching }] = usePatchTodayQuestMutation();
  const [deleteQuest] = useDeleteTodayQuestMutation();

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
              </View>
            </View>
          </TouchableOpacity>
          <QuestItemCheckmark
            completed={quest.isCompleted}
            questId={quest.id}
            patchQuest={patchQuest}
            isLoading={isPatching}
          />
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

      <UpdateTodayQuestModal isVisible={isUpdateQuestModalVisible} onClose={closeUpdateModal} quest={quest} />
    </>
  );
};

export default TodayQuestItem;
