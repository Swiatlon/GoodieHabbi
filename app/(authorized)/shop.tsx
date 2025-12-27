import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from '@/components/shared/loader/loader';
import ShopItem from '@/components/views/shop/shop-item';
import { useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetAccountDataQuery } from '@/redux/api/account/account-api';
import { useGetShopItemsQuery, usePurchaseShopItemMutation } from '@/redux/api/shop/shop.api';
import { useGetStatsProfileQuery } from '@/redux/api/stats/stats-api';

const Shop = () => {
  const { data: items = [], isLoading, isFetching, refetch } = useGetShopItemsQuery({});
  const { data: account, isLoading: isLoadingAccount } = useGetAccountDataQuery({});
  const { data: statsData, isLoading: isStatsLoading } = useGetStatsProfileQuery();
  const [purchaseShopItem, { isLoading: isPurchasing }] = usePurchaseShopItemMutation();
  const { showSnackbar } = useSnackbar();

  const handlePurchase = async (itemId: number) => {
    try {
      await purchaseShopItem({ shopItemId: itemId }).unwrap();
      refetch();
      showSnackbar({ text: 'Purchase successful!', variant: 'success' });
    } catch {
      showSnackbar({ text: 'Purchase failed. Please try again.', variant: 'error' });
    }
  };

  if (isLoading || isLoadingAccount || isStatsLoading) {
    return <Loader message="Loading items..." />;
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">No items available in the shop.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold text-primary text-center">Shop</Text>
      {account?.profile.coins && statsData?.xpStats.level && (
        <View className="flex-row items-center justify-center mb-4">
          <View className="flex-row bg-white rounded-xl shadow p-4 gap-8 items-center">
            <View className="flex-row items-center gap-1">
              <Ionicons name="cash-outline" size={22} color="#85BB65" />
              <Text className="text-lg font-bold text-gray-800">{account.profile.coins}</Text>
              <Text className="text-sm text-gray-500 ml-1">coins</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="star-outline" size={22} color="#FFD700" />
              <Text className="text-lg font-bold text-gray-800">{statsData.xpStats.level}</Text>
              <Text className="text-sm text-gray-500 ml-1">level</Text>
            </View>
          </View>
        </View>
      )}
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ShopItem item={item} isPurchasing={isPurchasing || isFetching} onPurchase={handlePurchase} />}
      />
    </View>
  );
};

export default Shop;
