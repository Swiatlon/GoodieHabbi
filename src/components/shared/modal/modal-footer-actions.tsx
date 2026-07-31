import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoniconName } from '@/utils/icons/ionicon-name';

interface ModalFooterActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmIcon: IoniconName;
  confirmDisabled?: boolean;
}

// The "Cancel + primary action" footer repeated across every finance form modal. Modals whose confirm
// button needs to stay isolated from a watched form field (so typing doesn't re-render the whole modal —
// see add-transaction-modal's and budget-modal's own SubmitButton) keep their own version instead of this.
const ModalFooterActions: React.FC<ModalFooterActionsProps> = ({ onCancel, onConfirm, confirmLabel, confirmIcon, confirmDisabled = false }) => {
  const { t } = useTranslation();

  return (
    <View className="flex-row justify-between">
      <TouchableOpacity onPress={onCancel} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
        <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
        <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onConfirm}
        disabled={confirmDisabled}
        className={`flex-row items-center gap-1 rounded-lg px-4 py-2 ${confirmDisabled ? 'bg-gray-300' : 'bg-primary'}`}
      >
        <Ionicons name={confirmIcon} size={18} color="white" />
        <Text className="text-white font-semibold">{confirmLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalFooterActions;
