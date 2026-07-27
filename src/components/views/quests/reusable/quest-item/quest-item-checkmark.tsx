import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';

interface QuestItemCheckmarkProps {
  completed: boolean;
  questId: number;
  isLoading: boolean;
  patchQuest: (payload: { id: number; isCompleted: boolean }) => Promise<unknown>;
}

const QuestItemCheckmark: React.FC<QuestItemCheckmarkProps> = ({ completed, questId, patchQuest, isLoading }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const handlePatch = () => {
    if (isLoading) {
      return;
    }

    patchQuest({ id: questId, isCompleted: !completed })
      .then(() => {
        showSnackbar({
          text: !completed ? t('quests.reusable.itemCheckmark.completedSuccess') : t('quests.reusable.itemCheckmark.incompleteSuccess'),
          variant: SnackbarVariantEnum.SUCCESS,
        });
      })
      .catch(() => {
        showSnackbar({
          text: t('quests.reusable.itemCheckmark.updateError'),
          variant: SnackbarVariantEnum.ERROR,
        });
      });
  };

  return (
    <TouchableOpacity onPress={handlePatch} className="ml-4" testID="quest-item-checkmark">
      <Ionicons name={completed ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={completed ? '#4caf50' : '#9e9e9e'} />
    </TouchableOpacity>
  );
};

export default QuestItemCheckmark;
