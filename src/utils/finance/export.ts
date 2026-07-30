import { Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ITransaction } from '@/contract/finance/finance.contract';

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

const EXPORT_COLUMNS = ['id', 'type', 'date', 'category', 'amount', 'note'];

export const buildExportRows = (transactions: ITransaction[], categoryNameById: Map<number, string>): IFinanceExportRow[] =>
  transactions.map(tx => ({
    id: tx.id,
    type: tx.type,
    date: tx.occurredOn,
    category: tx.categoryId != null ? (categoryNameById.get(tx.categoryId) ?? String(tx.categoryId)) : '',
    amount: tx.netAmount,
    note: tx.note ?? '',
  }));

export type FinanceExportFormat = 'json' | 'csv';

// Shares to the OS share sheet when available (lets the user pick "save to Files", email, etc.);
// falls back to the plain text Share API on platforms without expo-sharing support (e.g. web).
export const shareFinanceExport = async (rows: IFinanceExportRow[], year: number, month: number, format: FinanceExportFormat) => {
  const filenameBase = `goodiehabbi-export-${year}-${String(month).padStart(2, '0')}`;
  const isCsv = format === 'csv';
  const content = isCsv
    ? generateCsv(rows as unknown as Record<string, unknown>[], EXPORT_COLUMNS)
    : JSON.stringify({ exportedAt: new Date().toISOString(), year, month, items: rows }, null, 2);
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
