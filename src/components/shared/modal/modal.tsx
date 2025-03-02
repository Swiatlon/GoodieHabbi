import React from 'react';
import { Modal as OriginalModal, ModalProps as OriginalModalProps, View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../icon-button/icon-button';

export interface IBaseModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ModalProps extends OriginalModalProps, IBaseModalProps {
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children, className = '', ...rest }) => {
  return (
    <OriginalModal visible={isVisible} animationType="fade" transparent {...rest}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="bg-black/50 h-full w-full flex">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className={`w-11/12 bg-white rounded-lg shadow-lg ${className} max-h-[90vh] m-auto`}>
              <View className="absolute top-5 right-2 z-40">
                <IconButton onPress={() => onClose()} icon={<Ionicons name="close-outline" size={24} color="#1987EE" />} />
              </View>
              <ScrollView contentContainerStyle={{ padding: 16, position: 'relative', display: 'flex', flexGrow: 1 }}>
                <View className="h-full">{children}</View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </OriginalModal>
  );
};

export default Modal;
