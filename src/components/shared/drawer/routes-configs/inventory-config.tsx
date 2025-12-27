import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const InventoryConfig = () => {
  return <CustomDrawerItem label="Inventory" icon={<Ionicons name="cube-outline" />} route="(authorized)/inventory" />;
};

export default InventoryConfig;
