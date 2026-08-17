import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { IMuscleGroupVolume } from '@/contract/workouts/workouts.contract';
import { getMuscleGroupVisual } from '@/utils/workouts/muscle-group-visuals';

interface MuscleGroupBarProps {
  entry: IMuscleGroupVolume;
  maxVolume: number;
  weightUnit: string;
}

const MuscleGroupBar: React.FC<MuscleGroupBarProps> = ({ entry, maxVolume, weightUnit }) => {
  const { t } = useTranslation();
  const widthPercent = maxVolume > 0 ? Math.max(4, (entry.totalVolume / maxVolume) * 100) : 0;
  const visual = getMuscleGroupVisual(entry.muscleGroup);

  return (
    <View className="gap-1" testID="muscle-group-bar">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View className="w-5 h-5 rounded-full items-center justify-center" style={{ backgroundColor: `${visual.color}20` }}>
            <Text className="text-[10px]">{visual.emoji}</Text>
          </View>
          <Text className="text-xs font-semibold text-gray-600">{t(`workouts.enums.muscleGroup.${entry.muscleGroup}`)}</Text>
        </View>
        <Text className="text-xs text-gray-400">
          {entry.totalVolume} {weightUnit}
        </Text>
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View className="h-full rounded-full" style={{ width: `${widthPercent}%`, backgroundColor: visual.color }} />
      </View>
    </View>
  );
};

export default MuscleGroupBar;
