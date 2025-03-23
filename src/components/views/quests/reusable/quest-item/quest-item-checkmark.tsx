import React from 'react';
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
  const { showSnackbar } = useSnackbar();

  const handlePatch = () => {
    if (isLoading) {
      return;
    }

    patchQuest({ id: questId, isCompleted: !completed })
      .then(() => {
        showSnackbar({
          text: `Quest marked as ${!completed ? 'completed' : 'incomplete'}.`,
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
    <TouchableOpacity onPress={handlePatch} className="ml-4">
      <Ionicons name={completed ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={completed ? '#4caf50' : '#9e9e9e'} />
    </TouchableOpacity>
  );
};

export default QuestItemCheckmark;
