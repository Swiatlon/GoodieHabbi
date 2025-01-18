export const exampleOneTimeQuests: IOneTimeQuest[] = [
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

export const exampleSeasonalQuests: ISeasonalQuest[] = [
  {
    id: 1,
    title: 'Buy Groceries',
    description: 'Buy vegetables.',
    completed: false,
    emoji: '🛒',
    startDate: '2025-01-01',
    endDate: '2025-01-05',
    isImportant: true,
  },
  {
    id: 2,
    title: 'Clean the House',
    description: 'Clean thoroughly.',
    completed: false,
    emoji: '🧹',
    startDate: '2025-01-02',
    endDate: '2025-01-07',
    isImportant: false,
  },
  {
    id: 3,
    title: 'Finish Report',
    description: 'Submit the report.',
    completed: true,
    emoji: '📄',
    startDate: '2025-01-03',
    endDate: '2025-01-10',
    isImportant: false,
  },
];

interface IQuest {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  isImportant: boolean;
  emoji?: string;
}

export interface ISeasonalQuest extends IQuest {
  startDate: string;
  endDate: string;
}

export interface IOneTimeQuest extends IQuest {
  date: string;
}
