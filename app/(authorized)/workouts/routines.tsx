import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/components/shared/empty-state/empty-state';
import Loader from '@/components/shared/loader/loader';
import SearchBar from '@/components/shared/search-bar/search-bar';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import RoutineFormModal from '@/components/views/workouts/routines/routine-form-modal';
import RoutineItem from '@/components/views/workouts/routines/routine-item';
import { IWorkoutRoutine } from '@/contract/workouts/workouts.contract';
import { useSearch } from '@/hooks/use-search/use-search';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteRoutineMutation, useGetRoutinesQuery, useSetRoutineArchivedMutation } from '@/redux/api/workouts/routines-api';
import { IApiError } from '@/types/global-types';

const RoutinesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [modalRoutine, setModalRoutine] = useState<IWorkoutRoutine | null | undefined>(undefined);

  const { data: routines = [], isLoading } = useGetRoutinesQuery({ includeArchived });
  const { data: searchedRoutines, searchQuery, setSearchQuery } = useSearch({ data: routines });
  const [deleteRoutine] = useDeleteRoutineMutation();
  const [setRoutineArchived] = useSetRoutineArchivedMutation();

  const handleDelete = (routine: IWorkoutRoutine) => {
    Alert.alert(t('workouts.routines.deleteTitle'), t('workouts.routines.deleteMessage', { name: routine.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRoutine({ id: routine.id }).unwrap();
            showSnackbar({ text: t('workouts.routines.deletedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
          } catch (err) {
            const error = err as IApiError;
            showSnackbar({ text: error.data?.message || t('workouts.routines.deletedError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  const handleToggleArchived = async (routine: IWorkoutRoutine) => {
    try {
      await setRoutineArchived({ id: routine.id, data: { isArchived: !routine.isArchived } }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.routines.archiveError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  if (isLoading) {
    return <Loader message={t('workouts.routines.fetching')} />;
  }

  return (
    <View className="flex-1 bg-gray-50" testID="workouts-routines-screen">
      <Text className="text-2xl font-bold text-primary px-4 pt-4">{t('workouts.routines.title')}</Text>

      <View className="px-4 pt-3">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('workouts.routines.searchPlaceholder')}
          testID="routines-search-input"
        />
      </View>

      <View className="px-4 pt-3">
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          <ToggleTab active={!includeArchived} onPress={() => setIncludeArchived(false)}>
            <Text className={`text-xs font-bold ${!includeArchived ? 'text-primary' : 'text-gray-500'}`}>
              {t('workouts.reusable.filterActiveOnly')}
            </Text>
          </ToggleTab>
          <ToggleTab active={includeArchived} onPress={() => setIncludeArchived(true)}>
            <Text className={`text-xs font-bold ${includeArchived ? 'text-primary' : 'text-gray-500'}`}>
              {t('workouts.reusable.filterAllIncludingArchived')}
            </Text>
          </ToggleTab>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        {searchedRoutines.length === 0 ? (
          <EmptyState icon="repeat-outline" message={t('workouts.routines.noRoutinesFound')} />
        ) : (
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {searchedRoutines.map((routine, idx) => (
              <View key={routine.id} className={idx < searchedRoutines.length - 1 ? 'border-b border-gray-50' : ''}>
                <RoutineItem routine={routine} onEdit={setModalRoutine} onDelete={handleDelete} onToggleArchived={handleToggleArchived} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalRoutine(null)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        accessibilityLabel={t('workouts.routines.addTitle')}
        testID="btn-add-routine"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <RoutineFormModal isVisible={modalRoutine !== undefined} onClose={() => setModalRoutine(undefined)} routine={modalRoutine ?? null} />
    </View>
  );
};

export default RoutinesScreen;
