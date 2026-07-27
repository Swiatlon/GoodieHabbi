import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import en from './locales/en';
import pl from './locales/pl';

const supportedLangs = ['en', 'pl'];
const deviceLang = Localization.getLocales()[0]?.languageCode ?? 'pl';
const lng = supportedLangs.includes(deviceLang) ? deviceLang : 'pl';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  },
  lng,
  fallbackLng: 'pl',
  interpolation: { escapeValue: false },
});

export default i18n;
