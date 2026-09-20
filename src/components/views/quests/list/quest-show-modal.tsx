import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuestItemSchedule from '../reusable/quest-item/quest-item-schedule';
import QuestDatesExtended from '../reusable/show-quest-modal/quest-dates-extended';
import QuestDescriptionExtended from '../reusable/show-quest-modal/quest-description-extended';
import QuestDifficultyExtended from '../reusable/show-quest-modal/quest-difficulty-extended';
import QuestPriorityExtended from '../reusable/show-quest-modal/quest-priority-extended';
import QuestScheduledTimeExtended from '../reusable/show-quest-modal/quest-scheduled-extended';
import QuestStatisticsExtended from '../reusable/show-quest-modal/quest-statistics-extended';
import QuestStatusExtended from '../reusable/show-quest-modal/quest-status-extended';
import QuestTagsExtended from '../reusable/show-quest-modal/quest-tags-extended';
import QuestTitleExtended from '../reusable/show-quest-modal/quest-title-extended';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { IQuest } from '@/contract/quests/quest.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteQuestMutation } from '@/redux/api/quests/quests-api';
import { isRepeatingQuest } from '@/utils/quests/schedule';

interface QuestShowModalProps {
  quest: IQuest;
  isVisible: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

/**
 * Quest details, with the three type-specific badges (season, weekdays, month range) collapsed into the
 * one schedule line. Statistics and the analytics link show only for repeating quests — a one-off has
 * no streak and the analytics endpoint answers 400 for it.
 */
const QuestShowModal: React.FC<QuestShowModalProps> = ({ quest, isVisible, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [deleteQuest] = useDeleteQuestMutation();

  const isRepeating = isRepeatingQuest(quest);

  const handleDelete = async () => {
    try {
      await deleteQuest({ id: quest.id }).unwrap();
      showSnackbar({ text: t('quests.reusable.showModal.deletedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('quests.reusable.showModal.deletedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} className="max-h-[80%] p-4 rounded-lg" testID="show-quest-modal">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
        <QuestTitleExtended title={quest.title} emoji={quest.emoji} />
        <QuestStatusExtended isCompleted={quest.isCompleted} />
        <QuestDescriptionExtended description={quest.description} />
        <QuestItemSchedule schedule={quest.schedule} target={quest.target} />
        {isRepeating && (
          <QuestStatisticsExtended statistics={quest.statistics ?? undefined} questId={quest.id} onClose={onClose} streakUnit={quest.schedule.unit} />
        )}
        <QuestPriorityExtended priority={quest.priority} />
        <QuestDifficultyExtended difficulty={quest.difficulty} />
        <QuestDatesExtended startDate={quest.startDate} endDate={quest.endDate} />
        <QuestScheduledTimeExtended scheduledTime={quest.scheduledTime} endDate={quest.endDate} />
        <QuestTagsExtended tags={quest.labels} />
      </ScrollView>

      <View className="flex-row flex-wrap justify-between mt-4 w-full">
        <Button
          label={t('quests.reusable.showModal.closeButton')}
          styleType="primary"
          onPress={onClose}
          testID="btn-close-quest-modal"
          startIcon={<Ionicons name="close-outline" size={18} color="white" />}
        />
        <Button
          label={t('quests.reusable.showModal.editButton')}
          styleType="accent"
          onPress={onUpdate}
          testID="btn-edit-quest"
          startIcon={<Ionicons name="create-outline" size={18} color="white" />}
        />
        <Button
          label={t('quests.reusable.showModal.deleteButton')}
          styleType="danger"
          onPress={handleDelete}
          testID="btn-delete-quest"
          startIcon={<Ionicons name="trash-outline" size={18} color="white" />}
        />
      </View>
    </Modal>
  );
};

export default QuestShowModal;
