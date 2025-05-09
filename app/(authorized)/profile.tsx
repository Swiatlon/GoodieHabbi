import { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import userLogo from '@/assets/images/exampleUserIconLogin.png';
import Button from '@/components/shared/button/button';
import Loader from '@/components/shared/loader/loader';
import DeleteAccountModal from '@/components/views/profile/delete-profile-modal';
import UpdateProfileModal from '@/components/views/profile/update-profile-modal';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useGetAccountDataQuery } from '@/redux/api/account/account-api';

const ProfileView: React.FC = () => {
  const { data, isLoading } = useGetAccountDataQuery({});
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const profileStyle = useTransformFade({ isContentLoading: isLoading, delay: 100 });
  const statsStyle = useTransformFade({ isContentLoading: isLoading, delay: 500 });
  const buttonsStyle = useTransformFade({ isContentLoading: isLoading, delay: 900 });

  if (isLoading || !data) {
    return <Loader fullscreen />;
  }

  const calculateProgress = () => (data.userXp / data.nextLevelTotalXpRequired) * 100;
  const calculateQuestProgress = () => {
    const percentage = (data.completedQuests / data.totalQuests) * 100;

    if (percentage >= 100) {
      return 100;
    }

    return percentage;
  };

  const closeUpdateModal = () => setIsUpdateModalVisible(false);
  const closeDeleteModal = () => setIsDeleteModalVisible(false);

  return (
    <>
      <View className="flex-1 py-12 px-3 bg-white rounded-lg items-center">
        <View className="flex-1 mb-12 items-center justify-center gap-12">
          <Animated.View style={profileStyle} className="items-center flex gap-3">
            <Image source={userLogo} style={{ width: 80, height: 80 }} resizeMode="contain" />
            {data.nickname && <Text className="text-xl font-bold text-primary mt-2">{data.nickname}</Text>}
            {data.email && <Text className="text-gray-500">{data.email}</Text>}
            {data.bio && <Text className="text-center font-medium">{data.bio}</Text>}
            {data.joinDate && <Text className="text-center text-sm text-gray-400">Joined: {new Date(data.joinDate).toLocaleDateString()}</Text>}
          </Animated.View>

          <Animated.View style={statsStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg flex w-[80vw]">
            <Text className="text-lg font-bold text-center">Statistics</Text>

            <View className="flex items-center mt-3">
              <Text className="text-primary text-lg font-semibold">Level: {data.level}</Text>
              <View className="relative w-full bg-gray-300 h-5 rounded-full mt-2">
                <View
                  className={`${calculateProgress() >= 100 ? 'bg-green-500' : 'bg-primary'} h-5 rounded-full`}
                  style={{ width: `${calculateProgress()}%` }}
                />
                <Text className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold -top-0.5">
                  {data.userXp} / {data.nextLevelTotalXpRequired} XP
                </Text>
              </View>
            </View>

            <View className="flex items-center mt-3">
              <Text className="text-primary text-lg font-semibold">Quests Completed: {data.completedQuests}</Text>
              <View className="relative w-full bg-gray-300 h-5 rounded-full mt-2">
                <View
                  className={`${calculateQuestProgress() >= 100 ? 'bg-yellow-500' : 'bg-primary'} h-5 rounded-full`}
                  style={{ width: `${calculateQuestProgress()}%` }}
                />
                <Text className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold -top-0.5">
                  {data.completedQuests} / {data.totalQuests}
                </Text>
              </View>
            </View>

            {data.badges.length > 0 ? (
              <ScrollView
                className="flex-row flex-nowrap gap-4 mt-6 max-h-[40px]"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View className="flex-row flex-nowrap gap-4">
                  {data.badges.map((badge, index) => (
                    <View key={index} className="bg-primary text-white p-2 px-3 rounded-full">
                      <Text className="text-white text-sm">{badge.text}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text className="text-center text-gray-400 mt-6">✨ No badges yet! Keep going!</Text>
            )}
          </Animated.View>
        </View>

        <Animated.View style={buttonsStyle} className="flex-row flex-wrap gap-4 justify-center">
          <Button
            label="Edit Profile"
            onPress={() => {
              setIsUpdateModalVisible(true);
            }}
            startIcon={<Ionicons name="create" size={20} color="white" />}
          />
          <Button
            label="Delete Account"
            styleType="danger"
            onPress={() => {
              setIsDeleteModalVisible(true);
            }}
            startIcon={<Ionicons name="trash" size={20} color="white" />}
          />
        </Animated.View>
      </View>

      {isUpdateModalVisible && <UpdateProfileModal isVisible={isUpdateModalVisible} onClose={closeUpdateModal} user={data} />}
      {isDeleteModalVisible && <DeleteAccountModal isVisible={isDeleteModalVisible} onClose={closeDeleteModal} />}
    </>
  );
};

export default ProfileView;
