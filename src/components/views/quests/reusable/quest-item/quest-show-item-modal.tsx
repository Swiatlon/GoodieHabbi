import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const ShowQuestItemModal: React.FC<QuestShowItemModalProps> = ({ quest, isVisible, onClose, deleteQuest, onUpdate }) => {
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
    <Modal isVisible={isVisible} onClose={onClose} className="min-h-[200px]">
      <View className="flex gap-4 h-full" testID="show-quest-modal">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">{quest.title}</Text>
          {quest.emoji && <Text className="text-2xl">{quest.emoji}</Text>}
        </View>
        <View>
          {quest.description && <Text className="text-sm text-gray-700">{quest.description}</Text>}
          {(quest.priority || quest.startDate || quest.endDate) && (
            <View>
              <QuestItemPriority priority={quest.priority} />
              <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
            </View>
          )}
        </View>
        <View className="flex-row justify-between mt-auto">
          <View className="flex-row gap-2">
            <Button
              label="Delete"
              styleType="danger"
              onPress={handleDelete}
              testID="btn-delete-quest"
              startIcon={<Ionicons name="trash-outline" size={18} color="white" />}
            />
            <Button
              label="Edit"
              styleType="accent"
              onPress={onUpdate}
              testID="btn-edit-quest"
              startIcon={<Ionicons name="create-outline" size={18} color="white" />}
            />
          </View>
          <Button
            label="Close"
            styleType="primary"
            onPress={onClose}
            testID="btn-close-quest-modal"
            startIcon={<Ionicons name="close-outline" size={18} color="white" />}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ShowQuestItemModal;
