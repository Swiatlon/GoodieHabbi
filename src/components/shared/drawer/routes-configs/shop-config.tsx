import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const ShopConfig = () => {
  return <CustomDrawerItem label="Shop" icon={<Ionicons name="cart-outline" />} route="(authorized)/shop" />;
};

export default ShopConfig;
