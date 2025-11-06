import { render, fireEvent, screen } from '@testing-library/react-native';
import { IconButton } from './icon-button';

describe('IconButton Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly', () => {
    render(<IconButton onPress={mockOnPress} testID="icon-button" className="custom-class" />);

    const button = screen.getByTestId('icon-button');
    expect(button).toBeTruthy();
    // In React Native, className is not a valid prop; check for testID or other props instead
    expect(button.props.testID).toBe('icon-button');
  });

  it('calls onPress when pressed', () => {
    render(<IconButton onPress={mockOnPress} testID="icon-button-press" />);

    const button = screen.getByTestId('icon-button-press');
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders with children', () => {
    render(
      <IconButton onPress={mockOnPress} testID="icon-button-both">
        <>Child</>
      </IconButton>
    );

    const button = screen.getByTestId('icon-button-both');
    expect(button).toBeTruthy();
  });
});
