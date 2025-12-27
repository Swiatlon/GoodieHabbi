import { FC } from 'react';
import { Animated, View } from 'react-native';
import { SHOP_ITEM_TYPE_CONFIG } from './items.config';
import { ShopItemSubProps } from './shop-item';
import ShopItemButton from './shop-item-button';
import ShopItemInfo from './shop-item-info';
import ShopItemRequirements from './shop-item-requirements';

const ShopItemTitle: FC<ShopItemSubProps> = ({ item, isPurchasing, onPurchase, animatedStyle }) => (
  <Animated.View style={animatedStyle}>
    <View className={`bg-white rounded-2xl shadow-md p-4 mb-4 border ${SHOP_ITEM_TYPE_CONFIG['Title'].borderColor}`}>
      <ShopItemInfo item={item} />
      <ShopItemRequirements item={item} />
      <ShopItemButton item={item} isPurchasing={isPurchasing} onPurchase={onPurchase} />
    </View>
  </Animated.View>
);

export default ShopItemTitle;
