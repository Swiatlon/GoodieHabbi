import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import { IShopItem } from '@/contract/shop/shop.contract';

interface ShopItemButtonProps {
  item: IShopItem;
  isPurchasing: boolean;
  onPurchase: (id: number) => void;
}

const ShopItemButton: React.FC<ShopItemButtonProps> = ({ item, isPurchasing, onPurchase }) => {
  const isConsumable = item.itemType === 'Consumable';

  const canPurchase = item.userContext?.canPurchase ?? false;

  return (
    <View className="items-end mt-2">
      {/* Non-consumables: show Owned if already owned */}
      {!isConsumable && item.userContext?.isOwned ? (
        <View className="px-4 py-3 rounded-full bg-green-100">
          <Text className="text-green-700 font-semibold text-xs">Owned</Text>
        </View>
      ) : (
        <Button
          label={canPurchase ? 'Buy' : 'Locked'}
          styleType={canPurchase ? 'primary' : 'secondary'}
          disabled={isPurchasing || !canPurchase}
          onPress={() => onPurchase(item.id)}
          startIcon={<Ionicons name="cart-outline" size={20} color="#fff" />}
          className="px-4"
        />
      )}
    </View>
  );
};

export default ShopItemButton;
