import React from 'react';
import { TouchableOpacity } from 'react-native';

interface ToggleTabProps {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
}

// NativeWind's `shadow-sm` utility toggled on/off via className race-conditions with
// Expo Router's navigation context when applied to a pressed element, so the shadow is
// applied via inline style instead (see https://reactnavigation.org "navigation context" + NativeWind cssInterop).
const ACTIVE_SHADOW_STYLE = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 };

const ToggleTab: React.FC<ToggleTabProps> = ({ active, onPress, children, className = 'py-2' }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 rounded-lg items-center ${className} ${active ? 'bg-white' : ''}`}
    style={active ? ACTIVE_SHADOW_STYLE : undefined}
  >
    {children}
  </TouchableOpacity>
);

export default ToggleTab;
