import React from 'react';
import { Modal as OriginalModal, ModalProps as OriginalModalProps, View, TouchableWithoutFeedback } from 'react-native';

interface ModalProps extends OriginalModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children, className = '', ...rest }) => {
  return (
    <OriginalModal visible={isVisible} animationType="fade" transparent {...rest} className="max-h-screen">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center max-h-screen">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className={`w-4/5 bg-white rounded-lg p-6 shadow-lg ${className}`}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </OriginalModal>
  );
};

export default Modal;
