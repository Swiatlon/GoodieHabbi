import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export const useSessionMetadataValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    name: yup.string().trim().required(t('workouts.sessions.schema.nameRequired')).max(80, t('workouts.sessions.schema.nameMaxLength')),
    performedOn: yup.string().required(t('workouts.sessions.schema.performedOnRequired')),
    note: yup.string().nullable().default(null).max(500, t('workouts.sessions.schema.noteMaxLength')),
  });
};
