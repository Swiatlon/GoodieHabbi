import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FinanceTransactionTypeEnum } from '@/contract/finance/finance.contract';

// Mirrors the backend's "unique name per sibling level" rule client-side for instant feedback — the
// server still enforces it (409) as the source of truth, this just avoids a round trip for the common case.
export const useCategoryValidationSchema = () => {
  const { t } = useTranslation();

  return (siblingNames: string[], previousName?: string) =>
    yup.object().shape({
      name: yup
        .string()
        .trim()
        .required(t('finance.categories.schema.nameRequired'))
        .max(40, t('finance.categories.schema.nameMaxLength'))
        .test('unique-category-name', t('finance.categories.schema.nameUnique'), value => {
          if (!value) return true;
          if (previousName && value.toLowerCase() === previousName.toLowerCase()) return true;
          return siblingNames.every(name => name.toLowerCase() !== value.toLowerCase());
        }),
      color: yup.string().default('#1987EE'),
      icon: yup.string().default('pricetag-outline'),
      type: yup.mixed<FinanceTransactionTypeEnum>().oneOf(Object.values(FinanceTransactionTypeEnum)).required(),
      isSavings: yup.boolean().default(false).required(),
    });
};
