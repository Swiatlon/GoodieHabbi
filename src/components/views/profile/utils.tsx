import { calculateProgress } from '@/utils/utils/utils';

export const calculateGoalPercentages = (completedGoals: number, expiredGoals: number, abandonedGoals: number, totalGoals = 0) => {
  const completed = calculateProgress(completedGoals, totalGoals);
  const expired = calculateProgress(expiredGoals, totalGoals);
  const abandoned = calculateProgress(abandonedGoals, totalGoals);

  return {
    percentages: {
      completed,
      expired,
      abandoned,
    },
  };
};

export type GoalType = 'completed' | 'expired' | 'abandoned';

export interface GoalData {
  type: GoalType;
  value: number;
}

export interface GoalTypeStyle {
  color: string;
  name: string;
}

export const goalTypeStyles: Record<GoalType, GoalTypeStyle> = {
  completed: { color: 'bg-green-500', name: 'Completed' },
  expired: { color: 'bg-red-500', name: 'Expired' },
  abandoned: { color: 'bg-gray-500', name: 'Abandoned' },
};
