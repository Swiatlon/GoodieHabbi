import React from 'react';
import { Host } from 'react-native-portalize';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ConfirmModal from './confirm-modal';

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(async () => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

const renderWithHost = (ui: React.ReactElement) => {
  return render(<Host>{ui}</Host>);
};

describe('ConfirmModal', () => {
  const mockOnAccept = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default title and message', () => {
    renderWithHost(<ConfirmModal isVisible={true} onAccept={mockOnAccept} onClose={mockOnClose} />);
    expect(screen.getByTestId('confirm-modal-title').props.children).toBe('Confirm Action');
    expect(screen.getByTestId('confirm-modal-message').props.children).toBe('Are you sure you want to proceed?');
  });

  it('calls onClose when cancel button is pressed', () => {
    renderWithHost(<ConfirmModal isVisible={true} onAccept={mockOnAccept} onClose={mockOnClose} />);
    fireEvent.press(screen.getByTestId('confirm-modal-cancel-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onAccept when save button is pressed', () => {
    renderWithHost(<ConfirmModal isVisible={true} onAccept={mockOnAccept} onClose={mockOnClose} />);
    fireEvent.press(screen.getByTestId('confirm-modal-accept-button'));
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  it('does not render when isVisible is false', () => {
    const { queryByTestId } = renderWithHost(<ConfirmModal isVisible={false} onAccept={mockOnAccept} onClose={mockOnClose} />);
    expect(queryByTestId('confirm-modal')).toBeNull();
  });
});
