export const SHOP_ITEM_TYPE_CONFIG = {
  Title: {
    labelKey: 'title',
    textClass: 'text-yellow-600',
    borderColor: 'border-yellow-300',
    iconName: 'ribbon-outline',
    iconBgColor: '#fef9c3', // yellow-100
    layout: 'column',
  },
  VisualEffect: {
    labelKey: 'visualEffect',
    textClass: 'text-purple-600',
    borderColor: 'border-purple-300',
    iconName: 'sparkles-outline',
    iconBgColor: '#ede9fe', // purple-100
    layout: 'column',
  },
  Consumable: {
    labelKey: 'consumable',
    textClass: 'text-blue-600',
    borderColor: 'border-blue-300',
    iconName: 'flash-outline',
    iconBgColor: '#dbeafe', // blue-100
    layout: 'row',
  },
  Cosmetic: {
    labelKey: 'cosmetic',
    textClass: 'text-pink-600',
    borderColor: 'border-pink-300',
    iconName: 'color-palette-outline',
    iconBgColor: '#fce7f3', // pink-100
    layout: 'row',
  },
  Pet: {
    labelKey: 'pet',
    textClass: 'text-green-600',
    borderColor: 'border-green-300',
    iconName: 'paw-outline',
    iconBgColor: '#dcfce7', // green-100
    layout: 'row',
  },
} as const;
