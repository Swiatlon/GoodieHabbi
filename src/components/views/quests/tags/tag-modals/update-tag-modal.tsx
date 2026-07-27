import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTagValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledSwatches from '@/components/shared/swatches/controlled-swatches';
import { IPostQuestLabelRequest, IQuestLabel } from '@/contract/quests/labels/labels-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery, useUpdateQuestLabelMutation } from '@/redux/api/quests/labels-quests-api';
import { IApiError } from '@/types/global-types';
import { getBestContrastTextColor } from '@/utils/utils/utils';

interface UpdateTagModalProps extends IBaseModalProps {
  tag: IQuestLabel;
}

const UpdateTagModal: React.FC<UpdateTagModalProps> = ({ isVisible, onClose, tag }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createQuestLabel, { isLoading }] = useUpdateQuestLabelMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const tagValidationSchema = useTagValidationSchema();

  const methods = useForm<IPostQuestLabelRequest>({
    resolver: yupResolver(tagValidationSchema(questLabels, tag.value)),
    defaultValues: {
      value: tag.value,
      backgroundColor: tag.backgroundColor,
    },
  });

  const { handleSubmit, watch } = methods;
  const selectedBackgroundColor = watch('backgroundColor');
  const newTagValue = watch('value');

  const onSubmit = async (data: IPostQuestLabelRequest) => {
    try {
      await createQuestLabel({ id: tag.id, ...data }).unwrap();
      showSnackbar({ text: t('quests.tags.updateModal.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('quests.tags.updateModal.updatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      key={tag.id}
      isLoading={isLoading}
      loadingMessage={t('quests.tags.updateModal.loadingMessage')}
      footer={
        <View className="flex-row justify-between">
          <Button
            label={t('quests.tags.cancelButton')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label={t('quests.tags.updateModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-8 py-2">
          <Text className="text-xl font-bold text-center">{t('quests.tags.updateModal.heading')}</Text>
          <ControlledInput name="value" label={t('quests.tags.nameLabel')} placeholder={t('quests.tags.namePlaceholder')} isRequired />
          <ControlledSwatches name="backgroundColor" label={t('quests.tags.backgroundColorLabel')} />

          <View>
            <Text className="text-base font-semibold mb-2">{t('quests.tags.previewLabel')}</Text>
            <View
              className="py-2 px-6 rounded-full flex-row justify-center items-center overflow-hidden max-w-[200px]"
              style={{ backgroundColor: selectedBackgroundColor, alignSelf: 'flex-start' }}
            >
              <Text
                className="text-lg font-medium"
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{ color: getBestContrastTextColor(selectedBackgroundColor) }}
              >
                {newTagValue || t('quests.tags.previewFallback')}
              </Text>
            </View>
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateTagModal;
