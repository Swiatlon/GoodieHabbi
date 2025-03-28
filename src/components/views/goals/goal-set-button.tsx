import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';

interface SetGoalButtonProps {
  onPress: () => void;
  disabled: boolean;
}

const GoalSetButton: React.FC<SetGoalButtonProps> = ({ onPress, disabled }) => {
  return (
    <Button
      label="Set goal"
      startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
      className="mx-auto mt-auto px-6 py-4"
      onPress={onPress}
      disabled={disabled}
    />
  );
};

export default GoalSetButton;
