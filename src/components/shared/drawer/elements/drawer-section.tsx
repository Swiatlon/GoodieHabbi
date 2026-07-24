import React from 'react';
import { View, Text } from 'react-native';

interface DrawerSectionProps {
  title: string;
  children: React.ReactNode;
}

const DrawerSection: React.FC<DrawerSectionProps> = ({ title, children }) => (
  <View className="gap-4">
    <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{title}</Text>
    {children}
  </View>
);

export default DrawerSection;
