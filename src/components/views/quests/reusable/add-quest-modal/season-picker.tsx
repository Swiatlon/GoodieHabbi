import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import ControlledSelect from '@/components/shared/select/controlled-select';
import { SeasonEnum, SeasonEnumType } from '@/contract/quests/base-quests';

const getSeasonStyle = (season: SeasonEnumType | null) => {
  switch (season) {
    case SeasonEnum.WINTER:
      return '#00bcd4';
    case SeasonEnum.SPRING:
      return '#4caf50';
    case SeasonEnum.SUMMER:
      return '#ffeb3b';
    case SeasonEnum.AUTUMN:
      return '#ff9800';
    default:
      return '#6b7280';
  }
};

const ControlledSeasonPicker: React.FC = () => {
  const { watch } = useFormContext();
  const selectedSeason = watch('season') as SeasonEnumType | null;

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">Season:</Text>
      <ControlledSelect
        name="season"
        placeholder="Select season"
        options={[
          { label: 'Winter', value: SeasonEnum.WINTER },
          { label: 'Spring', value: SeasonEnum.SPRING },
          { label: 'Summer', value: SeasonEnum.SUMMER },
          { label: 'Autumn', value: SeasonEnum.AUTUMN },
        ]}
        isModalVersion={true}
        className={`px-2`}
        textColor={getSeasonStyle(selectedSeason)}
      />
    </View>
  );
};

export default ControlledSeasonPicker;
