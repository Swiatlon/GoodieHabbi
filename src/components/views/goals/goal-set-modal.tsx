import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GoalQuestSection from './goal-quest-section';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import Select from '@/components/shared/select/select';
import { AllQuestsUnion, useGetAllQuests } from '@/hooks/quests/useGetAllQuests';

interface GoalSetModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const GoalSetModal: React.FC<GoalSetModalProps> = ({ isVisible, onClose }) => {
  const { data: fetchedQuests = [], isLoading } = useGetAllQuests();
  const [selectedQuest, setSelectedQuest] = useState<AllQuestsUnion | null>(null);
  const [selectedQuestLabel, setSelectedQuestLabel] = useState<string | null>(null);

  const options = useMemo(
    () =>
      fetchedQuests
        .filter(item => !item.isCompleted)
        .map(quest => ({ label: `${quest.emoji} ${quest.title}`, value: `${quest.emoji} ${quest.title}` })),
    [fetchedQuests]
  );

  const selectedQuestData = useMemo(
    () => fetchedQuests.filter(item => !item.isCompleted).find(quest => `${quest.emoji} ${quest.title}` === selectedQuestLabel) || null,
    [selectedQuestLabel, fetchedQuests]
  );

  return (
    <Modal isVisible={isVisible} onClose={onClose} className="min-h-[200px]" isLoading={isLoading} loadingMessage="Loading quests...">
      <View className="flex gap-4 h-full px-4">
        <Text className="text-lg font-bold text-center">Set goal</Text>
        <Select
          placeholder="Select a quest"
          value={selectedQuestLabel}
          onChange={value => {
            setSelectedQuestLabel(value);
            const newQuest = fetchedQuests.find(quest => quest.title === value);

            if (newQuest) {
              setSelectedQuest(newQuest);
            } else {
              setSelectedQuest(null);
            }
          }}
          options={options}
          isModalVersion
        />
        <Text className="text-lg font-semibold tracking-wider text-center">Preview selected quest:</Text>
        <GoalQuestSection selectedQuest={selectedQuestData} />
        <View className="flex-row justify-between mt-auto">
          <Button label="Close" variant="outlined" onPress={onClose} startIcon={<Ionicons name="close-outline" size={18} color="#1987EE" />} />
          <Button
            label="Set"
            styleType="primary"
            onPress={onClose}
            startIcon={<Ionicons name="add-circle-outline" size={18} color="white" />}
            disabled={!selectedQuest}
          />
        </View>
      </View>
    </Modal>
  );
};

export default GoalSetModal;
