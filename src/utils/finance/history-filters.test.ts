import {
  buildTransactionQuery,
  countActiveFilters,
  DEFAULT_HISTORY_FILTERS,
  IHistoryFilters,
  isBrowsingMonth,
  resolveHistoryRange,
} from './history-filters';
import { FinanceTransactionTypeEnum } from '@/contract/finance/finance.contract';

const withFilters = (overrides: Partial<IHistoryFilters>): IHistoryFilters => ({ ...DEFAULT_HISTORY_FILTERS, ...overrides });

describe('resolveHistoryRange', () => {
  it('covers the whole context month, including a short February', () => {
    expect(resolveHistoryRange(DEFAULT_HISTORY_FILTERS, 2026, 9)).toEqual({ from: '2026-09-01', to: '2026-09-30' });
    expect(resolveHistoryRange(DEFAULT_HISTORY_FILTERS, 2026, 2)).toEqual({ from: '2026-02-01', to: '2026-02-28' });
  });

  it('covers the whole context year', () => {
    expect(resolveHistoryRange(withFilters({ rangeMode: 'year' }), 2026, 9)).toEqual({ from: '2026-01-01', to: '2026-12-31' });
  });

  it('leaves both sides unbounded for all time', () => {
    expect(resolveHistoryRange(withFilters({ rangeMode: 'all' }), 2026, 9)).toEqual({});
  });

  it('leaves an empty custom side open', () => {
    expect(resolveHistoryRange(withFilters({ rangeMode: 'custom', customFrom: '2025-03-10', customTo: '' }), 2026, 9)).toEqual({
      from: '2025-03-10',
      to: undefined,
    });
  });
});

describe('countActiveFilters', () => {
  it('counts nothing for the defaults', () => {
    expect(countActiveFilters(DEFAULT_HISTORY_FILTERS)).toBe(0);
  });

  it('does not count type, which has its own toggle', () => {
    expect(countActiveFilters(withFilters({ type: FinanceTransactionTypeEnum.Expense }))).toBe(0);
  });

  it('counts range, categories and paid status once each', () => {
    expect(countActiveFilters(withFilters({ rangeMode: 'all', categoryIds: [3, 7], isPaid: false }))).toBe(3);
  });
});

describe('isBrowsingMonth', () => {
  it('is true only when nothing is set, treating a whitespace search as empty', () => {
    expect(isBrowsingMonth(DEFAULT_HISTORY_FILTERS, '')).toBe(true);
    expect(isBrowsingMonth(DEFAULT_HISTORY_FILTERS, '   ')).toBe(true);
    expect(isBrowsingMonth(DEFAULT_HISTORY_FILTERS, 'rent')).toBe(false);
    expect(isBrowsingMonth(withFilters({ type: FinanceTransactionTypeEnum.Income }), '')).toBe(false);
    expect(isBrowsingMonth(withFilters({ isPaid: true }), '')).toBe(false);
  });
});

describe('buildTransactionQuery', () => {
  it('drops empty values so they never reach the query string', () => {
    expect(buildTransactionQuery(withFilters({ rangeMode: 'all' }), '  ', 2026, 9)).toEqual({
      type: undefined,
      categoryIds: undefined,
      isPaid: undefined,
      search: undefined,
    });
  });

  it('trims the search term and passes the other filters through', () => {
    const filters = withFilters({ type: FinanceTransactionTypeEnum.Expense, categoryIds: [3], isPaid: false });

    expect(buildTransactionQuery(filters, '  kino ', 2026, 9)).toEqual({
      from: '2026-09-01',
      to: '2026-09-30',
      type: FinanceTransactionTypeEnum.Expense,
      categoryIds: [3],
      isPaid: false,
      search: 'kino',
    });
  });
});
