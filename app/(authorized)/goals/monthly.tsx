import React, { useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View } from 'react-native';
import ConfirmModal from '@/components/shared/confirm-modal/confirm-modal';
import Loader from '@/components/shared/loader/loader';
import GoalHeader from '@/components/views/goals/goal-header';
import GoalQuestSection from '@/components/views/goals/goal-quest-section';
import GoalSetButton from '@/components/views/goals/goal-set-button';
import GoalSetModal from '@/components/views/goals/goal-set-modal';
import GoalTimeSection from '@/components/views/goals/goal-time-section';
import { useGetAllQuests } from '@/hooks/quests/useGetAllQuests';

const frequency = 'monthly';

const Monthly = () => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isGoalSetModalVisible, setIsGoalSetModalVisible] = useState(false);
  const { data: fetchedQuests = [], isLoading } = useGetAllQuests();
  const methods = useForm();
  const selectedQuest = useMemo(() => fetchedQuests[0] || null, [fetchedQuests]);
  const openConfirmModal = () => setIsConfirmModalVisible(true);
  const closeConfirmModal = () => setIsConfirmModalVisible(false);

  const openSetGoalModal = () => setIsGoalSetModalVisible(true);
  const closeSetGoalModal = () => setIsGoalSetModalVisible(false);

  const handleConfirmCompletion = () => {
    closeConfirmModal();
  };

  if (isLoading) {
    return <Loader message="Fetching quests..." />;
  }

  return (
    <>
      <FormProvider {...methods}>
        <View className="flex-1 p-6 bg-white gap-6">
          <GoalHeader title="Monthly goal" />
          <GoalTimeSection frequency={frequency} />
          <GoalQuestSection selectedQuest={selectedQuest} onComplete={openConfirmModal} />
          <GoalSetButton onPress={openSetGoalModal} disabled={!!selectedQuest} />
        </View>
      </FormProvider>

      {isGoalSetModalVisible && <GoalSetModal isVisible={isGoalSetModalVisible} onClose={closeSetGoalModal} />}

      {isConfirmModalVisible && (
        <ConfirmModal
          isVisible={isConfirmModalVisible}
          onAccept={handleConfirmCompletion}
          onClose={closeConfirmModal}
          title="Complete Quest?"
          message="Are you sure you want to mark this quest as completed?"
        />
      )}
    </>
  );
};

export default Monthly;
