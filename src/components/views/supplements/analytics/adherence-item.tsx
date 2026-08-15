import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ISupplementAdherenceItem } from '@/contract/supplements/supplements.contract';

interface AdherenceItemProps {
  item: ISupplementAdherenceItem;
}

const AdherenceItem: React.FC<AdherenceItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const barWidth = item.rate == null ? 0 : Math.min(item.rate, 100);
  const isOverPlan = item.rate != null && item.rate > 100;

  return (
    <View className="gap-1 p-4 border-b border-gray-100" testID="adherence-item">
      <View className="flex-row justify-between">
        <Text className="text-sm font-semibold text-gray-700">{item.supplementName}</Text>
        <Text className="text-sm font-bold text-gray-800">{item.rate == null ? t('supplements.analytics.noData') : `${Math.round(item.rate)}%`}</Text>
      </View>
      <Text className="text-xs text-gray-400">
        {item.taken}/{item.scheduled} {t('supplements.analytics.doses')}
        {isOverPlan && ` · ${t('supplements.analytics.overPlan')}`}
      </Text>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View className={`h-full rounded-full ${isOverPlan ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${barWidth}%` }} />
      </View>
    </View>
  );
};

export default AdherenceItem;
