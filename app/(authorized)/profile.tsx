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

  const {
    email,
    profile: { nickname, avatar, bio, joinDate, questsStats, goalsStats, xpProgress, badges },
  } = data;

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 py-6 px-4 bg-white rounded-lg items-center">
          <ProfileHeader email={email} nickname={nickname} avatar={avatar} bio={bio} joinDate={joinDate} isLoading={isLoading} />
          <LevelExperienceSection
            level={xpProgress.level}
            userXp={xpProgress.currentXp}
            nextLevelTotalXpRequired={xpProgress.nextLevelXpRequirement}
            isMaxLevel={xpProgress.isMaxLevel}
            completedQuests={questsStats.completedExistingQuests}
            totalQuests={questsStats.existingQuests}
            isLoading={isLoading}
          />
          <GoalsSection
            completed={goalsStats.completed}
            totalCreated={goalsStats.totalCreated}
            expired={goalsStats.expired}
            active={goalsStats.active}
            isLoading={isLoading}
          />
          <BadgesSection badges={badges} isLoading={isLoading} />
        </View>
      </ScrollView>

      <ActionButtons onUpdatePress={handleUpdatePress} onDeletePress={handleDeletePress} isLoading={isLoading} />

      {isUpdateModalVisible && <UpdateProfileModal isVisible={isUpdateModalVisible} onClose={closeUpdateModal} user={data} />}
      {isDeleteModalVisible && <DeleteAccountModal isVisible={isDeleteModalVisible} onClose={closeDeleteModal} />}
    </>
  );
};

export default Profile;
