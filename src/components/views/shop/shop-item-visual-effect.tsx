import { FC } from 'react';
import { Animated, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOP_ITEM_TYPE_CONFIG } from './items.config';
import { ShopItemSubProps } from './shop-item';
import ShopItemButton from './shop-item-button';
import ShopItemInfo from './shop-item-info';
import ShopItemRequirements from './shop-item-requirements';

const ShopItemVisualEffect: FC<ShopItemSubProps> = ({ item, isPurchasing, onPurchase, animatedStyle }) => (
  <Animated.View style={animatedStyle}>
    <View className={`bg-white rounded-2xl shadow-md p-4 mb-4 border ${SHOP_ITEM_TYPE_CONFIG['VisualEffect'].borderColor}`}>
      <ShopItemInfo item={item} />
      <ShopItemRequirements item={item} />

      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="w-full h-24 rounded-xl mt-2" resizeMode="cover" />
      ) : (
        <View className="w-full h-10 mt-2 rounded-xl bg-purple-100 border border-purple-300 items-center justify-center">
          <Ionicons name="sparkles-outline" size={28} color="#a78bfa" />
        </View>
      )}

      <ShopItemButton item={item} isPurchasing={isPurchasing} onPurchase={onPurchase} />
    </View>
  </Animated.View>
);

export default ShopItemVisualEffect;
