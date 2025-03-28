import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../modal/modal';
import Button from '@/components/shared/button/button';

interface ConfirmModalProps {
  isVisible: boolean;
  onAccept: () => void;
  onClose: () => void;
  title?: string;
  message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onAccept,
  onClose,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
}) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="flex-1 gap-6 px-4">
        <Text className="text-lg font-bold">{title}</Text>
        <Text className="text-gray-600">{message}</Text>
        <View className="flex-row justify-between">
          <Button
            label="Cancel"
            variant="outlined"
            onPress={onClose}
            className="rounded-lg py-2.5"
            startIcon={<Ionicons name="close-circle-outline" size={16} color="#1987EE" />}
          />
          <Button
            label="Save"
            onPress={onAccept}
            className="rounded-lg py-2.5"
            startIcon={<Ionicons name="checkmark-circle-outline" size={16} color="#fff" />}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
