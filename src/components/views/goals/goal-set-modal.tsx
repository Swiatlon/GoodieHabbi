import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GoalQuestSection from './goal-quest-section';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import Select, { SelectItemValue } from '@/components/shared/select/select';
import { IGetActiveGoalResponse } from '@/contract/goals/goals.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateGoalMutation } from '@/redux/api/goals/goals-api';
import { useGetEligibleQuestsForGoalsQuery } from '@/redux/api/quests/today-quests-api';

interface GoalSetModalProps {
  isVisible: boolean;
  onClose: () => void;
  frequency: string;
}

const GoalSetModal: React.FC<GoalSetModalProps> = ({ isVisible, onClose, frequency }) => {
  const { t } = useTranslation();
  const { data: fetchedQuests = [], isLoading } = useGetEligibleQuestsForGoalsQuery();
  const [selectedQuest, setSelectedQuest] = useState<IGetActiveGoalResponse | null>(null);
  const { showSnackbar } = useSnackbar();
  const [sendGoal] = useCreateGoalMutation();

  const options = useMemo(
    () =>
      fetchedQuests
        .filter(item => !item.isCompleted)
        .map(quest => ({
          label: `${quest.emoji ?? ''} ${quest.title}`,
          value: quest.id,
        })),
    [fetchedQuests]
  );

  const handleSelectChange = (selected: SelectItemValue) => {
    const newQuest = fetchedQuests.find(quest => quest.id === selected) ?? null;
    setSelectedQuest(newQuest as IGetActiveGoalResponse | null);
  };

  const handleSubmit = async () => {
    if (!selectedQuest) {
      return;
    }

    try {
      await sendGoal({
        data: { questId: selectedQuest.id, goalType: frequency },
      }).unwrap();

      showSnackbar({ text: t('goals.setModal.setSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({
        text: t('goals.setModal.setError'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} className="min-h-[200px]" isLoading={isLoading} loadingMessage={t('goals.setModal.loadingQuests')}>
      <View className="flex gap-4 h-full px-4">
        <Text className="text-lg font-bold text-center">{t('goals.setModal.title')}</Text>
        <Select
          placeholder={t('goals.setModal.selectPlaceholder')}
          value={selectedQuest?.id}
          onChange={handleSelectChange}
          options={options}
          isModalVersion
        />
        <Text className="text-lg font-semibold tracking-wider text-center">{t('goals.setModal.previewLabel')}</Text>
        <GoalQuestSection selectedQuest={selectedQuest} />
        <View className="flex-row justify-between mt-auto">
          <Button
            label={t('common.close')}
            variant="outlined"
            onPress={onClose}
            startIcon={<Ionicons name="close-outline" size={18} color="#1987EE" />}
          />
          <Button
            label={t('goals.setModal.setButton')}
            styleType="primary"
            onPress={handleSubmit}
            startIcon={<Ionicons name="add-circle-outline" size={18} color="white" />}
            disabled={!selectedQuest}
          />
        </View>
      </View>
    </Modal>
  );
};

export default GoalSetModal;
