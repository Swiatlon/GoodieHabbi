import React from 'react';
import { Text } from 'react-native';

interface QuestItemEmojiProps {
  emoji: string | null;
}

const QuestItemEmoji: React.FC<QuestItemEmojiProps> = ({ emoji }) => {
  if (!emoji) {
    return null;
  }

  return <Text className="mr-4 text-2xl">{emoji}</Text>;
};

export default QuestItemEmoji;
