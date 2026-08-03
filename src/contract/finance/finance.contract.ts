export enum FinanceTransactionTypeEnum {
  Income = 'Income',
  Expense = 'Expense',
}

export enum BudgetPeriodEnum {
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export interface IFinanceCategory {
  id: number;
  name: string;
  type: FinanceTransactionTypeEnum;
  color: string | null;
  icon: string | null;
  isSystem: boolean;
  isSavings: boolean;
  parentCategoryId: number | null;
  subCategories: IFinanceCategory[] | null;
}

export interface ICreateFinanceCategoryRequest {
  name: string;
  type: FinanceTransactionTypeEnum;
  parentCategoryId?: number | null;
  color?: string | null;
  icon?: string | null;
  isSavings?: boolean;
}

export interface IUpdateFinanceCategoryRequest {
  // Required by the API even though the update is conceptually partial — and PUT replaces the whole
  // record, so color/icon must always be sent too or the backend nulls them out. See docs/finance-backend-todo.md.
  name: string;
  color?: string | null;
  icon?: string | null;
  isSavings?: boolean;
}

export interface IDeleteFinanceCategoriesRequest {
  categoryIds: number[];
}

/**
 * A correction is money coming back against an earlier transaction (a refund, a friend paying you back,
 * an employer reimbursing an expense — and the mirror direction too). It is a relation, not a type: the
 * correction is itself a transaction pointing at its parent via `correctsTransactionId`, and it inherits the
 * parent's `type` and `categoryId`.
 *
 * `GET /transactions` returns parents only — corrections arrive nested in `corrections`, never as their own
 * row, so a correction dated in a different month than its parent can never be paged away from it.
 * Render `netAmount`, never `amount`: any client-side total built from `amount` will disagree with every
 * server aggregate. Analytics already arrive net.
 */
export interface ITransaction {
  id: number;
  type: FinanceTransactionTypeEnum;
  amount: number;
  categoryId: number | null;
  occurredOn: string;
  note?: string | null;
  correctsTransactionId: number | null;
  correctedAmount: number;
  netAmount: number;
  corrections: ITransaction[];
  createdAt: string;
  updatedAt?: string | null;
  // Whether this transaction has actually been paid/received yet — mainly meaningful for expenses
  // dated today or in the future. See docs/finance-backend-todo.md.
  isPaid: boolean;
}

export interface IAddCorrectionRequest {
  amount: number;
  occurredOn: string;
  note?: string | null;
}

export interface ICreateTransactionRequest {
  type: FinanceTransactionTypeEnum;
  amount: number;
  occurredOn: string;
  categoryId?: number | null;
  note?: string | null;
  isPaid?: boolean;
}

export interface IUpdateTransactionRequest extends ICreateTransactionRequest {}

export interface IUpdateTransactionPaidStatusRequest {
  isPaid: boolean;
}

export interface ITransactionPagedResult {
  items: ITransaction[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface IBudget {
  id: number;
  categoryId: number | null;
  period: BudgetPeriodEnum;
  year: number;
  month: number | null;
  limitAmount: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ICreateBudgetRequest {
  categoryId?: number | null;
  period: BudgetPeriodEnum;
  year: number;
  month?: number | null;
  limitAmount: number;
}

export interface IUpdateBudgetRequest {
  limitAmount: number;
}

export interface ICategoryBreakdownItem {
  categoryId: number | null;
  categoryName?: string | null;
  parentCategoryId: number | null;
  amount: number;
  percentage: number;
}

export interface IMonthlySummary {
  year: number;
  month: number;
  currency?: string | null;
  totalIncome: number;
  totalExpense: number;
  net: number;
  expenseByCategory: ICategoryBreakdownItem[];
  incomeByCategory: ICategoryBreakdownItem[];
  // Leftover carried forward from previous months (income minus expense, chained), server-computed.
  // See docs/finance-backend-todo.md.
  openingBalance: number;
}

export interface IMonthlyTotals {
  month: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export interface IYearlySummary {
  year: number;
  currency?: string | null;
  totalIncome: number;
  totalExpense: number;
  net: number;
  months: IMonthlyTotals[];
  expenseByCategory: ICategoryBreakdownItem[];
  incomeByCategory: ICategoryBreakdownItem[];
}

export interface ICategoryBreakdown {
  type: FinanceTransactionTypeEnum;
  year: number;
  month: number | null;
  currency?: string | null;
  total: number;
  items: ICategoryBreakdownItem[];
}

export interface IBudgetProgressItem {
  budgetId: number;
  categoryId: number | null;
  categoryName?: string | null;
  period: BudgetPeriodEnum;
  year: number;
  month: number | null;
  limit: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
}

export interface ISpendingTrendPoint {
  year: number;
  month: number;
  income: number;
  expense: number;
  net: number;
}

export interface ISpendingTrend {
  currency?: string | null;
  points: ISpendingTrendPoint[];
}

export interface IFinanceSettings {
  currency: string | null;
}

export interface IUpdateCurrencyRequest {
  currency: string;
}

/**
 * A recurring transaction is a template the backend materializes into a real transaction every month on
 * a schedule — distinct from the client-side "copy to another month" action, which only ever creates a
 * one-off duplicate. `dayOfMonth` past the end of a short month lands on that month's last day.
 *
 * Note that the materialized transactions carry no reference back to the template they came from, so the
 * app cannot mark them as recurring, dedupe them, or offer a "skip this month" action.
 */
export interface IRecurringTransaction {
  id: number;
  type: FinanceTransactionTypeEnum;
  categoryId: number | null;
  amount: number;
  note?: string | null;
  dayOfMonth: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ICreateRecurringTransactionRequest {
  type: FinanceTransactionTypeEnum;
  categoryId?: number | null;
  amount: number;
  note?: string | null;
  dayOfMonth: number;
}

/**
 * Every field is optional and an omitted one is left untouched — so a partial body (e.g. just
 * `isActive`) is safe and preserves the rest.
 *
 * ⚠️ `note: null` is treated as "leave unchanged", not "clear". To erase a note send an empty string.
 */
export interface IUpdateRecurringTransactionRequest {
  amount?: number;
  note?: string | null;
  dayOfMonth?: number;
  isActive?: boolean;
}
