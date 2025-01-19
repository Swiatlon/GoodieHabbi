import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuestItemCheckmarkProps {
  completed: boolean;
  onToggle: () => void;
}

const QuestItemCheckmark: React.FC<QuestItemCheckmarkProps> = ({ completed, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} className="ml-4">
      <Ionicons
        name={completed ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={completed ? '#4caf50' : '#9e9e9e'}
      />
    </TouchableOpacity>
  );
};

export default QuestItemCheckmark;
