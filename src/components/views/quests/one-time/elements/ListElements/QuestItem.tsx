import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Quest } from '../../../constants/QuestsConstants';

interface QuestItemProps {
  quest: Quest;
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, setQuests }) => {
  const toggleComplete = (id: number): void => {
    setQuests(prev => prev.map(quest => (quest.id === id ? { ...quest, completed: !quest.completed } : quest)));
  };

  return (
    <View
      className={`flex flex-row items-center justify-between py-5 px-4 border-b border-gray-300 ${
        quest.completed ? 'bg-gray-100' : ''
      }`}
    >
      <View className="flex-1 flex-row items-center">
        {quest.emoji && <Text className="mr-4 text-2xl">{quest.emoji}</Text>}
        <View>
          <Text
            className={`text-lg ${quest.completed ? 'line-through [text-decoration-thickness:3px] text-gray-500' : ''}`}
          >
            {quest.title}
          </Text>
          <Text className="text-sm text-gray-500">{quest.description}</Text>
          <Text className="text-xs text-gray-400 mt-1">{new Date(quest.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => toggleComplete(quest.id)}>
        <Ionicons
          name={quest.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={quest.completed ? '#4caf50' : '#9e9e9e'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default QuestItem;
