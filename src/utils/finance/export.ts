import { Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ICategoryBreakdownItem, ITransaction } from '@/contract/finance/finance.contract';

export const generateCsv = (rows: Record<string, unknown>[], headers?: string[]) => {
  if (rows.length === 0) return '';
  const cols = headers ?? Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v == null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('\n') || s.includes('\r') || s.includes('"')) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [cols.join(',')];
  for (const r of rows) {
    const cells = cols.map(c => escape(r[c]));
    lines.push(cells.join(','));
  }
  return lines.join('\n');
};

export interface IFinanceExportRow {
  id: number;
  type: string;
  date: string;
  category: string;
  amount: number;
  note: string;
}

export const TRANSACTION_EXPORT_COLUMNS = ['id', 'type', 'date', 'category', 'amount', 'note'];

export const buildExportRows = (transactions: ITransaction[], categoryNameById: Map<number, string>): IFinanceExportRow[] =>
  transactions.map(tx => ({
    id: tx.id,
    type: tx.type,
    date: tx.occurredOn,
    category: tx.categoryId != null ? (categoryNameById.get(tx.categoryId) ?? String(tx.categoryId)) : '',
    amount: tx.netAmount,
    note: tx.note ?? '',
  }));

export interface IFinanceBreakdownExportRow {
  type: string;
  category: string;
  amount: number;
  percentage: number;
}

export const BREAKDOWN_EXPORT_COLUMNS = ['type', 'category', 'amount', 'percentage'];

// Statistics only ever has the already-aggregated per-category totals (not the raw transaction list), so its
// export is "how much per category" rather than History/Dashboard's "every transaction".
export const buildBreakdownExportRows = (
  incomeByCategory: ICategoryBreakdownItem[],
  expenseByCategory: ICategoryBreakdownItem[],
  categoryNameById: Map<number, string>
): IFinanceBreakdownExportRow[] => {
  const toRow = (type: string) => (item: ICategoryBreakdownItem) => ({
    type,
    category: item.categoryId != null ? (categoryNameById.get(item.categoryId) ?? String(item.categoryId)) : '',
    amount: item.amount,
    percentage: Math.round(item.percentage * 100) / 100,
  });
  return [...incomeByCategory.map(toRow('Income')), ...expenseByCategory.map(toRow('Expense'))];
};

export type FinanceExportFormat = 'json' | 'csv';

// Shares to the OS share sheet when available (lets the user pick "save to Files", email, etc.);
// falls back to the plain text Share API on platforms without expo-sharing support (e.g. web).
// month is null for a whole-year export (Statistics' year view), which drops it from both the filename and
// the JSON payload rather than printing a misleading "month: null".
export const shareFinanceExport = async (
  rows: Record<string, unknown>[],
  columns: string[],
  year: number,
  month: number | null,
  format: FinanceExportFormat
) => {
  const filenameBase = month != null ? `goodiehabbi-export-${year}-${String(month).padStart(2, '0')}` : `goodiehabbi-export-${year}`;
  const isCsv = format === 'csv';
  const content = isCsv
    ? generateCsv(rows, columns)
    : JSON.stringify({ exportedAt: new Date().toISOString(), year, ...(month != null ? { month } : {}), items: rows }, null, 2);
  const filename = `${filenameBase}.${isCsv ? 'csv' : 'json'}`;
  const mimeType = isCsv ? 'text/csv' : 'application/json';

  const path = FileSystem.cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(path, content, { encoding: FileSystem.EncodingType.UTF8 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, { mimeType, dialogTitle: 'Finance export' });
  } else {
    await Share.share({ title: 'Finance export', message: content });
  }
};
