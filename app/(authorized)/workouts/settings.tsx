import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Loader from '@/components/shared/loader/loader';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetWorkoutSettingsQuery, useUpdateWeightUnitMutation } from '@/redux/api/workouts/settings-api';
import { IApiError } from '@/types/global-types';

const WorkoutSettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { data: settings, isLoading } = useGetWorkoutSettingsQuery();
  const [updateWeightUnit, { isLoading: isUpdating }] = useUpdateWeightUnitMutation();

  if (isLoading || !settings) {
    return <Loader message={t('workouts.settings.fetching')} />;
  }

  const handleSelectUnit = (unit: string) => {
    if (unit === settings.weightUnit) return;

    Alert.alert(t('workouts.settings.confirmTitle'), t('workouts.settings.confirmMessage', { unit }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.save'),
        onPress: async () => {
          try {
            await updateWeightUnit({ weightUnit: unit }).unwrap();
            showSnackbar({ text: t('workouts.settings.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
          } catch (err) {
            const error = err as IApiError;
            showSnackbar({ text: error.data?.message || t('workouts.settings.updatedError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white px-4 pt-4 gap-4" testID="workouts-settings-screen">
      <Text className="text-2xl font-bold text-primary">{t('workouts.settings.title')}</Text>

      <View className="gap-2">
        <Text className="text-sm font-semibold text-gray-500">{t('workouts.settings.weightUnitLabel')}</Text>
        <Text className="text-xs text-gray-400 -mt-1">{t('workouts.settings.weightUnitHint')}</Text>

        <View className="flex-row gap-3 mt-2">
          {settings.supportedWeightUnits.map(unit => {
            const isSelected = unit === settings.weightUnit;
            return (
              <TouchableOpacity
                key={unit}
                onPress={() => handleSelectUnit(unit)}
                disabled={isUpdating}
                className={`px-5 py-2 rounded-lg border ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}
                testID={`btn-weight-unit-${unit}`}
              >
                <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>{unit}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default WorkoutSettingsScreen;
