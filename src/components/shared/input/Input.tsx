import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return <TextInput className={`border border-gray-300 rounded-md p-3 ${className}`} {...props} />;
};

export default Input;
