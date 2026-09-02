import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SwipeableRow from '@/components/shared/swipeable-row/swipeable-row';
import { IFinanceCategory } from '@/contract/finance/finance.contract';
import { DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';

interface CategoryRowProps {
  category: IFinanceCategory;
  indented?: boolean;
  onEdit: (category: IFinanceCategory) => void;
  onDelete: (category: IFinanceCategory) => void;
}

// System categories from the seed are read-only everywhere (PUT/DELETE 404 for them, see
// docs/finance-backend-todo.md) — no tap, no swipe, just a badge explaining why.
const CategoryRow: React.FC<CategoryRowProps> = ({ category, indented, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const color = category.color ?? DEFAULT_CATEGORY_COLOR;
  const icon = resolveCategoryIcon(category.icon);

  const content = (
    <View className={`flex-row items-center gap-3 px-4 py-3 bg-white ${indented ? 'pl-10' : ''}`}>
      <TouchableOpacity
        onPress={category.isSystem ? undefined : () => onEdit(category)}
        activeOpacity={category.isSystem ? 1 : 0.7}
        disabled={category.isSystem}
        className="flex-1 flex-row items-center gap-3"
      >
        <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Ionicons name={icon} size={15} color={color} />
        </View>
        <Text className="flex-1 text-sm font-semibold text-gray-800" numberOfLines={1}>
          {category.name}
        </Text>
        {category.isSavings && (
          <View className="flex-row items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50">
            <Ionicons name="trending-up-outline" size={10} color="#059669" />
            <Text className="text-[10px] font-semibold text-emerald-600">{t('finance.categories.savingsBadge')}</Text>
          </View>
        )}
      </TouchableOpacity>

      {category.isSystem ? (
        <View className="flex-row items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-100">
          <Ionicons name="lock-closed-outline" size={10} color="#6b7280" />
          <Text className="text-[10px] font-semibold text-gray-500">{t('finance.categories.systemBadge')}</Text>
        </View>
      ) : (
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => onDelete(category)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={t('finance.categories.deleteTitle')}
            testID={`category-delete-${category.id}`}
          >
            <Ionicons name="trash-outline" size={16} color="#e53e3e" />
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={14} color="#d1d5db" />
        </View>
      )}
    </View>
  );

  if (category.isSystem) return content;

  return <SwipeableRow onDelete={() => onDelete(category)}>{content}</SwipeableRow>;
};

export default CategoryRow;
