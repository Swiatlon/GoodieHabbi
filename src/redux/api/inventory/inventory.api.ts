import { IGetInventoryItemsResponse, IInventoryActionRequest } from '@/contract/inventory/inventory.contract';
import Api from '@/redux/config/api';

export const inventorySliceAPI = Api.injectEndpoints({
  endpoints: builder => ({
    getInventoryItems: builder.query<IGetInventoryItemsResponse, void>({
      query: () => ({
        url: 'inventory/items',
        method: 'GET',
      }),
      providesTags: ['inventory', 'account'],
    }),

    equipInventoryItem: builder.mutation<void, IInventoryActionRequest>({
      query: ({ inventoryId }) => ({
        url: `inventory/items/${inventoryId}/equip`,
        method: 'POST',
      }),
      invalidatesTags: ['inventory', 'account'],
    }),

    unequipInventoryItem: builder.mutation<void, IInventoryActionRequest>({
      query: ({ inventoryId }) => ({
        url: `inventory/items/${inventoryId}/unequip`,
        method: 'POST',
      }),
      invalidatesTags: ['inventory', 'account'],
    }),

    useInventoryItem: builder.mutation<void, IInventoryActionRequest>({
      query: ({ inventoryId }) => ({
        url: `inventory/items/${inventoryId}/use`,
        method: 'POST',
      }),
      invalidatesTags: ['inventory', 'account', 'statsProfile'],
    }),
  }),
});

export const { useGetInventoryItemsQuery, useEquipInventoryItemMutation, useUnequipInventoryItemMutation, useUseInventoryItemMutation } =
  inventorySliceAPI;
