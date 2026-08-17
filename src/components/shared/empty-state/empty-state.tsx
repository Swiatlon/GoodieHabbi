import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoniconName } from '@/utils/icons/ionicon-name';

interface EmptyStateProps {
  icon: IoniconName;
  message: string;
  testID?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message, testID }) => (
  <View className="items-center py-12 px-4" testID={testID}>
    <Ionicons name={icon} size={48} color="#d1d5db" />
    <Text className="text-gray-500 text-base mt-3 text-center">{message}</Text>
  </View>
);

export default EmptyState;
