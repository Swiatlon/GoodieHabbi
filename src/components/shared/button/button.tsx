import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent } from 'react-native';

type StyleType = 'primary' | 'secondary' | 'danger' | 'accent';
type Variant = 'contained' | 'outlined';

interface ButtonProps {
  label?: string;
  onPress?: (event: GestureResponderEvent) => void;
  styleType?: StyleType;
  variant?: Variant;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const baseStyles = 'rounded-full flex-row gap-2 items-center px-4 py-2';

const styleTypeColors: Record<StyleType, { contained: string; outlined: string }> = {
  primary: {
    contained: 'bg-blue-500',
    outlined: 'border border-blue-500 bg-transparent',
  },
  secondary: {
    contained: 'bg-gray-500',
    outlined: 'border border-gray-500 bg-transparent',
  },
  danger: {
    contained: 'bg-red-500',
    outlined: 'border border-red-500 bg-transparent',
  },
  accent: {
    contained: 'bg-purple-600',
    outlined: 'border border-purple-600 bg-transparent',
  },
};

const Button: React.FC<ButtonProps> = ({ label, onPress, styleType = 'primary', variant = 'contained', className = '', startIcon, endIcon }) => {
  const buttonStyles = styleTypeColors[styleType][variant];
  const textColor = variant === 'contained' ? 'text-white' : `text-${styleType}`;

  return (
    <TouchableOpacity onPress={onPress} className={`${baseStyles} ${buttonStyles} ${className}`}>
      {startIcon}
      {label && <Text className={`font-semibold  ${textColor}`}>{label}</Text>}
      {endIcon}
    </TouchableOpacity>
  );
};

export default Button;
