import { useGetMonthlySummaryQuery } from '@/redux/api/finance/finance-api';
import { getPastMonth } from '@/utils/finance/summary-helpers';

// BUDGET_HISTORY_MONTHS (6) fixed calls — RTK Query hooks can't be called a variable number of times, so
// this must be kept in sync by hand if that constant ever changes.
export const useMonthlyHistory = (year: number, month: number, skip = false) => {
  const options = { skip };
  const { data: m1 } = useGetMonthlySummaryQuery(getPastMonth(year, month, 1), options);
  const { data: m2 } = useGetMonthlySummaryQuery(getPastMonth(year, month, 2), options);
  const { data: m3 } = useGetMonthlySummaryQuery(getPastMonth(year, month, 3), options);
  const { data: m4 } = useGetMonthlySummaryQuery(getPastMonth(year, month, 4), options);
  const { data: m5 } = useGetMonthlySummaryQuery(getPastMonth(year, month, 5), options);
  const { data: m6 } = useGetMonthlySummaryQuery(getPastMonth(year, month, 6), options);
  return [m1, m2, m3, m4, m5, m6];
};
