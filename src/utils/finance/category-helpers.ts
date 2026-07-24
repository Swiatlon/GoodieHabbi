import { Ionicons } from '@expo/vector-icons';
import { IFinanceCategory } from '@/contract/finance/finance.contract';
import { IoniconName } from '@/utils/icons/ionicon-name';

export const DEFAULT_CATEGORY_ICON: IoniconName = 'pricetag-outline';
export const DEFAULT_CATEGORY_COLOR = '#6b7280';

export const flattenCategories = (categories: IFinanceCategory[]): IFinanceCategory[] =>
  categories.flatMap(cat => [cat, ...(cat.subCategories ?? [])]);

export const collectCategoryIds = (category: IFinanceCategory): number[] => [category.id, ...(category.subCategories ?? []).map(sub => sub.id)];

export const getSavingsCategoryIds = (categories: IFinanceCategory[]): Set<number> => {
  const ids = new Set<number>();
  categories.forEach(cat => {
    if (cat.isSavings) collectCategoryIds(cat).forEach(id => ids.add(id));
  });
  return ids;
};

export const buildCategoriesById = (categories: IFinanceCategory[]): Map<number, IFinanceCategory> =>
  new Map(flattenCategories(categories).map(cat => [cat.id, cat]));

const isValidIoniconName = (name: string | null | undefined): name is IoniconName =>
  !!name && Object.prototype.hasOwnProperty.call(Ionicons.glyphMap, name);

export const resolveCategoryIcon = (icon: string | null | undefined): IoniconName => (isValidIoniconName(icon) ? icon : DEFAULT_CATEGORY_ICON);

export const getCategoryVisual = (
  categoriesById: Map<number, IFinanceCategory>,
  categoryId: number | null,
  fallbackColor: string = DEFAULT_CATEGORY_COLOR
): { icon: IoniconName; color: string } => {
  const category = categoryId != null ? categoriesById.get(categoryId) : undefined;
  return {
    icon: resolveCategoryIcon(category?.icon),
    color: category?.color ?? fallbackColor,
  };
};
