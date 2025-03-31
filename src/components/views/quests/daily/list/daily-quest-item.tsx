import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QuestItemCheckmark from '../../reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '../../reusable/quest-item/quest-item-container';
import QuestItemDate from '../../reusable/quest-item/quest-item-date';
import QuestItemEmoji from '../../reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '../../reusable/quest-item/quest-item-priority';
import QuestItemTag from '../../reusable/quest-item/quest-item-tag';
import QuestItemTitle from '../../reusable/quest-item/quest-item-title';
import ShowQuestItemModal from '../../reusable/quest-item/quest-show-item-modal';
import UpdateDailyQuestModal from '../quest-modals/update-daily-quest-modal';
import Loader from '@/components/shared/loader/loader';
import { IDailyQuest } from '@/contract/quests/quests-types/daily-quests';
import { useDeleteDailyQuestMutation, usePatchDailyQuestMutation } from '@/redux/api/daily-quests-api';

interface DailyQuestItemProps {
  quest: IDailyQuest;
}

const DailyQuestItem: React.FC<DailyQuestItemProps> = ({ quest }) => {
  const [patchQuest, { isLoading: isPatching }] = usePatchDailyQuestMutation();
  const [deleteQuest, { isLoading: isDeleting }] = useDeleteDailyQuestMutation();

  const [isShowQuestModalVisible, setIsShowQuestModalVisible] = useState(false);
  const [isUpdateQuestModalVisible, setIsUpdateQuestModalVisible] = useState(false);

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
                <QuestItemTitle title={quest.title} description={quest.description} isCompleted={quest.isCompleted} />
                <QuestItemPriority priority={quest.priority} />
                <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
                <QuestItemTag tags={quest.labels} onPress={openShowModal} />
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
      {isUpdateQuestModalVisible && <UpdateDailyQuestModal isVisible={isUpdateQuestModalVisible} onClose={closeUpdateModal} quest={quest} />}
    </>
  );
};

export default DailyQuestItem;
