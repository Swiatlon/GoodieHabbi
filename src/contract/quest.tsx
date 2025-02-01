export const PriorityEnum = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export type PriorityEnumType = (typeof PriorityEnum)[keyof typeof PriorityEnum];

export const RepeatIntervalEnum = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
} as const;

export type RepeatIntervalEnumType = (typeof RepeatIntervalEnum)[keyof typeof RepeatIntervalEnum];

export enum SeasonEnum {
  Winter = 'winter',
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
}

export enum RepeatTypeEnum {
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export enum WeekdayEnum {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

interface IQuest {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  emoji?: string;
  priority?: PriorityEnumType;
}

export interface ISeasonalQuest extends IQuest {
  startDate: string;
  endDate: string;
  season: SeasonEnum;
}



export const exampleSeasonalQuests: ISeasonalQuest[] = [
  {
    id: 1,
    title: 'Buy Groceries',
    description: 'Buy vegetables.',
    completed: false,
    emoji: '🛒',
    startDate: '2025-12-21',
    endDate: '2025-03-19',
    season: SeasonEnum.Winter,
    priority: PriorityEnum.Low,
  },
  {
    id: 4,
    title: 'Spring Cleaning',
    description: 'Declutter and clean your living space.',
    completed: false,
    emoji: '🌸',
    startDate: '2025-03-20',
    endDate: '2025-06-20',
    season: SeasonEnum.Spring,
    priority: PriorityEnum.Medium,
  },
  {
    id: 5,
    title: 'Plant Flowers',
    description: 'Plant new flowers for the season.',
    completed: false,
    emoji: '🌷',
    startDate: '2025-03-20',
    endDate: '2025-06-20',
    season: SeasonEnum.Spring,
  },
  {
    id: 6,
    title: 'Beach Day',
    description: 'Spend a day at the beach.',
    completed: false,
    emoji: '🏖️',
    startDate: '2025-06-21',
    endDate: '2025-09-22',
    season: SeasonEnum.Summer,
  },
  {
    id: 7,
    title: 'Go Hiking',
    description: 'Enjoy a hike in the great outdoors.',
    completed: false,
    emoji: '🥾',
    startDate: '2025-06-21',
    endDate: '2025-09-22',
    season: SeasonEnum.Summer,
  },
  {
    id: 8,
    title: 'Harvest Festival',
    description: 'Celebrate the harvest season.',
    completed: false,
    emoji: '🍂',
    startDate: '2025-09-23',
    endDate: '2025-12-20',
    season: SeasonEnum.Autumn,
  },
  {
    id: 9,
    title: 'Bake Pumpkin Pie',
    description: 'Bake a delicious pumpkin pie.',
    completed: false,
    emoji: '🥧',
    startDate: '2025-09-23',
    endDate: '2025-12-20',
    season: SeasonEnum.Autumn,
  },
];

export const exampleDailyQuests: ITodayQuest[] = [
  {
    id: 1,
    title: 'Buy Groceries',
    description:
      'To show the priority of a quest in your React Native component, you can add a new UI element to display the priority property if it exists. Heres how you can modify the OneTimeQuestItem component:',
    completed: false,
    emoji: '🛒',
    startDate: '2025-01-01',
    endDate: '2025-01-20',
    priority: PriorityEnum.High,
  },
  {
    id: 2,
    title: 'Quick Clean-Up',
    description: 'Spend 15 minutes tidying up the most cluttered area.',
    completed: false,
    emoji: '🧹',
    priority: PriorityEnum.Medium,
  },
  {
    id: 3,
    title: 'Daily Report Notes',
    description: 'Write a brief summary of your day or any pending tasks.',
    completed: false,
    emoji: '📄',
    priority: PriorityEnum.Low,
  },
  {
    id: 4,
    title: 'Check in with Mom',
    description: 'Send a quick message or call to ask how she’s doing.',
    completed: false,
    emoji: '📞',
    priority: PriorityEnum.High,
  },
  {
    id: 5,
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water today.',
    completed: false,
    emoji: '💧',
    priority: PriorityEnum.Medium,
  },
  {
    id: 6,
    title: 'Stretch or Exercise',
    description: 'Do 10 minutes of stretching or light exercise.',
    completed: false,
    emoji: '🏋️',
    priority: PriorityEnum.Medium,
  },
];

export const exampleRepeatableQuests: IRepeatableQuest[] = [
  {
    id: 1,
    title: 'Workout',
    description: 'Go to the gym.',
    completed: false,
    emoji: '🏋️',
    repeatType: RepeatTypeEnum.Weekly,
    repeatDaysOfWeek: [
      WeekdayEnum.Monday,
      WeekdayEnum.Tuesday,
      WeekdayEnum.Wednesday,
      WeekdayEnum.Thursday,
      WeekdayEnum.Friday,
      WeekdayEnum.Saturday,
      WeekdayEnum.Sunday,
    ],
    priority: PriorityEnum.High,
  },
  {
    id: 2,
    title: 'Water Plants',
    description: 'Water the plants in the garden.',
    completed: false,
    emoji: '🌱',
    repeatType: RepeatTypeEnum.Weekly,
    repeatDaysOfWeek: [
      WeekdayEnum.Monday,
      WeekdayEnum.Tuesday,
      WeekdayEnum.Wednesday,
      WeekdayEnum.Thursday,
      WeekdayEnum.Friday,
      WeekdayEnum.Saturday,
    ],
    priority: PriorityEnum.Medium,
  },
  {
    id: 3,
    title: 'Monthly Report',
    description: 'Prepare the monthly report.',
    completed: false,
    emoji: '📊',
    repeatType: RepeatTypeEnum.Monthly,
    repeatDateRange: { startDay: 7, endDay: 10 },
    priority: PriorityEnum.High,
  },
  {
    id: 4,
    title: 'Pay Rent',
    description: 'Ensure the rent is paid.',
    completed: false,
    emoji: '🏠',
    repeatType: RepeatTypeEnum.Monthly,
    repeatDateRange: { startDay: 1, endDay: 1 },
    priority: PriorityEnum.High,
  },
  {
    id: 5,
    title: 'Pay Rent',
    description: 'Ensure the rent is paid.',
    completed: false,
    emoji: '🏠',
    repeatType: RepeatTypeEnum.Weekly,
    repeatDaysOfWeek: [WeekdayEnum.Monday, WeekdayEnum.Tuesday],
    priority: PriorityEnum.High,
  },
];
