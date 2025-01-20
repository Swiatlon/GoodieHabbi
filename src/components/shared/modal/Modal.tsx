import React from 'react';
import {
  Modal as OriginalModal,
  ModalProps as OriginalModalProps,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

interface ModalProps extends OriginalModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children, className = '', ...rest }) => {
  return (
    <OriginalModal visible={isVisible} animationType="fade" transparent {...rest}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center relative">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className={`w-11/12 bg-white rounded-lg shadow-lg ${className} max-h-[90vh]`}>
              <ScrollView contentContainerStyle={{ padding: 16 }}>{children}</ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </OriginalModal>
  );
};

export default Modal;
