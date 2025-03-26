import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, ParamListBase, NavigationProp } from '@react-navigation/native';

interface DropdownItem {
  label: string;
  icon: JSX.Element;
  route?: string;
  children?: DropdownItem[];
}

interface CustomDrawerProps {
  label: string;
  icon: JSX.Element;
  route?: string;
  items?: DropdownItem[];
  depth?: number;
}

const ICON_SIZE = 20;
const DEPTH_MARGIN_CLASSES: Record<number, string> = {
  0: 'ml-0',
  1: 'ml-4',
  2: 'ml-8',
  3: 'ml-12',
  4: 'ml-16',
};

const renderIcon = (iconElement: JSX.Element, active: boolean) =>
  React.cloneElement(iconElement, {
    size: ICON_SIZE,
    color: active ? '#1987EE' : '#4b465d',
  });

const renderLabel = (text: string, active: boolean) => <Text className={`flex-1 text-base ${active ? 'text-primary' : 'text-black'}`}>{text}</Text>;

const renderExtendArrow = (isOpen: boolean) => (
  <Ionicons name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={ICON_SIZE} color="#4b465d" />
);

const CustomDrawerItem: React.FC<CustomDrawerProps> = ({ label, icon, items = [], route, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(label === 'Quests' ? true : false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const currentRoute = navigation.getState().routes[navigation.getState().index]?.name;
  const isActive = route === currentRoute;
  const hasChildren = items.length > 0;
  const marginClass = DEPTH_MARGIN_CLASSES[depth];

  const handlePress = () => {
    setIsOpen(!isOpen);

    if (!hasChildren && route) {
      navigation.navigate(route);
    }
  };

  const renderChildren = () =>
    isOpen &&
    hasChildren &&
    items.map((item, index) => (
      <View key={index} className="mt-4">
        <CustomDrawerItem label={item.label} icon={item.icon} items={item.children} route={item.route} depth={depth + 1} />
      </View>
    ));

  return (
    <View>
      <TouchableOpacity className={`flex flex-row items-center gap-2 ${marginClass}`} onPress={handlePress}>
        {renderIcon(icon, isActive)}
        {renderLabel(label, isActive)}
        {hasChildren && renderExtendArrow(isOpen)}
      </TouchableOpacity>
      {renderChildren()}
    </View>
  );
};

export default CustomDrawerItem;
