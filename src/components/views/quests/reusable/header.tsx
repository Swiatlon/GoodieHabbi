import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface HeaderProps {
  title: string;
  isSearchVisible: boolean;
  searchQuery: string;
  setIsSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSortModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({
  title,
  isSearchVisible,
  searchQuery,
  setIsSearchVisible,
  setIsFilterModalVisible,
  setIsSortModalVisible,
  setSearchQuery,
}) => {
  const { t } = useTranslation();
  const animatedSearchStyle = useTransformFade({ direction: 'left' });
  const animatedFilterStyle = useTransformFade({ direction: 'right' });

  return (
    <>
      <View className="flex-row justify-between items-center mb-4">
        <Animated.View className="flex-row" style={animatedFilterStyle}>
          {setIsFilterModalVisible && (
            <IconButton onPress={() => setIsFilterModalVisible(true)}>
              <Ionicons name="filter-outline" size={24} color="#1987EE" />
            </IconButton>
          )}
          {setIsSortModalVisible && (
            <IconButton onPress={() => setIsSortModalVisible(true)}>
              <Ionicons name="swap-vertical-outline" size={24} color="#1987EE" />
            </IconButton>
          )}
        </Animated.View>
        <Text className="text-2xl font-bold text-primary text-center">{title}</Text>
        <Animated.View style={animatedSearchStyle}>
          <IconButton onPress={() => setIsSearchVisible(prev => !prev)}>
            <Ionicons name={isSearchVisible ? 'close' : 'search-outline'} size={24} color="#1987EE" />
          </IconButton>
        </Animated.View>
      </View>

      {isSearchVisible && (
        <View className="flex-row items-center w-full border border-gray-300 rounded-md mb-4 px-2">
          <TextInput
            className="flex-1 p-2"
            placeholder={t('quests.reusable.header.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={20} color="#9e9e9e" />
        </View>
      )}
    </>
  );
};

export default Header;
