import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UpdateTagModal from '../tag-modals/update-tag-modal';
import Button from '@/components/shared/button/button';
import { IQuestLabel } from '@/contract/quests/labels/labels-quests';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteQuestLabelMutation } from '@/redux/api/quests/labels-quests-api';

interface TagItemProps {
  tag: IQuestLabel;
}

const TagItem: React.FC<TagItemProps> = ({ tag }) => {
  const { id, value, backgroundColor, textColor } = tag;

  const { showSnackbar } = useSnackbar();
  const [deleteQuestLabel] = useDeleteQuestLabelMutation();

  const [isUpdateTagModalVisible, setIsUpdateTagModalVisible] = useState(false);

  const openUpdateModal = () => setIsUpdateTagModalVisible(true);
  const closeUpdateModal = () => setIsUpdateTagModalVisible(false);

  const handleDelete = () => {
    deleteQuestLabel({ id: id })
      .then(() => {
        showSnackbar({
          text: 'Tag deleted successfully.',
          variant: SnackbarVariantEnum.SUCCESS,
        });
      })
      .catch(() => {
        showSnackbar({
          text: 'Failed to delete tag. Please try again.',
          variant: SnackbarVariantEnum.ERROR,
        });
      });
  };

  return (
    <View className={`flex flex-row items-center justify-between py-2 border-b border-gray-300`}>
      <View
        className={`flex-row items-center justify-between my-3 py-2 mr-auto rounded-3xl pl-4 pr-6 shadow-lg max-w-[200px]`}
        style={{
          backgroundColor,
        }}
      >
        <Ionicons name="pricetag-outline" size={20} color={textColor} className="mr-4" />
        <Text className="text-lg font-medium max-w-[140px]" numberOfLines={2} ellipsizeMode="tail" style={{ color: textColor }}>
          {value}
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className="flex-row gap-2">
          <Button
            label=""
            styleType="danger"
            onPress={handleDelete}
            startIcon={<Ionicons name="trash-outline" size={18} color="white" />}
            className="shadow-lg"
          />
          <Button
            label=""
            styleType="accent"
            onPress={openUpdateModal}
            startIcon={<Ionicons name="create-outline" size={18} color="white" />}
            className="shadow-lg"
          />
        </View>
      </View>
      <UpdateTagModal isVisible={isUpdateTagModalVisible} onClose={closeUpdateModal} tag={tag} />
    </View>
  );
};

export default TagItem;
