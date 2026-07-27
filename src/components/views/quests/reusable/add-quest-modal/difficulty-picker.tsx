import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const selectedDifficulty = watch('difficulty') as DifficultyEnumType | null;

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">{t('quests.reusable.form.difficultyLabel')}</Text>
      <ControlledSelect
        name="difficulty"
        placeholder={t('quests.reusable.form.difficultyPlaceholder')}
        clearAsNull
        options={[
          { label: t('quests.reusable.form.difficulties.easy'), value: DifficultyEnum.EASY },
          { label: t('quests.reusable.form.difficulties.medium'), value: DifficultyEnum.MEDIUM },
          { label: t('quests.reusable.form.difficulties.hard'), value: DifficultyEnum.HARD },
          { label: t('quests.reusable.form.difficulties.impossible'), value: DifficultyEnum.IMPOSSIBLE },
        ]}
        isModalVersion={true}
        className="px-2"
        textColor={getDifficultyStyle(selectedDifficulty)}
      />
    </View>
  );
};

export default ControlledDifficultyPicker;
