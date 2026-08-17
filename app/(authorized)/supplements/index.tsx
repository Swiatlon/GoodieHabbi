import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/components/shared/empty-state/empty-state';
import Loader from '@/components/shared/loader/loader';
import ProgressBar from '@/components/shared/progress-bar/progress-bar';
import AdHocModal from '@/components/views/supplements/checklist/ad-hoc-modal';
import ChecklistItem from '@/components/views/supplements/checklist/checklist-item';
import dayjs from '@/configs/day-js-config';
import { ISupplementChecklistItem, SupplementTimingEnum } from '@/contract/supplements/supplements.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteIntakeMutation, useGetChecklistQuery, useToggleIntakeMutation } from '@/redux/api/supplements/intakes-api';
import { IApiError } from '@/types/global-types';
import { DEFAULT_SUPPLEMENT_COLOR, DEFAULT_SUPPLEMENT_EMOJI, getTimingVisual } from '@/utils/supplements/supplement-visuals';
import { safeDateFormat, toIsoDate } from '@/utils/utils/utils';

interface ChecklistSection {
  timing: SupplementTimingEnum;
  items: ISupplementChecklistItem[];
}

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

  const sections: ChecklistSection[] = useMemo(() => {
    if (!checklist) return [];
    const byTiming = new Map<SupplementTimingEnum, ISupplementChecklistItem[]>();
    checklist.items.forEach(item => {
      const group = byTiming.get(item.timing) ?? [];
      group.push(item);
      byTiming.set(item.timing, group);
    });
    return Object.values(SupplementTimingEnum)
      .filter(timing => byTiming.has(timing))
      .map(timing => ({ timing, items: byTiming.get(timing) as ISupplementChecklistItem[] }));
  }, [checklist]);

  if (isLoading || !checklist) {
    return <Loader message={t('supplements.checklist.fetching')} />;
  }

  const totalCount = checklist.items.length;
  const takenCount = checklist.items.filter(item => item.taken).length;

  return (
    <View className="flex-1 bg-gray-50" testID="supplements-checklist-screen">
      <View className="px-4 pt-4 pb-3 bg-white">
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

        {totalCount > 0 && (
          <View className="mt-3">
            <Text className="text-xs font-semibold text-gray-500 mb-1">{t('supplements.checklist.adherenceTitle')}</Text>
            <ProgressBar current={takenCount} total={totalCount} />
          </View>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        {totalCount === 0 ? (
          <EmptyState icon="checkbox-outline" message={t('supplements.checklist.noItems')} testID="checklist-empty-state" />
        ) : (
          sections.map(section => {
            const visual = getTimingVisual(section.timing);
            const sectionTaken = section.items.filter(item => item.taken).length;
            return (
              <View key={section.timing} className="mb-3 bg-white rounded-2xl shadow-sm overflow-hidden">
                <View className="flex-row items-center gap-2 px-4 py-2.5 bg-gray-50">
                  <Text className="text-sm">{visual.emoji}</Text>
                  <Text className="text-xs font-bold text-gray-600 uppercase tracking-wide flex-1">
                    {t(`supplements.enums.timing.${section.timing}`)}
                  </Text>
                  <Text className="text-xs font-semibold text-gray-400">
                    {sectionTaken}/{section.items.length}
                  </Text>
                </View>
                {section.items.map((item, idx) => (
                  <View key={item.slotId} className={idx < section.items.length - 1 ? 'border-b border-gray-50' : ''}>
                    <ChecklistItem item={item} onToggle={async () => handleToggle(item)} />
                  </View>
                ))}
              </View>
            );
          })
        )}

        {checklist.adHoc.length > 0 && (
          <View className="gap-2">
            <Text className="text-sm font-semibold text-gray-500">{t('supplements.checklist.adHocLabel')}</Text>
            <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {checklist.adHoc.map((intake, idx) => (
                <View
                  key={intake.id}
                  className={`flex-row items-center px-4 py-3 bg-white ${idx < checklist.adHoc.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${DEFAULT_SUPPLEMENT_COLOR}20` }}
                  >
                    <Text className="text-lg">{DEFAULT_SUPPLEMENT_EMOJI}</Text>
                  </View>
                  <Text className="flex-1 text-sm text-gray-700" numberOfLines={1}>
                    {intake.supplementName} · {intake.amount} {t(`supplements.enums.unit.${intake.unit}`)}
                  </Text>
                  <TouchableOpacity
                    onPress={async () => handleDeleteAdHoc(intake.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel={t('common.delete')}
                  >
                    <Ionicons name="trash-outline" size={16} color="#d1d5db" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

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
