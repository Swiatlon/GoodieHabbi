import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import EmptyState from '@/components/shared/empty-state/empty-state';
import FilterChips from '@/components/shared/filter-chips/filter-chips';
import Modal from '@/components/shared/modal/modal';
import SearchBar from '@/components/shared/search-bar/search-bar';
import { IExercise, MuscleGroupEnum } from '@/contract/workouts/workouts.contract';
import { useSearch } from '@/hooks/use-search/use-search';
import { getMuscleGroupVisual, MUSCLE_GROUP_COLORS, MUSCLE_GROUP_EMOJI } from '@/utils/workouts/muscle-group-visuals';

interface ExercisePickerContentProps {
  exercises: IExercise[];
  onSelect: (exercise: IExercise) => void;
  testID?: string;
}

// Pure content, no Modal/Portal of its own — use this directly when the picker needs to appear
// inside a screen that is already a modal (e.g. routine-form-modal.tsx), so opening it doesn't
// stack a second Portal/backdrop on top of the first (which double-darkens the screen and lets
// the outer modal's own backdrop-tap-to-close fire through the picker). Use ExercisePickerModal
// below instead when the picker is opened from a plain (non-modal) screen.
export const ExercisePickerContent: React.FC<ExercisePickerContentProps> = ({ exercises, onSelect, testID }) => {
  const { t } = useTranslation();
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroupEnum | null>(null);

  const { data: searchedExercises, searchQuery, setSearchQuery } = useSearch({ data: exercises });
  const filteredExercises = useMemo(
    () => (muscleGroup ? searchedExercises.filter(exercise => exercise.muscleGroup === muscleGroup) : searchedExercises),
    [searchedExercises, muscleGroup]
  );

  const muscleGroupItems = useMemo(
    () =>
      Object.values(MuscleGroupEnum).map(value => ({
        key: value,
        label: t(`workouts.enums.muscleGroup.${value}`),
        color: MUSCLE_GROUP_COLORS[value],
        emoji: MUSCLE_GROUP_EMOJI[value],
      })),
    [t]
  );

  return (
    <View className="gap-3">
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder={t('workouts.exercises.searchPlaceholder')} />

      <FilterChips items={muscleGroupItems} value={muscleGroup} onChange={setMuscleGroup} allLabel={t('workouts.reusable.muscleGroupFilterAll')} />

      {filteredExercises.length === 0 ? (
        <EmptyState icon="barbell-outline" message={t('workouts.exercises.noExercisesFound')} />
      ) : (
        <ScrollView className="max-h-[50vh]">
          {filteredExercises.map((exercise, idx) => {
            const visual = getMuscleGroupVisual(exercise.muscleGroup);
            return (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => onSelect(exercise)}
                activeOpacity={0.7}
                className={`flex-row items-center py-2.5 ${idx < filteredExercises.length - 1 ? 'border-b border-gray-50' : ''}`}
                testID={testID ? `${testID}-option-${exercise.id}` : undefined}
              >
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: `${visual.color}20` }}>
                  <Text className="text-base">{visual.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                    {exercise.name}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {t(`workouts.enums.muscleGroup.${exercise.muscleGroup}`)} · {t(`workouts.enums.equipment.${exercise.equipment}`)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

interface ExercisePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  exercises: IExercise[];
  onSelect: (exercise: IExercise) => void;
  testID?: string;
}

const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({ isVisible, onClose, exercises, onSelect, testID }) => {
  const { t } = useTranslation();

  const handleSelect = (exercise: IExercise) => {
    onSelect(exercise);
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} testID={testID}>
      <View className="gap-3">
        <Text className="text-lg font-bold text-gray-800 text-center">{t('workouts.reusable.exercisePickerTitle')}</Text>
        <ExercisePickerContent exercises={exercises} onSelect={handleSelect} testID={testID} />
      </View>
    </Modal>
  );
};

export default ExercisePickerModal;
