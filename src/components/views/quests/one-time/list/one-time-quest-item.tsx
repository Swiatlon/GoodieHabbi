import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QuestItemCheckmark from '../../reusable/quest-item/quest-item-checkmark';
import QuestItemContainer from '../../reusable/quest-item/quest-item-container';
import QuestItemDate from '../../reusable/quest-item/quest-item-date';
import QuestItemEmoji from '../../reusable/quest-item/quest-item-emoji';
import QuestItemModal from '../../reusable/quest-item/quest-item-modal';
import QuestItemPriority from '../../reusable/quest-item/quest-item-priority';
import QuestItemTitle from '../../reusable/quest-item/quest-item-title';
import { IOneTimeQuest } from '@/contract/one-time-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { usePatchQuestMutation } from '@/redux/api/one-time-quests-api';

interface OneTimeQuestItemProps {
  quest: IOneTimeQuest;
}

const OneTimeQuestItem: React.FC<OneTimeQuestItemProps> = ({ quest }) => {
  const [patchQuest, { isLoading }] = usePatchQuestMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const { showSnackbar } = useSnackbar();

  const toggleComplete = () => {
    if (isLoading) {
      return;
    }

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
      });
  };
  return (
    <>
      <QuestItemContainer completed={quest.isCompleted}>
        <View className="flex-1 flex-row items-center">
          <TouchableOpacity onPress={openModal} className="flex-1">
            <View className="flex-row items-center gap-2">
              <QuestItemEmoji emoji={quest.emoji} />
              <View className="flex-1 gap-1">
                <QuestItemTitle title={quest.title} description={quest.description} isCompleted={quest.isCompleted} />
                <QuestItemPriority priority={quest.priority} />
                <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
              </View>
            </View>
          </TouchableOpacity>
          <QuestItemCheckmark completed={quest.isCompleted} onToggle={toggleComplete} />
        </View>
      </QuestItemContainer>
      <QuestItemModal quest={quest} isVisible={isModalVisible} onClose={closeModal} />
    </>
  );
};

export default OneTimeQuestItem;
