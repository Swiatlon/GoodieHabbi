import { ICategoryBreakdownItem } from '@/contract/finance/finance.contract';

export const getSavingsAmount = (expenseByCategory: ICategoryBreakdownItem[], savingsCategoryIds: Set<number>): number =>
  expenseByCategory
    .filter(item => item.categoryId != null && savingsCategoryIds.has(item.categoryId))
    .reduce((sum, item) => sum + item.amount, 0);
