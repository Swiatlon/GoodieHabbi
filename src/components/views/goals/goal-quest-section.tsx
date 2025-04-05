import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import CompleteGoalButton from './goal-completion-button';
import AllQuestItemGoals from '@/components/views/goals/goal-all-quest-item';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';

interface QuestSectionProps {
  selectedQuest: AllQuestsUnion | null;
  onComplete?: () => void;
}

const GoalQuestSection: React.FC<QuestSectionProps> = ({ selectedQuest, onComplete }) => {
  const goalStyle = useTransformFade({ delay: 500 });

  return (
    <Animated.View className="flex-1 py-4 rounded-3xl shadow-lg bg-white border border-gray-100 items-center justify-evenly" style={goalStyle}>
      <Text className="text-lg font-semibold text-primary uppercase tracking-wider">Quest</Text>
      {selectedQuest ? (
        <>
          <AllQuestItemGoals quest={selectedQuest} />
          {onComplete && <CompleteGoalButton onPress={onComplete} disabled={!selectedQuest} />}
        </>
      ) : (
        <View className="p-4 rounded-lg w-full items-center">
          <Text className="text-secondary text-lg px-4 text-center">🎯 Set a goal to get started! 🎯</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default GoalQuestSection;
