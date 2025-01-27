import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import DatePickerModal from '../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../reusable/add-quest-modal/priority-picker';
import SeasonPicker from '../../reusable/add-quest-modal/season-picker';
import { seasonDates } from '../constants/constants';
import Button from '@/components/shared/button/button';
import Input from '@/components/shared/input/input';
import Modal from '@/components/shared/modal/modal';
import TextArea from '@/components/shared/text-area/text-area';
import { PriorityEnum, SeasonEnum } from '@/contract/quest';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';

interface AddSeasonalQuestModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddSeasonalQuestModal: React.FC<AddSeasonalQuestModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [priority, setPriority] = useState<PriorityEnum | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [season, setSeason] = useState<SeasonEnum | null>(null);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (season) {
      const { startDate: seasonStart, endDate: seasonEnd } = seasonDates[season];

      setStartDate(new Date(seasonStart));
      setEndDate(new Date(seasonEnd));
    }
  }, [season]);

  const handleAddQuest = () => {
    showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    setIsModalVisible(false);
    setTitle('');
    setDescription('');
    setSelectedEmoji(null);
    setPriority(null);
    setStartDate(null);
    setEndDate(null);
    setSeason(null);
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
        <EmojiPickerComponent
          selectedEmoji={selectedEmoji}
          onEmojiSelected={emoji => setSelectedEmoji(emoji)}
          formVersion
          label="Emoji"
        />
        <PriorityPicker priority={priority} setPriority={setPriority} />
        <SeasonPicker season={season} setSeason={setSeason} />
        <DatePickerModal onConfirm={setStartDate} selectedDate={startDate} label="Start Date" formVersion isDisabled />
        <DatePickerModal onConfirm={setEndDate} selectedDate={endDate} label="End Date" formVersion isDisabled />
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

export default AddSeasonalQuestModal;
