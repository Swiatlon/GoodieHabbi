import React, { useState, FC } from 'react';
import { View, ScrollView } from 'react-native';
import Loader from '@/components/shared/loader/loader';
import ActionButtons from '@/components/views/profile/action-buttons';
import BadgesSection from '@/components/views/profile/badges-section';
import DeleteAccountModal from '@/components/views/profile/delete-profile-modal';
import GoalsSection from '@/components/views/profile/goal-section';
import LevelExperienceSection from '@/components/views/profile/level-experience-section';
import ProfileHeader from '@/components/views/profile/profile-header';
import UpdateProfileModal from '@/components/views/profile/update-profile-modal';
import { useGetAccountDataQuery } from '@/redux/api/account/account-api';

const Profile: FC = () => {
  const { data, isLoading } = useGetAccountDataQuery({});
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

  const handleUpdatePress = () => setIsUpdateModalVisible(true);
  const handleDeletePress = () => setIsDeleteModalVisible(true);

  const closeUpdateModal = () => setIsUpdateModalVisible(false);
  const closeDeleteModal = () => setIsDeleteModalVisible(false);

  if (isLoading || !data) {
    return <Loader fullscreen />;
  }

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 py-6 px-4 bg-white rounded-lg items-center">
          <ProfileHeader
            email={data.email}
            nickname={data.nickname}
            avatar={data.avatar}
            bio={data.bio}
            joinDate={data.joinDate}
            isLoading={isLoading}
          />
          <LevelExperienceSection
            level={data.level}
            userXp={data.userXp}
            nextLevelTotalXpRequired={data.nextLevelTotalXpRequired}
            isMaxLevel={data.isMaxLevel}
            completedQuests={data.completedQuests}
            totalQuests={data.totalQuests}
            isLoading={isLoading}
          />
          <GoalsSection
            completedGoals={data.completedGoals}
            totalGoals={data.totalGoals}
            expiredGoals={data.expiredGoals}
            abandonedGoals={data.abandonedGoals}
            isLoading={isLoading}
          />
          <BadgesSection badges={data.badges} isLoading={isLoading} />
        </View>
      </ScrollView>
      <ActionButtons onUpdatePress={handleUpdatePress} onDeletePress={handleDeletePress} isLoading={isLoading} />

      {isUpdateModalVisible && <UpdateProfileModal isVisible={isUpdateModalVisible} onClose={closeUpdateModal} user={data} />}
      {isDeleteModalVisible && <DeleteAccountModal isVisible={isDeleteModalVisible} onClose={closeDeleteModal} />}
    </>
  );
};

export default Profile;
