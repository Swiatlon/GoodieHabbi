import React from 'react';
import { View, Text } from 'react-native';

interface RatioBarSegment {
  label: string;
  value: number;
  color: string;
}

interface RatioBarProps {
  segments: RatioBarSegment[];
}

const RatioBar: React.FC<RatioBarProps> = ({ segments }) => {
  const total = segments.reduce((acc, seg) => acc + seg.value, 0);

  if (total === 0) return null;

  return (
    <View className="flex-row w-full rounded-lg overflow-hidden h-6">
      {segments.map(seg => {
        const widthPercent = (seg.value / total) * 100;

        return (
          <View key={seg.label} className="justify-center items-center" style={{ width: `${widthPercent}%`, backgroundColor: seg.color }}>
            <Text className="text-white font-bold text-xs">{Math.round(widthPercent)}%</Text>
          </View>
        );
      })}
    </View>
  );
};

export default RatioBar;
