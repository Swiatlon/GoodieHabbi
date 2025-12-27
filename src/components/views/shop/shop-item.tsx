import { FC } from 'react';
import { Animated, View, Image } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShopItemButton from './shop-item-button';
import ShopItemInfo from './shop-item-info';
import ShopItemRequirements from './shop-item-requirements';
import { IShopItem } from '@/contract/shop/shop.contract';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface ShopItemSubProps {
  item: IShopItem;
  isPurchasing: boolean;
  onPurchase: (id: number) => void;
  animatedStyle: StyleProp<ViewStyle>;
}

const ShopItemTitle: FC<ShopItemSubProps> = ({ item, isPurchasing, onPurchase, animatedStyle }) => (
  <Animated.View style={animatedStyle}>
    <View className="bg-white rounded-2xl shadow-md p-4 mb-4 flex-col items-stretch">
      <ShopItemInfo item={item} />
      <ShopItemRequirements item={item} />
      <ShopItemButton item={item} isPurchasing={isPurchasing} onPurchase={onPurchase} />
    </View>
  </Animated.View>
);

const ShopItemVisualEffect: FC<ShopItemSubProps> = ({ item, isPurchasing, onPurchase, animatedStyle }) => (
  <Animated.View style={animatedStyle}>
    <View className="bg-white rounded-2xl shadow-md p-4 mb-4 flex-col items-stretch">
      <ShopItemInfo item={item} />
      <ShopItemRequirements item={item} />
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="w-full h-24 rounded-xl mt-2" resizeMode="cover" />
      ) : (
        <View className="w-full h-10 rounded-xl bg-yellow-100 items-center justify-center border border-yellow-300 mt-2">
          <Ionicons name="ribbon-outline" size={28} color="#eab308" />
        </View>
      )}
      <ShopItemButton item={item} isPurchasing={isPurchasing} onPurchase={onPurchase} />
    </View>
  </Animated.View>
);

const ShopItemDefault: FC<ShopItemSubProps> = ({ item, isPurchasing, onPurchase, animatedStyle }) => (
  <Animated.View style={animatedStyle}>
    <View className="bg-white rounded-2xl shadow-md p-4 mb-4 flex-row items-center gap-4">
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="w-16 h-16" resizeMode="cover" />
      ) : (
        <View className="w-16 h-16 rounded-xl bg-gray-200 items-center justify-center">
          <Ionicons name="cart-outline" size={32} color="#b0b0b0" />
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

interface ShopItemProps {
  item: IShopItem;
  isPurchasing: boolean;
  onPurchase: (id: number) => void;
}

const ShopItem: React.FC<ShopItemProps> = ({ item, isPurchasing, onPurchase }) => {
  const animatedStyle = useTransformFade({});

  if (item.itemType === 'Title') {
    return <ShopItemTitle item={item} isPurchasing={isPurchasing} onPurchase={onPurchase} animatedStyle={animatedStyle} />;
  }

  if (item.itemType === 'VisualEffect') {
    return <ShopItemVisualEffect item={item} isPurchasing={isPurchasing} onPurchase={onPurchase} animatedStyle={animatedStyle} />;
  }

  return <ShopItemDefault item={item} isPurchasing={isPurchasing} onPurchase={onPurchase} animatedStyle={animatedStyle} />;
};

export default ShopItem;
