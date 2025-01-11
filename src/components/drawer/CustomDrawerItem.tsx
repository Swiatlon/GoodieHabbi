import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, ParamListBase, NavigationProp } from '@react-navigation/native';

interface IDropdownItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  children?: IDropdownItem[];
}

interface ICustomDrawer {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  items?: IDropdownItem[];
}

const ICONS_SIZE = 20;

const CustomDrawerItem = ({ label, icon, items, route }: ICustomDrawer) => {
  const hasChildren = items?.length ?? false;
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleNavigation = (route?: string) => {
    if (route) {
      navigation.navigate(route);
    }
  };

  return (
    <View>
      <TouchableOpacity
        className="flex flex-row items-center px-5 gap-2"
        onPress={() => {
          setIsOpen(!isOpen);
          handleNavigation(route);
        }}
      >
        <Ionicons name={icon} size={ICONS_SIZE} color={isOpen ? '#1987EE' : '#4b465d'} />
        <Text className={`flex-1 text-base ${isOpen ? 'text-primary' : 'text-black'}`}>{label}</Text>
        {hasChildren && (
          <Ionicons name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={ICONS_SIZE} color="#4b465d" />
        )}
      </TouchableOpacity>

      {isOpen &&
        hasChildren &&
        items!.map((item, index) => (
          <View key={index} className="pl-4">
            {item.children ? (
              <CustomDrawerItem label={item.label} icon={item.icon} items={item.children} />
            ) : (
              <TouchableOpacity
                className="flex flex-row items-center py-3 pl-5 pr-2"
                onPress={() => handleNavigation(item.route)}
              >
                <Ionicons name={item.icon} size={ICONS_SIZE} color="#4b465d" />
                <Text className="ml-3 text-base text-black">{item.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
    </View>
  );
};

export default CustomDrawerItem;
