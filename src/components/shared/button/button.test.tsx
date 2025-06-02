/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Button from './button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button />);

      const button = screen.getByTestId('button');
      expect(button).toBeTruthy();
    });

    it('renders with custom testID', () => {
      render(<Button testID="custom-button" />);

      const button = screen.getByTestId('custom-button');
      expect(button).toBeTruthy();
    });

    it('renders with label', () => {
      render(<Button label="Click me" testID="test-button" />);

      const button = screen.getByTestId('test-button');
      const label = screen.getByTestId('test-button-label');

      expect(button).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label.props.children).toBe('Click me');
    });

    it('renders without label when not provided', () => {
      render(<Button testID="test-button" />);

      const button = screen.getByTestId('test-button');
      expect(button).toBeTruthy();

      expect(() => screen.getByTestId('test-button-label')).toThrow();
    });

    it('renders start icon', () => {
      const StartIcon = () => <Text testID="start-icon">👈</Text>;

      render(<Button label="With Start Icon" startIcon={<StartIcon />} testID="icon-button" />);

      const startIconContainer = screen.getByTestId('start-icon');
      const startIcon = screen.getByTestId('start-icon');

      expect(startIconContainer).toBeTruthy();
      expect(startIcon).toBeTruthy();
    });

    it('renders end icon', () => {
      const EndIcon = () => <Text testID="end-icon">👉</Text>;

      render(<Button label="With End Icon" endIcon={<EndIcon />} testID="icon-button" />);

      const endIconContainer = screen.getByTestId('end-icon');
      const endIcon = screen.getByTestId('end-icon');

      expect(endIconContainer).toBeTruthy();
      expect(endIcon).toBeTruthy();
    });

    it('renders both start and end icons', () => {
      const StartIcon = () => <Text testID="start-icon">👈</Text>;
      const EndIcon = () => <Text testID="end-icon">👉</Text>;

      render(<Button label="With Both Icons" startIcon={<StartIcon />} endIcon={<EndIcon />} testID="both-icons-button" />);

      expect(screen.getByTestId('start-icon')).toBeTruthy();
      expect(screen.getByTestId('end-icon')).toBeTruthy();
      expect(screen.getByTestId('start-icon')).toBeTruthy();
      expect(screen.getByTestId('end-icon')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('calls onPress when pressed', () => {
      render(<Button label="Press me" onPress={mockOnPress} testID="pressable-button" />);

      const button = screen.getByTestId('pressable-button');
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      render(<Button label="Disabled button" onPress={mockOnPress} disabled={true} testID="disabled-button" />);

      const button = screen.getByTestId('disabled-button');
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when onPress is not provided', () => {
      render(<Button label="No handler" testID="no-handler-button" />);

      const button = screen.getByTestId('no-handler-button');

      // Should not throw error when pressed without onPress handler
      expect(() => fireEvent.press(button)).not.toThrow();
    });
  });

  describe('Style Types', () => {
    const styleTypes = ['primary', 'secondary', 'danger', 'accent'] as const;

    styleTypes.forEach(styleType => {
      it(`renders ${styleType} style correctly`, () => {
        render(<Button label={`${styleType} button`} styleType={styleType} testID={`${styleType}-button`} />);

        const button = screen.getByTestId(`${styleType}-button`);
        expect(button).toBeTruthy();
      });
    });
  });

  describe('Variants', () => {
    it('renders contained variant correctly', () => {
      render(<Button label="Contained" variant="contained" testID="contained-button" />);

      const button = screen.getByTestId('contained-button');
      expect(button).toBeTruthy();
    });

    it('renders outlined variant correctly', () => {
      render(<Button label="Outlined" variant="outlined" testID="outlined-button" />);

      const button = screen.getByTestId('outlined-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Style Type and Variant Combinations', () => {
    const combinations = [
      { styleType: 'primary', variant: 'contained' },
      { styleType: 'primary', variant: 'outlined' },
      { styleType: 'secondary', variant: 'contained' },
      { styleType: 'secondary', variant: 'outlined' },
      { styleType: 'danger', variant: 'contained' },
      { styleType: 'danger', variant: 'outlined' },
      { styleType: 'accent', variant: 'contained' },
      { styleType: 'accent', variant: 'outlined' },
    ] as const;

    combinations.forEach(({ styleType, variant }) => {
      it(`renders ${styleType} ${variant} combination correctly`, () => {
        render(<Button label={`${styleType} ${variant}`} styleType={styleType} variant={variant} testID={`${styleType}-${variant}-button`} />);

        const button = screen.getByTestId(`${styleType}-${variant}-button`);
        expect(button).toBeTruthy();
      });
    });
  });

  describe('Disabled State', () => {
    it('renders disabled button correctly', () => {
      render(<Button label="Disabled" disabled={true} testID="disabled-button" />);

      const button = screen.getByTestId('disabled-button');
      expect(button).toBeTruthy();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('renders enabled button correctly', () => {
      render(<Button label="Enabled" disabled={false} testID="enabled-button" />);

      const button = screen.getByTestId('enabled-button');
      expect(button).toBeTruthy();
      expect(button.props.disabled).toBeUndefined();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Button label="Custom Class" className="custom-class" testID="custom-class-button" />);

      const button = screen.getByTestId('custom-class-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label string', () => {
      render(<Button label="" testID="empty-label-button" />);

      const button = screen.getByTestId('empty-label-button');
      expect(button).toBeTruthy();

      // Empty label should not render label element
      expect(() => screen.getByTestId('empty-label-button-label')).toThrow();
    });

    it('handles undefined label', () => {
      render(<Button label={undefined} testID="undefined-label-button" />);

      const button = screen.getByTestId('undefined-label-button');
      expect(button).toBeTruthy();

      expect(() => screen.getByTestId('undefined-label-button-label')).toThrow();
    });

    it('handles complex onPress event', () => {
      const complexHandler = jest.fn(() => {
        // Handler logic can go here if needed
      });

      render(<Button label="Complex Handler" onPress={complexHandler} testID="complex-handler-button" />);

      const button = screen.getByTestId('complex-handler-button');
      fireEvent.press(button);

      expect(complexHandler).toHaveBeenCalledTimes(1);
    });
  });
});
