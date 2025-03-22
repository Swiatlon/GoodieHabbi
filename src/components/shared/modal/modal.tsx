import React from 'react';
import { Modal as OriginalModal, ModalProps as OriginalModalProps, View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../icon-button/icon-button';

export interface IBaseModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ModalProps extends OriginalModalProps, IBaseModalProps {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children, className = '', footer, ...rest }) => {
  return (
    <OriginalModal visible={isVisible} animationType="fade" transparent {...rest}>
      <View className="h-full w-full flex justify-center items-center">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="bg-black/50 absolute top-0 left-0 h-full w-full" />
        </TouchableWithoutFeedback>
        <View className={`w-11/12 bg-white rounded-lg shadow-lg max-h-[90vh] m-auto py-6 px-4 ${className}`}>
          <View className="absolute top-1 right-2 z-40">
            <IconButton onPress={() => onClose()} icon={<Ionicons name="close-outline" size={24} color="#1987EE" />} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 0, position: 'relative', display: 'flex', flexGrow: 1 }}>
            <View className="h-full">{children}</View>
          </ScrollView>
          {footer && <View className="mt-4 px-4">{footer}</View>}
        </View>
      </View>
    </OriginalModal>
  );
};

export default Modal;
