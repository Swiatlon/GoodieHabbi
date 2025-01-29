import * as Yup from 'yup';
import { PriorityEnumType } from '@/contract/quest';

export interface OneTimeQuestFormValues {
  title: string;
  description: string | null;
  selectedEmoji: string | null;
  priority: PriorityEnumType | null;
  startDate: Date | null;
  endDate: Date | null;
  isCompleted: boolean;
  emoji: string | null;
}

export const oneTimeQuestValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: Yup.string().nullable().default(null),
  selectedEmoji: Yup.string().nullable().default(null),
  priority: Yup.mixed<PriorityEnumType>().nullable().default(null),
  startDate: Yup.date().nullable().default(null),
  endDate: Yup.date().nullable().default(null).min(Yup.ref('startDate'), 'End date must be after the start date'),
  isCompleted: Yup.boolean().default(false),
  emoji: Yup.string().nullable().default(null),
});
