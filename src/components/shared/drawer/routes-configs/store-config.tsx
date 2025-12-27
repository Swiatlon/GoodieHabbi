import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const ShopConfig = () => <CustomDrawerItem label="Shop" icon={<Ionicons name="cart-outline" size={24} />} route="(authorized)/shop" />;

export default ShopConfig;
