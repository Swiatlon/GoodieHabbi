import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import logoHeader from '@/assets/images/logoheader.png';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

export const LogoButton = () => {
  const router = useRouter();
  const animatedStyle = useTransformFade({ direction: 'right' });

  const handlePress = () => {
    router.navigate('/(authorized)/dashboard');
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={handlePress} testID="logo-button">
        <Image source={logoHeader} className="w-[50px] h-[50px]" resizeMode="contain" />
      </TouchableOpacity>
    </Animated.View>
  );
};
