import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { formValuesToRequest, IQuestFormValues, questToFormValues } from './form-values';
import QuestFormFields from './quest-form-fields';
import { useQuestFormSchema } from './schema';
import Button from '@/components/shared/button/button';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import { IQuest } from '@/contract/quests/quest.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useUpdateQuestMutation } from '@/redux/api/quests/quests-api';

interface UpdateQuestModalProps extends IBaseModalProps {
  quest: IQuest;
}

const UpdateQuestModal: React.FC<UpdateQuestModalProps> = ({ isVisible, onClose, quest }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [updateQuest, { isLoading }] = useUpdateQuestMutation();
  const questFormSchema = useQuestFormSchema();

  const methods = useForm<IQuestFormValues>({
    resolver: yupResolver(questFormSchema) as never,
    defaultValues: questToFormValues(quest),
    // The start date may legitimately sit in the past on an existing quest; the base rule only applies
    // to the value the user newly picks, which the schema resolves through this context.
    context: { initialStartDate: quest.startDate },
  });

  const { handleSubmit, reset } = methods;

  // The list can hand over a fresher copy while the modal is mounted — after a completion, say.
  useEffect(() => {
    reset(questToFormValues(quest));
  }, [quest, reset]);

  const onSubmit = async (values: IQuestFormValues) => {
    try {
      await updateQuest({ id: quest.id, ...formValuesToRequest(values) }).unwrap();
      onClose();
      showSnackbar({ text: t('quests.questForm.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: t('quests.questForm.updatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('quests.questForm.loadingMessage')}
      testID="update-quest-modal"
      footer={
        <View className="flex-row justify-between">
          <Button
            label={t('quests.reusable.form.cancelButton')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            testID="btn-cancel"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label={t('quests.questForm.updateButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            testID="btn-update-quest"
            startIcon={<Ionicons name="save-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <Text className="text-lg font-bold text-center">{t('quests.questForm.updateHeading')}</Text>
        <Text className="text-[11px] text-gray-400 text-center mb-4 px-4">{t('quests.questForm.updateScheduleNote')}</Text>
        <QuestFormFields />
      </FormProvider>
    </Modal>
  );
};

export default UpdateQuestModal;
