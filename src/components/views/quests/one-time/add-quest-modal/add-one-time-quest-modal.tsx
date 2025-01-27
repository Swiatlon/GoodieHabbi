import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import Button from '@/components/shared/button/button';
import Input from '@/components/shared/input/input';
import Modal from '@/components/shared/modal/modal';
import TextArea from '@/components/shared/text-area/text-area';
import { PriorityEnum } from '@/contract/quest';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';

interface AddOneTimeQuestModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddOneTimeQuestModal: React.FC<AddOneTimeQuestModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [priority, setPriority] = useState<PriorityEnum | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { showSnackbar } = useSnackbar();

  const handleAddQuest = () => {
    showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    setIsModalVisible(false);
    setTitle('');
    setDescription('');
    setSelectedEmoji(null);
    setPriority(null);
  };

  return (
    <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
      <View className="bg-white rounded-lg px-0 gap-4">
        <Text className="text-lg font-bold text-center">Add New Quest</Text>
        <Input
          placeholder="Enter the title"
          value={title}
          onChangeText={setTitle}
          formVersion
          label="Title:"
          isRequired
        />
        <TextArea
          placeholder="Enter the description"
          value={description}
          onChangeText={setDescription}
          formVersion
          label="Description"
        />
        <DatePickerModal
          onConfirm={setStartDate}
          onClearInput={() => {
            setStartDate(null);
          }}
          selectedDate={startDate}
          label="Start Date"
          formVersion
          minDate={new Date()}
        />
        <DatePickerModal
          onConfirm={setEndDate}
          onClearInput={() => {
            setEndDate(null);
          }}
          selectedDate={endDate}
          label="End Date"
          formVersion
          minDate={startDate}
        />
        <EmojiPickerComponent
          selectedEmoji={selectedEmoji}
          onEmojiSelected={emoji => setSelectedEmoji(emoji)}
          formVersion
          label="Emoji"
        />
        <PriorityPicker priority={priority} setPriority={setPriority} />
        <View className="flex-row justify-between">
          <Button
            label="Cancel"
            onPress={() => setIsModalVisible(false)}
            className="bg-gray-200 text-gray-700 rounded-lg"
            variant="outlined"
          />
          <Button label="Add Quest" onPress={handleAddQuest} className="bg-blue-500 text-white rounded-lg" />
        </View>
      </View>
    </Modal>
  );
};

export default AddOneTimeQuestModal;
