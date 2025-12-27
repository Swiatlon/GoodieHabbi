import React, { FC } from 'react';
import { View } from 'react-native';
import Button from '@/components/shared/button/button';
import { IUserInventoryItem } from '@/contract/inventory/inventory.contract';

interface InventoryItemActionsProps {
  item: IUserInventoryItem;
  isEquipped: boolean;
  canEquip: boolean;
  canUse: boolean;
  onEquip: (id: number) => void;
  onUnequip: (id: number) => void;
  onUse: (id: number) => void;
}

const InventoryItemActions: FC<InventoryItemActionsProps> = ({ item, isEquipped, canEquip, canUse, onEquip, onUnequip, onUse }) => (
  <View className="flex-col items-end space-y-2">
    {!isEquipped && canEquip && <Button label="Wear" onPress={() => onEquip(item.userInventoryId)} styleType="primary" className="px-4" />}
    {isEquipped && !canUse && <Button label="Take Off" onPress={() => onUnequip(item.userInventoryId)} styleType="danger" className="px-4" />}
    {canUse && <Button label="Use Now" onPress={() => onUse(item.userInventoryId)} styleType="accent" className="px-4" />}
  </View>
);

export default InventoryItemActions;
