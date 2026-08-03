import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const handleDelete = () => {
    deleteQuest({ id: quest.id })
      .then(() => {
        showSnackbar({
          text: t('quests.weekly.showModal.deletedSuccess'),
          variant: SnackbarVariantEnum.SUCCESS,
        });
        onClose();
      })
      .catch(() => {
        showSnackbar({
          text: t('quests.weekly.showModal.deletedError'),
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
            label={t('quests.weekly.showModal.closeButton')}
            styleType="primary"
            onPress={onClose}
            testID="btn-close-quest-modal"
            startIcon={<Ionicons name="close-outline" size={18} color="white" />}
          />
          <Button
            label={t('quests.weekly.showModal.editButton')}
            styleType="accent"
            onPress={onUpdate}
            testID="btn-edit-quest"
            startIcon={<Ionicons name="create-outline" size={18} color="white" />}
          />
          <Button
            label={t('quests.weekly.showModal.deleteButton')}
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
        <QuestStatisticsExtended statistics={quest.statistics} questId={quest.id} onClose={onClose} />
        <QuestWeekdaysExtended weekdays={quest.weekdays} />
        <QuestPriorityExtended priority={quest.priority} />
        <QuestDifficultyExtended difficulty={quest.difficulty} />
        <QuestDatesExtended startDate={quest.startDate} endDate={quest.endDate} />
        <QuestScheduledTimeExtended scheduledTime={quest.scheduledTime} endDate={quest.endDate} />
        <QuestTagsExtended tags={quest.labels} />
      </ScrollView>
    </Modal>
  );
};

export default ShowWeeklyQuestItemModal;
