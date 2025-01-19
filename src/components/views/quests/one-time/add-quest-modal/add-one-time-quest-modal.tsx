import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Modal } from 'react-native-paper';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import Button from '@/components/shared/button/button';
import Input from '@/components/shared/input/input';
import TextArea from '@/components/shared/text-area/text-area';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';

interface AddOneTimeQuestModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddOneTimeQuestModal: React.FC<AddOneTimeQuestModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>('🌟');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [date, setDate] = useState(new Date());

  const { showSnackbar } = useSnackbar();

  const handleAddQuest = () => {
    if (!title.trim() || !description.trim() || !priority) {
      showSnackbar({ text: 'Please fill in all fields!', variant: SnackbarVariantEnum.INFO });
      return;
    }

    console.log({
      title,
      description,
      emoji: selectedEmoji,
      priority,
      date,
    });

    showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    setIsModalVisible(false);
    setTitle('');
    setDescription('');
    setSelectedEmoji('🌟');
    setPriority(null);
    setDate(new Date());
  };

  return (
    <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)}>
      <View className="p-6 w-11/12 mx-auto bg-white rounded-lg flex gap-6">
        <Text className="text-lg font-bold text-center">Add New Quest</Text>
        <Input placeholder="Enter the title" value={title} onChangeText={setTitle} formVersion label="Title" />
        <TextArea
          placeholder="Enter the description"
          value={description}
          onChangeText={setDescription}
          formVersion
          label="Description"
        />
        <EmojiPickerComponent
          selectedEmoji={selectedEmoji}
          onEmojiSelected={emoji => setSelectedEmoji(emoji)}
          formVersion
          label="Emoji"
        />
        <PriorityPicker priority={priority} setPriority={setPriority} />
        <View className="flex-row justify-between">
          <Button label="Cancel" onPress={() => setIsModalVisible(false)} className="rounded-lg" variant="outlined" />
          <Button label="Add Quest" onPress={handleAddQuest} className="rounded-lg" />
        </View>
      </View>
    </Modal>
  );
};

export default AddOneTimeQuestModal;
