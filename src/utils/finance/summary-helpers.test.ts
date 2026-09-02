import {
  amountForCategoryIds,
  averageDefined,
  computeBudgetOverview,
  getBudgetByCategory,
  getPastMonth,
  getSavingsAmount,
  groupAmountByCategory,
  groupTransactionsByCategory,
  hasMonthActivity,
  isIrregularCategory,
  maxDefined,
  medianDefined,
  suggestBudgetAmount,
} from './summary-helpers';
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

describe('getPastMonth', () => {
  it('wraps across a year boundary', () => {
    expect(getPastMonth(2026, 1, 1)).toEqual({ year: 2025, month: 12 });
    expect(getPastMonth(2026, 3, 2)).toEqual({ year: 2026, month: 1 });
  });
});

describe('averageDefined', () => {
  it('averages only over defined values, ignoring months still loading or without history', () => {
    expect(averageDefined([100, undefined, 200])).toBe(150);
  });

  it('returns 0 when nothing is defined yet', () => {
    expect(averageDefined([undefined, undefined])).toBe(0);
  });
});

describe('amountForCategoryIds', () => {
  it('sums matching categories from one month and is undefined when the query has not loaded', () => {
    const summary = {
      totalIncome: 0,
      totalExpense: 150,
      expenseByCategory: [
        { categoryId: 1, amount: 100, percentage: 0, parentCategoryId: null },
        { categoryId: 2, amount: 50, percentage: 0, parentCategoryId: null },
      ],
    };

    expect(amountForCategoryIds(summary, new Set([1]))).toBe(100);
    expect(amountForCategoryIds(undefined, new Set([1]))).toBeUndefined();
  });

  it('is undefined for a month with zero activity everywhere, not just 0 — a phantom pre-account month reads the same as a real one otherwise', () => {
    const emptyMonth = { totalIncome: 0, totalExpense: 0, expenseByCategory: [] };
    expect(amountForCategoryIds(emptyMonth, new Set([1]))).toBeUndefined();
  });

  it('is a real 0 when the month had activity but nothing in this category', () => {
    const monthWithOtherSpend = {
      totalIncome: 0,
      totalExpense: 80,
      expenseByCategory: [{ categoryId: 2, amount: 80, percentage: 0, parentCategoryId: null }],
    };
    expect(amountForCategoryIds(monthWithOtherSpend, new Set([1]))).toBe(0);
  });
});

describe('hasMonthActivity', () => {
  it('is true when either income or expense is non-zero, false for an all-zero or missing summary', () => {
    expect(hasMonthActivity({ totalIncome: 100, totalExpense: 0 })).toBe(true);
    expect(hasMonthActivity({ totalIncome: 0, totalExpense: 50 })).toBe(true);
    expect(hasMonthActivity({ totalIncome: 0, totalExpense: 0 })).toBe(false);
    expect(hasMonthActivity(undefined)).toBe(false);
  });
});

describe('medianDefined', () => {
  it('is unmoved by a single outlier month, unlike an average', () => {
    const groceries = [400, 420, 410, 390, 405];
    expect(medianDefined(groceries)).toBe(405);

    const withOneSpike = [0, 0, 0, 0, 600];
    expect(medianDefined(withOneSpike)).toBe(0);
    expect(averageDefined(withOneSpike)).toBe(120);
  });
});

describe('maxDefined', () => {
  it('returns the single highest defined value', () => {
    expect(maxDefined([10, undefined, 50, 20])).toBe(50);
    expect(maxDefined([undefined, undefined])).toBe(0);
  });
});

describe('isIrregularCategory', () => {
  it('flags a category with occasional spikes against mostly-zero months', () => {
    expect(isIrregularCategory([0, 0, 0, 0, 0, 600])).toBe(true);
  });

  it('does not flag a steady category with similar amounts every month', () => {
    expect(isIrregularCategory([400, 420, 410, 390, 405])).toBe(false);
  });

  it('needs at least two data points to judge variability', () => {
    expect(isIrregularCategory([500])).toBe(false);
    expect(isIrregularCategory([])).toBe(false);
  });
});

describe('suggestBudgetAmount', () => {
  it('suggests the median for a regular category', () => {
    const result = suggestBudgetAmount([400, 420, 410, 390, 405]);
    expect(result).toEqual({ amount: 405, isIrregular: false, peak: 420, hasHistory: true });
  });

  it('suggests the mean (a sinking-fund amount) for an irregular category, and surfaces the peak', () => {
    const result = suggestBudgetAmount([0, 0, 0, 0, 0, 600]);
    expect(result).toEqual({ amount: 100, isIrregular: true, peak: 600, hasHistory: true });
  });

  it('has no history when every month is still undefined', () => {
    expect(suggestBudgetAmount([undefined, undefined])).toEqual({ amount: 0, isIrregular: false, peak: 0, hasHistory: false });
  });
});
