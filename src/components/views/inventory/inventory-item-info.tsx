import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { SHOP_ITEM_TYPE_CONFIG } from '../shop/items.config';
import { IUserInventoryItem } from '@/contract/inventory/inventory.contract';

interface InventoryItemInfoProps {
  item: IUserInventoryItem;
}

const InventoryItemInfo: React.FC<InventoryItemInfoProps> = ({ item }) => {
  const { t } = useTranslation();
  const config = SHOP_ITEM_TYPE_CONFIG[item.itemType as keyof typeof SHOP_ITEM_TYPE_CONFIG];

  return (
    <>
      <Text className="text-lg font-semibold text-gray-900 mb-1">{item.itemName}</Text>
      {item.itemDescription && <Text className="text-gray-500 text-sm mb-2">{item.itemDescription}</Text>}
      <Text className={`${config.textClass} font-bold text-xs mt-1`}>{t(`shop.types.${config.labelKey}`)}</Text>
    </>
  );
};

export default InventoryItemInfo;
