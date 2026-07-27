import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

const Comp = () => {
  const { t } = useTranslation();
  return <Text>{t('shared.select.selectOptionLabel')}</Text>;
};

test('no init', () => {
  const { toJSON } = render(<Comp />);
  console.log(JSON.stringify(toJSON()));
});
