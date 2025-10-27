import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Modal from '@/components/shared/modal/modal';
import { IAccountDataResponse, IBadge } from '@/contract/account/account';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface BadgesSectionProps {
  isLoading: boolean;
  badges: IAccountDataResponse['profile']['badges'];
}

const BadgesSection: React.FC<BadgesSectionProps> = ({ badges, isLoading }) => {
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 700 });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<IAccountDataResponse['profile']['badges'][number] | null>(null);

  const handleBadgePress = (badge: IBadge) => {
    setSelectedBadge(badge);
    setIsVisible(true);
  };

  return (
    <>
      <Animated.View style={animationStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg flex w-full mb-6">
        <Text className="text-lg font-bold text-center mb-2">Achievements & Badges</Text>
        {badges.length > 0 ? (
          <ScrollView horizontal className="flex-row flex-nowrap mt-2" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <View className="flex-row flex-nowrap gap-3 py-2">
              {badges.map((badge, index) => (
                <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => handleBadgePress(badge)}>
                  <View className="px-4 py-2 rounded-full items-center" style={{ backgroundColor: badge.colorHex || '#3B82F6' }}>
                    <Text className="text-white font-bold">{badge.text}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className="py-4 items-center">
            <Ionicons name="trophy-outline" size={32} color="#CBD5E0" />
            <Text className="text-center text-gray-400 mt-2">✨ No badges yet! Keep going!</Text>
          </View>
        )}
      </Animated.View>

      <Modal isVisible={isVisible} onClose={() => setIsVisible(false)}>
        {selectedBadge && (
          <View className="p-4">
            <Text className="text-xl font-bold mb-2 text-center">{selectedBadge.text}</Text>
            <Text className="text-gray-600 text-center">{selectedBadge.description}</Text>
          </View>
        )}
      </Modal>
    </>
  );
};

export default BadgesSection;
