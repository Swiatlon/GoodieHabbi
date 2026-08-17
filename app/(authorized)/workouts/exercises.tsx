import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/components/shared/empty-state/empty-state';
import FilterChips from '@/components/shared/filter-chips/filter-chips';
import Loader from '@/components/shared/loader/loader';
import SearchBar from '@/components/shared/search-bar/search-bar';
import ExerciseFormModal from '@/components/views/workouts/exercises/exercise-form-modal';
import ExerciseItem from '@/components/views/workouts/exercises/exercise-item';
import { IExercise, MuscleGroupEnum } from '@/contract/workouts/workouts.contract';
import { useSearch } from '@/hooks/use-search/use-search';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteExerciseMutation, useGetExercisesQuery, useSetExerciseArchivedMutation } from '@/redux/api/workouts/exercises-api';
import { IApiError } from '@/types/global-types';
import { MUSCLE_GROUP_COLORS, MUSCLE_GROUP_EMOJI } from '@/utils/workouts/muscle-group-visuals';

const ExercisesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroupEnum | null>(null);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [modalExercise, setModalExercise] = useState<IExercise | null | undefined>(undefined);

  const { data: exercises = [], isLoading } = useGetExercisesQuery({ muscleGroup: muscleGroup ?? undefined, includeArchived });
  const { data: searchedExercises, searchQuery, setSearchQuery } = useSearch({ data: exercises });
  const [deleteExercise] = useDeleteExerciseMutation();
  const [setExerciseArchived] = useSetExerciseArchivedMutation();

  const handleDelete = (exercise: IExercise) => {
    Alert.alert(t('workouts.exercises.deleteTitle'), t('workouts.exercises.deleteMessage', { name: exercise.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExercise({ id: exercise.id }).unwrap();
            showSnackbar({ text: t('workouts.exercises.deletedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
          } catch (err) {
            const error = err as IApiError;
            showSnackbar({ text: error.data?.message || t('workouts.exercises.deletedError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  const handleToggleArchived = async (exercise: IExercise) => {
    try {
      await setExerciseArchived({ id: exercise.id, data: { isArchived: !exercise.isArchived } }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.exercises.archiveError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  if (isLoading) {
    return <Loader message={t('workouts.exercises.fetching')} />;
  }

  const muscleGroupItems = Object.values(MuscleGroupEnum).map(value => ({
    key: value,
    label: t(`workouts.enums.muscleGroup.${value}`),
    color: MUSCLE_GROUP_COLORS[value],
    emoji: MUSCLE_GROUP_EMOJI[value],
  }));

  return (
    <View className="flex-1 bg-gray-50" testID="workouts-exercises-screen">
      <View className="flex-row justify-between items-center px-4 pt-4">
        <Text className="text-2xl font-bold text-primary">{t('workouts.exercises.title')}</Text>
        <TouchableOpacity
          onPress={() => setIncludeArchived(prev => !prev)}
          className={`px-3 py-1.5 rounded-full border ${includeArchived ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
          testID="exercises-toggle-archived"
        >
          <Text className={`text-xs font-bold ${includeArchived ? 'text-white' : 'text-gray-500'}`}>{t('workouts.reusable.archivedPillLabel')}</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-3">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('workouts.exercises.searchPlaceholder')}
          testID="exercises-search-input"
        />
      </View>

      <View className="pt-3 pl-4">
        <FilterChips
          items={muscleGroupItems}
          value={muscleGroup}
          onChange={setMuscleGroup}
          allLabel={t('workouts.reusable.muscleGroupFilterAll')}
          testID="exercises-muscle-group-filter"
        />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        {searchedExercises.length === 0 ? (
          <EmptyState icon="barbell-outline" message={t('workouts.exercises.noExercisesFound')} />
        ) : (
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {searchedExercises.map((exercise, idx) => (
              <View key={exercise.id} className={idx < searchedExercises.length - 1 ? 'border-b border-gray-50' : ''}>
                <ExerciseItem exercise={exercise} onEdit={setModalExercise} onDelete={handleDelete} onToggleArchived={handleToggleArchived} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalExercise(null)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        accessibilityLabel={t('workouts.exercises.addTitle')}
        testID="btn-add-exercise"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <ExerciseFormModal isVisible={modalExercise !== undefined} onClose={() => setModalExercise(undefined)} exercise={modalExercise ?? null} />
    </View>
  );
};

export default ExercisesScreen;
