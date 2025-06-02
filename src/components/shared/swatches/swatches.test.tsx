import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Swatches from './swatches';

describe('Swatches Component', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders all color swatches', () => {
    const { getByTestId } = render(<Swatches selectedColor="#1987EE" onSelect={mockOnSelect} />);
    const swatches = [
      '#1987EE',
      '#4b465d',
      '#47B64E',
      '#C8102E',
      '#8A2BE2',
      '#000000',
      '#FFD700',
      '#FF1493',
      '#20B2AA',
      '#D2691E',
      '#A52A2A',
      '#800080',
      '#C71585',
      '#2F4F4F',
    ];

    swatches.forEach(color => {
      expect(getByTestId(`swatch-${color}`)).toBeTruthy();
    });
  });

  it('highlights the selected color with a checkmark', () => {
    const { getByText } = render(<Swatches selectedColor="#FFD700" onSelect={mockOnSelect} />);
    expect(getByText('✓')).toBeTruthy();
  });

  it('calls onSelect when a swatch is pressed', () => {
    const { getByTestId } = render(<Swatches selectedColor="#000000" onSelect={mockOnSelect} />);
    fireEvent.press(getByTestId('swatch-#1987EE'));
    expect(mockOnSelect).toHaveBeenCalledWith('#1987EE');
  });

  it('does not show checkmark for unselected colors', () => {
    const { queryAllByText } = render(<Swatches selectedColor="#D2691E" onSelect={mockOnSelect} />);
    const checkmarks = queryAllByText('✓');
    expect(checkmarks).toHaveLength(1);
  });

  it('updates selected color when a new swatch is pressed', () => {
    const { getByTestId, rerender, queryAllByText } = render(<Swatches selectedColor="#FFD700" onSelect={mockOnSelect} />);

    fireEvent.press(getByTestId('swatch-#4b465d'));
    expect(mockOnSelect).toHaveBeenCalledWith('#4b465d');

    rerender(<Swatches selectedColor="#4b465d" onSelect={mockOnSelect} />);
    expect(queryAllByText('✓')).toHaveLength(1);
  });
});
