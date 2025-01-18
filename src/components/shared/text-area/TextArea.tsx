import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface TextAreaProps extends TextInputProps {
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className = '', ...props }) => {
  return (
    <TextInput className={`border border-gray-300 rounded-md p-3 h-24 text-base ${className}`} multiline {...props} />
  );
};

export default TextArea;
