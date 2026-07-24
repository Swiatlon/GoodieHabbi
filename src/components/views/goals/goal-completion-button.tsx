import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';

interface CompleteGoalButtonProps {
  onPress: () => void;
  disabled: boolean;
}

const CompleteGoalButton: React.FC<CompleteGoalButtonProps> = ({ onPress, disabled }) => {
  const { t } = useTranslation();

  return (
    <Button
      label={t('goals.completionButton.label')}
      startIcon={<Ionicons name="checkmark-circle-outline" size={20} color="#fff" />}
      className="mx-auto"
      styleType="accent"
      onPress={onPress}
      disabled={disabled}
    />
  );
};

export default CompleteGoalButton;
