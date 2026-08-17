import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import SupplementsNavBar from '@/components/views/supplements/reusable/supplements-nav-bar';

const SupplementsLayout = () => (
  <View className="flex-1">
    <SupplementsNavBar />
    <Slot />
  </View>
);

export default SupplementsLayout;
