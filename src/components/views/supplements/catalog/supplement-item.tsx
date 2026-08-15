import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SlotFormModal from './slot-form-modal';
import { ISupplement, ISupplementSlot } from '@/contract/supplements/supplements.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteSupplementSlotMutation } from '@/redux/api/supplements/catalog-api';
import { IApiError } from '@/types/global-types';

interface SupplementItemProps {
  supplement: ISupplement;
  onEdit: (supplement: ISupplement) => void;
  onDelete: (supplement: ISupplement) => void;
  onToggleActive: (supplement: ISupplement) => void;
}

const SupplementItem: React.FC<SupplementItemProps> = ({ supplement, onEdit, onDelete, onToggleActive }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [slotModalState, setSlotModalState] = useState<{ slot: ISupplementSlot | null } | null>(null);
  const [deleteSlot] = useDeleteSupplementSlotMutation();

  const handleDeleteSlot = (slot: ISupplementSlot) => {
    Alert.alert(t('supplements.catalog.deleteSlotTitle'), t('supplements.catalog.deleteSlotMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSlot({ supplementId: supplement.id, slotId: slot.id }).unwrap();
          } catch (err) {
            const error = err as IApiError;
            showSnackbar({ text: error.data?.message || t('supplements.catalog.deleteSlotError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  return (
    <View testID="supplement-item-container" className={`p-4 border-b border-gray-100 gap-2 ${supplement.isActive ? '' : 'opacity-50'}`}>
      <View className="flex-row items-center justify-between">
        <TouchableOpacity className="flex-1 pr-3" onPress={() => onEdit(supplement)}>
          <Text className="text-base font-semibold text-gray-800">{supplement.name}</Text>
          <Text className="text-xs text-gray-400 mt-0.5">{t(`supplements.enums.unit.${supplement.unit}`)}</Text>
        </TouchableOpacity>

        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => onToggleActive(supplement)} accessibilityLabel={t('supplements.catalog.toggleActive')}>
            <Ionicons name={supplement.isActive ? 'toggle' : 'toggle-outline'} size={26} color={supplement.isActive ? '#10B981' : '#9ca3af'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(supplement)} accessibilityLabel={t('common.delete')}>
            <Ionicons name="trash-outline" size={20} color="#e53e3e" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="gap-1">
        {supplement.slots.map(slot => (
          <TouchableOpacity
            key={slot.id}
            className="flex-row items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
            onPress={() => setSlotModalState({ slot })}
            onLongPress={() => handleDeleteSlot(slot)}
          >
            <Text className="text-xs text-gray-600">
              {t(`supplements.enums.timing.${slot.timing}`)} · {slot.amount} {t(`supplements.enums.unit.${supplement.unit}`)}
            </Text>
            <Ionicons name="pencil-outline" size={14} color="#9ca3af" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => setSlotModalState({ slot: null })} className="flex-row items-center gap-1 py-1" testID="btn-add-slot">
          <Ionicons name="add-circle-outline" size={16} color="#1987EE" />
          <Text className="text-xs font-semibold text-primary">{t('supplements.catalog.addSlot')}</Text>
        </TouchableOpacity>
      </View>

      {slotModalState && (
        <SlotFormModal isVisible={true} onClose={() => setSlotModalState(null)} supplement={supplement} slot={slotModalState.slot} />
      )}
    </View>
  );
};

export default SupplementItem;
