import React from 'react';
import { Text } from 'react-native';
import ShopItemTypeBadge from './shop-item-type-badge';
import { IShopItem } from '@/contract/shop/shop.contract';

interface ShopItemInfoProps {
  item: IShopItem;
}

const ShopItemInfo: React.FC<ShopItemInfoProps> = ({ item }) => (
  <>
    <Text className="text-lg font-semibold text-gray-900 mb-1">{item.name}</Text>
    <ShopItemTypeBadge item={item} />
    {item.description && <Text className="text-gray-500 text-sm mb-2">{item.description}</Text>}
  </>
);

export default ShopItemInfo;
