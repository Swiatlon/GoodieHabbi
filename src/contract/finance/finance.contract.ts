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
  name?: string | null;
  color?: string | null;
  icon?: string | null;
  isSavings?: boolean;
}

export interface IDeleteFinanceCategoriesRequest {
  categoryIds: number[];
}

export interface ITransaction {
  id: number;
  type: FinanceTransactionTypeEnum;
  amount: number;
  categoryId: number | null;
  occurredOn: string;
  note?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ICreateTransactionRequest {
  type: FinanceTransactionTypeEnum;
  amount: number;
  occurredOn: string;
  categoryId?: number | null;
  note?: string | null;
}

export interface IUpdateTransactionRequest extends ICreateTransactionRequest {}

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
