import { FC } from 'react';
import { Image } from 'react-native';
import { IUserInventoryItem } from '@/contract/inventory/inventory.contract';

interface InventoryItemIconProps {
  item: IUserInventoryItem;
}

export const InventoryItemIconRow: FC<InventoryItemIconProps> = ({ item }) => {
  return <Image source={{ uri: item.itemUrl }} className="w-16 h-16 rounded-xl" resizeMode="cover" />;
};

export const InventoryItemIconColumn: FC<InventoryItemIconProps> = ({ item }) => {
  return <Image source={{ uri: item.itemUrl }} className="w-full h-24 rounded-xl" resizeMode="cover" />;
};
