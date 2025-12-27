export type ShopSortBy = 'id' | 'name' | 'price' | 'levelRequirement';
export type ShopSortOrder = 'asc' | 'desc';
export type ShopCategory = 'avatarFrames' | 'avatars' | 'nameEffects' | 'consumables' | 'pets' | 'titles';
export type ShopItemType = 'Title' | 'VisualEffect' | 'Consumable' | 'Pet' | 'Cosmetic';

export interface IShopItemUserContext {
  isOwned: boolean;
  quantityOwned: number;
  isUnlocked: boolean;
  canAfford: boolean;
  canPurchase: boolean;
  purchaseLockReason?: string | null;
}

export interface IShopItem {
  id: number;
  name?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  itemType?: ShopItemType | null;
  category?: string | null;
  price: number;
  currencyType?: string | null;
  levelRequirement: number;
  userContext?: IShopItemUserContext | null;
}

export interface IGetShopItemsRequest {
  sortBy?: ShopSortBy;
  sortOrder?: ShopSortOrder;
  category?: ShopCategory;
}

export type IGetShopItemsResponse = IShopItem[];

export interface IPostPurchaseShopItemRequest {
  shopItemId: number;
}

export interface IPostPurchaseShopItemResponse {
  coins: number;
}
