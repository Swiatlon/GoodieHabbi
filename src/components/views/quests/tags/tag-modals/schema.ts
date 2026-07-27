import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { IQuestLabel } from '@/contract/quests/labels/labels-quests';

export const useTagValidationSchema = () => {
  const { t } = useTranslation();

  return (questsLabels: IQuestLabel[], previousValue?: string) =>
    yup.object().shape({
      value: yup
        .string()
        .trim()
        .required(t('quests.tags.schema.required'))
        .max(25, t('quests.tags.schema.maxLength'))
        .test('unique-tag', t('quests.tags.schema.unique'), value => {
          if (previousValue && value.toLowerCase() === previousValue.toLowerCase()) {
            return true;
          }

          return questsLabels.every(label => label.value.toLowerCase() !== value.toLowerCase());
        }),
      backgroundColor: yup.string().default('#1987EE'),
    });
};
