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
    startDate: '2025-12-21',
    endDate: '2025-03-19',
    season: 'winter',
    priority: 'low',
  },
  {
    id: 4,
    title: 'Spring Cleaning',
    description: 'Declutter and clean your living space.',
    completed: false,
    emoji: '🌸',
    startDate: '2025-03-20',
    endDate: '2025-06-20',
    season: 'spring',
    priority: 'medium',
  },
  {
    id: 5,
    title: 'Plant Flowers',
    description: 'Plant new flowers for the season.',
    completed: false,
    emoji: '🌷',
    startDate: '2025-03-20',
    endDate: '2025-06-20',
    season: 'spring',
  },
  {
    id: 6,
    title: 'Beach Day',
    description: 'Spend a day at the beach.',
    completed: false,
    emoji: '🏖️',
    startDate: '2025-06-21',
    endDate: '2025-09-22',
    season: 'summer',
  },
  {
    id: 7,
    title: 'Go Hiking',
    description: 'Enjoy a hike in the great outdoors.',
    completed: false,
    emoji: '🥾',
    startDate: '2025-06-21',
    endDate: '2025-09-22',
    season: 'summer',
  },
  {
    id: 8,
    title: 'Harvest Festival',
    description: 'Celebrate the harvest season.',
    completed: false,
    emoji: '🍂',
    startDate: '2025-09-23',
    endDate: '2025-12-20',
    season: 'autumn',
  },
  {
    id: 9,
    title: 'Bake Pumpkin Pie',
    description: 'Bake a delicious pumpkin pie.',
    completed: false,
    emoji: '🥧',
    startDate: '2025-09-23',
    endDate: '2025-12-20',
    season: 'autumn',
  },
];

export const exampleDailyQuests: IQuest[] = [
  {
    id: 1,
    title: 'Buy Fresh Groceries',
    description: 'Pick up fresh produce, milk, or bread for the day.',
    completed: false,
    emoji: '🛒',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Quick Clean-Up',
    description: 'Spend 15 minutes tidying up the most cluttered area.',
    completed: false,
    emoji: '🧹',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Daily Report Notes',
    description: 'Write a brief summary of your day or any pending tasks.',
    completed: false,
    emoji: '📄',
    priority: 'low',
  },
  {
    id: 4,
    title: 'Check in with Mom',
    description: 'Send a quick message or call to ask how she’s doing.',
    completed: false,
    emoji: '📞',
    priority: 'high',
  },
  {
    id: 5,
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water today.',
    completed: false,
    emoji: '💧',
    priority: 'medium',
  },
  {
    id: 6,
    title: 'Stretch or Exercise',
    description: 'Do 10 minutes of stretching or light exercise.',
    completed: false,
    emoji: '🏋️',
    priority: 'medium',
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
  season: 'winter' | 'spring' | 'summer' | 'autumn';
}

export interface IOneTimeQuest extends IQuest {
  startDate?: string;
  endDate?: string;
}

export interface IDailyQuests extends IQuest {}
