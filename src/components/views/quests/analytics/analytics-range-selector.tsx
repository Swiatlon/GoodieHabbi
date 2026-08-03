import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import { ANALYTICS_RANGE_DAYS, AnalyticsRangeDays } from '@/utils/quests/analytics';

interface AnalyticsRangeSelectorProps {
  value: AnalyticsRangeDays;
  onChange: (days: AnalyticsRangeDays) => void;
}

const AnalyticsRangeSelector: React.FC<AnalyticsRangeSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <View className="flex-row bg-gray-100 rounded-xl p-1">
      {ANALYTICS_RANGE_DAYS.map(days => (
        <ToggleTab key={days} active={value === days} onPress={() => onChange(days)}>
          <Text className={`text-xs font-bold ${value === days ? 'text-primary' : 'text-gray-500'}`}>
            {t('quests.analytics.range.days', { days })}
          </Text>
        </ToggleTab>
      ))}
    </View>
  );
};

export default AnalyticsRangeSelector;
