import { Dispatch, SetStateAction, FC } from 'react';
import { View, Text, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface HeaderProps {
  unreadCount: number;
  isSearchVisible: boolean;
  searchQuery: string;
  setIsSearchVisible: Dispatch<SetStateAction<boolean>>;
  setIsFilterModalVisible?: Dispatch<SetStateAction<boolean>>;
  setIsSortModalVisible?: Dispatch<SetStateAction<boolean>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export const Header: FC<HeaderProps> = ({
  unreadCount,
  isSearchVisible,
  searchQuery,
  setIsSearchVisible,
  setIsFilterModalVisible,
  setIsSortModalVisible,
  setSearchQuery,
}) => {
  const animatedSearchStyle = useTransformFade({ direction: 'left' });
  const animatedFilterStyle = useTransformFade({ direction: 'right' });

  return (
    <>
      <View className="flex-row justify-between items-center mb-4">
        <Animated.View className="flex-row" style={animatedFilterStyle}>
          {setIsFilterModalVisible && <IconButton onPress={() => setIsFilterModalVisible(true)} iconName="filter-outline" />}
          {setIsSortModalVisible && (
            <IconButton onPress={() => setIsSortModalVisible(true)}>
              <Ionicons name="swap-vertical-outline" size={24} color="#1987EE" />
            </IconButton>
          )}
        </Animated.View>
        <View>
          <Text className="text-2xl font-bold text-primary text-center">Notifications</Text>
          <Text className="text-sm text-gray-500 text-center">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Animated.View style={animatedSearchStyle}>
          <IconButton onPress={() => setIsSearchVisible(prev => !prev)} iconName={isSearchVisible ? 'close' : 'search-outline'} />
        </Animated.View>
      </View>

      {isSearchVisible && (
        <View className="flex-row items-center w-full border border-gray-300 rounded-md mb-4 px-2">
          <TextInput className="flex-1 p-2" placeholder="Search notifications..." value={searchQuery} onChangeText={setSearchQuery} />
          <Ionicons name="search-outline" size={20} color="#9e9e9e" />
        </View>
      )}
    </>
  );
};
