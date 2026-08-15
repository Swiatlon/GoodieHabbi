import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSessionMetadataValidationSchema } from './session-metadata-schema';
import ControlledInput from '@/components/shared/input/controlled-input';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import WorkoutsDatePickerModal from '@/components/views/workouts/reusable/date-picker-modal';
import { IWorkoutSession } from '@/contract/workouts/workouts.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useUpdateSessionMutation } from '@/redux/api/workouts/sessions-api';
import { IApiError } from '@/types/global-types';

interface SessionMetadataFormProps {
  session: IWorkoutSession;
}

interface SessionMetadataFormValues {
  name: string;
  performedOn: string;
  note: string | null;
}

const SessionMetadataForm: React.FC<SessionMetadataFormProps> = ({ session }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [updateSession, { isLoading }] = useUpdateSessionMutation();
  const validationSchema = useSessionMetadataValidationSchema();

  const methods = useForm<SessionMetadataFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: session.name, performedOn: session.performedOn, note: session.note },
  });
  const { handleSubmit, reset: resetForm, formState } = methods;

  useEffect(() => {
    resetForm({ name: session.name, performedOn: session.performedOn, note: session.note });
  }, [session.id, session.name, session.performedOn, session.note, resetForm]);

  const onSubmit = async (values: SessionMetadataFormValues) => {
    try {
      await updateSession({
        id: session.id,
        data: { name: values.name.trim(), performedOn: values.performedOn, note: values.note?.trim() || null },
      }).unwrap();
      showSnackbar({ text: t('workouts.sessions.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.sessions.updatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <FormProvider {...methods}>
      <View className="gap-4">
        <ControlledInput name="name" label={t('workouts.sessions.nameLabel')} placeholder={t('workouts.sessions.namePlaceholder')} isRequired />
        <WorkoutsDatePickerModal
          name="performedOn"
          label={t('workouts.sessions.performedOnLabel')}
          placeholder={t('workouts.sessions.performedOnLabel')}
        />
        <ControlledTextArea name="note" label={t('workouts.sessions.noteLabel')} placeholder={t('workouts.sessions.notePlaceholder')} />

        {formState.isDirty && (
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex-row items-center justify-center gap-1 bg-primary rounded-lg py-2 self-start px-4"
            testID="btn-save-session-metadata"
          >
            <Ionicons name="checkmark-circle-outline" size={16} color="white" />
            <Text className="text-white font-semibold text-sm">{t('common.save')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </FormProvider>
  );
};

export default SessionMetadataForm;
