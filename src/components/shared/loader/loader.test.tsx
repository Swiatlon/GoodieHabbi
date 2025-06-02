import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import Loader from './loader';

describe('Loader', () => {
  it('renders the loading message and spinner', () => {
    const { getByText } = render(<Loader message="Please wait..." />);
    expect(getByText('Please wait...')).toBeTruthy();
  });

  it('renders children when fullscreen and children prop provided', () => {
    const childText = 'Child component';
    const { getByText } = render(<Loader fullscreen>{<Text>{childText}</Text>}</Loader>);
    expect(getByText(childText)).toBeTruthy();
  });
});
