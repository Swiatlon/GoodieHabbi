import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import exampleUserIcon from '@/assets/images/exampleUserIcon.png';
import logoHeader from '@/assets/images/logoheader.png';

const AppBar = () => {
  const navigation = useNavigation();

  return (
    <View className="bg-primary flex flex-row justify-between items-center px-4 py-2">
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons name="menu" size={28} color="white" className="w-[50px]" />
      </TouchableOpacity>
      <Image source={logoHeader} style={{ width: 50, height: 50 }} resizeMode="contain" />
      <View>
        <Image source={exampleUserIcon} style={{ width: 50, height: 50 }} resizeMode="contain" />
      </View>
    </View>
  );
};

export default AppBar;
