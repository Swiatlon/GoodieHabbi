import React, { useState, FC } from 'react';
import { View, ScrollView } from 'react-native';
import Loader from '@/components/shared/loader/loader';
import ActionButtons from '@/components/views/profile/action-buttons';
import BadgesSection from '@/components/views/profile/badges-section';
import ClearProfileDataModal from '@/components/views/profile/clear-profile-data-modal';
import DangerActionsSection from '@/components/views/profile/delete-actions-section';
import DeleteAccountModal from '@/components/views/profile/delete-profile-modal';
import GoalsSection from '@/components/views/profile/goal-section';
import LevelExperienceSection from '@/components/views/profile/level-experience-section';
import ProfileHeader from '@/components/views/profile/profile-header';
import QuestsSection from '@/components/views/profile/quests-section';
import UpdateProfileModal from '@/components/views/profile/update-profile-modal';
import { useGetAccountDataQuery } from '@/redux/api/account/account-api';
import { useGetStatsProfileQuery } from '@/redux/api/stats/stats-api';

const Profile: FC = () => {
  const { data: profileData, isLoading: isProfileLoading } = useGetAccountDataQuery({});
  const { data: statsData, isLoading: isStatsLoading } = useGetStatsProfileQuery();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [isWipeoutDataModalVisible, setIsWipeoutDataModalVisible] = useState<boolean>(false);

  const isLoading = isProfileLoading || isStatsLoading;

  const handleUpdatePress = () => setIsUpdateModalVisible(true);
  const handleDeletePress = () => setIsDeleteModalVisible(true);
  const handleWipeoutDataPress = () => setIsWipeoutDataModalVisible(true);

  const closeUpdateModal = () => setIsUpdateModalVisible(false);
  const closeDeleteModal = () => setIsDeleteModalVisible(false);
  const closeWipeoutDataModal = () => setIsWipeoutDataModalVisible(false);

  if (isLoading || !profileData || !statsData) {
    return <Loader fullscreen />;
  }

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 py-6 px-4 bg-white rounded-lg items-center">
          <ProfileHeader
            login={profileData.login}
            email={profileData.email}
            joinDate={profileData.joinDate}
            profile={profileData.profile}
            isLoading={isLoading}
            activeCosmetics={profileData.preferences.activeCosmetics}
          />
          <LevelExperienceSection xpStats={statsData.xpStats} isLoading={isLoading} />
          <QuestsSection quests={statsData.questStats} isLoading={isLoading} />
          <GoalsSection goals={statsData.goalStats} isLoading={isLoading} />
          <BadgesSection badges={profileData.profile.badges} isLoading={isLoading} />
          <DangerActionsSection isLoading={isLoading} onDeleteAccount={handleDeletePress} onWipeoutData={handleWipeoutDataPress} />
        </View>
      </ScrollView>
      <ActionButtons onUpdatePress={handleUpdatePress} isLoading={isLoading} />

      {isUpdateModalVisible && (
        <UpdateProfileModal
          isVisible={isUpdateModalVisible}
          onClose={closeUpdateModal}
          login={profileData.login}
          email={profileData.email}
          nickname={profileData.profile.nickname}
          bio={profileData.profile.bio}
        />
      )}
      {isDeleteModalVisible && <DeleteAccountModal isVisible={isDeleteModalVisible} onClose={closeDeleteModal} />}
      {isWipeoutDataModalVisible && <ClearProfileDataModal isVisible={isWipeoutDataModalVisible} onClose={closeWipeoutDataModal} />}
    </>
  );
};

export default Profile;
