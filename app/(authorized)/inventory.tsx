import React from 'react';
import { FlatList, View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import Button from '@/components/shared/button/button';
import Loader from '@/components/shared/loader/loader';
import InventoryItem from '@/components/views/inventory/inventory-item';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useSnackbar } from '@/providers/snackbar/snackbar-context';
import {
  useGetInventoryItemsQuery,
  useEquipInventoryItemMutation,
  useUnequipInventoryItemMutation,
  useUseInventoryItemMutation,
} from '@/redux/api/inventory/inventory.api';

const Inventory = () => {
  const { data: items = [], isLoading, refetch } = useGetInventoryItemsQuery();
  const [equipItem] = useEquipInventoryItemMutation();
  const [unequipItem] = useUnequipInventoryItemMutation();
  const [useItem] = useUseInventoryItemMutation();
  const { showSnackbar } = useSnackbar();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const buttonsStyle = useTransformFade({ isContentLoading: isLoading, delay: 200 });

  const handleEquip = async (inventoryId: number) => {
    try {
      await equipItem({ inventoryId }).unwrap();
      refetch();
      showSnackbar({ text: 'Looking good! You equipped this item.', variant: 'success' });
    } catch {
      showSnackbar({ text: "Oops! Couldn't equip this item. Try again?", variant: 'error' });
    }
  };

  const handleUnequip = async (inventoryId: number) => {
    try {
      await unequipItem({ inventoryId }).unwrap();
      refetch();
      showSnackbar({ text: 'You took off this item.', variant: 'success' });
    } catch {
      showSnackbar({ text: "Couldn't take it off. Please try again!", variant: 'error' });
    }
  };

  const handleUse = async (inventoryId: number) => {
    try {
      await useItem({ inventoryId }).unwrap();
      refetch();
      showSnackbar({ text: 'Used! Hope it helped 🎉', variant: 'success' });
    } catch {
      showSnackbar({ text: "Couldn't use this item. Try again!", variant: 'error' });
    }
  };

  if (isLoading) {
    return <Loader message="Loading inventory..." />;
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">Your inventory is empty.</Text>
        <Animated.View style={buttonsStyle}>
          <Button
            label="Go to Shop to buy items"
            onPress={() => navigation.navigate('(authorized)/shop')}
            startIcon={<Ionicons name="cart-outline" size={20} color="#fff" />}
            className="mx-auto mt-4"
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold text-primary text-center mb-4">Inventory</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.userInventoryId.toString()}
        renderItem={({ item }) => <InventoryItem item={item} onEquip={handleEquip} onUnequip={handleUnequip} onUse={handleUse} />}
      />
    </View>
  );
};

export default Inventory;
