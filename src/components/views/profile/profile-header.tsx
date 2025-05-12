import React, { useMemo } from 'react';
import { Text, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import userLogo from '@/assets/images/exampleUserIconLogin.png';
import { IAccountDataResponse } from '@/contract/account/account';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface ProfileHeaderProps extends Pick<IAccountDataResponse, 'email' | 'nickname' | 'avatar' | 'bio' | 'joinDate'> {
  isLoading: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ email, nickname, avatar, bio, joinDate, isLoading }) => {
  const avatarSource = useMemo(() => (avatar ? { uri: avatar } : userLogo), [avatar]);
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 100 });

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 items-center flex gap-3 mb-6 bg-gray-100 rounded-lg shadow-lg w-full">
      <Image source={avatarSource} style={{ width: 65, height: 65 }} resizeMode="cover" />
      {nickname && <Text className="text-xl font-bold text-primary mt-2">{nickname}</Text>}
      <Text className="text-gray-500">{email}</Text>
      {bio && <Text className="text-center font-medium mt-2">{bio}</Text>}
      {joinDate && <Text className="text-center text-sm text-gray-400 mt-1">Member since {new Date(joinDate).toLocaleDateString()}</Text>}
    </Animated.View>
  );
};

export default ProfileHeader;
