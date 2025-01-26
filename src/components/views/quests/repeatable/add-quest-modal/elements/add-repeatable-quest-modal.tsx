import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DatePickerModal from '../../../reusable/add-quest-modal/date-picker-modal';
import EmojiPickerComponent from '../../../reusable/add-quest-modal/emoji-picker';
import PriorityPicker from '../../../reusable/add-quest-modal/priority-picker';
import WeeklyPicker from '../weekly-picker';
import MonthlyPicker from './monthly-picker';
import RepeatTypePicker from './repeat-type-picker';
import Button from '@/components/shared/button/button';
import Input from '@/components/shared/input/input';
import Modal from '@/components/shared/modal/modal';
import TextArea from '@/components/shared/text-area/text-area';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';

interface AddRepeatableQuestModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddRepeatableQuestModal: React.FC<AddRepeatableQuestModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [repeatType, setRepeatType] = useState<'weekly' | 'monthly' | null>('weekly');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [monthlyStart, setMonthlyStart] = useState<number | null>(null);
  const [monthlyEnd, setMonthlyEnd] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { showSnackbar } = useSnackbar();

  const handleAddQuest = () => {
    if (!title.trim() || !description.trim() || !priority || !repeatType) {
      showSnackbar({ text: 'Please fill in all required fields!', variant: SnackbarVariantEnum.INFO });
      return;
    }

    if (repeatType === 'weekly' && selectedDays.length === 0) {
      showSnackbar({
        text: 'Please select at least one day for weekly repetition!',
        variant: SnackbarVariantEnum.INFO,
      });
      return;
    }

    if (repeatType === 'monthly' && (!monthlyStart || (monthlyEnd && monthlyStart > monthlyEnd))) {
      showSnackbar({
        text: 'Please provide valid start and end days for monthly repetition!',
        variant: SnackbarVariantEnum.INFO,
      });
      return;
    }

    showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    setIsModalVisible(false);
    resetFields();
  };

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setSelectedEmoji('🌟');
    setPriority(null);
    setRepeatType(null);
    setSelectedDays([]);
    setMonthlyStart(null);
    setMonthlyEnd(null);
    setStartDate(null);
    setEndDate(null);
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
  };

  return (
    <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
      <View className="bg-white rounded-lg px-0 gap-4">
        <Text className="text-lg font-bold text-center">Add New Quest</Text>
        <Input placeholder="Enter the title*" value={title} onChangeText={setTitle} formVersion label="Title" />
        <TextArea
          placeholder="Enter the description"
          value={description}
          onChangeText={setDescription}
          formVersion
          label="Description"
        />
        <DatePickerModal
          onConfirm={setStartDate}
          selectedDate={startDate}
          label="Start Date"
          formVersion
          minDate={new Date()}
        />
        <DatePickerModal
          onConfirm={setEndDate}
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
        <RepeatTypePicker repeatType={repeatType} setRepeatType={setRepeatType} />
        {repeatType === 'weekly' && (
          <WeeklyPicker selectedDays={selectedDays} toggleDaySelection={toggleDaySelection} />
        )}
        {repeatType === 'monthly' && (
          <MonthlyPicker
            monthlyStart={monthlyStart}
            monthlyEnd={monthlyEnd}
            setMonthlyStart={setMonthlyStart}
            setMonthlyEnd={setMonthlyEnd}
          />
        )}

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

export default AddRepeatableQuestModal;
