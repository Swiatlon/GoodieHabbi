import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { SHOP_ITEM_TYPE_CONFIG } from './items.config';
import { IShopItem } from '@/contract/shop/shop.contract';

interface ShopItemTypeBadgeProps {
  item: IShopItem;
}

const ShopItemTypeBadge: React.FC<ShopItemTypeBadgeProps> = ({ item }) => {
  const { t } = useTranslation();

  if (!item.itemType) return null;

  const config = SHOP_ITEM_TYPE_CONFIG[item.itemType as keyof typeof SHOP_ITEM_TYPE_CONFIG];

  return <Text className={`${config.textClass} font-bold text-xs mt-1`}>{t(`shop.types.${config.labelKey}`)}</Text>;
};

export default ShopItemTypeBadge;
