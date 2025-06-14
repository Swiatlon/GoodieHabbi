import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { calculateGoalPercentages, GoalType, goalTypeStyles } from './utils';
import { IGoalsStats } from '@/contract/account/account';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface GoalsSectionProps extends IGoalsStats {
  isLoading: boolean;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ isLoading, completed, totalCreated = 0, expired, active }) => {
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 500 });

  const { percentages } = useMemo(
    () => calculateGoalPercentages(completed, expired, active, totalCreated),
    [completed, expired, active, totalCreated]
  );

  const visibleGoals = useMemo(() => {
    return [
      { type: 'completed' as GoalType, value: completed, percentage: percentages.completed },
      { type: 'expired' as GoalType, value: expired, percentage: percentages.expired },
      { type: 'active' as GoalType, value: active, percentage: percentages.abandoned },
    ].filter(goal => goal.value > 0);
  }, [completed, expired, active, percentages]);

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg flex w-full mb-6">
      <Text className="text-lg font-bold text-center mb-3">Goals Overview</Text>
      <View className="flex-row justify-between mb-4">
        <View className="items-center flex-1">
          <Text className="text-green-600 font-bold text-xl">{completed}</Text>
          <Text className="text-xs text-gray-600">Completed</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-red-500 font-bold text-xl">{expired}</Text>
          <Text className="text-xs text-gray-600">Expired</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-gray-500 font-bold text-xl">{active}</Text>
          <Text className="text-xs text-gray-600">Active</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-blue-600 font-bold text-xl">{totalCreated}</Text>
          <Text className="text-xs text-gray-600">Total</Text>
        </View>
      </View>
      <View className="bg-gray-200 rounded-lg w-full flex-row items-center justify-center min-h-4">
        {visibleGoals.map((goal, index) => {
          const isFirst = index === 0;
          const isLast = index === visibleGoals.length - 1;
          const { color } = goalTypeStyles[goal.type];

          return (
            <View
              key={goal.type}
              className={`
                flex items-center p-[4px] ${color}
                ${visibleGoals.length === 1 ? 'rounded-lg' : ''}
                ${isFirst ? 'rounded-l-lg' : ''}
                ${isLast ? 'rounded-r-lg' : ''}
              `}
              style={{ width: `${goal.percentage}%` }}
            >
              <Text className="text-xs font-bold text-white text-center">{Math.round(goal.percentage)}%</Text>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default GoalsSection;
