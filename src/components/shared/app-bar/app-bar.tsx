import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import exampleUserIcon from '@/assets/images/exampleUserIcon.png';
import logoHeader from '@/assets/images/logoheader.png';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

const AppBar: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const { isCorrect: isAuthenticated } = useIsCorrectAccessToken();

  const handleProfileClick = () => {
    navigation.navigate('(authorized)/profile');
  };

  return (
    <View className="bg-primary flex flex-row justify-between items-center px-4 py-2">
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons name="menu" size={28} color="white" className="w-[50px]" />
      </TouchableOpacity>
      <Image source={logoHeader} style={{ width: 50, height: 50 }} resizeMode="contain" />
      <View>
        {isAuthenticated ? (
          <TouchableOpacity onPress={handleProfileClick}>
            <Image source={exampleUserIcon} style={{ width: 50, height: 50 }} resizeMode="contain" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default AppBar;
