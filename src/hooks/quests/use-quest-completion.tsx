import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IsoDate } from '@/contract/quests/quest.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useAddQuestCompletionMutation, useRemoveQuestCompletionMutation } from '@/redux/api/quests/quests-api';
import { formatProgress } from '@/utils/quests/schedule';
import { createUuid } from '@/utils/uuid';

interface ICompleteOptions {
  /** For a measured target: litres, pages, minutes. Defaults to one repetition. */
  amount?: number;
  /** The day this counts for. Defaults to today; used by the catch-up card to backfill. */
  completedOn?: IsoDate;
}

/** The daily cap is the only 409 this endpoint raises. */
const CONFLICT_STATUS = 409;

/**
 * Recording and undoing quest completions, with the two rules that are easy to get wrong in one place:
 * a stable idempotency key per user action, and a 409 read as "already done today" rather than as a
 * failure the user caused.
 */
export const useQuestCompletion = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [addCompletion, { isLoading: isAdding }] = useAddQuestCompletionMutation();
  const [removeCompletion, { isLoading: isRemoving }] = useRemoveQuestCompletionMutation();

  /**
   * One key per *action*, not per request. A failed attempt keeps its key so that tapping again after a
   * dropped connection is recognised as the same action rather than recorded twice — which on a
   * "twice a day" habit would silently finish the day. Cleared only once the write has landed.
   */
  const pendingKeys = useRef(new Map<string, string>());

  const takeRequestKey = (questId: number, completedOn?: IsoDate): string => {
    const actionKey = `${questId}:${completedOn ?? 'today'}`;
    const existing = pendingKeys.current.get(actionKey);

    if (existing) {
      return existing;
    }

    const key = createUuid();
    pendingKeys.current.set(actionKey, key);

    return key;
  };

  const releaseRequestKey = (questId: number, completedOn?: IsoDate): void => {
    pendingKeys.current.delete(`${questId}:${completedOn ?? 'today'}`);
  };

  /**
   * Takes a quest id rather than a quest so the catch-up card, which only ever sees a summary row, can
   * use the same path as the list with its `completedOn` pointed at the missed day.
   */
  const complete = async (questId: number, options: ICompleteOptions = {}): Promise<void> => {
    const { amount, completedOn } = options;

    try {
      const response = await addCompletion({
        questId,
        amount,
        completedOn,
        clientRequestId: takeRequestKey(questId, completedOn),
      }).unwrap();

      releaseRequestKey(questId, completedOn);

      if (response.periodCompleted) {
        const earnedReward = response.xpAwarded > 0 || response.coinsAwarded > 0;

        showSnackbar({
          text: earnedReward
            ? t('quests.reusable.completion.rewardEarned', { xp: response.xpAwarded, coins: response.coinsAwarded })
            : t('quests.reusable.completion.periodCompleted'),
          variant: SnackbarVariantEnum.SUCCESS,
        });

        return;
      }

      // Short of the target: say how far along the period now is, so "+1" on a 3x habit gives feedback.
      const period = response.quest.currentPeriod;

      showSnackbar({
        text: period
          ? t('quests.reusable.completion.progressSaved', {
              progress: formatProgress(period.progress, period.target, response.quest.target.unit),
            })
          : t('quests.reusable.completion.periodCompleted'),
        variant: SnackbarVariantEnum.SUCCESS,
      });
    } catch (error) {
      const { status } = error as { status?: number };

      // Not a failure the user needs to retry — the cap is what makes "twice a week" mean anything.
      showSnackbar({
        text: status === CONFLICT_STATUS ? t('quests.reusable.completion.dailyLimitReached') : t('quests.reusable.completion.error'),
        variant: status === CONFLICT_STATUS ? SnackbarVariantEnum.INFO : SnackbarVariantEnum.ERROR,
      });
    }
  };

  /**
   * Takes back the most recent tap of the current period. The reward already granted for the period is
   * never reclaimed and never paid twice, so there is nothing to protect here.
   */
  const undo = async (questId: number, completionId: number): Promise<void> => {
    try {
      await removeCompletion({ questId, completionId }).unwrap();

      showSnackbar({ text: t('quests.reusable.completion.undone'), variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: t('quests.reusable.completion.undoError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return { complete, undo, isLoading: isAdding || isRemoving };
};
