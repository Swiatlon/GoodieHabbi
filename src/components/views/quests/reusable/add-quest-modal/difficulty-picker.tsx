import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { DifficultyEnum, DifficultyEnumType } from '@/contract/quests/base-quests';

const getDifficultyStyle = (difficulty: DifficultyEnumType | null) => {
  switch (difficulty) {
    case DifficultyEnum.EASY:
      return '#22c55e';
    case DifficultyEnum.MEDIUM:
      return '#eab308';
    case DifficultyEnum.HARD:
      return '#f97316';
    case DifficultyEnum.IMPOSSIBLE:
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const ControlledDifficultyPicker: React.FC = () => {
  const { watch } = useFormContext();
  const selectedDifficulty = watch('difficulty') as DifficultyEnumType | null;

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">⚔️ Difficulty:</Text>
      <ControlledSelect
        name="difficulty"
        placeholder="Select difficulty"
        options={[
          { label: 'Easy', value: DifficultyEnum.EASY },
          { label: 'Medium', value: DifficultyEnum.MEDIUM },
          { label: 'Hard', value: DifficultyEnum.HARD },
          { label: 'Impossible', value: DifficultyEnum.IMPOSSIBLE },
        ]}
        isModalVersion={true}
        className="px-2"
        textColor={getDifficultyStyle(selectedDifficulty)}
      />
    </View>
  );
};

export default ControlledDifficultyPicker;
