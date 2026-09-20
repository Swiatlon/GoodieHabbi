import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IQuest } from '@/contract/quests/quest.contract';
import { useQuestCompletion } from '@/hooks/quests/use-quest-completion';
import { formatAmount, getUndoableCompletion, hasCountedTarget } from '@/utils/quests/schedule';

interface QuestItemCompletionProps {
  quest: IQuest;
}

const COMPLETED_COLOR = '#4caf50';
const IDLE_COLOR = '#9e9e9e';
const DISABLED_COLOR = '#cfd8dc';

/**
 * The one control that records and takes back progress, in two shapes.
 *
 * A plain habit keeps the familiar checkmark. A habit with a real target ("2 litres", "3 times a week")
 * gets a counter instead, because a checkbox cannot express "1 of 2" — which is the whole point of the
 * new model.
 *
 * Two states are easy to confuse and must not be:
 *  - `currentPeriod === null` means the quest is not due today. It renders as a quiet label, never as an
 *    unchecked box the user is failing to tick.
 *  - `canCompleteToday === false` means the daily cap is used up (or the one-off is finished). The plus
 *    is disabled, but undo stays live — the server resolves both, so nothing here re-implements the rule
 *    and nothing is lost when the app restarts.
 */
const QuestItemCompletion: React.FC<QuestItemCompletionProps> = ({ quest }) => {
  const { t } = useTranslation();
  const { complete, undo, isLoading } = useQuestCompletion();

  const period = quest.currentPeriod;

  /*
   * A null period now means one thing only: the quest is not due today. A one-off used to land here
   * once its date passed — the backend since made `currentPeriod` always resolve for non-recurring
   * quests, so an overdue one-off arrives with its own period and ticks like anything else.
   */
  if (!period) {
    return (
      <View className="ml-4 max-w-[96px]">
        <Text className="text-[11px] text-gray-400 text-right">{t('quests.reusable.completion.notScheduledToday')}</Text>
      </View>
    );
  }

  const undoableCompletion = getUndoableCompletion(period);
  const canUndo = undoableCompletion !== null;
  const canAdd = period.canCompleteToday && !isLoading;

  const handleComplete = () => {
    if (!canAdd) return;

    complete(quest.id);
  };

  const handleUndo = () => {
    if (!undoableCompletion || isLoading) return;

    undo(quest.id, undoableCompletion.id);
  };

  if (!hasCountedTarget(quest.target)) {
    const isDone = quest.isCompleted;

    return (
      <TouchableOpacity
        onPress={isDone ? handleUndo : handleComplete}
        disabled={isLoading || (!isDone && !canAdd)}
        className="ml-4"
        accessibilityRole="button"
        testID="quest-item-checkmark"
      >
        <Ionicons
          name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={isDone ? COMPLETED_COLOR : canAdd ? IDLE_COLOR : DISABLED_COLOR}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View className="ml-3 items-end gap-1" testID="quest-item-counter">
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={handleUndo}
          disabled={!canUndo || isLoading}
          accessibilityRole="button"
          accessibilityLabel={t('quests.reusable.completion.undone')}
          testID="quest-item-undo"
        >
          <Ionicons name="remove-circle-outline" size={24} color={canUndo ? IDLE_COLOR : DISABLED_COLOR} />
        </TouchableOpacity>

        <Text className="text-sm font-bold text-gray-700 min-w-[46px] text-center">
          {formatAmount(period.progress)} / {formatAmount(period.target)}
        </Text>

        <TouchableOpacity onPress={handleComplete} disabled={!canAdd} accessibilityRole="button" testID="quest-item-add">
          <Ionicons name="add-circle" size={26} color={canAdd ? COMPLETED_COLOR : DISABLED_COLOR} />
        </TouchableOpacity>
      </View>

      {quest.target.unit && <Text className="text-[10px] text-gray-400">{quest.target.unit}</Text>}
    </View>
  );
};

export default QuestItemCompletion;
