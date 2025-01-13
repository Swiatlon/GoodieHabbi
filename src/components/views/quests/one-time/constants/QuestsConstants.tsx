export const exampleQuests = [
  { id: 1, title: 'Buy Groceries', description: 'Buy vegetables.', completed: false, emoji: '🛒', date: '2025-01-01' },
  {
    id: 2,
    title: 'Clean the House',
    description: 'Clean thoroughly.',
    completed: false,
    emoji: '🧹',
    date: '2025-01-02',
  },
  {
    id: 3,
    title: 'Finish Report',
    description: 'Submit the report.',
    completed: true,
    emoji: '📄',
    date: '2025-01-03',
  },
];

export const QuestFilterMap = new Map<string, null | boolean>([
  ['ALL', null],
  ['COMPLETED', true],
  ['INCOMPLETED', false],
]);

export interface Quest {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  emoji?: string;
  date: string;
}
