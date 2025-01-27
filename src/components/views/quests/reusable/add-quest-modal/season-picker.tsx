import React from 'react';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { SeasonEnum } from '@/contract/quest';

interface SeasonPickerProps {
  season: SeasonEnum | null;
  setSeason: (value: SeasonEnum | null) => void;
}

const getSeasonStyle = (season: SeasonEnum | null) => {
  switch (season) {
    case 'winter':
      return '#00bcd4';
    case 'spring':
      return '#4caf50';
    case 'summer':
      return '#ffeb3b';
    case 'autumn':
      return '#ff9800';
    default:
      return '#6b7280';
  }
};

const SeasonPicker: React.FC<SeasonPickerProps> = ({ season, setSeason }) => {
  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">Season:</Text>
      <View className={`rounded-lg border border-gray-300`}>
        <RNPickerSelect
          onValueChange={setSeason}
          items={[
            { label: 'Winter', value: 'winter' },
            { label: 'Spring', value: 'spring' },
            { label: 'Summer', value: 'summer' },
            { label: 'Autumn', value: 'autumn' },
          ]}
          value={season}
          placeholder={{
            label: 'Select Season',
            value: null,
            color: '#6b7280',
          }}
          style={{
            inputIOS: {
              marginLeft: 0,
              color: getSeasonStyle(season),
            },
            inputAndroid: {
              marginLeft: 0,
              color: getSeasonStyle(season),
            },
          }}
        />
      </View>
    </View>
  );
};

export default SeasonPicker;
