import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import Loader from '@/components/shared/loader/loader';
import RoutineFormModal from '@/components/views/workouts/routines/routine-form-modal';
import RoutineItem from '@/components/views/workouts/routines/routine-item';
import { IWorkoutRoutine } from '@/contract/workouts/workouts.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteRoutineMutation, useGetRoutinesQuery, useSetRoutineArchivedMutation } from '@/redux/api/workouts/routines-api';
import { IApiError } from '@/types/global-types';

const RoutinesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [modalRoutine, setModalRoutine] = useState<IWorkoutRoutine | null | undefined>(undefined);

  const { data: routines = [], isLoading } = useGetRoutinesQuery({ includeArchived });
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
    <View className="flex-1 bg-white" testID="workouts-routines-screen">
      <View className="flex-row justify-between items-center px-4 pt-4">
        <Text className="text-2xl font-bold text-primary">{t('workouts.routines.title')}</Text>
        <IconButton onPress={() => setIncludeArchived(prev => !prev)}>
          <Ionicons name={includeArchived ? 'archive' : 'archive-outline'} size={22} color="#1987EE" />
        </IconButton>
      </View>

      <FlatList
        className="flex-1 mt-2"
        data={routines}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <RoutineItem routine={item} onEdit={setModalRoutine} onDelete={handleDelete} onToggleArchived={handleToggleArchived} />
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-6">{t('workouts.routines.noRoutinesFound')}</Text>}
      />

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
