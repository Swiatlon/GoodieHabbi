import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import logoHeader from '@/assets/images/logoheader.png';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

export const LogoButton = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const animatedStyle = useTransformFade({ direction: 'right' });

  const handlePress = () => {
    navigation.navigate('(authorized)/dashboard');
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={handlePress} testID="logo-button">
        <Image source={logoHeader} className="w-[50px] h-[50px]" resizeMode="contain" />
      </TouchableOpacity>
    </Animated.View>
  );
};
