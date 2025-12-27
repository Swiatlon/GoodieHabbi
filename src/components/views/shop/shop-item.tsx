// shop-item.tsx
import { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import ShopItemConsumable from './shop-item-consumables';
import ShopItemCosmetic from './shop-item-cosmetic';
import ShopItemPet from './shop-item-pet';
import ShopItemTitle from './shop-item-title';
import ShopItemVisualEffect from './shop-item-visual-effect';
import { IShopItem, ShopItemType } from '@/contract/shop/shop.contract';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

export interface ShopItemSubProps {
  item: IShopItem;
  isPurchasing: boolean;
  onPurchase: (id: number) => void;
  animatedStyle: StyleProp<ViewStyle>;
}

const ITEM_COMPONENT_MAP: Record<ShopItemType, FC<ShopItemSubProps>> = {
  Title: ShopItemTitle,
  VisualEffect: ShopItemVisualEffect,
  Consumable: ShopItemConsumable,
  Pet: ShopItemPet,
  Cosmetic: ShopItemCosmetic,
};

interface ShopItemProps {
  item: IShopItem;
  isPurchasing: boolean;
  onPurchase: (id: number) => void;
}

function isValidShopItemType(type: string): type is ShopItemType {
  return type in ITEM_COMPONENT_MAP;
}

const ShopItem: FC<ShopItemProps> = props => {
  const animatedStyle = useTransformFade({});
  const { item } = props;

  if (!item.itemType) {
    return null;
  }

  if (!isValidShopItemType(item.itemType)) {
    return null;
  }

  const Component = ITEM_COMPONENT_MAP[item.itemType];

  return <Component {...props} animatedStyle={animatedStyle} item={item as IShopItem & { itemType: ShopItemType }} />;
};

export default ShopItem;
