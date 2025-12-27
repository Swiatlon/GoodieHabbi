import React, { FC } from 'react';
import { View, Animated, Text } from 'react-native';
import { SHOP_ITEM_TYPE_CONFIG } from '../shop/items.config';
import InventoryItemActions from './inventory-item-actions';
import { InventoryItemIconColumn, InventoryItemIconRow } from './inventory-item-icon';
import InventoryItemInfo from './inventory-item-info';
import { IUserInventoryItem } from '@/contract/inventory/inventory.contract';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface InventoryItemProps {
  item: IUserInventoryItem;
  onEquip: (id: number) => void;
  onUnequip: (id: number) => void;
  onUse: (id: number) => void;
}

const InventoryItem: FC<InventoryItemProps> = ({ item, onEquip, onUnequip, onUse }) => {
  const animatedStyle = useTransformFade({});

  if (!item.itemType) {
    return null;
  }

  const config = SHOP_ITEM_TYPE_CONFIG[item.itemType as keyof typeof SHOP_ITEM_TYPE_CONFIG];
  const isEquipped = item.isActive;
  const isConsumable = item.itemType === 'Consumable';
  const canEquip = !isEquipped && !isConsumable && item.quantity > 0;
  const canUse = isConsumable && item.quantity > 0;

  return (
    <Animated.View style={animatedStyle}>
      <View
        className={`bg-white rounded-2xl shadow-md p-4 mb-4 border ${config.borderColor}`}
        style={{
          flexDirection: config.layout === 'row' ? 'row' : 'column',
          alignItems: config.layout === 'row' ? 'center' : 'stretch',
          gap: 12,
        }}
      >
        {config.layout === 'row' && <InventoryItemIconRow item={item} />}

        <View style={{ flex: 1 }}>
          <InventoryItemInfo item={item} />
          <Text className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</Text>
          {config.layout === 'column' && item.itemType !== 'Title' && <InventoryItemIconColumn item={item} />}
          <InventoryItemActions
            item={item}
            isEquipped={isEquipped}
            canEquip={canEquip}
            canUse={canUse}
            onEquip={onEquip}
            onUnequip={onUnequip}
            onUse={onUse}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default InventoryItem;
