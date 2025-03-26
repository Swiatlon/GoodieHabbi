import { DrawerNavigationProp } from '@react-navigation/drawer';
export type RootDrawerNavigationProp = DrawerNavigationProp<unknown, unknown>;

declare global {
  namespace ReactNavigation {
    interface RootParamList {}
  }
}
