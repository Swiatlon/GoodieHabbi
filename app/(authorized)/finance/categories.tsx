import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import CategoryFormModal from '@/components/views/finance/categories/category-form-modal';
import CategoryGroup from '@/components/views/finance/categories/category-group';
import { FinanceTransactionTypeEnum, IFinanceCategory } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteFinanceCategoriesMutation, useGetFinanceCategoriesQuery } from '@/redux/api/finance/finance-api';
import { IApiError } from '@/types/global-types';
import { collectCategoryIds } from '@/utils/finance/category-helpers';

type ModalState = { mode: 'create'; parentCategory: IFinanceCategory | null } | { mode: 'edit'; category: IFinanceCategory } | null;

const CategoriesScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [typeFilter, setTypeFilter] = useState<FinanceTransactionTypeEnum>(FinanceTransactionTypeEnum.Expense);
  const { data: categories = [], isLoading } = useGetFinanceCategoriesQuery({ type: typeFilter });
  const [deleteFinanceCategories] = useDeleteFinanceCategoriesMutation();
  const [modalState, setModalState] = useState<ModalState>(null);

  // The sibling group a new/edited name must be unique within: same parent (or top-level), same type —
  // the query is already type-scoped, so only the parent match is needed here.
  const siblingNames = useMemo(() => {
    if (!modalState) return [];
    if (modalState.mode === 'create') {
      const siblings = modalState.parentCategory ? (modalState.parentCategory.subCategories ?? []) : categories;
      return siblings.map(c => c.name);
    }
    const parent = categories.find(c => c.id === modalState.category.parentCategoryId);
    const siblings = parent ? (parent.subCategories ?? []) : categories;
    return siblings.filter(c => c.id !== modalState.category.id).map(c => c.name);
  }, [modalState, categories]);

  const handleDelete = (category: IFinanceCategory) => {
    const categoryIds = collectCategoryIds(category);
    const subCount = (category.subCategories ?? []).length;

    Alert.alert(
      t('finance.categories.deleteTitle'),
      subCount > 0
        ? t('finance.categories.deleteCascadeMessage', { name: category.name, count: subCount })
        : t('finance.categories.deleteMessage', { name: category.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFinanceCategories({ categoryIds }).unwrap();
              showSnackbar({ text: t('finance.categories.deletedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
            } catch (err) {
              const error = err as IApiError;
              showSnackbar({ text: error.data?.message || t('finance.categories.deleteError'), variant: SnackbarVariantEnum.ERROR });
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-2 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={t('finance.categories.back')}
        >
          <Ionicons name="chevron-back" size={22} color="#4b465d" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-bold text-gray-800">{t('finance.categories.title')}</Text>
        <View className="w-9" />
      </View>

      <View className="px-4 pt-3 pb-1">
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          {(
            [
              { key: FinanceTransactionTypeEnum.Expense, label: t('finance.history.filterExpenses') },
              { key: FinanceTransactionTypeEnum.Income, label: t('finance.history.filterIncome') },
            ] as const
          ).map(section => {
            const active = typeFilter === section.key;
            return (
              <ToggleTab key={section.key} active={active} onPress={() => setTypeFilter(section.key)}>
                <Text className={`text-xs font-bold ${active ? 'text-primary' : 'text-gray-500'}`}>{section.label}</Text>
              </ToggleTab>
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1987EE" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 90 }}>
          {categories.map(category => (
            <CategoryGroup
              key={category.id}
              category={category}
              onEdit={cat => setModalState({ mode: 'edit', category: cat })}
              onDelete={handleDelete}
              onAddSubcategory={parent => setModalState({ mode: 'create', parentCategory: parent })}
            />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => setModalState({ mode: 'create', parentCategory: null })}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        accessibilityLabel={t('finance.categories.addTopLevel')}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <CategoryFormModal
        isVisible={modalState !== null}
        onClose={() => setModalState(null)}
        type={typeFilter}
        category={modalState?.mode === 'edit' ? modalState.category : null}
        parentCategory={modalState?.mode === 'create' ? modalState.parentCategory : null}
        siblingNames={siblingNames}
      />
    </View>
  );
};

export default CategoriesScreen;
