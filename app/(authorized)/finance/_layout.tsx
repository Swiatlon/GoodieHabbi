import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import FinanceNavBar from '@/components/views/finance/shared/finance-nav-bar';
import FinanceMonthProvider from '@/providers/finance/finance-month-provider';

const FinanceLayout = () => (
  <FinanceMonthProvider>
    <View className="flex-1">
      <FinanceNavBar />
      <Slot />
    </View>
  </FinanceMonthProvider>
);

export default FinanceLayout;
