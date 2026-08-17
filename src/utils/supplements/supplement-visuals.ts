import { ISupplement, SupplementTimingEnum } from '@/contract/supplements/supplements.contract';

export const DEFAULT_SUPPLEMENT_COLOR = '#1987EE';
export const DEFAULT_SUPPLEMENT_EMOJI = '💊';

// Curated set for the icon picker in supplement-form-modal — same idea as the finance category
// icon picker, but emoji instead of Ionicons (matches the app's existing quest-flavor convention
// and what the user actually sees as "an icon" here — see quest-item-difficulty.tsx).
export const SUPPLEMENT_EMOJI_OPTIONS: string[] = ['💊', '🥗', '🧪', '💧', '🌿', '☀️', '🌙', '🏋️', '❤️', '🛡️', '🔥', '⚡'];

export const getSupplementVisual = (supplement: Pick<ISupplement, 'color' | 'icon'>): { emoji: string; color: string } => ({
  emoji: supplement.icon?.trim() || DEFAULT_SUPPLEMENT_EMOJI,
  color: supplement.color ?? DEFAULT_SUPPLEMENT_COLOR,
});

export const SUPPLEMENT_TIMING_COLORS: Record<SupplementTimingEnum, string> = {
  [SupplementTimingEnum.Morning]: '#F59E0B',
  [SupplementTimingEnum.Midday]: '#FACC15',
  [SupplementTimingEnum.Afternoon]: '#FB923C',
  [SupplementTimingEnum.Evening]: '#6366F1',
  [SupplementTimingEnum.Night]: '#4338CA',
  [SupplementTimingEnum.PreWorkout]: '#EF4444',
  [SupplementTimingEnum.PostWorkout]: '#10B981',
  [SupplementTimingEnum.WithMeal]: '#22C55E',
  [SupplementTimingEnum.Custom]: '#6b7280',
};

export const SUPPLEMENT_TIMING_EMOJI: Record<SupplementTimingEnum, string> = {
  [SupplementTimingEnum.Morning]: '🌅',
  [SupplementTimingEnum.Midday]: '☀️',
  [SupplementTimingEnum.Afternoon]: '🌤️',
  [SupplementTimingEnum.Evening]: '🌆',
  [SupplementTimingEnum.Night]: '🌙',
  [SupplementTimingEnum.PreWorkout]: '🏋️',
  [SupplementTimingEnum.PostWorkout]: '🥤',
  [SupplementTimingEnum.WithMeal]: '🍽️',
  [SupplementTimingEnum.Custom]: '⏰',
};

export const getTimingVisual = (timing: SupplementTimingEnum): { emoji: string; color: string } => ({
  emoji: SUPPLEMENT_TIMING_EMOJI[timing],
  color: SUPPLEMENT_TIMING_COLORS[timing],
});
