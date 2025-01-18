import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import LoginConfig from '@/components/shared/drawer/routes-configs/LoginConfig';
import QuestConfig from '@/components/shared/drawer/routes-configs/QuestConfig';
import RegisterConfig from '@/components/shared/drawer/routes-configs/RegisterConfig';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  return (
    <DrawerContentScrollView {...props}>
      <View className="px-2 py-4">
        <View className="flex items-end">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} className="p-[0.1] ml-auto">
            <Ionicons name="close" size={22} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex gap-4">
          <RegisterConfig />
          <LoginConfig />
          <QuestConfig />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};
