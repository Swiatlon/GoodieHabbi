import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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

const ControlledSeasonPicker = ({ isRequired }: { isRequired?: boolean }) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const selectedSeason = watch('season') as SeasonEnumType | null;

  return (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-gray-500">
        {t('quests.reusable.form.seasonLabel')}
        {isRequired && <Text className="text-red-500">*</Text>}
      </Text>
      <ControlledSelect
        clearAsNull
        name="season"
        placeholder={t('quests.reusable.form.seasonPlaceholder')}
        options={[
          { label: t('quests.seasonal.seasons.winter'), value: SeasonEnum.WINTER },
          { label: t('quests.seasonal.seasons.spring'), value: SeasonEnum.SPRING },
          { label: t('quests.seasonal.seasons.summer'), value: SeasonEnum.SUMMER },
          { label: t('quests.seasonal.seasons.autumn'), value: SeasonEnum.AUTUMN },
        ]}
        isModalVersion
        className={`px-2`}
        textColor={getSeasonStyle(selectedSeason)}
      />
    </View>
  );
};

export default ControlledSeasonPicker;
