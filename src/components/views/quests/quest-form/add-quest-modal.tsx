import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { DEFAULT_QUEST_FORM_VALUES, formValuesToRequest, IQuestFormValues } from './form-values';
import QuestFormFields from './quest-form-fields';
import { useQuestFormSchema } from './schema';
import Button from '@/components/shared/button/button';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateQuestMutation } from '@/redux/api/quests/quests-api';

interface AddQuestModalProps extends IBaseModalProps {}

/** One modal for every quest — the schedule goes in the body, so there is nothing left to branch on. */
const AddQuestModal: React.FC<AddQuestModalProps> = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createQuest, { isLoading }] = useCreateQuestMutation();
  const questFormSchema = useQuestFormSchema();

  const methods = useForm<IQuestFormValues>({
    resolver: yupResolver(questFormSchema) as never,
    defaultValues: DEFAULT_QUEST_FORM_VALUES,
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: IQuestFormValues) => {
    try {
      await createQuest(formValuesToRequest(values)).unwrap();
      onClose();
      reset(DEFAULT_QUEST_FORM_VALUES);
      showSnackbar({ text: t('quests.questForm.addedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: t('quests.questForm.addedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('quests.questForm.loadingMessage')}
      testID="add-quest-modal"
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
            label={t('quests.questForm.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            testID="btn-add-quest"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <Text className="text-lg font-bold text-center mb-4">{t('quests.questForm.addHeading')}</Text>
        <QuestFormFields />
      </FormProvider>
    </Modal>
  );
};

export default AddQuestModal;
