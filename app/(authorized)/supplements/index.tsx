import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from '@/components/shared/loader/loader';
import AdHocModal from '@/components/views/supplements/checklist/ad-hoc-modal';
import ChecklistItem from '@/components/views/supplements/checklist/checklist-item';
import dayjs from '@/configs/day-js-config';
import { ISupplementChecklistItem } from '@/contract/supplements/supplements.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteIntakeMutation, useGetChecklistQuery, useToggleIntakeMutation } from '@/redux/api/supplements/intakes-api';
import { IApiError } from '@/types/global-types';
import { safeDateFormat, toIsoDate } from '@/utils/utils/utils';

const ChecklistScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [date, setDate] = useState(() => toIsoDate(new Date()) ?? '');
  const [isAdHocModalVisible, setIsAdHocModalVisible] = useState(false);

  const { data: checklist, isLoading } = useGetChecklistQuery({ date });
  const [toggleIntake] = useToggleIntakeMutation();
  const [deleteIntake] = useDeleteIntakeMutation();

  const shiftDate = (days: number) => setDate(prev => toIsoDate(dayjs(prev).add(days, 'day').toDate()) ?? prev);

  const handleToggle = async (item: ISupplementChecklistItem) => {
    try {
      await toggleIntake({ supplementId: item.supplementId, slotId: item.slotId, date, taken: !item.taken }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('supplements.checklist.toggleError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleDeleteAdHoc = async (id: number) => {
    try {
      await deleteIntake({ id }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('supplements.checklist.deleteAdHocError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  if (isLoading || !checklist) {
    return <Loader message={t('supplements.checklist.fetching')} />;
  }

  return (
    <View className="flex-1 bg-white" testID="supplements-checklist-screen">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-primary mb-3">{t('supplements.checklist.title')}</Text>
        <View className="flex-row items-center justify-between bg-gray-50 rounded-xl px-2 py-1">
          <TouchableOpacity onPress={() => shiftDate(-1)} className="p-2">
            <Ionicons name="chevron-back" size={20} color="#1987EE" />
          </TouchableOpacity>
          <Text className="text-sm font-semibold text-gray-700">{safeDateFormat(date)}</Text>
          <TouchableOpacity onPress={() => shiftDate(1)} className="p-2">
            <Ionicons name="chevron-forward" size={20} color="#1987EE" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        className="flex-1 mt-2"
        data={checklist.items}
        keyExtractor={item => item.slotId.toString()}
        renderItem={({ item }) => <ChecklistItem item={item} onToggle={async () => handleToggle(item)} />}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-6">{t('supplements.checklist.noItems')}</Text>}
        ListFooterComponent={
          checklist.adHoc.length > 0 ? (
            <View className="px-4 pt-4 gap-2">
              <Text className="text-sm font-semibold text-gray-500">{t('supplements.checklist.adHocLabel')}</Text>
              {checklist.adHoc.map(intake => (
                <View key={intake.id} className="flex-row items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <Text className="text-sm text-gray-700">
                    {intake.supplementName} · {intake.amount} {t(`supplements.enums.unit.${intake.unit}`)}
                  </Text>
                  <TouchableOpacity onPress={async () => handleDeleteAdHoc(intake.id)}>
                    <Ionicons name="trash-outline" size={18} color="#e53e3e" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        onPress={() => setIsAdHocModalVisible(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        accessibilityLabel={t('supplements.checklist.logAdHoc')}
        testID="btn-log-ad-hoc-fab"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <AdHocModal isVisible={isAdHocModalVisible} onClose={() => setIsAdHocModalVisible(false)} date={date} />
    </View>
  );
};

export default ChecklistScreen;
