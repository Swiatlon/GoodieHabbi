import { computeBudgetOverview, getBudgetByCategory, getSavingsAmount, groupAmountByCategory, groupTransactionsByCategory } from './summary-helpers';
import { BudgetPeriodEnum, FinanceTransactionTypeEnum, IFinanceCategory, ITransaction } from '@/contract/finance/finance.contract';

describe('getSavingsAmount', () => {
  it('sums only items in savings categories', () => {
    const expenseByCategory = [
      { categoryId: 1, amount: 100, percentage: 0, parentCategoryId: null },
      { categoryId: 2, amount: 50, percentage: 0, parentCategoryId: null },
      { categoryId: 3, amount: 25, percentage: 0, parentCategoryId: null },
    ];
    const savingsCategoryIds = new Set([2]);

    expect(getSavingsAmount(expenseByCategory, savingsCategoryIds)).toBe(50);
  });
});

const TEST_DATE = '2026-01-01';

const buildCategory = (id: number, subCategoryIds: number[] = []): IFinanceCategory => ({
  id,
  name: `Category ${id}`,
  type: FinanceTransactionTypeEnum.Expense,
  color: null,
  icon: null,
  isSystem: false,
  isSavings: false,
  parentCategoryId: null,
  subCategories: subCategoryIds.map(subId => ({
    id: subId,
    name: `Sub ${subId}`,
    type: FinanceTransactionTypeEnum.Expense,
    color: null,
    icon: null,
    isSystem: false,
    isSavings: false,
    parentCategoryId: id,
    subCategories: null,
  })),
});

describe('groupAmountByCategory', () => {
  it('sums a subcategory into its parent, and leaves untouched categories at 0', () => {
    const categories = [buildCategory(1, [2]), buildCategory(3)];
    const breakdown = [
      { categoryId: 1, amount: 100, percentage: 0, parentCategoryId: null },
      { categoryId: 2, amount: 50, percentage: 0, parentCategoryId: 1 },
    ];

    const result = groupAmountByCategory(breakdown, categories);

    expect(result.get(1)).toBe(150);
    expect(result.get(3)).toBe(0);
  });
});

describe('groupTransactionsByCategory', () => {
  it('groups by type and merges subcategory transactions into the parent', () => {
    const categories = [buildCategory(1, [2])];
    const makeTx = (id: number, categoryId: number, type: FinanceTransactionTypeEnum): ITransaction => ({
      id,
      type,
      amount: 10,
      categoryId,
      occurredOn: TEST_DATE,
      correctsTransactionId: null,
      correctedAmount: 0,
      netAmount: 10,
      corrections: [],
      createdAt: TEST_DATE,
      isPaid: true,
    });
    const transactions = [
      makeTx(1, 1, FinanceTransactionTypeEnum.Expense),
      makeTx(2, 2, FinanceTransactionTypeEnum.Expense),
      makeTx(3, 1, FinanceTransactionTypeEnum.Income),
    ];

    const result = groupTransactionsByCategory(transactions, FinanceTransactionTypeEnum.Expense, categories);

    expect(result.get(1)?.map(tx => tx.id)).toEqual([1, 2]);
  });
});

describe('getBudgetByCategory', () => {
  it('indexes budgets by categoryId and skips budgets without one', () => {
    const budgets = [
      { id: 1, categoryId: 5, period: BudgetPeriodEnum.Monthly, year: 2026, month: 1, limitAmount: 100, createdAt: TEST_DATE },
      { id: 2, categoryId: null, period: BudgetPeriodEnum.Monthly, year: 2026, month: 1, limitAmount: 200, createdAt: TEST_DATE },
    ];

    const result = getBudgetByCategory(budgets);

    expect(result.get(5)?.id).toBe(1);
    expect(result.size).toBe(1);
  });
});

describe('computeBudgetOverview', () => {
  it('folds the opening balance into totalBudget and flags over-budget', () => {
    expect(computeBudgetOverview(1000, 200, 900)).toEqual({ totalBudget: 1200, totalCommitted: 900, progress: 0.75, isOver: false });
    expect(computeBudgetOverview(1000, 0, 1500)).toEqual({ totalBudget: 1000, totalCommitted: 1500, progress: 1, isOver: true });
  });

  it('has no progress/over-budget signal when there is no budget at all', () => {
    expect(computeBudgetOverview(0, 0, 50)).toEqual({ totalBudget: 0, totalCommitted: 50, progress: 0, isOver: false });
  });
});
