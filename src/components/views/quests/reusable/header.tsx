import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/icon-button';

interface HeaderProps {
  title: string;
  isSearchVisible: boolean;
  searchQuery: string;
  setIsSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConfigModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ title, isSearchVisible, searchQuery, setIsSearchVisible, setIsConfigModalVisible, setSearchQuery }) => (
  <>
    <View className="flex-row justify-between items-center mb-4">
      <IconButton onPress={() => setIsConfigModalVisible(true)} icon={<Ionicons name="settings-outline" size={24} color="#1987EE" />} />
      <Text className="text-2xl font-bold text-primary text-center">{title}</Text>
      <IconButton
        onPress={() => setIsSearchVisible(prev => !prev)}
        icon={<Ionicons name={isSearchVisible ? 'close' : 'search-outline'} size={24} color="#1987EE" />}
      />
    </View>

    {isSearchVisible && (
      <View className="flex-row items-center w-full border border-gray-300 rounded-md mb-4 px-2">
        <TextInput className="flex-1 p-2" placeholder="Search..." value={searchQuery} onChangeText={setSearchQuery} />
        <Ionicons name="search-outline" size={20} color="#9e9e9e" />
      </View>
    )}
  </>
);

export default Header;
