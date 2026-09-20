import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ICurrentPeriod, IQuestTarget } from '@/contract/quests/quest.contract';
import { formatAmount } from '@/utils/quests/schedule';

interface QuestItemPeriodProps {
  period: ICurrentPeriod | null;
  target: IQuestTarget;
}

/**
 * The "you are running out of runway" nudge.
 *
 * `isAtRisk` comes from the backend and is deliberately always `false` on single-day periods, where
 * "not done yet" is the normal state of every habit before the user gets to it. Deriving this on the
 * client from `remaining > 0` would flag every quest every morning and mean nothing.
 */
const QuestItemPeriod: React.FC<QuestItemPeriodProps> = ({ period, target }) => {
  const { t } = useTranslation();

  if (!period || !period.isAtRisk) {
    return null;
  }

  const remaining = target.unit ? `${formatAmount(period.remaining)} ${target.unit}` : formatAmount(period.remaining);

  return (
    <View className="flex-row items-center">
      <Text className="text-sm text-amber-600 font-bold">{t('quests.reusable.period.atRisk', { remaining, count: period.remainingDays })}</Text>
    </View>
  );
};

export default QuestItemPeriod;
