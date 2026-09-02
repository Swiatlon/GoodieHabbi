import { collectCategoryIds } from './category-helpers';
import dayjs from '@/configs/day-js-config';
import {
  FinanceTransactionTypeEnum,
  IBudget,
  ICategoryBreakdownItem,
  IFinanceCategory,
  IMonthlySummary,
  ITransaction,
} from '@/contract/finance/finance.contract';

// How many past months feed the "realistic average" used both for the single-category suggestion in
// BudgetModal and for the whole-category-list Budget Planner — kept as one constant so both screens always
// agree on what "history" means.
export const BUDGET_HISTORY_MONTHS = 6;

// months-ago (1..BUDGET_HISTORY_MONTHS) relative to a given year/month, wrapping across year boundaries.
export const getPastMonth = (year: number, month: number, monthsAgo: number) => {
  const target = dayjs()
    .year(year)
    .month(month - 1)
    .subtract(monthsAgo, 'month');
  return { year: target.year(), month: target.month() + 1 };
};

// Averages only over the `undefined`-filtered values a caller passes in — dividing by a fixed count would
// understate the average for a query still loading or a newer account with less than BUDGET_HISTORY_MONTHS
// of real history. Callers are responsible for turning "no real data that month" into `undefined` before
// this runs — see hasMonthActivity / amountForCategoryIds, which is where that actually happens.
export const averageDefined = (values: (number | undefined)[]): number => {
  const defined = values.filter((v): v is number => v != null);
  if (defined.length === 0) return 0;
  return defined.reduce((sum, v) => sum + v, 0) / defined.length;
};

type IMonthActivitySummary = Pick<IMonthlySummary, 'totalIncome' | 'totalExpense'>;

// The API returns a valid, all-zero summary for a month with zero transactions — including a month before
// the account existed at all — so there's no field that says "no data". The only usable signal is: did
// *anything* happen that month, anywhere (any income or any expense)? A month you were actually using the
// app in will have some total; a month before you started won't. Not perfect (a genuinely inactive month
// while using the app reads the same as "before you started"), but far better than treating every
// before-the-account-existed month as "spent exactly 0", which silently drags every suggestion toward zero.
export const hasMonthActivity = (summary: IMonthActivitySummary | undefined): boolean =>
  !!summary && (summary.totalIncome > 0 || summary.totalExpense > 0);

// Total for a set of category ids (a top-level category plus its subcategories) within one month's
// breakdown. Returns undefined — not 0 — when the query hasn't loaded yet, or the whole month has no
// activity at all (see hasMonthActivity), so averageDefined/medianDefined only see months that genuinely
// happened, and a category that was really at 0 in an active month still counts as a real 0.
export const amountForCategoryIds = (
  summary: (IMonthActivitySummary & { expenseByCategory: ICategoryBreakdownItem[] }) | undefined,
  categoryIds: Set<number>
): number | undefined => {
  if (!hasMonthActivity(summary)) return undefined;
  return summary!.expenseByCategory
    .filter(item => item.categoryId != null && categoryIds.has(item.categoryId))
    .reduce((sum, item) => sum + item.amount, 0);
};

// The middle value of the months that actually have data — unlike the mean, one unusually expensive month
// (a car repair, a holiday) can't drag this away from what a normal month actually looks like.
export const medianDefined = (values: (number | undefined)[]): number => {
  const defined = values
    .filter((v): v is number => v != null)
    .slice()
    .sort((a, b) => a - b);
  if (defined.length === 0) return 0;
  const mid = Math.floor(defined.length / 2);
  return defined.length % 2 === 0 ? (defined[mid - 1] + defined[mid]) / 2 : defined[mid];
};

export const maxDefined = (values: (number | undefined)[]): number => {
  const defined = values.filter((v): v is number => v != null);
  return defined.length === 0 ? 0 : Math.max(...defined);
};

// "Irregular" = occasional spikes rather than a steady monthly cost (car repairs, annual fees, one-off
// medical bills) — most months are low or zero, then one month jumps. Detected via coefficient of variation
// (stddev / mean) rather than a fixed amount threshold, so the same rule works for a 50 zł category and a
// 5000 zł one. Needs at least 2 months of data to say anything.
const IRREGULAR_COEFFICIENT_OF_VARIATION_THRESHOLD = 0.75;

export const isIrregularCategory = (values: (number | undefined)[]): boolean => {
  const defined = values.filter((v): v is number => v != null);
  if (defined.length < 2) return false;
  const mean = defined.reduce((sum, v) => sum + v, 0) / defined.length;
  if (mean === 0) return false;
  const variance = defined.reduce((sum, v) => sum + (v - mean) ** 2, 0) / defined.length;
  return Math.sqrt(variance) / mean > IRREGULAR_COEFFICIENT_OF_VARIATION_THRESHOLD;
};

export interface IBudgetSuggestion {
  // For a regular category this is the median (the typical month, so it's actually hit most months —
  // unlike a mean, which you basically never land on exactly). For an irregular one it's the mean instead:
  // that's the correct "sinking fund" amount to set aside every month so the occasional spike is already
  // covered, on the same logic as splitting an annual bill into 12 monthly payments.
  amount: number;
  isIrregular: boolean;
  peak: number;
  hasHistory: boolean;
}

export const suggestBudgetAmount = (values: (number | undefined)[]): IBudgetSuggestion => {
  const isIrregular = isIrregularCategory(values);
  return {
    amount: Math.round(isIrregular ? averageDefined(values) : medianDefined(values)),
    isIrregular,
    peak: maxDefined(values),
    hasHistory: values.some(v => v != null),
  };
};

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
