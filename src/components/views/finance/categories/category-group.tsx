import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryRow from './category-row';
import { IFinanceCategory } from '@/contract/finance/finance.contract';

interface CategoryGroupProps {
  category: IFinanceCategory;
  onEdit: (category: IFinanceCategory) => void;
  onDelete: (category: IFinanceCategory) => void;
  onAddSubcategory: (parent: IFinanceCategory) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ category, onEdit, onDelete, onAddSubcategory }) => {
  const { t } = useTranslation();
  const subCategories = category.subCategories ?? [];

  return (
    <View className="mb-3 bg-white rounded-2xl shadow-sm overflow-hidden">
      <CategoryRow category={category} onEdit={onEdit} onDelete={onDelete} />
      {subCategories.map(sub => (
        <View key={sub.id} className="border-t border-gray-50">
          <CategoryRow category={sub} indented onEdit={onEdit} onDelete={onDelete} />
        </View>
      ))}
      {/* Allowed even under a system parent — the new subcategory is the user's own and gets full edit/delete,
          it just can't be flagged isSavings unless the parent is (server cascades isSavings from parent). */}
      <TouchableOpacity onPress={() => onAddSubcategory(category)} className="flex-row items-center gap-2 px-4 py-2.5 border-t border-gray-50">
        <Ionicons name="add-circle-outline" size={16} color="#1987EE" />
        <Text className="text-xs font-semibold text-primary">{t('finance.categories.addSubcategory')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryGroup;
