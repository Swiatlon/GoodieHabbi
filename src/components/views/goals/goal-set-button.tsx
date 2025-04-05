import React from 'react';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface SetGoalButtonProps {
  onPress: () => void;
  disabled: boolean;
}

const GoalSetButton: React.FC<SetGoalButtonProps> = ({ onPress, disabled }) => {
  const buttonStyle = useTransformFade({ delay: 900 });

  return (
    <Animated.View style={buttonStyle}>
      <Button
        label="Set goal"
        startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
        className="mx-auto mt-auto px-6 py-4"
        onPress={onPress}
        disabled={disabled}
      />
    </Animated.View>
  );
};

export default GoalSetButton;
