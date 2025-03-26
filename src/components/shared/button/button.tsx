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
  disabled?: boolean;
}
const styleTypeColors: Record<StyleType, { contained: string; outlined: string; text: string }> = {
  primary: {
    contained: 'bg-blue-500',
    outlined: 'border border-blue-500 bg-transparent',
    text: 'text-blue-500',
  },
  secondary: {
    contained: 'bg-gray-500',
    outlined: 'border border-gray-500 bg-transparent',
    text: 'text-gray-500',
  },
  danger: {
    contained: 'bg-red-600',
    outlined: 'border border-red-500 bg-transparent',
    text: 'text-red-500',
  },
  accent: {
    contained: 'bg-[#30D5C8]',
    outlined: 'border border-[#30D5C8] bg-transparent',
    text: 'text-[#30D5C8]',
  },
};

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  styleType = 'primary',
  variant = 'contained',
  className = '',
  startIcon,
  endIcon,
  disabled = false,
}) => {
  const buttonStyles = `${styleTypeColors[styleType][variant]} ${disabled ? 'opacity-50' : ''}`;
  const textColor = variant === 'contained' ? 'text-white' : styleTypeColors[styleType].text;

  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
      className={`rounded-3xl flex-row gap-2 items-center p-3 ${buttonStyles} ${className}`}
      disabled={disabled}
    >
      {startIcon}
      {label && <Text className={`font-semibold ${textColor}`}>{label}</Text>}
      {endIcon}
    </TouchableOpacity>
  );
};

export default Button;
