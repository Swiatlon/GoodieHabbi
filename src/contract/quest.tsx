export const exampleOneTimeQuests: IOneTimeQuest[] = [
  {
    id: 1,
    title: 'Buy Groceries',
    description:
      'To show the priority of a quest in your React Native component, you can add a new UI element to display the priority property if it exists. Heres how you can modify the OneTimeQuestItem component:',
    completed: false,
    emoji: '🛒',
    startDate: '2025-01-01',
    endDate: '2025-01-20',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Clean the House',
    description: 'Clean thoroughly.',
    completed: false,
    emoji: '🧹',
    startDate: '2025-01-02',
    endDate: '2025-01-20',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Finish Report',
    description: 'Submit the report.',
    completed: true,
    emoji: '📄',
    endDate: '2025-05-20',
    priority: 'low',
  },
  {
    id: 4,
    title: 'Call Mom',
    description: 'Check in and see how she’s doing.',
    completed: false,
    emoji: '📞',
    startDate: '2025-01-15',
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
  },
  {
    id: 2,
    title: 'Clean the House',
    description: 'Clean thoroughly.',
    completed: false,
    emoji: '🧹',
    startDate: '2025-01-02',
    endDate: '2025-01-07',
  },
  {
    id: 3,
    title: 'Finish Report',
    description: 'Submit the report.',
    completed: true,
    emoji: '📄',
    startDate: '2025-01-03',
    endDate: '2025-01-10',
  },
];

interface IQuest {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  emoji?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface ISeasonalQuest extends IQuest {
  startDate: string;
  endDate: string;
}

export interface IOneTimeQuest extends IQuest {
  startDate?: string;
  endDate?: string;
}
