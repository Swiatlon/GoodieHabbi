import { FC } from 'react';
import { Animated, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOP_ITEM_TYPE_CONFIG } from './items.config';
import { ShopItemSubProps } from './shop-item';
import ShopItemButton from './shop-item-button';
import ShopItemInfo from './shop-item-info';
import ShopItemRequirements from './shop-item-requirements';

const ShopItemConsumable: FC<ShopItemSubProps> = ({ item, isPurchasing, onPurchase, animatedStyle }) => (
  <Animated.View style={animatedStyle}>
    <View className={`bg-white rounded-2xl shadow-md p-4 mb-4 flex-row gap-4 border ${SHOP_ITEM_TYPE_CONFIG['Consumable'].borderColor}`}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="w-16 h-16 rounded-xl" />
      ) : (
        <View className="w-16 h-16 rounded-xl bg-blue-100 items-center justify-center">
          <Ionicons name="flash-outline" size={32} color="#3b82f6" />
        </View>
      )}

      <View className="flex-1">
        <ShopItemInfo item={item} />
        <ShopItemRequirements item={item} />
      </View>

      <ShopItemButton item={item} isPurchasing={isPurchasing} onPurchase={onPurchase} />
    </View>
  </Animated.View>
);

export default ShopItemConsumable;
