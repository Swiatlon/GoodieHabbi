import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { SupplementTimingEnum, SupplementUnitEnum } from '@/contract/supplements/supplements.contract';

export const useSupplementValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    name: yup.string().trim().required(t('supplements.catalog.schema.nameRequired')).max(80, t('supplements.catalog.schema.nameMaxLength')),
    unit: yup.mixed<SupplementUnitEnum>().oneOf(Object.values(SupplementUnitEnum)).required(),
    defaultAmount: yup
      .string()
      .default('')
      .test('is-positive-number', t('supplements.catalog.schema.amountPositive'), value => {
        if (!value || value.trim() === '') return true;
        const parsed = parseFloat(value.replace(',', '.'));
        return !Number.isNaN(parsed) && parsed > 0;
      }),
    note: yup.string().nullable().default(null).max(500, t('supplements.catalog.schema.noteMaxLength')),
    color: yup.string().nullable().default(null),
    icon: yup.string().nullable().default(null),
  });
};

export const useSupplementSlotValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    timing: yup.mixed<SupplementTimingEnum>().oneOf(Object.values(SupplementTimingEnum)).required(),
    amount: yup
      .string()
      .required(t('supplements.catalog.schema.amountRequired'))
      .test('is-positive-number', t('supplements.catalog.schema.amountPositive'), value => {
        if (!value) return false;
        const parsed = parseFloat(value.replace(',', '.'));
        return !Number.isNaN(parsed) && parsed > 0;
      }),
    timeOfDay: yup
      .string()
      .nullable()
      .default(null)
      .when('timing', {
        is: SupplementTimingEnum.Custom,
        then: schema => schema.required(t('supplements.catalog.schema.timeOfDayRequired')),
      }),
    offsetMinutes: yup.string().default(''),
    note: yup.string().nullable().default(null).max(500, t('supplements.catalog.schema.noteMaxLength')),
  });
};
