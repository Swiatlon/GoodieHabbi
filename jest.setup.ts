import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import en from './src/i18n/locales/en';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Components read insets directly (the shared Modal keeps its footer clear of the navigation bar), and
// tests render them without a `SafeAreaProvider`.
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual<object>('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));
