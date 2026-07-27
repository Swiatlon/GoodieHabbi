import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ConfirmModal from '@/components/shared/confirm-modal/confirm-modal';
import Loader from '@/components/shared/loader/loader';
import GoalHeader from '@/components/views/goals/goal-header';
import GoalQuestSection from '@/components/views/goals/goal-quest-section';
import GoalSetButton from '@/components/views/goals/goal-set-button';
import GoalSetModal from '@/components/views/goals/goal-set-modal';
import GoalTimeSection from '@/components/views/goals/goal-time-section';
import { useGetAllQuests } from '@/hooks/quests/useGetAllQuests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetActiveGoalQuery, useUpdateActiveGoalMutation } from '@/redux/api/goals/goals-api';

const frequency = 'monthly';

const Monthly = () => {
  const { t } = useTranslation();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isGoalSetModalVisible, setIsGoalSetModalVisible] = useState(false);
  const { data: MonthlyGoal = null } = useGetActiveGoalQuery(frequency);
  const { isLoading } = useGetAllQuests();
  const { showSnackbar } = useSnackbar();
  const [updateActiveGoal] = useUpdateActiveGoalMutation();
  const methods = useForm();

  const openConfirmModal = () => setIsConfirmModalVisible(true);
  const closeConfirmModal = () => setIsConfirmModalVisible(false);

  const openSetGoalModal = () => setIsGoalSetModalVisible(true);
  const closeSetGoalModal = () => setIsGoalSetModalVisible(false);

  const handleConfirmCompletion = async () => {
    try {
      await updateActiveGoal({
        id: MonthlyGoal!.id,
        isCompleted: !MonthlyGoal!.isCompleted,
      }).unwrap();

      showSnackbar({
        text: t('goals.screens.completeSuccess'),
        variant: SnackbarVariantEnum.SUCCESS,
      });
    } catch {
      showSnackbar({
        text: t('goals.screens.completeError'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }

    closeConfirmModal();
  };

  if (isLoading) {
    return <Loader message={t('goals.screens.loadingQuests')} />;
  }

  return (
    <>
      <FormProvider {...methods}>
        <View className="flex-1 p-6 bg-white gap-6">
          <GoalHeader title={t('goals.header.monthly')} />
          <GoalTimeSection frequency={frequency} />
          <GoalQuestSection selectedQuest={MonthlyGoal} onComplete={openConfirmModal} />
          <GoalSetButton onPress={openSetGoalModal} disabled={!!MonthlyGoal} />
        </View>
      </FormProvider>

      {isGoalSetModalVisible && <GoalSetModal isVisible={isGoalSetModalVisible} onClose={closeSetGoalModal} frequency={frequency} />}

      {isConfirmModalVisible && (
        <ConfirmModal
          isVisible={isConfirmModalVisible}
          onAccept={handleConfirmCompletion}
          onClose={closeConfirmModal}
          title={t('goals.screens.confirmTitle')}
          message={t('goals.screens.confirmMessage')}
        />
      )}
    </>
  );
};

export default Monthly;
