import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { IMuscleGroupVolume } from '@/contract/workouts/workouts.contract';

interface MuscleGroupBarProps {
  entry: IMuscleGroupVolume;
  maxVolume: number;
  weightUnit: string;
}

const MuscleGroupBar: React.FC<MuscleGroupBarProps> = ({ entry, maxVolume, weightUnit }) => {
  const { t } = useTranslation();
  const widthPercent = maxVolume > 0 ? Math.max(4, (entry.totalVolume / maxVolume) * 100) : 0;

  return (
    <View className="gap-1" testID="muscle-group-bar">
      <View className="flex-row justify-between">
        <Text className="text-xs font-semibold text-gray-600">{t(`workouts.enums.muscleGroup.${entry.muscleGroup}`)}</Text>
        <Text className="text-xs text-gray-400">
          {entry.totalVolume} {weightUnit}
        </Text>
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View className="h-full bg-primary rounded-full" style={{ width: `${widthPercent}%` }} />
      </View>
    </View>
  );
};

export default MuscleGroupBar;
