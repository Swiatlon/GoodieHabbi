import React from 'react';
import { View } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import WorkoutsNavBar from '@/components/views/workouts/reusable/workouts-nav-bar';

// Only the 4 tab-bar destinations show the nav bar — settings, the active session, a session
// detail, and an exercise's analytics detail are all "drilled into" screens, not lateral tabs.
const NAV_BAR_PATHS = ['/workouts/exercises', '/workouts/routines', '/workouts/sessions', '/workouts/analytics'];

const WorkoutsLayout = () => {
  const pathname = usePathname();
  const showNavBar = NAV_BAR_PATHS.includes(pathname);

  return (
    <View className="flex-1">
      {showNavBar && <WorkoutsNavBar />}
      <Slot />
    </View>
  );
};

export default WorkoutsLayout;
