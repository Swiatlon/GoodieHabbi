import { ExerciseMetricEnum } from '@/contract/workouts/workouts.contract';

export type MetricField = 'reps' | 'weight' | 'durationSeconds' | 'distance';

const REQUIRED_FIELDS_BY_METRIC: Record<ExerciseMetricEnum, MetricField[]> = {
  [ExerciseMetricEnum.Reps]: ['reps'],
  [ExerciseMetricEnum.RepsAndWeight]: ['reps', 'weight'],
  [ExerciseMetricEnum.Time]: ['durationSeconds'],
  [ExerciseMetricEnum.Distance]: ['distance'],
  [ExerciseMetricEnum.DistanceAndTime]: ['distance', 'durationSeconds'],
};

export const getRequiredFields = (metricType: ExerciseMetricEnum): MetricField[] => REQUIRED_FIELDS_BY_METRIC[metricType];

export const isFieldRequired = (metricType: ExerciseMetricEnum, field: MetricField): boolean => getRequiredFields(metricType).includes(field);
