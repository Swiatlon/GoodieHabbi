import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IShopItem } from '@/contract/shop/shop.contract';

interface ShopItemRequirementsProps {
  item: IShopItem;
}

const ShopItemRequirements: React.FC<ShopItemRequirementsProps> = ({ item }) => (
  <View className="flex-row items-center gap-2 mb-2">
    <Ionicons name="cash-outline" size={24} color="#85BB65" />
    <Text className={`text-base font-bold ${item.userContext?.canAfford === false ? 'text-red-500' : 'text-gray-800'}`}>{item.price}</Text>
    {item.levelRequirement > 1 && (
      <Text className={`ml-2 text-sm ${item.userContext?.isUnlocked === false ? 'text-red-500' : 'text-blue-500'}`}>
        Lvl {item.levelRequirement}+
      </Text>
    )}
  </View>
);

export default ShopItemRequirements;
