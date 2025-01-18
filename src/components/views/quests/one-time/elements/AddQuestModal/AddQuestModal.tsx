import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Modal } from 'react-native-paper';
import EmojiPickerComponent from './elements/EmojiPicker';
import MarkAsImportant from './elements/MarkAsImportant';
import Button from '@/components/shared/button/Button';
import Input from '@/components/shared/input/Input';
import TextArea from '@/components/shared/text-area/TextArea';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/SnackbarContext';

interface AddQuestModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddQuestModal: React.FC<AddQuestModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isImportant, setIsImportant] = useState(false);
  const [date, setDate] = useState(new Date());

  const { showSnackbar } = useSnackbar();

  const handleAddQuest = () => {
    if (!title.trim() || !description.trim()) {
      showSnackbar({ text: 'Please fill in all fields!', variant: SnackbarVariantEnum.INFO });
      return;
    }

    console.log({
      title,
      description,
      emoji: selectedEmoji,
      important: isImportant,
      date,
    });

    showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    setIsModalVisible(false);
    setTitle('');
    setDescription('');
    setSelectedEmoji('🌟');
    setIsImportant(false);
    setDate(new Date());
  };

  const handleToggle = () => {
    setIsImportant(!isImportant);
  };

  return (
    <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)}>
      <View className="p-6 w-11/12 mx-auto bg-white rounded-lg flex gap-6">
        <Text className="text-lg font-bold text-center">Add New Quest</Text>
        <Input placeholder="Title*" value={title} onChangeText={setTitle} />
        <TextArea placeholder="Description" value={description} onChangeText={setDescription} />
        <EmojiPickerComponent selectedEmoji={selectedEmoji} onEmojiSelected={emoji => setSelectedEmoji(emoji)} />
        <MarkAsImportant isImportant={isImportant} onToggle={handleToggle} />
        <View className="flex-row justify-between">
          <Button label="Cancel" onPress={() => setIsModalVisible(false)} className="rounded-lg" variant="outlined" />
          <Button label="Add Quest" onPress={handleAddQuest} className="rounded-lg" />
        </View>
      </View>
    </Modal>
  );
};

export default AddQuestModal;
