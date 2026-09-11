import dayjs from '@/configs/day-js-config';
import { FinanceTransactionTypeEnum, IGetTransactionsQueryParams } from '@/contract/finance/finance.contract';
import { DATE_FORMAT } from '@/utils/finance/form-helpers';

export const SEARCH_MAX_LENGTH = 250;
export const HISTORY_PAGE_SIZE = 50;

export type HistoryRangeMode = 'month' | 'year' | 'all' | 'custom';

export interface IHistoryFilters {
  rangeMode: HistoryRangeMode;
  /** `YYYY-MM-DD`, or '' to leave that side of a custom range open. */
  customFrom: string;
  customTo: string;
  type: FinanceTransactionTypeEnum | null;
  categoryIds: number[];
  isPaid: boolean | null;
}

export const DEFAULT_HISTORY_FILTERS: IHistoryFilters = {
  rangeMode: 'month',
  customFrom: '',
  customTo: '',
  type: null,
  categoryIds: [],
  isPaid: null,
};

export interface IDateRange {
  from?: string;
  to?: string;
}

// `month` and `year` read the screen's year/month, so History can widen its range without owning a second date.
export const resolveHistoryRange = (filters: IHistoryFilters, year: number, month: number): IDateRange => {
  const monthStart = dayjs()
    .year(year)
    .month(month - 1)
    .date(1);

  switch (filters.rangeMode) {
    case 'month':
      return { from: monthStart.startOf('month').format(DATE_FORMAT), to: monthStart.endOf('month').format(DATE_FORMAT) };
    case 'year':
      return { from: monthStart.startOf('year').format(DATE_FORMAT), to: monthStart.endOf('year').format(DATE_FORMAT) };
    case 'custom':
      return { from: filters.customFrom || undefined, to: filters.customTo || undefined };
    case 'all':
    default:
      return {};
  }
};

// Type is left out on purpose: it has its own always-visible toggle on the screen, so badging it would double-count.
export const countActiveFilters = (filters: IHistoryFilters): number =>
  (filters.rangeMode === 'month' ? 0 : 1) + (filters.categoryIds.length > 0 ? 1 : 0) + (filters.isPaid === null ? 0 : 1);

/** True only for the screen's default state: one month, nothing narrowed, nothing searched. */
export const isBrowsingMonth = (filters: IHistoryFilters, search: string): boolean =>
  countActiveFilters(filters) === 0 && filters.type === null && search.trim() === '';

export const buildTransactionQuery = (filters: IHistoryFilters, search: string, year: number, month: number): IGetTransactionsQueryParams => {
  const trimmed = search.trim();

  return {
    ...resolveHistoryRange(filters, year, month),
    type: filters.type ?? undefined,
    categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
    isPaid: filters.isPaid ?? undefined,
    search: trimmed.length > 0 ? trimmed : undefined,
  };
};
