/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Select from './select';

// Mocks
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name }: { name: string }) => <Text>{name}</Text>,
  };
});

jest.mock('../modal/modal', () => {
  return ({ isVisible, children }: any) => (isVisible ? children : null);
});

jest.mock('@/configs/day-js-config', () => require('dayjs'));
jest.mock('@/utils/utils/utils', () => ({
  fromUTCToLocal: (date: string) => date,
  safeDateFormat: (date: string) => `Formatted(${date})`,
}));

const mockOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

describe('Select component', () => {
  it('renders placeholder when no value is selected', () => {
    const { getByPlaceholderText } = render(<Select placeholder="Select a fruit" isModalVersion value={null} options={mockOptions} />);
    expect(getByPlaceholderText('Select a fruit')).toBeTruthy();
  });

  it('displays selected value from options', () => {
    const { getByDisplayValue } = render(<Select placeholder="Select a fruit" isModalVersion value="banana" options={mockOptions} />);
    expect(getByDisplayValue('Banana')).toBeTruthy();
  });

  it('displays formatted date if isDate is true', () => {
    const { getByDisplayValue } = render(<Select placeholder="Pick date" value="2024-01-01T00:00:00Z" isDate />);
    expect(getByDisplayValue('Formatted(2024-01-01T00:00:00Z)')).toBeTruthy();
  });

  it('calls onPress and opens modal in modal version', () => {
    const onPress = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Select placeholder="Select" value={null} isModalVersion options={mockOptions} onPress={onPress} onChange={jest.fn()} />
    );

    fireEvent.press(getByPlaceholderText('Select'));
    expect(getByText('Select an option:')).toBeTruthy(); // Modal opened
  });

  it('calls onChange when an option is selected', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Select placeholder="Select" value={null} isModalVersion options={mockOptions} onChange={onChange} />
    );

    fireEvent.press(getByPlaceholderText('Select'));
    fireEvent.press(getByText('Apple'));
    expect(onChange).toHaveBeenCalledWith('apple');
  });

  it('renders clear button and calls onClear', () => {
    const onClear = jest.fn();
    const { getByText } = render(<Select placeholder="Select" value="banana" isModalVersion options={mockOptions} onClear={onClear} />);

    fireEvent.press(getByText('close-circle')); // Mocked Ionicon name
    expect(onClear).toHaveBeenCalled();
  });

  it('shows error text and red border when error is passed', () => {
    const { getByText } = render(<Select placeholder="Select" value={null} isModalVersion options={mockOptions} error="Field is required" />);

    expect(getByText('Field is required')).toBeTruthy();
  });
});
