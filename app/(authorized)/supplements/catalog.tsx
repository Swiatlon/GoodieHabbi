import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import Loader from '@/components/shared/loader/loader';
import SupplementFormModal from '@/components/views/supplements/catalog/supplement-form-modal';
import SupplementItem from '@/components/views/supplements/catalog/supplement-item';
import { ISupplement } from '@/contract/supplements/supplements.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteSupplementMutation, useGetSupplementsQuery, useSetSupplementActiveMutation } from '@/redux/api/supplements/catalog-api';
import { IApiError } from '@/types/global-types';

const SupplementsCatalogScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [includeInactive, setIncludeInactive] = useState(false);
  const [modalSupplement, setModalSupplement] = useState<ISupplement | null | undefined>(undefined);

  const { data: supplements = [], isLoading } = useGetSupplementsQuery({ includeInactive });
  const [deleteSupplement] = useDeleteSupplementMutation();
  const [setSupplementActive] = useSetSupplementActiveMutation();

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
    <View className="flex-1 bg-white" testID="supplements-catalog-screen">
      <View className="flex-row justify-between items-center px-4 pt-4">
        <Text className="text-2xl font-bold text-primary">{t('supplements.catalog.title')}</Text>
        <IconButton onPress={() => setIncludeInactive(prev => !prev)}>
          <Ionicons name={includeInactive ? 'eye' : 'eye-outline'} size={22} color="#1987EE" />
        </IconButton>
      </View>

      <FlatList
        className="flex-1 mt-2"
        data={supplements}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SupplementItem supplement={item} onEdit={setModalSupplement} onDelete={handleDelete} onToggleActive={handleToggleActive} />
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-6">{t('supplements.catalog.noSupplementsFound')}</Text>}
      />

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
