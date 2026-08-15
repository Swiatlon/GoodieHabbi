export enum SupplementUnitEnum {
  Piece = 'Piece',
  Capsule = 'Capsule',
  Tablet = 'Tablet',
  Gram = 'Gram',
  Milligram = 'Milligram',
  Milliliter = 'Milliliter',
  Scoop = 'Scoop',
  Drop = 'Drop',
  InternationalUnit = 'InternationalUnit',
}

export enum SupplementTimingEnum {
  Morning = 'Morning',
  Midday = 'Midday',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night',
  PreWorkout = 'PreWorkout',
  PostWorkout = 'PostWorkout',
  WithMeal = 'WithMeal',
  Custom = 'Custom',
}

export interface ISupplementSlot {
  id: number;
  timing: SupplementTimingEnum;
  timeOfDay: string | null;
  offsetMinutes: number | null;
  amount: number;
  note: string | null;
}

export interface ISupplement {
  id: number;
  name: string;
  unit: SupplementUnitEnum;
  defaultAmount: number | null;
  note: string | null;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  slots: ISupplementSlot[];
}

export interface ICreateSupplementRequest {
  name: string;
  unit: SupplementUnitEnum;
  defaultAmount?: number | null;
  note?: string | null;
  color?: string | null;
  icon?: string | null;
}

export interface IUpdateSupplementRequest {
  name: string;
  unit: SupplementUnitEnum;
  defaultAmount?: number | null;
  note?: string | null;
  color?: string | null;
  icon?: string | null;
}

export interface ISetActiveRequest {
  isActive: boolean;
}

export interface ISupplementSlotRequest {
  timing: SupplementTimingEnum;
  amount: number;
  timeOfDay?: string | null;
  offsetMinutes?: number | null;
  note?: string | null;
}

export interface IUpsertSupplementSlotRequest {
  supplementId: number;
  slotId?: number;
  slot: ISupplementSlotRequest;
}

export interface IDeleteSupplementSlotRequest {
  supplementId: number;
  slotId: number;
}

export interface ISupplementIntake {
  id: number;
  supplementId: number;
  supplementName: string;
  unit: SupplementUnitEnum;
  scheduleSlotId: number | null;
  takenOn: string;
  takenAt: string;
  amount: number;
  workoutSessionId: number | null;
}

export interface ISupplementChecklistItem {
  supplementId: number;
  supplementName: string;
  unit: SupplementUnitEnum;
  color: string | null;
  icon: string | null;
  slotId: number;
  timing: SupplementTimingEnum;
  timeOfDay: string | null;
  offsetMinutes: number | null;
  plannedAmount: number;
  note: string | null;
  taken: boolean;
  intakeId: number | null;
  takenAt: string | null;
  takenAmount: number | null;
  workoutSessionId: number | null;
}

export interface ISupplementChecklist {
  date: string;
  items: ISupplementChecklistItem[];
  adHoc: ISupplementIntake[];
}

export interface IGetChecklistRequest {
  date: string;
  timing?: SupplementTimingEnum[];
}

export interface IGetIntakesRequest {
  from?: string;
  to?: string;
}

export interface IToggleIntakeRequest {
  supplementId: number;
  slotId: number;
  date: string;
  taken: boolean;
  amount?: number | null;
  workoutSessionId?: number | null;
}

export interface ILogAdHocIntakeRequest {
  supplementId: number;
  date: string;
  amount?: number | null;
  workoutSessionId?: number | null;
}

export interface ISupplementAdherenceItem {
  supplementId: number;
  supplementName: string;
  slotsPerDay: number;
  scheduled: number;
  taken: number;
  rate: number | null;
}

export interface ISupplementAdherenceReport {
  from: string;
  to: string;
  scheduled: number;
  taken: number;
  rate: number | null;
  items: ISupplementAdherenceItem[];
}
