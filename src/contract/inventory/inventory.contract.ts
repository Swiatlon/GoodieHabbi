import { NullableString } from '@/types/global-types';

export interface IUserInventoryItem {
  userInventoryId: number;
  shopItemId: number;
  itemType?: NullableString;
  category?: NullableString;
  quantity: number;
  acquiredAt: string;
  isActive: boolean;
  itemUrl: string;
  itemName?: NullableString;
  itemDescription?: NullableString;
}

export type IGetInventoryItemsResponse = IUserInventoryItem[];

export interface IInventoryActionRequest {
  inventoryId: number;
}
