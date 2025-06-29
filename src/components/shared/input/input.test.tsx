import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Input from './input';

jest.mock('@expo/vector-icons', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return {
    Ionicons: () => <Text>Icon</Text>,
  };
});

describe('Input Component', () => {
  const mockOnChange = jest.fn();
  const mockOnClear = jest.fn();
  const mockTogglePasswordVisibility = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnClear.mockClear();
    mockTogglePasswordVisibility.mockClear();
  });

  it('renders correctly with label and required asterisk', () => {
    render(<Input label="Username" isRequired value="" onChange={mockOnChange} testID="input" />);

    const label = screen.getByTestId('input-label');
    expect(label).toBeTruthy();
    expect(label.props.children).toContain('Username');

    const asterisk = screen.getByTestId('asteriks');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const asteriskText = Array.isArray(asterisk.props.children) ? asterisk.props.children.join('') : asterisk.props.children;

    expect(asteriskText).toBe(' *');
  });

  it('calls onChange when typing', () => {
    render(<Input value="" onChange={mockOnChange} testID="input" />);
    const input = screen.getByTestId('input-input');
    fireEvent.changeText(input, 'hello');
    expect(mockOnChange).toHaveBeenCalledWith('hello');
  });

  it('renders password visibility toggle when passwordField prop is present and value exists', () => {
    render(
      <Input
        value="secret"
        onChange={mockOnChange}
        passwordField={{
          visibilityValue: true,
          onPasswordVisibilityChange: mockTogglePasswordVisibility,
        }}
        testID="input"
      />
    );

    const toggleButton = screen.getByTestId('input-password-toggle');
    expect(toggleButton).toBeTruthy();

    fireEvent.press(toggleButton);
    expect(mockTogglePasswordVisibility).toHaveBeenCalledTimes(1);
  });

  it('renders clear button when value is present and onClear is provided', () => {
    render(<Input value="something" onChange={mockOnChange} onClear={mockOnClear} testID="input" />);

    const clearButton = screen.getByTestId('input-clear-button');
    expect(clearButton).toBeTruthy();

    fireEvent.press(clearButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('does not render clear or password toggle if value is empty', () => {
    render(<Input value="" onChange={mockOnChange} onClear={mockOnClear} testID="input" />);

    expect(() => screen.getByTestId('input-clear-button')).toThrow();
    expect(() => screen.getByTestId('input-password-toggle')).toThrow();
  });

  it('applies error border style when error is passed', () => {
    const { getByTestId } = render(<Input value="test" error="Error message" onChange={mockOnChange} testID="input" />);

    const wrapper = getByTestId('input-wrapper');
    expect(wrapper.props.className).toContain('border-red-500');
  });
});
