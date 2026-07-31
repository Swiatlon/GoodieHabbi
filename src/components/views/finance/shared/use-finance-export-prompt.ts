import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { IFinanceCategory, ITransaction } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { buildExportRows, FinanceExportFormat, shareFinanceExport, TRANSACTION_EXPORT_COLUMNS } from '@/utils/finance/export';

// Shared by the Dashboard and History export buttons: ask CSV vs JSON, build the rows, share the file.
export const useFinanceExportPrompt = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  return (transactions: ITransaction[], categoriesById: Map<number, IFinanceCategory>, year: number, month: number) => {
    const runExport = async (format: FinanceExportFormat) => {
      try {
        const categoryNameById = new Map<number, string>([...categoriesById].map(([id, cat]) => [id, cat.name]));
        const rows = buildExportRows(transactions, categoryNameById);
        await shareFinanceExport(rows as unknown as Record<string, unknown>[], TRANSACTION_EXPORT_COLUMNS, year, month, format);
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
