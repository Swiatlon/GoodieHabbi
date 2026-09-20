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
import { useQuestCompletion } from '@/hooks/quests/use-quest-completion';
import { useGetActiveGoalQuery } from '@/redux/api/goals/goals-api';

const frequency = 'daily';

const Daily = () => {
  const { t } = useTranslation();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isGoalSetModalVisible, setIsGoalSetModalVisible] = useState(false);
  const { data: dailyGoal = null, isLoading } = useGetActiveGoalQuery(frequency);
  const { complete } = useQuestCompletion();
  const methods = useForm();

  const openConfirmModal = () => setIsConfirmModalVisible(true);
  const closeConfirmModal = () => setIsConfirmModalVisible(false);

  const openSetGoalModal = () => setIsGoalSetModalVisible(true);
  const closeSetGoalModal = () => setIsGoalSetModalVisible(false);

  /*
   * A goal is completed by completing its quest — `PATCH /goals/{id}/completion` is deprecated,
   * ignores its body and has no undo. The goal is achieved as a consequence, by the first period
   * that reaches its target inside the goal window.
   */
  const handleConfirmCompletion = async () => {
    if (dailyGoal) {
      await complete(dailyGoal.id);
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
          <GoalHeader title={t('goals.header.daily')} />
          <GoalTimeSection frequency={frequency} />
          <GoalQuestSection selectedQuest={dailyGoal} onComplete={openConfirmModal} />
          <GoalSetButton onPress={openSetGoalModal} disabled={!!dailyGoal} />
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

export default Daily;
