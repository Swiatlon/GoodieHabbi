import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import TextArea from './text-area';

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: () => <Text>Icon</Text>,
  };
});

describe('TextArea Component', () => {
  const mockOnChange = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnClear.mockClear();
  });

  it('renders correctly with label', () => {
    render(<TextArea label="Description" value="test" onChange={mockOnChange} testID="text-area" />);

    expect(screen.getByTestId('text-area-container')).toBeTruthy();
    expect(screen.getByTestId('text-area-label')).toBeTruthy();
    expect(screen.getByTestId('text-area-input')).toBeTruthy();
  });

  it('renders required asterisk when isRequired is true', () => {
    const { getByTestId } = render(<TextArea label="Required" isRequired value="" onChange={mockOnChange} testID="required-text-area" />);
    const label = getByTestId('required-text-area-label');
    expect(label.children.join('')).toContain('*');
  });

  it('calls onChange when typing', () => {
    render(<TextArea value="" onChange={mockOnChange} testID="input-text-area" />);

    const input = screen.getByTestId('input-text-area-input');
    fireEvent.changeText(input, 'new value');

    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('renders clear button when value is present and onClear is provided', () => {
    render(<TextArea value="something" onChange={mockOnChange} onClear={mockOnClear} testID="clearable-text-area" />);

    const clearButton = screen.getByTestId('clearable-text-area-clear-button');
    expect(clearButton).toBeTruthy();
  });

  it('does not render clear button if value is empty', () => {
    render(<TextArea value="" onChange={mockOnChange} onClear={mockOnClear} testID="empty-text-area" />);

    expect(() => screen.getByTestId('empty-text-area-clear-button')).toThrow();
  });

  it('calls onClear when clear button is pressed', () => {
    render(<TextArea value="clear me" onChange={mockOnChange} onClear={mockOnClear} testID="clear-button-text-area" />);

    const clearButton = screen.getByTestId('clear-button-text-area-clear-button');
    fireEvent.press(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('applies error style when error is passed', () => {
    const { getByTestId } = render(<TextArea value="test" error="Error message" onChange={mockOnChange} testID="error-text-area" />);

    const wrapper = getByTestId('error-text-area-wrapper');
    expect(wrapper.props.className).toContain('border-red-500');
  });
});
