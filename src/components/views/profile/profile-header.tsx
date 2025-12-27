import React, { useMemo } from 'react';
import { Text, Image } from 'react-native';
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

  // TODO: Render cosmetics (avatarFrameUrl, pet, title, nameEffect) here

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 items-center flex gap-3 mb-6 bg-gray-100 rounded-lg shadow-lg w-full">
      {/* Avatar frame (if present) */}
      {activeCosmetics?.avatarFrameUrl && (
        <Image
          source={{ uri: activeCosmetics.avatarFrameUrl }}
          style={{ position: 'absolute', width: 75, height: 75, zIndex: 2 }}
          resizeMode="cover"
        />
      )}
      {/* Avatar */}
      <Image source={avatarSource} style={{ width: 65, height: 65, borderRadius: 32.5, zIndex: 1 }} resizeMode="cover" />
      {/* Pet (if present) */}
      {activeCosmetics?.pet?.petUrl && (
        <Image source={{ uri: activeCosmetics.pet.petUrl }} style={{ width: 40, height: 40, marginTop: 8 }} resizeMode="contain" />
      )}
      {/* Title (if present) */}
      {activeCosmetics?.title && (
        <Text className="text-base font-bold text-yellow-700 bg-yellow-100 rounded px-2 py-1 mt-2">{activeCosmetics.title}</Text>
      )}
      {/* Nickname with name effect (if present) */}
      {nickname && (
        <Text
          className="text-xl font-bold mt-2"
          style={activeCosmetics?.nameEffect?.colorHex ? { color: activeCosmetics.nameEffect.colorHex } : undefined}
        >
          {nickname}
        </Text>
      )}
      <Text className="text-gray-500">{email}</Text>
      {bio && <Text className="text-center font-medium mt-2">{bio}</Text>}
      {joinDate && <Text className="text-center text-sm text-gray-400 mt-1">Member since {new Date(joinDate).toLocaleDateString()}</Text>}
    </Animated.View>
  );
};

export default ProfileHeader;
