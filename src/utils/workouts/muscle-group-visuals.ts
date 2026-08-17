import { MuscleGroupEnum } from '@/contract/workouts/workouts.contract';

export const MUSCLE_GROUP_COLORS: Record<MuscleGroupEnum, string> = {
  [MuscleGroupEnum.Other]: '#6b7280',
  [MuscleGroupEnum.Chest]: '#EF4444',
  [MuscleGroupEnum.Back]: '#F97316',
  [MuscleGroupEnum.Shoulders]: '#F59E0B',
  [MuscleGroupEnum.Biceps]: '#EAB308',
  [MuscleGroupEnum.Triceps]: '#84CC16',
  [MuscleGroupEnum.Forearms]: '#22C55E',
  [MuscleGroupEnum.Abs]: '#10B981',
  [MuscleGroupEnum.Glutes]: '#14B8A6',
  [MuscleGroupEnum.Quadriceps]: '#06B6D4',
  [MuscleGroupEnum.Hamstrings]: '#0EA5E9',
  [MuscleGroupEnum.Calves]: '#6366F1',
  [MuscleGroupEnum.FullBody]: '#8B5CF6',
  [MuscleGroupEnum.Cardio]: '#EC4899',
};

// Emoji, not Ionicons — matches the app's existing convention for enum "flavor" (see
// quest-item-difficulty.tsx / quest-item-priority.tsx), which reads better in a gamified app
// than a generic outline glyph, especially since Ionicons has no real per-muscle iconography.
export const MUSCLE_GROUP_EMOJI: Record<MuscleGroupEnum, string> = {
  [MuscleGroupEnum.Other]: '🏋️',
  [MuscleGroupEnum.Chest]: '🎽',
  [MuscleGroupEnum.Back]: '🦍',
  [MuscleGroupEnum.Shoulders]: '🙆',
  [MuscleGroupEnum.Biceps]: '💪',
  [MuscleGroupEnum.Triceps]: '🦾',
  [MuscleGroupEnum.Forearms]: '🤜',
  [MuscleGroupEnum.Abs]: '🧱',
  [MuscleGroupEnum.Glutes]: '🍑',
  [MuscleGroupEnum.Quadriceps]: '🦵',
  [MuscleGroupEnum.Hamstrings]: '🍗',
  [MuscleGroupEnum.Calves]: '🦶',
  [MuscleGroupEnum.FullBody]: '🤸',
  [MuscleGroupEnum.Cardio]: '❤️‍🔥',
};

export const getMuscleGroupVisual = (group: MuscleGroupEnum): { emoji: string; color: string } => ({
  emoji: MUSCLE_GROUP_EMOJI[group],
  color: MUSCLE_GROUP_COLORS[group],
});
