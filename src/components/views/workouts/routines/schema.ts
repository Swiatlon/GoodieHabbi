import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export const useRoutineValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    name: yup.string().trim().required(t('workouts.routines.schema.nameRequired')).max(80, t('workouts.routines.schema.nameMaxLength')),
    description: yup.string().nullable().default(null).max(500, t('workouts.routines.schema.descriptionMaxLength')),
  });
};
