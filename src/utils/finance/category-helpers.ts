import { Ionicons } from '@expo/vector-icons';
import { FinanceTransactionTypeEnum, IFinanceCategory, ITransaction } from '@/contract/finance/finance.contract';
import { IoniconName } from '@/utils/icons/ionicon-name';

export const DEFAULT_CATEGORY_ICON: IoniconName = 'pricetag-outline';
export const DEFAULT_CATEGORY_COLOR = '#6b7280';
export const INCOME_DEFAULT_COLOR = '#10B981';

export const flattenCategories = (categories: IFinanceCategory[]): IFinanceCategory[] =>
  categories.flatMap(cat => [cat, ...(cat.subCategories ?? [])]);

// Fixed categorical hue order (validated for colorblind-safe adjacent contrast) — used only where color is
// the primary way a chart tells categories apart (a pie/donut slice and its legend dot). Everywhere else
// (icon chips, cards) the category's name is already right there, so a shared gray fallback is fine — it's
// only a chart that actually needs every uncustomized category to look different from its neighbors.
const CATEGORICAL_CHART_PALETTE = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];

// Assigns a palette hue to every category that has no user-picked color, in the category list's own stable
// order — never by amount/rank within a chart, so a category's color can't shift just because its spend
// rank changed this month. Categories with a custom color are skipped (they keep their own color and don't
// consume a palette slot). Past 8 uncustomized categories the palette repeats rather than growing hues
// indefinitely — a real collision, but strictly better than every category sharing one gray, and the chart's
// legend still disambiguates by name.
export const buildCategoryChartColors = (categories: IFinanceCategory[]): Map<number, string> => {
  const map = new Map<number, string>();
  let paletteIndex = 0;
  for (const category of flattenCategories(categories)) {
    if (category.color) continue;
    map.set(category.id, CATEGORICAL_CHART_PALETTE[paletteIndex % CATEGORICAL_CHART_PALETTE.length]);
    paletteIndex += 1;
  }
  return map;
};

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

// Expenses and income fall back to different default colors when their category has none set.
export const getTransactionVisual = (
  categoriesById: Map<number, IFinanceCategory>,
  transaction: Pick<ITransaction, 'type' | 'categoryId'>
): { icon: IoniconName; color: string } => {
  const fallbackColor = transaction.type === FinanceTransactionTypeEnum.Expense ? DEFAULT_CATEGORY_COLOR : INCOME_DEFAULT_COLOR;
  return getCategoryVisual(categoriesById, transaction.categoryId, fallbackColor);
};

export const getCategoryLabel = (categoriesById: Map<number, IFinanceCategory>, categoryId: number | null, uncategorizedLabel: string): string =>
  categoryId != null ? (categoriesById.get(categoryId)?.name ?? uncategorizedLabel) : uncategorizedLabel;
