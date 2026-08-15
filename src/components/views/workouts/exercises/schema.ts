import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { EquipmentEnum, ExerciseMetricEnum, MuscleGroupEnum } from '@/contract/workouts/workouts.contract';

export const useExerciseValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    name: yup.string().trim().required(t('workouts.exercises.schema.nameRequired')).max(80, t('workouts.exercises.schema.nameMaxLength')),
    metricType: yup.mixed<ExerciseMetricEnum>().oneOf(Object.values(ExerciseMetricEnum)).required(t('workouts.exercises.schema.metricRequired')),
    muscleGroup: yup.mixed<MuscleGroupEnum>().oneOf(Object.values(MuscleGroupEnum)).nullable().default(null),
    equipment: yup.mixed<EquipmentEnum>().oneOf(Object.values(EquipmentEnum)).nullable().default(null),
    note: yup.string().nullable().default(null).max(500, t('workouts.exercises.schema.noteMaxLength')),
  });
};
