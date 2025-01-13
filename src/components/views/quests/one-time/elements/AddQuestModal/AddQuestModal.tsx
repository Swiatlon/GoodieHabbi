import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Quest } from '@/components/views/quests/one-time/constants/QuestsConstants';

interface AddQuestModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddQuestModal: React.FC<AddQuestModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🌟');
  const [date, setDate] = useState(new Date());

  const handleAddQuest = () => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    const newQuest: Quest = {
      id: Date.now(),
      title,
      description,
      completed: false,
      emoji,
      date: date.toISOString(),
    };

    setIsModalVisible(false);
    setTitle('');
    setDescription('');
    setEmoji('🌟');
    setDate(new Date());
  };

  return (
    <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-11/12 rounded-lg p-6">
          <Text className="text-lg font-bold text-center mb-4">Add New Quest</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4"
            placeholder="Quest Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4 h-24 text-base"
            placeholder="Quest Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold">Emoji:</Text>
            <TouchableOpacity
              className="flex-row items-center bg-blue-500 px-3 py-2 rounded-md"
              onPress={() => setEmoji(emoji === '🌟' ? '🔥' : '🌟')}
            >
              <Text className="text-white text-lg mr-2">{emoji}</Text>
              <Text className="text-white font-semibold">Change</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="flex-row items-center bg-red-500 py-2 px-4 rounded-md"
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#fff" />
              <Text className="text-white font-semibold ml-2">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center bg-green-500 py-2 px-4 rounded-md"
              onPress={handleAddQuest}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text className="text-white font-semibold ml-2">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddQuestModal;
