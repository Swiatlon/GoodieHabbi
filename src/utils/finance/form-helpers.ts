import { useDefaultClassNames } from 'react-native-ui-datepicker';
import dayjs from '@/configs/day-js-config';
import { ICreateTransactionRequest, ITransaction } from '@/contract/finance/finance.contract';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const todayString = () => dayjs().format(DATE_FORMAT);

export const parseAmount = (value: string) => parseFloat(value.replace(',', '.'));

// Keeps the same day-of-month, clamped into the target month (e.g. the 31st copied into a 30-day month lands on the 30th).
export const remapOccurredOnToMonth = (occurredOn: string, targetYear: number, targetMonth: number) => {
  const day = dayjs(occurredOn).date();
  const targetMonthStart = dayjs()
    .year(targetYear)
    .month(targetMonth - 1)
    .date(1);
  const clampedDay = Math.min(day, targetMonthStart.endOf('month').date());
  return targetMonthStart.date(clampedDay).format(DATE_FORMAT);
};

// The two "copy this transaction into another month" modals both build this exact payload.
export const buildCopyTransactionPayload = (transaction: ITransaction, targetYear: number, targetMonth: number): ICreateTransactionRequest => ({
  type: transaction.type,
  amount: transaction.amount,
  categoryId: transaction.categoryId,
  note: transaction.note ?? undefined,
  occurredOn: remapOccurredOnToMonth(transaction.occurredOn, targetYear, targetMonth),
});

type DatePickerClassNames = ReturnType<typeof useDefaultClassNames>;

// Shared calendar styling for every finance date picker — react-native-ui-datepicker's default classNames
// don't lay out the prev/next month header as a row, which is what made picking a future date look broken.
export const buildDatePickerClassNames = (defaultClassNames: DatePickerClassNames): DatePickerClassNames => ({
  ...defaultClassNames,
  header: 'flex-row justify-between items-center mb-2',
  weekdays: 'border-b border-gray-200 flex-row justify-between my-2 pb-2',
  weekday_label: 'text-gray-500 text-sm font-semibold',
  today: 'bg-white border border-primary rounded-full m-1',
  selected: 'bg-primary border-primary rounded-full m-1',
  selected_label: 'text-white font-bold',
  disabled: 'opacity-50',
});
