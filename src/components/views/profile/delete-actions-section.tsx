import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface DangerActionsSectionProps {
  isLoading: boolean;
  onDeleteAccount: () => void;
  onWipeoutData: () => void;
}

const DangerActionsSection: React.FC<DangerActionsSectionProps> = ({ isLoading, onDeleteAccount, onWipeoutData }) => {
  const { t } = useTranslation();
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 500 });

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg w-full mb-6">
      <Text className="text-lg font-bold text-center mb-4 text-red-600">{t('profile.dangerZone.title')}</Text>
      <View className="flex-row justify-evenly items-center space-x-4">
        <Button
          label={t('profile.dangerZone.deleteAccountButton')}
          styleType="danger"
          onPress={onDeleteAccount}
          startIcon={<Ionicons name="trash" size={16} color="white" />}
        />
        <Button
          label={t('profile.dangerZone.wipeoutDataButton')}
          styleType="danger"
          onPress={onWipeoutData}
          startIcon={<Ionicons name="warning" size={16} color="white" />}
        />
      </View>
    </Animated.View>
  );
};

export default DangerActionsSection;
