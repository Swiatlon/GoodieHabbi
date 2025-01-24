import React from 'react';
import {
  Modal as OriginalModal,
  ModalProps as OriginalModalProps,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../icon-button/icon-button';

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
              <View className="absolute top-3 right-2 z-40">
                <IconButton
                  onPress={() => {
                    onClose();
                  }}
                  icon={<Ionicons name="close-outline" size={24} color="#1987EE" />}
                />
              </View>
              <ScrollView contentContainerStyle={{ padding: 16 }}>{children}</ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </OriginalModal>
  );
};

export default Modal;
