import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Href, usePathname, useRouter } from 'expo-router';
import { IoniconName } from '@/utils/icons/ionicon-name';

const SECTIONS: { path: string; icon: IoniconName; labelKey: string }[] = [
  { path: '/supplements', icon: 'checkbox-outline', labelKey: 'supplements.tabs.checklist' },
  { path: '/supplements/catalog', icon: 'file-tray-full-outline', labelKey: 'supplements.tabs.catalog' },
  { path: '/supplements/analytics', icon: 'stats-chart-outline', labelKey: 'supplements.tabs.analytics' },
];

const SupplementsNavBar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center px-8 py-2.5 bg-white border-b border-gray-100">
      {SECTIONS.map(section => {
        const isActive = pathname === section.path;
        return (
          <TouchableOpacity
            key={section.path}
            onPress={() => router.replace(section.path as Href)}
            className={`w-11 h-11 rounded-full items-center justify-center ${isActive ? 'bg-blue-50' : ''}`}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            accessibilityLabel={t(section.labelKey)}
          >
            <Ionicons name={section.icon} size={isActive ? 24 : 20} color={isActive ? '#1987EE' : '#9ca3af'} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SupplementsNavBar;
