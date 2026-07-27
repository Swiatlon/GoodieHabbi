import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTagValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledSwatches from '@/components/shared/swatches/controlled-swatches';
import { IPostQuestLabelRequest } from '@/contract/quests/labels/labels-quests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateQuestLabelMutation, useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';
import { IApiError } from '@/types/global-types';
import { getBestContrastTextColor } from '@/utils/utils/utils';

interface AddTagModalProps extends IBaseModalProps {}

const AddTagModal: React.FC<AddTagModalProps> = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createQuestLabel, { isLoading }] = useCreateQuestLabelMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();
  const tagValidationSchema = useTagValidationSchema();

  const methods = useForm<IPostQuestLabelRequest>({
    resolver: yupResolver(tagValidationSchema(questLabels)),
    defaultValues: {
      value: '',
      backgroundColor: '#1987EE',
      textColor: '#fff',
    },
  });

  const { handleSubmit, reset, watch, setValue } = methods;

  const selectedBackgroundColor = watch('backgroundColor');
  const selectedTextColor = watch('textColor');
  const newTagValue = watch('value');

  const onSubmit = async (data: IPostQuestLabelRequest) => {
    try {
      await createQuestLabel(data).unwrap();
      onClose();
      reset();
      showSnackbar({ text: t('quests.tags.addModal.addedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('quests.tags.addModal.addedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('quests.tags.addModal.loadingMessage')}
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
            label={t('quests.tags.addModal.submitButton')}
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-8 py-2">
          <Text className="text-xl font-bold text-center">{t('quests.tags.addModal.heading')}</Text>
          <ControlledInput name="value" label={t('quests.tags.nameLabel')} placeholder={t('quests.tags.namePlaceholder')} isRequired />
          <ControlledSwatches
            name="backgroundColor"
            label={t('quests.tags.backgroundColorLabel')}
            onChange={color => setValue('textColor', getBestContrastTextColor(color))}
          />
          <View>
            <Text className="text-base font-semibold mb-2">{t('quests.tags.previewLabel')}</Text>
            <View
              className="py-2 px-6 rounded-full flex-row justify-center items-center overflow-hidden max-w-[200px]"
              style={{ backgroundColor: selectedBackgroundColor, alignSelf: 'flex-start' }}
            >
              <Text className="text-lg font-medium shadow-lg" numberOfLines={2} ellipsizeMode="tail" style={{ color: selectedTextColor }}>
                {newTagValue || t('quests.tags.previewFallback')}
              </Text>
            </View>
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default AddTagModal;
