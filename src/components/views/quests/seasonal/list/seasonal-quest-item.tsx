import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QuestItemCheckmark from '../../reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '../../reusable/quest-item/quest-item-container';
import QuestItemDate from '../../reusable/quest-item/quest-item-date';
import QuestItemDifficulty from '../../reusable/quest-item/quest-item-difficulty';
import QuestItemEmoji from '../../reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '../../reusable/quest-item/quest-item-priority';
import QuestItemScheduledTime from '../../reusable/quest-item/quest-item-scheduled-time';
import QuestItemSeason from '../../reusable/quest-item/quest-item-season';
import QuestItemTag from '../../reusable/quest-item/quest-item-tag';
import QuestItemTitle from '../../reusable/quest-item/quest-item-title';
import ShowSeasonalQuestItemModal from '../quest-modals/show-seasonal-quest-modal';
import UpdateSeasonalQuestModal from '../quest-modals/update-seasonal-quest-modal';
import Loader from '@/components/shared/loader/loader';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';
import { usePatchSeasonalQuestMutation, useDeleteSeasonalQuestMutation } from '@/redux/api/quests/seasonal-quests-api';

interface SeasonalQuestItemProps {
  quest: ISeasonalQuest;
}

const SeasonalQuestItem: React.FC<SeasonalQuestItemProps> = ({ quest }) => {
  const [patchQuest, { isLoading: isPatching }] = usePatchSeasonalQuestMutation();
  const [deleteQuest, { isLoading: isDeleting }] = useDeleteSeasonalQuestMutation();

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
                <QuestItemTitle title={quest.title} isCompleted={quest.isCompleted} />
                <QuestItemSeason season={quest.season} />
                <QuestItemPriority priority={quest.priority} />
                <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
                <QuestItemScheduledTime scheduledTime={quest.scheduledTime} endDate={quest.endDate} />
                <QuestItemDifficulty difficulty={quest.difficulty} />
                <QuestItemTag tags={quest.labels} onPress={openShowModal} />
              </View>
            </View>
          </TouchableOpacity>
          <QuestItemCheckmark completed={quest.isCompleted} questId={quest.id} patchQuest={patchQuest} isLoading={isPatching} />
        </View>
      </QuestItemContainer>
      <ShowSeasonalQuestItemModal
        quest={quest}
        isVisible={isShowQuestModalVisible}
        onClose={closeShowModal}
        deleteQuest={deleteQuest}
        onUpdate={() => {
          closeShowModal();
          openUpdateModal();
        }}
      />

      {isUpdateQuestModalVisible && <UpdateSeasonalQuestModal isVisible={isUpdateQuestModalVisible} onClose={closeUpdateModal} quest={quest} />}
    </>
  );
};

export default SeasonalQuestItem;
