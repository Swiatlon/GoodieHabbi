import {
  IGetShopItemsResponse,
  IGetShopItemsRequest,
  IPostPurchaseShopItemResponse,
  IPostPurchaseShopItemRequest,
} from '@/contract/shop/shop.contract';
import Api from '@/redux/config/api';

export const shopSliceAPI = Api.injectEndpoints({
  endpoints: builder => ({
    getShopItems: builder.query<IGetShopItemsResponse, IGetShopItemsRequest>({
      query: params => ({
        url: 'shop/items',
        method: 'GET',
        params,
      }),
      providesTags: ['shopItems'],
    }),

    purchaseShopItem: builder.mutation<IPostPurchaseShopItemResponse, IPostPurchaseShopItemRequest>({
      query: body => ({
        url: 'shop/purchases',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['shopItems', 'statsProfile', 'account', 'inventory'],
    }),
  }),
});

export const { useGetShopItemsQuery, usePurchaseShopItemMutation } = shopSliceAPI;
