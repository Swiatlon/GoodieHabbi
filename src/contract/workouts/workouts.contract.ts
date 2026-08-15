export enum ExerciseMetricEnum {
  Reps = 'Reps',
  RepsAndWeight = 'RepsAndWeight',
  Time = 'Time',
  Distance = 'Distance',
  DistanceAndTime = 'DistanceAndTime',
}

export enum MuscleGroupEnum {
  Other = 'Other',
  Chest = 'Chest',
  Back = 'Back',
  Shoulders = 'Shoulders',
  Biceps = 'Biceps',
  Triceps = 'Triceps',
  Forearms = 'Forearms',
  Abs = 'Abs',
  Glutes = 'Glutes',
  Quadriceps = 'Quadriceps',
  Hamstrings = 'Hamstrings',
  Calves = 'Calves',
  FullBody = 'FullBody',
  Cardio = 'Cardio',
}

export enum EquipmentEnum {
  None = 'None',
  Barbell = 'Barbell',
  Dumbbell = 'Dumbbell',
  Kettlebell = 'Kettlebell',
  Machine = 'Machine',
  Cable = 'Cable',
  ResistanceBand = 'ResistanceBand',
  Other = 'Other',
}

export enum WorkoutSessionStatusEnum {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Abandoned = 'Abandoned',
}

export enum WorkoutSetTypeEnum {
  Normal = 'Normal',
  Warmup = 'Warmup',
  DropSet = 'DropSet',
  FailureSet = 'FailureSet',
}

export interface IExercise {
  id: number;
  name: string;
  metricType: ExerciseMetricEnum;
  muscleGroup: MuscleGroupEnum;
  equipment: EquipmentEnum;
  note: string | null;
  isSystem: boolean;
  isArchived: boolean;
}

export interface ICreateExerciseRequest {
  name: string;
  metricType: ExerciseMetricEnum;
  muscleGroup?: MuscleGroupEnum;
  equipment?: EquipmentEnum;
  note?: string | null;
}

export interface IUpdateExerciseRequest {
  name: string;
  metricType: ExerciseMetricEnum;
  muscleGroup?: MuscleGroupEnum;
  equipment?: EquipmentEnum;
  note?: string | null;
}

export interface ISetArchivedRequest {
  isArchived: boolean;
}

export interface IGetExercisesRequest {
  muscleGroup?: MuscleGroupEnum;
  metricType?: ExerciseMetricEnum;
  search?: string;
  includeArchived?: boolean;
}

export interface IWorkoutRoutineExercise {
  id: number;
  exerciseId: number;
  exerciseName: string;
  metricType: ExerciseMetricEnum;
  muscleGroup: MuscleGroupEnum;
  order: number;
  targetSets: number | null;
  targetReps: number | null;
  targetWeight: number | null;
  targetDurationSeconds: number | null;
  targetDistance: number | null;
  restSeconds: number | null;
  note: string | null;
}

export interface IWorkoutRoutine {
  id: number;
  name: string;
  description: string | null;
  isArchived: boolean;
  exercises: IWorkoutRoutineExercise[];
}

export interface IRoutineExerciseInput {
  exerciseId: number;
  targetSets?: number | null;
  targetReps?: number | null;
  targetWeight?: number | null;
  targetDurationSeconds?: number | null;
  targetDistance?: number | null;
  restSeconds?: number | null;
  note?: string | null;
}

export interface ICreateRoutineRequest {
  name: string;
  description?: string | null;
  exercises?: IRoutineExerciseInput[];
}

export interface IUpdateRoutineRequest {
  name: string;
  description?: string | null;
  exercises?: IRoutineExerciseInput[];
}

export interface IWorkoutSet {
  id: number;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  durationSeconds: number | null;
  distance: number | null;
  rpe: number | null;
  setType: WorkoutSetTypeEnum;
  completedAt: string;
  estimatedOneRepMax: number | null;
}

export interface IWorkoutSessionExercise {
  id: number;
  exerciseId: number | null;
  exerciseName: string;
  metricType: ExerciseMetricEnum;
  order: number;
  targetSets: number | null;
  targetReps: number | null;
  targetWeight: number | null;
  targetDurationSeconds: number | null;
  targetDistance: number | null;
  restSeconds: number | null;
  note: string | null;
  sets: IWorkoutSet[];
}

export interface IWorkoutSessionTotals {
  exerciseCount: number;
  setCount: number;
  totalReps: number;
  totalVolume: number;
}

export interface IWorkoutSessionSummary {
  id: number;
  routineId: number | null;
  name: string;
  performedOn: string;
  startedAt: string;
  completedAt: string | null;
  status: WorkoutSessionStatusEnum;
  note: string | null;
  durationSeconds: number | null;
  totals: IWorkoutSessionTotals;
}

export interface IWorkoutSession extends IWorkoutSessionSummary {
  exercises: IWorkoutSessionExercise[];
}

export interface IWorkoutSessionPagedResult {
  items: IWorkoutSessionSummary[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface IGetSessionsRequest {
  from?: string;
  to?: string;
  status?: WorkoutSessionStatusEnum;
  page?: number;
  pageSize?: number;
}

export interface IStartSessionRequest {
  routineId?: number | null;
  name?: string | null;
  performedOn?: string | null;
  note?: string | null;
}

export interface IUpdateSessionRequest {
  name: string;
  performedOn: string;
  note?: string | null;
}

export interface ISessionSetInput {
  reps?: number | null;
  weight?: number | null;
  durationSeconds?: number | null;
  distance?: number | null;
  rpe?: number | null;
  setType?: WorkoutSetTypeEnum;
  completedAt?: string | null;
}

export interface ISessionExerciseInput {
  exerciseId: number;
  targetSets?: number | null;
  targetReps?: number | null;
  targetWeight?: number | null;
  targetDurationSeconds?: number | null;
  targetDistance?: number | null;
  restSeconds?: number | null;
  note?: string | null;
  sets?: ISessionSetInput[];
}

export interface ILogSessionRequest {
  exercises: ISessionExerciseInput[];
}

export interface IAddSessionExerciseRequest {
  sessionId: number;
  exercise: ISessionExerciseInput;
}

export interface IDeleteSessionExerciseRequest {
  sessionId: number;
  entryId: number;
}

export interface IAddSessionSetRequest {
  sessionId: number;
  entryId: number;
  set: ISessionSetInput;
}

export interface IUpdateSessionSetRequest {
  sessionId: number;
  entryId: number;
  setId: number;
  set: ISessionSetInput;
}

export interface IDeleteSessionSetRequest {
  sessionId: number;
  entryId: number;
  setId: number;
}

export interface IMuscleGroupVolume {
  muscleGroup: MuscleGroupEnum;
  setCount: number;
  totalReps: number;
  totalVolume: number;
}

export interface IWorkoutSummary {
  from: string;
  to: string;
  sessionCount: number;
  exerciseCount: number;
  setCount: number;
  totalReps: number;
  totalVolume: number;
  totalDurationSeconds: number;
  averageDurationSeconds: number | null;
  byMuscleGroup: IMuscleGroupVolume[];
}

export interface IExerciseHistoryPoint {
  sessionId: number;
  performedOn: string;
  setCount: number;
  totalReps: number;
  totalVolume: number;
  maxWeight: number | null;
  bestEstimatedOneRepMax: number | null;
}

export interface IExerciseHistory {
  exerciseId: number;
  exerciseName: string;
  from: string;
  to: string;
  points: IExerciseHistoryPoint[];
}

export interface IPersonalRecord {
  exerciseId: number;
  exerciseName: string;
  maxWeight: number | null;
  maxReps: number | null;
  maxSetVolume: number | null;
  setCount: number;
  lastPerformedOn: string;
}

export interface IWorkoutSettings {
  weightUnit: string;
  supportedWeightUnits: string[];
}

export interface IUpdateWeightUnitRequest {
  weightUnit: string;
}
