import React from 'react';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface ActionButtonsProps {
  onUpdatePress: () => void;
  isLoading: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onUpdatePress, isLoading }) => {
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 900 });

  return (
    <Animated.View style={animationStyle} className="flex-row flex-wrap gap-4 justify-center p-6">
      <Button label="Edit Profile" onPress={onUpdatePress} startIcon={<Ionicons name="create" size={16} color="white" />} />
    </Animated.View>
  );
};

export default ActionButtons;
