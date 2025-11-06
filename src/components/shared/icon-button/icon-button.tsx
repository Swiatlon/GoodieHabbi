import React, { FC, ReactNode } from 'react';
import { GestureResponderEvent, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BaseProps {
  onPress: (event: GestureResponderEvent) => void;
  className?: string;
  testID?: string;
}

interface IconButtonPropsWithIcon extends BaseProps {
  iconName: 'close' | 'search-outline' | 'filter-outline';
  size?: number;
  color?: string;
  children?: never;
}

interface IconButtonPropsWithChildren extends BaseProps {
  children?: ReactNode;
  iconName?: never;
  size?: never;
  color?: never;
}

type IconButtonProps = IconButtonPropsWithIcon | IconButtonPropsWithChildren;

export const IconButton: FC<IconButtonProps> = ({ onPress, iconName, size = 24, color = '#1987EE', className = '', testID, children }) => {
  return (
    <TouchableOpacity onPress={onPress} className={`p-2 ${className}`} testID={testID}>
      {iconName ? (
        <View>
          <Ionicons name={iconName} size={size} color={color} />
        </View>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
