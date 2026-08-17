import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SlotFormModal from './slot-form-modal';
import SwipeableRow from '@/components/shared/swipeable-row/swipeable-row';
import { ISupplement, ISupplementSlot } from '@/contract/supplements/supplements.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteSupplementSlotMutation } from '@/redux/api/supplements/catalog-api';
import { IApiError } from '@/types/global-types';
import { getSupplementVisual, getTimingVisual } from '@/utils/supplements/supplement-visuals';

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
  const visual = getSupplementVisual(supplement);

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
    <View testID="supplement-item-container" className={`bg-white ${supplement.isActive ? '' : 'opacity-50'}`}>
      <SwipeableRow onDelete={() => onDelete(supplement)}>
        <TouchableOpacity onPress={() => onEdit(supplement)} activeOpacity={0.7} className="flex-row items-center px-4 py-3 bg-white">
          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: `${visual.color}20` }}>
            <Text className="text-lg">{visual.emoji}</Text>
          </View>
          <View className="flex-1 pr-3">
            <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
              {supplement.name}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">{t(`supplements.enums.unit.${supplement.unit}`)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onToggleActive(supplement)}
            accessibilityLabel={t('supplements.catalog.toggleActive')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={supplement.isActive ? 'toggle' : 'toggle-outline'} size={26} color={supplement.isActive ? '#10B981' : '#9ca3af'} />
          </TouchableOpacity>
        </TouchableOpacity>
      </SwipeableRow>

      <View className="flex-row flex-wrap gap-1.5 px-4 pb-3 bg-white">
        {supplement.slots.map(slot => {
          const timingVisual = getTimingVisual(slot.timing);
          return (
            <TouchableOpacity
              key={slot.id}
              onPress={() => setSlotModalState({ slot })}
              onLongPress={() => handleDeleteSlot(slot)}
              className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-full"
              style={{ backgroundColor: `${timingVisual.color}20` }}
            >
              <Text className="text-xs">{timingVisual.emoji}</Text>
              <Text className="text-[11px] font-semibold" style={{ color: timingVisual.color }}>
                {t(`supplements.enums.timing.${slot.timing}`)} · {slot.amount}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={() => setSlotModalState({ slot: null })}
          className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-full bg-gray-50"
          testID="btn-add-slot"
        >
          <Ionicons name="add-circle-outline" size={14} color="#1987EE" />
          <Text className="text-[11px] font-semibold text-primary">{t('supplements.catalog.addSlot')}</Text>
        </TouchableOpacity>
      </View>

      {slotModalState && (
        <SlotFormModal isVisible={true} onClose={() => setSlotModalState(null)} supplement={supplement} slot={slotModalState.slot} />
      )}
    </View>
  );
};

export default SupplementItem;
