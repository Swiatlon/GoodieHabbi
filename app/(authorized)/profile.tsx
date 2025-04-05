import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import userLogo from '@/assets/images/exampleUserIconLogin.png';
import Button from '@/components/shared/button/button';
import Loader from '@/components/shared/loader/loader';
import Badges from '@/components/views/profile/badges';
import ProgressBar from '@/components/views/profile/progress-bar';
import UpdateProfileModal from '@/components/views/profile/update-profile-modal';
import useProfileAnimations from '@/hooks/use-profile-animations';
import { useGetAccountDataQuery } from '@/redux/api/account/account-api';

const ProfileView: React.FC = () => {
  const { data, isLoading } = useGetAccountDataQuery({});
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const progressBarWidth = screenWidth * 0.8;

  const { fadeAnim, scaleAnim, slideAnim, progressAnim, startAnimations } = useProfileAnimations();

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && data) {
        startAnimations();
      }
    }, [isLoading, data, startAnimations])
  );

  if (isLoading || !data) {
    return <Loader fullscreen />;
  }

  const calculateProgress = useCallback(() => {
    return (data.xp / data.totalXP) * 100;
  }, [data.xp, data.totalXP]);

  const calculateQuestProgress = useCallback(() => {
    return (data.completedQuests / data.totalQuests) * 100;
  }, [data.completedQuests, data.totalQuests]);

  const closeUpdateModal = () => setIsUpdateModalVisible(false);

  const progressWidth = useMemo(
    () =>
      progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, (progressBarWidth * calculateProgress()) / 100],
      }) as Animated.Value,
    [progressAnim, progressBarWidth, calculateProgress]
  );

  const questProgressWidth = useMemo(
    () =>
      progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, (progressBarWidth * calculateQuestProgress()) / 100],
      }) as Animated.Value,
    [progressAnim, progressBarWidth, calculateQuestProgress]
  );

  const isLevelComplete = useMemo(() => calculateProgress() >= 100, [calculateProgress]);
  const isQuestsComplete = useMemo(() => calculateQuestProgress() >= 100, [calculateQuestProgress]);

  return (
    <>
      <View className="flex-1 py-12 px-3 bg-white rounded-lg items-center">
        <View className="flex-1 mb-12 items-center justify-center gap-12">
          <Animated.View
            className="items-center flex gap-3"
            style={{
              opacity: fadeAnim,
            }}
          >
            <Image source={userLogo} style={{ width: 80, height: 80 }} resizeMode="contain" />
            {data.nickname && <Text className="text-xl font-bold text-primary mt-2">{data.nickname}</Text>}
            {data.email && <Text className="text-gray-500">{data.email}</Text>}
            {data.bio && <Text className="text-center font-medium">{data.bio}</Text>}
            {data.joinDate && <Text className="text-center text-sm text-gray-400">Joined: {new Date(data.joinDate).toLocaleDateString()}</Text>}
          </Animated.View>

          <Animated.View
            className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg flex w-[80vw]"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-lg font-bold text-center">Statistics</Text>
            <ProgressBar
              width={progressWidth}
              label={`Level: ${data.level}`}
              value={`${data.xp} / ${data.totalXP} XP`}
              isComplete={isLevelComplete}
            />
            <ProgressBar
              width={questProgressWidth}
              label={`Quests Completed: ${data.completedQuests}`}
              value={`${data.completedQuests} / ${data.totalQuests}`}
              isComplete={isQuestsComplete}
            />
            <Badges badges={data.badges} fadeAnim={fadeAnim} scaleAnim={scaleAnim} slideAnim={slideAnim} />
          </Animated.View>
        </View>
        <View className="flex-row flex-wrap gap-4 justify-center">
          <Button
            label="Edit Profile"
            onPress={() => {
              setIsUpdateModalVisible(true);
            }}
            startIcon={<Ionicons name="create" size={20} color="white" />}
          />
          <Button label="Delete Account" styleType="danger" onPress={() => {}} startIcon={<Ionicons name="trash" size={20} color="white" />} />
        </View>
      </View>

      {isUpdateModalVisible && <UpdateProfileModal isVisible={isUpdateModalVisible} onClose={closeUpdateModal} user={data} />}
    </>
  );
};

export default ProfileView;
