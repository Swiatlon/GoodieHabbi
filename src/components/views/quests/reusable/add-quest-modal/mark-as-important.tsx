import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MarkAsImportantProps {
  isImportant: boolean;
  onToggle: () => void;
}

const MarkAsImportant: React.FC<MarkAsImportantProps> = ({ isImportant, onToggle }) => {
  const containerClasses = `w-6 h-6 mr-3 flex items-center justify-center border rounded ${
    isImportant ? 'bg-yellow-500 border-yellow-500' : 'bg-white border-gray-400'
  }`;

  const iconName = isImportant ? 'star' : 'checkmark';
  const iconColor = isImportant ? 'white' : 'gray';

  const textClasses = `text-base ${isImportant ? 'text-yellow-500 font-semibold' : 'text-gray-500'}`;
  const displayText = isImportant ? 'Marked as important' : 'Mark as important';

  return (
    <View className="flex-row items-center justify-start">
      <TouchableOpacity onPress={onToggle} className={containerClasses}>
        <Ionicons name={iconName} size={16} color={iconColor} />
      </TouchableOpacity>
      <Text className={textClasses} onPress={onToggle}>
        {displayText}
      </Text>
    </View>
  );
};

export default MarkAsImportant;
