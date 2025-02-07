import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

interface BaseProps {
  onPress: (event: GestureResponderEvent) => void;
  className?: string;
}

type IconButtonProps = (BaseProps & { icon: React.ReactNode; children?: never }) | (BaseProps & { children: React.ReactNode; icon?: never });

export const IconButton: React.FC<IconButtonProps> = ({ onPress, icon, className = '', children }) => {
  return (
    <TouchableOpacity onPress={onPress} className={`p-2 ${className}`}>
      {icon}
      {children}
    </TouchableOpacity>
  );
};
