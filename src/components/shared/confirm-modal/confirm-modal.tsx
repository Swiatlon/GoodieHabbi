import React from 'react';
import { useTranslation } from 'react-i18next';
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

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isVisible, onAccept, onClose, title, message }) => {
  const { t } = useTranslation();
  const modalTitle = title ?? t('shared.confirmModal.title');
  const modalMessage = message ?? t('shared.confirmModal.message');

  return (
    <Modal isVisible={isVisible} onClose={onClose} testID="confirm-modal">
      <View className="flex-1 gap-6 px-4" testID="confirm-modal-content">
        <Text className="text-lg font-bold" testID="confirm-modal-title">
          {modalTitle}
        </Text>
        <Text className="text-gray-600" testID="confirm-modal-message">
          {modalMessage}
        </Text>
        <View className="flex-row justify-between" testID="confirm-modal-buttons">
          <Button
            label={t('common.cancel')}
            variant="outlined"
            onPress={onClose}
            className="rounded-lg py-2.5"
            startIcon={<Ionicons name="close-circle-outline" size={16} color="#1987EE" />}
            testID="confirm-modal-cancel-button"
          />
          <Button
            label={t('common.save')}
            onPress={onAccept}
            className="rounded-lg py-2.5"
            startIcon={<Ionicons name="checkmark-circle-outline" size={16} color="#fff" />}
            testID="confirm-modal-accept-button"
          />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
