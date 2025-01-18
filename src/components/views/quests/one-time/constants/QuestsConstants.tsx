import { Ionicons } from '@expo/vector-icons';
import { FilterValueType } from '@/hooks/useFilter';

export const exampleQuests = [
  {
    id: 1,
    title: 'Buy Groceries',
    description: 'Buy vegetables.',
    completed: false,
    emoji: '🛒',
    date: '2025-01-01',
    isImportant: true,
  },
  {
    id: 2,
    title: 'Clean the House',
    description: 'Clean thoroughly.',
    completed: false,
    emoji: '🧹',
    date: '2025-01-02',
    isImportant: false,
  },
  {
    id: 3,
    title: 'Finish Report',
    description: 'Submit the report.',
    completed: true,
    emoji: '📄',
    date: '2025-01-03',
    isImportant: false,
  },
];

interface IFilterMapValues {
  key: keyof Quest;
  value: FilterValueType;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const QuestFilterMap = new Map<string, IFilterMapValues>([
  ['ALL', { key: 'completed', value: null, icon: 'list', color: '#1987EE' }],
  ['COMPLETED', { key: 'completed', value: true, icon: 'checkmark-circle', color: '#4caf50' }],
  ['INCOMPLETED', { key: 'completed', value: false, icon: 'alert-circle', color: '#ffc107' }],
  ['IMPORTANT', { key: 'isImportant', value: true, icon: 'star', color: '#FF5722' }],
]);

export interface Quest {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  isImportant: boolean;
  emoji?: string;
  date: string;
}
