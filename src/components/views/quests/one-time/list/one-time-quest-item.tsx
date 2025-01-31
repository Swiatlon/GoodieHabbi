import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QuestItemCheckmark from '../../reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '../../reusable/quest-item/quest-item-container';
import QuestItemDate from '../../reusable/quest-item/quest-item-date';
import QuestItemEmoji from '../../reusable/quest-item/quest-item-emoji';
import QuestItemPriority from '../../reusable/quest-item/quest-item-priority';
import QuestItemTitle from '../../reusable/quest-item/quest-item-title';
import ShowQuestItemModal from '../../reusable/quest-item/quest-show-item-modal';
import UpdateOneTimeQuestModal from '../quest-modals/update-one-time-quest-modal';
import { IOneTimeQuest } from '@/contract/one-time-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { usePatchQuestMutation, useDeleteQuestMutation } from '@/redux/api/one-time-quests-api';

interface OneTimeQuestItemProps {
  quest: IOneTimeQuest;
}

const OneTimeQuestItem: React.FC<OneTimeQuestItemProps> = ({ quest }) => {
  const { showSnackbar } = useSnackbar();
  const [patchQuest, { isLoading }] = usePatchQuestMutation();
  const [deleteQuest] = useDeleteQuestMutation();

  const [isShowQuestModalVisible, setIsShowQuestModalVisible] = useState(false);
  const [isUpdateQuestModalVisible, setIsUpdateQuestModalVisible] = useState(false);

  const openShowModal = () => setIsShowQuestModalVisible(true);
  const openUpdateModal = () => setIsUpdateQuestModalVisible(true);

  const closeShowModal = () => setIsShowQuestModalVisible(false);
  const closeUpdateModal = () => setIsUpdateQuestModalVisible(false);

  const handlePatch = () => {
    if (isLoading) return;

    patchQuest({
      id: quest.id,
      isCompleted: !quest.isCompleted,
    })
      .unwrap()
      .then(() => {
        showSnackbar({
          text: `Quest marked as ${!quest.isCompleted ? 'completed' : 'incomplete'}.`,
          variant: SnackbarVariantEnum.SUCCESS,
        });
      })
      .catch(() => {
        showSnackbar({
          text: 'Failed to update quest. Please try again.',
          variant: SnackbarVariantEnum.ERROR,
        });
      })
      .finally(() => closeShowModal());
  };

  const handleDelete = () => {
    deleteQuest({ id: quest.id })
      .unwrap()
      .then(() => {
        showSnackbar({
          text: 'Quest deleted successfully.',
          variant: SnackbarVariantEnum.SUCCESS,
        });
        closeShowModal();
      })
      .catch(() => {
        showSnackbar({
          text: 'Failed to delete quest. Please try again.',
          variant: SnackbarVariantEnum.ERROR,
        });
      })
      .finally(() => closeShowModal());
  };

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
          <QuestItemCheckmark completed={quest.isCompleted} onToggle={handlePatch} />
        </View>
      </QuestItemContainer>
      <ShowQuestItemModal
        quest={quest}
        isVisible={isShowQuestModalVisible}
        onClose={closeShowModal}
        onDelete={handleDelete}
        onUpdate={() => {
          closeShowModal();
          openUpdateModal();
        }}
      />
      <UpdateOneTimeQuestModal isVisible={isUpdateQuestModalVisible} onClose={closeUpdateModal} quest={quest} />
    </>
  );
};

export default OneTimeQuestItem;
