import React from 'react';
import { View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuestDatesExtended from '../../reusable/show-quest-modal/quest-dates-extended';
import QuestDescriptionExtended from '../../reusable/show-quest-modal/quest-description-extended';
import QuestDifficultyExtended from '../../reusable/show-quest-modal/quest-difficulty-extended';
import QuestPriorityExtended from '../../reusable/show-quest-modal/quest-priority-extended';
import QuestScheduledTimeExtended from '../../reusable/show-quest-modal/quest-scheduled-extended';
import QuestStatisticsExtended from '../../reusable/show-quest-modal/quest-statistics-extended';
import QuestStatusExtended from '../../reusable/show-quest-modal/quest-status-extended';
import QuestTagsExtended from '../../reusable/show-quest-modal/quest-tags-extended';
import QuestTitleExtended from '../../reusable/show-quest-modal/quest-title-extended';
import QuestWeekdaysExtended from '../../reusable/show-quest-modal/quest-weekly-extended';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';

interface ShowWeeklyQuestItemModalProps {
  quest: IWeeklyQuest;
  isVisible: boolean;
  onClose: () => void;
  deleteQuest: (payload: { id: number }) => Promise<unknown>;
  onUpdate: () => void;
}

const ShowWeeklyQuestItemModal: React.FC<ShowWeeklyQuestItemModalProps> = ({ quest, isVisible, onClose, deleteQuest, onUpdate }) => {
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
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      className="max-h-[80%] p-4 rounded-lg"
      footer={
        <View className="flex-row flex-wrap justify-between mt-4 w-full">
          <Button
            label="Close"
            styleType="primary"
            onPress={onClose}
            testID="btn-close-quest-modal"
            startIcon={<Ionicons name="close-outline" size={18} color="white" />}
          />
          <Button
            label="Edit"
            styleType="accent"
            onPress={onUpdate}
            testID="btn-edit-quest"
            startIcon={<Ionicons name="create-outline" size={18} color="white" />}
          />
          <Button
            label="Delete"
            styleType="danger"
            onPress={handleDelete}
            testID="btn-delete-quest"
            startIcon={<Ionicons name="trash-outline" size={18} color="white" />}
          />
        </View>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
        <QuestTitleExtended title={quest.title} emoji={quest.emoji} />
        <QuestStatusExtended isCompleted={quest.isCompleted} />
        <QuestDescriptionExtended description={quest.description} />
        <QuestStatisticsExtended statistics={quest.statistics} />
        <QuestWeekdaysExtended weekdays={quest.weekdays} />
        <QuestPriorityExtended priority={quest.priority} />
        <QuestDifficultyExtended difficulty={quest.difficulty} />
        <QuestDatesExtended startDate={quest.startDate} endDate={quest.endDate} />
        <QuestScheduledTimeExtended scheduledTime={quest.scheduledTime} />
        <QuestTagsExtended tags={quest.labels} />
      </ScrollView>
    </Modal>
  );
};

export default ShowWeeklyQuestItemModal;
