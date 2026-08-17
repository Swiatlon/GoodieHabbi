import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ISupplementAdherenceItem } from '@/contract/supplements/supplements.contract';
import { DEFAULT_SUPPLEMENT_COLOR, DEFAULT_SUPPLEMENT_EMOJI } from '@/utils/supplements/supplement-visuals';

interface AdherenceItemProps {
  item: ISupplementAdherenceItem;
}

const AdherenceItem: React.FC<AdherenceItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const barWidth = item.rate == null ? 0 : Math.min(item.rate, 100);
  const isOverPlan = item.rate != null && item.rate > 100;

  return (
    <View className="flex-row items-center gap-3 px-4 py-3 bg-white" testID="adherence-item">
      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${DEFAULT_SUPPLEMENT_COLOR}20` }}>
        <Text className="text-lg">{DEFAULT_SUPPLEMENT_EMOJI}</Text>
      </View>
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text className="text-sm font-semibold text-gray-700 flex-1 pr-2" numberOfLines={1}>
            {item.supplementName}
          </Text>
          <Text className="text-sm font-bold text-gray-800">
            {item.rate == null ? t('supplements.analytics.noData') : `${Math.round(item.rate)}%`}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">
          {item.taken}/{item.scheduled} {t('supplements.analytics.doses')}
          {isOverPlan && ` · ${t('supplements.analytics.overPlan')}`}
        </Text>
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View className={`h-full rounded-full ${isOverPlan ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${barWidth}%` }} />
        </View>
      </View>
    </View>
  );
};

export default AdherenceItem;
