import React from 'react';
import { TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

export const MenuButton = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const animatedStyle = useTransformFade({ direction: 'right' });

  const handlePress = () => {
    navigation.toggleDrawer();
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={handlePress} testID="menu-button">
        <Ionicons name="menu" size={28} color="white" className="w-[50px]" />
      </TouchableOpacity>
    </Animated.View>
  );
};
