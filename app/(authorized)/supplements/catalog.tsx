import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/components/shared/empty-state/empty-state';
import FilterChips, { FilterChipItem } from '@/components/shared/filter-chips/filter-chips';
import Loader from '@/components/shared/loader/loader';
import SearchBar from '@/components/shared/search-bar/search-bar';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import SupplementFormModal from '@/components/views/supplements/catalog/supplement-form-modal';
import SupplementItem from '@/components/views/supplements/catalog/supplement-item';
import { ISupplement, SupplementTimingEnum } from '@/contract/supplements/supplements.contract';
import { useSearch } from '@/hooks/use-search/use-search';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteSupplementMutation, useGetSupplementsQuery, useSetSupplementActiveMutation } from '@/redux/api/supplements/catalog-api';
import { IApiError } from '@/types/global-types';
import { SUPPLEMENT_TIMING_COLORS, SUPPLEMENT_TIMING_EMOJI } from '@/utils/supplements/supplement-visuals';

const SupplementsCatalogScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [includeInactive, setIncludeInactive] = useState(false);
  const [timingFilter, setTimingFilter] = useState<SupplementTimingEnum | null>(null);
  const [modalSupplement, setModalSupplement] = useState<ISupplement | null | undefined>(undefined);

  const { data: supplements = [], isLoading } = useGetSupplementsQuery({ includeInactive });
  const [deleteSupplement] = useDeleteSupplementMutation();
  const [setSupplementActive] = useSetSupplementActiveMutation();

  const { searchQuery, setSearchQuery, data: searchedSupplements } = useSearch({ data: supplements });

  const filteredSupplements = useMemo(
    () => (timingFilter ? searchedSupplements.filter(s => s.slots.some(slot => slot.timing === timingFilter)) : searchedSupplements),
    [searchedSupplements, timingFilter]
  );

  const timingItems: FilterChipItem<SupplementTimingEnum>[] = useMemo(
    () =>
      Object.values(SupplementTimingEnum).map(value => ({
        key: value,
        label: t(`supplements.enums.timing.${value}`),
        color: SUPPLEMENT_TIMING_COLORS[value],
        emoji: SUPPLEMENT_TIMING_EMOJI[value],
      })),
    [t]
  );

  const handleDelete = (supplement: ISupplement) => {
    Alert.alert(t('supplements.catalog.deleteTitle'), t('supplements.catalog.deleteMessage', { name: supplement.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSupplement({ id: supplement.id }).unwrap();
            showSnackbar({ text: t('supplements.catalog.deletedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
          } catch (err) {
            const error = err as IApiError;
            showSnackbar({ text: error.data?.message || t('supplements.catalog.deletedError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  const handleToggleActive = async (supplement: ISupplement) => {
    try {
      await setSupplementActive({ id: supplement.id, data: { isActive: !supplement.isActive } }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('supplements.catalog.toggleActiveError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  if (isLoading) {
    return <Loader message={t('supplements.catalog.fetching')} />;
  }

  return (
    <View className="flex-1 bg-gray-50" testID="supplements-catalog-screen">
      <View className="px-4 pt-4 pb-1 bg-white">
        <Text className="text-2xl font-bold text-primary mb-3">{t('supplements.catalog.title')}</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('supplements.catalog.searchPlaceholder')}
          testID="supplement-search-input"
        />
      </View>

      <View className="px-4 pt-3 pb-1 bg-white">
        <FilterChips
          items={timingItems}
          value={timingFilter}
          onChange={setTimingFilter}
          allLabel={t('supplements.reusable.timingFilterAll')}
          testID="supplement-timing-filter"
        />
      </View>

      <View className="px-4 pt-3 pb-3 bg-white">
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          <ToggleTab active={!includeInactive} onPress={() => setIncludeInactive(false)}>
            <Text className={`text-xs font-bold ${!includeInactive ? 'text-primary' : 'text-gray-500'}`}>
              {t('supplements.catalog.filterActiveLabel')}
            </Text>
          </ToggleTab>
          <ToggleTab active={includeInactive} onPress={() => setIncludeInactive(true)}>
            <Text className={`text-xs font-bold ${includeInactive ? 'text-primary' : 'text-gray-500'}`}>
              {t('supplements.catalog.filterAllLabel')}
            </Text>
          </ToggleTab>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        {filteredSupplements.length === 0 ? (
          <EmptyState icon="medkit-outline" message={t('supplements.catalog.noSupplementsFound')} testID="supplements-empty-state" />
        ) : (
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {filteredSupplements.map((supplement, idx) => (
              <View key={supplement.id} className={idx < filteredSupplements.length - 1 ? 'border-b border-gray-50' : ''}>
                <SupplementItem supplement={supplement} onEdit={setModalSupplement} onDelete={handleDelete} onToggleActive={handleToggleActive} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalSupplement(null)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        accessibilityLabel={t('supplements.catalog.addTitle')}
        testID="btn-add-supplement"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <SupplementFormModal
        isVisible={modalSupplement !== undefined}
        onClose={() => setModalSupplement(undefined)}
        supplement={modalSupplement ?? null}
      />
    </View>
  );
};

export default SupplementsCatalogScreen;
