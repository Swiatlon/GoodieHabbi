import React from 'react';
import { View } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import FinanceNavBar from '@/components/views/finance/shared/finance-nav-bar';
import FinanceMonthProvider from '@/providers/finance/finance-month-provider';

// Category management is a settings screen reached from the Dashboard header, not a 4th tab — the
// Dashboard/History/Statistics switcher doesn't belong on top of it.
const HIDDEN_NAV_BAR_PATHS = ['/finance/categories'];

const FinanceLayout = () => {
  const pathname = usePathname();
  const showNavBar = !HIDDEN_NAV_BAR_PATHS.includes(pathname);

  return (
    <FinanceMonthProvider>
      <View className="flex-1">
        {showNavBar && <FinanceNavBar />}
        <Slot />
      </View>
    </FinanceMonthProvider>
  );
};

export default FinanceLayout;
