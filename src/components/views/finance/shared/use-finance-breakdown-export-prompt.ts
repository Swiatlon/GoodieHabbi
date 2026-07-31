import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { ICategoryBreakdownItem, IFinanceCategory } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { BREAKDOWN_EXPORT_COLUMNS, buildBreakdownExportRows, FinanceExportFormat, shareFinanceExport } from '@/utils/finance/export';

// Statistics' export: the already-aggregated per-category totals for the currently viewed month or year
// (month === null exports the whole year), not the raw transaction list History/Dashboard export.
export const useFinanceBreakdownExportPrompt = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  return (
    incomeByCategory: ICategoryBreakdownItem[],
    expenseByCategory: ICategoryBreakdownItem[],
    categoriesById: Map<number, IFinanceCategory>,
    year: number,
    month: number | null
  ) => {
    const runExport = async (format: FinanceExportFormat) => {
      try {
        const categoryNameById = new Map<number, string>([...categoriesById].map(([id, cat]) => [id, cat.name]));
        const rows = buildBreakdownExportRows(incomeByCategory, expenseByCategory, categoryNameById);
        await shareFinanceExport(rows as unknown as Record<string, unknown>[], BREAKDOWN_EXPORT_COLUMNS, year, month, format);
      } catch {
        showSnackbar({ text: t('finance.export.error'), variant: SnackbarVariantEnum.ERROR });
      }
    };

    Alert.alert(t('finance.export.title'), undefined, [
      { text: 'CSV', onPress: async () => runExport('csv') },
      { text: 'JSON', onPress: async () => runExport('json') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };
};
