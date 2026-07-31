import { collectCategoryIds } from './category-helpers';
import { FinanceTransactionTypeEnum, IBudget, ICategoryBreakdownItem, IFinanceCategory, ITransaction } from '@/contract/finance/finance.contract';

export const getSavingsAmount = (expenseByCategory: ICategoryBreakdownItem[], savingsCategoryIds: Set<number>): number =>
  expenseByCategory.filter(item => item.categoryId != null && savingsCategoryIds.has(item.categoryId)).reduce((sum, item) => sum + item.amount, 0);

// Sums a category breakdown per top-level category (including its subcategories) in one pass over the
// breakdown array, instead of re-filtering the whole array once per category (O(categories) vs O(categories
// * breakdown) for a dashboard with many categories).
export const groupAmountByCategory = (breakdown: ICategoryBreakdownItem[], categories: IFinanceCategory[]): Map<number, number> => {
  const byLeafId = new Map<number, number>();
  for (const item of breakdown) {
    if (item.categoryId == null) continue;
    byLeafId.set(item.categoryId, (byLeafId.get(item.categoryId) ?? 0) + item.amount);
  }

  const result = new Map<number, number>();
  for (const category of categories) {
    const total = collectCategoryIds(category).reduce((sum, id) => sum + (byLeafId.get(id) ?? 0), 0);
    result.set(category.id, total);
  }
  return result;
};

// Same idea for the raw transaction list backing each category's expandable row list.
export const groupTransactionsByCategory = (
  transactions: ITransaction[],
  type: FinanceTransactionTypeEnum,
  categories: IFinanceCategory[]
): Map<number, ITransaction[]> => {
  const byLeafId = new Map<number, ITransaction[]>();
  for (const tx of transactions) {
    if (tx.type !== type || tx.categoryId == null) continue;
    const existing = byLeafId.get(tx.categoryId);
    if (existing) existing.push(tx);
    else byLeafId.set(tx.categoryId, [tx]);
  }

  const result = new Map<number, ITransaction[]>();
  for (const category of categories) {
    result.set(
      category.id,
      collectCategoryIds(category).flatMap(id => byLeafId.get(id) ?? [])
    );
  }
  return result;
};

export const getBudgetByCategory = (budgets: IBudget[]): Map<number, IBudget> =>
  new Map(budgets.filter((b): b is IBudget & { categoryId: number } => b.categoryId != null).map(b => [b.categoryId, b]));

export interface IBudgetOverview {
  totalBudget: number;
  totalCommitted: number;
  progress: number;
  isOver: boolean;
}

// totalBudget/progress/isOver were previously computed ad hoc inline on the Dashboard; pulled out so the
// arithmetic (and the "budget = income + carried-over balance" rule) lives and is tested in one place.
export const computeBudgetOverview = (totalIncome: number, openingBalance: number, totalSpent: number): IBudgetOverview => {
  const totalBudget = totalIncome + openingBalance;
  const totalCommitted = totalSpent;
  const progress = totalBudget > 0 ? Math.min(totalCommitted / totalBudget, 1) : 0;
  const isOver = totalBudget > 0 && totalCommitted > totalBudget;
  return { totalBudget, totalCommitted, progress, isOver };
};
