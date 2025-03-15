import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Text } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Loader from '@/components/shared/loader/loader';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledSwatches from '@/components/shared/swatches/controlled-swatches';
import { tagValidationSchema } from '@/components/views/quests/tags/tag-modals/schema';
import { IPostQuestLabelRequest } from '@/contract/quests/labels/labels-quests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateQuestLabelMutation } from '@/redux/api/quests/labels-quests-api';
import { getBestContrastTextColor } from '@/utils/utils';

interface AddTagModalProps extends IBaseModalProps {}

const AddTagModal: React.FC<AddTagModalProps> = ({ isVisible, onClose }) => {
  const { showSnackbar } = useSnackbar();
  const [createQuestLabel, { isLoading }] = useCreateQuestLabelMutation();

  const methods = useForm<IPostQuestLabelRequest>({
    resolver: yupResolver(tagValidationSchema),
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
      showSnackbar({ text: 'Tag added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: 'Failed to add tag. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      {isLoading && <Loader size="large" message="Adding quest..." fullscreen />}
      <FormProvider {...methods}>
        <View className="bg-white rounded-lg px-4 gap-8 py-2">
          <Text className="text-xl font-bold text-center">Create a New Tag:</Text>
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
          <View className="flex-row justify-between">
            <Button
              label="Cancel"
              onPress={() => {
                onClose();
                reset();
              }}
              styleType="secondary"
              variant="outlined"
            />
            <Button label="Create Tag" styleType="primary" onPress={handleSubmit(onSubmit)} disabled={!newTagValue.trim()} />
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};

export default AddTagModal;
