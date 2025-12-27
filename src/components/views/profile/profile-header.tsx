import React, { useMemo } from 'react';
import { Text, Image, View } from 'react-native';
import Animated from 'react-native-reanimated';
import userLogo from '@/assets/images/exampleUserIconLogin.png';
import { IUserProfile, IUserActiveCosmetics } from '@/contract/account/account';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface ProfileHeaderProps {
  login: string;
  email: string;
  joinDate: string;
  profile: IUserProfile;
  isLoading: boolean;
  activeCosmetics?: IUserActiveCosmetics | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ email, joinDate, profile, isLoading, activeCosmetics }) => {
  const { nickname, avatar, bio } = profile;
  const avatarSource = useMemo(() => (avatar ? { uri: avatar } : userLogo), [avatar]);
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 100 });

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 items-center w-full bg-gray-100 rounded-lg shadow-lg mb-6">
      <View className="relative items-center justify-center mb-3">
        {activeCosmetics?.avatarFrameUrl && (
          <Image
            source={{ uri: activeCosmetics.avatarFrameUrl }}
            style={{
              position: 'absolute',
              width: 120,
              height: 120,
              zIndex: 2,
            }}
            resizeMode="cover"
          />
        )}

        <Image
          source={avatarSource}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            zIndex: 1,
          }}
          resizeMode="cover"
        />

        {activeCosmetics?.pet?.petUrl && (
          <Image
            source={{ uri: activeCosmetics.pet.petUrl }}
            style={{
              position: 'absolute',
              width: 64,
              height: 64,
              bottom: -24,
              right: -24,
              zIndex: 3,
            }}
            resizeMode="contain"
          />
        )}
      </View>

      {activeCosmetics?.title && (
        <View className="bg-yellow-100 rounded px-3 py-1 mb-2">
          <Text className="text-sm font-semibold text-yellow-700">⭐ {activeCosmetics.title} ⭐</Text>
        </View>
      )}

      {nickname && (
        <Text
          className="text-xl font-bold mb-1"
          style={activeCosmetics?.nameEffect?.colorHex ? { color: activeCosmetics.nameEffect.colorHex } : { color: '#ff6b35' }}
        >
          {nickname}
        </Text>
      )}

      <Text className="text-gray-500 text-sm mb-2">{email}</Text>

      {bio && <Text className="text-center text-gray-700 text-sm mb-2 px-4">{bio}</Text>}

      {joinDate && (
        <View className="flex-row items-center">
          <Text className="text-gray-400 text-xs">
            🎁 Member since{' '}
            {new Date(joinDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default ProfileHeader;
