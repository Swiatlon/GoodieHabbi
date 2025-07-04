import * as yup from 'yup';
import { IQuestLabel } from '@/contract/quests/labels/labels-quests';

export const tagValidationSchema = (questsLabels: IQuestLabel[], previousValue?: string) => {
  return yup.object().shape({
    value: yup
      .string()
      .trim()
      .required('Tag cannot be empty')
      .max(25, 'Tag is too long. Please keep it under 25 characters.')
      .test('unique-tag', 'This tag name already exists. Please choose another.', value => {
        if (previousValue && value.toLowerCase() === previousValue.toLowerCase()) {
          return true;
        }

        return questsLabels.every(label => label.value.toLowerCase() !== value.toLowerCase());
      }),
    backgroundColor: yup.string().default('#1987EE'),
  });
};
