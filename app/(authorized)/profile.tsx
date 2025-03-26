import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import userLogo from '@/assets/images/exampleUserIconLogin.png';
import Button from '@/components/shared/button/button';
import UpdateProfileModal from '@/components/views/profile/update-profile-modal';

const user = {
  login: 'login',
  nickname: 'Nickname',
  email: 'john.doe@example.com',
  completedQuests: 42,
  totalQuests: 100,
  level: 5,
  xp: 1200,
  totalXP: 1500,
  bio: 'Passionate about coding and gaming.',
  joinDate: '2022-03-09',
  badges: [],
};

const ProfileView: React.FC = () => {
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const calculateProgress = () => {
    return (user.xp / user.totalXP) * 100;
  };

  const calculateQuestProgress = () => {
    return (user.completedQuests / user.totalQuests) * 100;
  };

  const closeUpdateModal = () => setIsUpdateModalVisible(false);

  return (
    <>
      <View className="flex-1 py-12 px-3 bg-white rounded-lg items-center">
        <View className="flex-1 mb-12 items-center justify-center gap-12">
          <View className="items-center flex gap-2">
            <Image source={userLogo} style={{ width: 80, height: 80 }} resizeMode="contain" />
            <Text className="text-xl font-bold text-primary mt-2">{user.nickname}</Text>
            <Text className="text-gray-500">{user.email}</Text>
            <Text className="text-center font-medium">{user.bio}</Text>
            <Text className="text-center text-sm text-gray-400">Joined: {new Date(user.joinDate).toLocaleDateString()}</Text>
          </View>

          <View className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg flex w-[80vw]">
            <Text className="text-lg font-bold text-center">Statistics</Text>

            <View className="flex items-center mt-3">
              <Text className="text-primary text-lg font-semibold">Level: {user.level}</Text>
              <View className="relative w-full bg-gray-300 h-5 rounded-full mt-2">
                <View
                  className={`${calculateProgress() >= 100 ? 'bg-green-500' : 'bg-primary'} h-5 rounded-full`}
                  style={{ width: `${calculateProgress()}%` }}
                />
                <Text className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold -top-0.5">
                  {user.xp}/{user.totalXP} XP
                </Text>
              </View>
            </View>

            <View className="flex items-center mt-3">
              <Text className="text-primary text-lg font-semibold">Quests Completed: {user.completedQuests}</Text>
              <View className="relative w-full bg-gray-300 h-5 rounded-full mt-2">
                <View
                  className={`${calculateQuestProgress() >= 100 ? 'bg-yellow-500' : 'bg-primary'} h-5 rounded-full`}
                  style={{ width: `${calculateQuestProgress()}%` }}
                />
                <Text className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold -top-0.5">
                  {user.completedQuests}/{user.totalQuests}
                </Text>
              </View>
            </View>

            {user.badges.length > 0 ? (
              <ScrollView
                className="flex-row flex-nowrap gap-4 mt-6 max-h-[40px]"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View className="flex-row flex-nowrap gap-4">
                  {user.badges.map((badge, index) => (
                    <View key={index} className="bg-primary text-white p-2 px-3 rounded-full">
                      <Text className="text-white text-sm">{badge}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text className="text-center text-gray-400 mt-6">✨ No badges yet! Keep going!</Text>
            )}
          </View>
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

      {isUpdateModalVisible && <UpdateProfileModal isVisible={isUpdateModalVisible} onClose={closeUpdateModal} user={user} />}
    </>
  );
};

export default ProfileView;
