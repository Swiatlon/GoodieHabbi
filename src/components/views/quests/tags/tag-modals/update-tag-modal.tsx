import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { tagValidationSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Loader from '@/components/shared/loader/loader';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledSwatches from '@/components/shared/swatches/controlled-swatches';
import { IPostQuestLabelRequest, IQuestLabel } from '@/contract/quests/labels/labels-quests';
import { useSnackbar, SnackbarVariantEnum } from '@/providers/snackbar/snackbar-context';
import { useGetQuestLabelsQuery, useUpdateQuestLabelMutation } from '@/redux/api/quests/labels-quests-api';
import { IApiError } from '@/types/global-types';
import { getBestContrastTextColor } from '@/utils/utils';

interface UpdateTagModalProps extends IBaseModalProps {
  tag: IQuestLabel;
}

const UpdateTagModal: React.FC<UpdateTagModalProps> = ({ isVisible, onClose, tag }) => {
  const { showSnackbar } = useSnackbar();
  const [createQuestLabel, { isLoading }] = useUpdateQuestLabelMutation();
  const { data: questLabels = [] } = useGetQuestLabelsQuery();

  const methods = useForm<IPostQuestLabelRequest>({
    resolver: yupResolver(tagValidationSchema(questLabels)),
    defaultValues: {
      value: tag.value,
      backgroundColor: tag.backgroundColor,
      textColor: tag.textColor,
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const selectedBackgroundColor = watch('backgroundColor');
  const selectedTextColor = watch('textColor');
  const newTagValue = watch('value');

  const onSubmit = async (data: IPostQuestLabelRequest) => {
    try {
      await createQuestLabel({ id: tag.id, ...data }).unwrap();
      showSnackbar({ text: 'Tag updated successfully!', variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || 'Failed to update tag. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      key={tag.id}
      footer={
        <View className="flex-row justify-between">
          <Button
            label="Cancel"
            variant="outlined"
            onPress={onClose}
            className="rounded-lg"
            startIcon={<Ionicons name="close-circle-outline" size={20} color="#1987EE" />}
          />
          <Button
            label="Update Tag"
            onPress={handleSubmit(onSubmit)}
            className="rounded-lg"
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
        </View>
      }
    >
      {isLoading && <Loader size="large" message="Adding quest..." fullscreen />}
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-8 py-2">
          <Text className="text-xl font-bold text-center">Update Tag:</Text>
          <ControlledInput name="value" label="Tag Name" placeholder="Enter tag name" isRequired />
          <ControlledSwatches
            name="backgroundColor"
            label="Pick a Background Color:"
            onChange={color => {
              setValue('textColor', getBestContrastTextColor(color));
            }}
          />

          <View>
            <Text className="text-base font-semibold mb-2">Tag Preview:</Text>
            <View
              className="py-2 px-6 rounded-full flex-row justify-center items-center overflow-hidden max-w-[200px]"
              style={{ backgroundColor: selectedBackgroundColor, alignSelf: 'flex-start' }}
            >
              <Text className="text-lg font-medium" numberOfLines={2} ellipsizeMode="tail" style={{ color: selectedTextColor }}>
                {newTagValue || 'Example Tag'}
              </Text>
            </View>
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default UpdateTagModal;
