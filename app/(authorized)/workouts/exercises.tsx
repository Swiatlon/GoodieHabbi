import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import Loader from '@/components/shared/loader/loader';
import ExerciseFormModal from '@/components/views/workouts/exercises/exercise-form-modal';
import ExerciseItem from '@/components/views/workouts/exercises/exercise-item';
import { MuscleGroupFilter } from '@/components/views/workouts/reusable/muscle-group-picker';
import { IExercise, MuscleGroupEnum } from '@/contract/workouts/workouts.contract';
import { useSearch } from '@/hooks/use-search/use-search';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteExerciseMutation, useGetExercisesQuery, useSetExerciseArchivedMutation } from '@/redux/api/workouts/exercises-api';
import { IApiError } from '@/types/global-types';

const ExercisesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroupEnum | null>(null);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
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

  return (
    <View className="flex-1 bg-white" testID="workouts-exercises-screen">
      <View className="flex-row justify-between items-center px-4 pt-4">
        <Text className="text-2xl font-bold text-primary">{t('workouts.exercises.title')}</Text>
        <View className="flex-row">
          <IconButton onPress={() => setIncludeArchived(prev => !prev)}>
            <Ionicons name={includeArchived ? 'archive' : 'archive-outline'} size={22} color="#1987EE" />
          </IconButton>
          <IconButton onPress={() => setIsSearchVisible(prev => !prev)}>
            <Ionicons name={isSearchVisible ? 'close' : 'search-outline'} size={22} color="#1987EE" />
          </IconButton>
        </View>
      </View>

      {isSearchVisible && (
        <View className="flex-row items-center mx-4 mt-2 border border-gray-300 rounded-md px-2">
          <TextInput
            className="flex-1 p-2"
            placeholder={t('workouts.exercises.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={20} color="#9e9e9e" />
        </View>
      )}

      <View className="mx-4 mt-2">
        <MuscleGroupFilter value={muscleGroup} onChange={setMuscleGroup} />
      </View>

      <FlatList
        className="flex-1 mt-2"
        data={searchedExercises}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ExerciseItem exercise={item} onEdit={setModalExercise} onDelete={handleDelete} onToggleArchived={handleToggleArchived} />
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-6">{t('workouts.exercises.noExercisesFound')}</Text>}
      />

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
