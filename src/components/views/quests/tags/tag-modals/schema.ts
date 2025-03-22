import * as yup from 'yup';
import { IQuestLabel } from '@/contract/quests/labels/labels-quests';

export const tagValidationSchema = (questsLabels: IQuestLabel[]) => {
  const tagValidationSchema = yup.object().shape({
    value: yup
      .string()
      .trim()
      .required('Tag cannot be empty')
      .max(25, 'Tag is too long. Please keep it under 25 characters.')
      .test('unique-tag', 'This tag name already exists. Please choose another.', value => {
        if (value) {
          return questsLabels.every(label => label.value.toLowerCase() !== value.toLowerCase());
        }

        return true;
      }),
    backgroundColor: yup.string().default('#1987EE'),
    textColor: yup.string().default('#FFFFFF'),
  });

  return tagValidationSchema;
};
