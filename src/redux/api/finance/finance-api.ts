import {
  FinanceTransactionTypeEnum,
  IAddCorrectionRequest,
  IBudget,
  ICreateBudgetRequest,
  ICreateFinanceCategoryRequest,
  ICreateTransactionRequest,
  IBudgetProgressItem,
  IDeleteFinanceCategoriesRequest,
  IFinanceCategory,
  IMonthlySummary,
  ITransaction,
  ITransactionPagedResult,
  IUpdateBudgetRequest,
  IUpdateFinanceCategoryRequest,
  IUpdateTransactionRequest,
  IYearlySummary,
} from '@/contract/finance/finance.contract';
import Api from '@/redux/config/api';

const FINANCE_CATEGORIES_URL = '/finance/categories';

export const FinanceApi = Api.injectEndpoints({
  endpoints: builder => ({
    getFinanceCategories: builder.query<IFinanceCategory[], { type?: FinanceTransactionTypeEnum } | void>({
      query: (args = {}) => ({
        url: FINANCE_CATEGORIES_URL,
        method: 'GET',
        params: { type: args?.type },
      }),
      providesTags: ['financeCategories'],
    }),

    createFinanceCategory: builder.mutation<IFinanceCategory, ICreateFinanceCategoryRequest>({
      query: data => ({
        url: FINANCE_CATEGORIES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['financeCategories'],
    }),

    updateFinanceCategory: builder.mutation<IFinanceCategory, { id: number; data: IUpdateFinanceCategoryRequest }>({
      query: ({ id, data }) => ({
        url: `${FINANCE_CATEGORIES_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['financeCategories'],
    }),

    deleteFinanceCategories: builder.mutation<void, IDeleteFinanceCategoriesRequest>({
      query: data => ({
        url: FINANCE_CATEGORIES_URL,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['financeCategories'],
    }),

    getTransactions: builder.query<
      ITransactionPagedResult,
      { from: string; to: string; type?: FinanceTransactionTypeEnum; categoryId?: number; page?: number; pageSize?: number }
    >({
      query: ({ from, to, type, categoryId, page = 1, pageSize = 20 }) => ({
        url: '/finance/transactions',
        method: 'GET',
        params: { from, to, type, categoryId, page, pageSize },
      }),
      providesTags: ['financeTransactions'],
    }),

    createTransaction: builder.mutation<ITransaction, ICreateTransactionRequest>({
      query: data => ({
        url: '/finance/transactions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['financeTransactions', 'financeAnalytics'],
    }),

    updateTransaction: builder.mutation<ITransaction, { id: number; data: IUpdateTransactionRequest }>({
      query: ({ id, data }) => ({
        url: `/finance/transactions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['financeTransactions', 'financeAnalytics'],
    }),

    // Returns the PARENT transaction with the new correction already embedded, since corrections are
    // never rendered as standalone rows.
    addCorrection: builder.mutation<ITransaction, { id: number; data: IAddCorrectionRequest }>({
      query: ({ id, data }) => ({
        url: `/finance/transactions/${id}/corrections`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['financeTransactions', 'financeAnalytics'],
    }),

    deleteTransaction: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/finance/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['financeTransactions', 'financeAnalytics'],
    }),

    getBudgets: builder.query<IBudget[], { year: number; month?: number }>({
      query: ({ year, month }) => ({
        url: '/finance/budgets',
        method: 'GET',
        params: { year, month },
      }),
      providesTags: ['financeBudgets'],
    }),

    createBudget: builder.mutation<IBudget, ICreateBudgetRequest>({
      query: data => ({
        url: '/finance/budgets',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['financeBudgets', 'financeAnalytics'],
    }),

    updateBudget: builder.mutation<IBudget, { id: number; data: IUpdateBudgetRequest }>({
      query: ({ id, data }) => ({
        url: `/finance/budgets/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['financeBudgets', 'financeAnalytics'],
    }),

    deleteBudget: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/finance/budgets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['financeBudgets', 'financeAnalytics'],
    }),

    getMonthlySummary: builder.query<IMonthlySummary, { year: number; month: number }>({
      query: ({ year, month }) => ({
        url: '/finance/analytics/monthly-summary',
        method: 'GET',
        params: { year, month },
      }),
      providesTags: ['financeAnalytics'],
    }),

    getYearlySummary: builder.query<IYearlySummary, { year: number }>({
      query: ({ year }) => ({
        url: '/finance/analytics/yearly-summary',
        method: 'GET',
        params: { year },
      }),
      providesTags: ['financeAnalytics'],
    }),

    getBudgetProgress: builder.query<IBudgetProgressItem[], { year: number; month?: number }>({
      query: ({ year, month }) => ({
        url: '/finance/analytics/budget-progress',
        method: 'GET',
        params: { year, month },
      }),
      providesTags: ['financeAnalytics', 'financeBudgets'],
    }),
  }),
});

export const {
  useGetFinanceCategoriesQuery,
  useCreateFinanceCategoryMutation,
  useUpdateFinanceCategoryMutation,
  useDeleteFinanceCategoriesMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useAddCorrectionMutation,
  useDeleteTransactionMutation,
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
  useGetMonthlySummaryQuery,
  useGetYearlySummaryQuery,
  useGetBudgetProgressQuery,
} = FinanceApi;
