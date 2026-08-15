import { getRequiredFields, isFieldRequired } from './metric';
import { ExerciseMetricEnum } from '@/contract/workouts/workouts.contract';

describe('getRequiredFields', () => {
  it.each([
    [ExerciseMetricEnum.Reps, ['reps']],
    [ExerciseMetricEnum.RepsAndWeight, ['reps', 'weight']],
    [ExerciseMetricEnum.Time, ['durationSeconds']],
    [ExerciseMetricEnum.Distance, ['distance']],
    [ExerciseMetricEnum.DistanceAndTime, ['distance', 'durationSeconds']],
  ])('maps %s to %j', (metric, expected) => {
    expect(getRequiredFields(metric)).toEqual(expected);
  });
});

describe('isFieldRequired', () => {
  it('does not treat extra measurements as required', () => {
    expect(isFieldRequired(ExerciseMetricEnum.Reps, 'weight')).toBe(false);
    expect(isFieldRequired(ExerciseMetricEnum.Reps, 'reps')).toBe(true);
  });

  it('requires both fields for compound metrics', () => {
    expect(isFieldRequired(ExerciseMetricEnum.DistanceAndTime, 'distance')).toBe(true);
    expect(isFieldRequired(ExerciseMetricEnum.DistanceAndTime, 'durationSeconds')).toBe(true);
    expect(isFieldRequired(ExerciseMetricEnum.DistanceAndTime, 'weight')).toBe(false);
  });
});
