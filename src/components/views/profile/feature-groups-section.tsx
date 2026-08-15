import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { FeatureGroupId, useFeatureGroups } from '@/providers/feature-groups-context';

interface FeatureGroupsSectionProps {
  isLoading: boolean;
}

const GROUP_IDS: FeatureGroupId[] = ['finance', 'tasks', 'workouts'];

const FeatureGroupsSection: React.FC<FeatureGroupsSectionProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  const { isGroupEnabled, setGroupEnabled } = useFeatureGroups();
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 500 });

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg w-full mb-6">
      <Text className="text-lg font-bold text-center mb-1 text-gray-800">{t('profile.featureGroups.title')}</Text>
      <Text className="text-xs text-gray-500 text-center mb-4">{t('profile.featureGroups.hint')}</Text>

      <View className="gap-3">
        {GROUP_IDS.map(group => {
          const enabled = isGroupEnabled(group);

          return (
            <TouchableOpacity
              key={group}
              onPress={() => setGroupEnabled(group, !enabled)}
              className="flex-row items-center justify-between px-3 py-3 bg-white rounded-xl"
              testID={`btn-toggle-feature-group-${group}`}
            >
              <View className="flex-1 pr-3">
                <Text className="text-sm font-semibold text-gray-700">{t(`profile.featureGroups.groups.${group}.label`)}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">{t(`profile.featureGroups.groups.${group}.hint`)}</Text>
              </View>
              <Ionicons name={enabled ? 'toggle' : 'toggle-outline'} size={32} color={enabled ? '#10B981' : '#9ca3af'} />
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default FeatureGroupsSection;
