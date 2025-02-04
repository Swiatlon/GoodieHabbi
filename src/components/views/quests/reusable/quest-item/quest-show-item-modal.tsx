import React from 'react';
import { Text, View } from 'react-native';
import QuestItemDate from './quest-item-date';
import QuestItemPriority from './quest-item-priority';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { IOneTimeQuest } from '@/contract/quests/quests-types/one-time-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';

interface QuestShowItemModalProps {
  quest: IOneTimeQuest;
  isVisible: boolean;
  onClose: () => void;
  deleteQuest: (payload: { id: number }) => Promise<unknown>;
  onUpdate: () => void;
}

const ShowQuestItemModal: React.FC<QuestShowItemModalProps> = ({
  quest,
  isVisible,
  onClose,
  deleteQuest,
  onUpdate,
}) => {
  const { showSnackbar } = useSnackbar();

  const handleDelete = () => {
    deleteQuest({ id: quest.id })
      .then(() => {
        showSnackbar({
          text: 'Quest deleted successfully.',
          variant: SnackbarVariantEnum.SUCCESS,
        });
        onClose();
      })
      .catch(() => {
        showSnackbar({
          text: 'Failed to delete quest. Please try again.',
          variant: SnackbarVariantEnum.ERROR,
        });
      });
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="flex gap-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">{quest.title}</Text>
          {quest.emoji && <Text className="text-2xl">{quest.emoji}</Text>}
        </View>
        {quest.description && <Text className="text-sm text-gray-700">{quest.description}</Text>}
        {(quest.priority || quest.startDate || quest.endDate) && (
          <View>
            <QuestItemPriority priority={quest.priority} />
            <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
          </View>
        )}
        <View className="flex-row justify-between mt-4">
          <View className="flex-row gap-2">
            <Button label="Delete" styleType="danger" onPress={handleDelete} />
            <Button label="Edit" styleType="accent" onPress={onUpdate} />
          </View>
          <Button label="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ShowQuestItemModal;
