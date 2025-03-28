import React from 'react';
import { Text } from 'react-native';

const GoalHeader = ({ title }: { title: string }) => {
  return <Text className="text-3xl font-extrabold text-primary text-center tracking-wide">{title}</Text>;
};

export default GoalHeader;
