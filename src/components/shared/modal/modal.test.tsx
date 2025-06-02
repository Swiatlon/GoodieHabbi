import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Button from '../button/button';
import Modal from './modal';

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(async () => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock('react-native-portalize', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Modal Component', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  it('does not render when isVisible is false', () => {
    const { queryByTestId } = render(
      <Modal isVisible={false} onClose={onCloseMock} testID="modal">
        <></>
      </Modal>
    );
    expect(queryByTestId('modal')).toBeNull();
  });

  it('renders children when visible', () => {
    const { getByText } = render(
      <Modal isVisible={true} onClose={onCloseMock} testID="modal">
        <Text>Modal Content</Text>
      </Modal>
    );
    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('calls onClose when backdrop is pressed and not loading', async () => {
    const { getByTestId } = render(
      <Modal isVisible={true} onClose={onCloseMock} testID="modal">
        <></>
      </Modal>
    );

    const backdrop = getByTestId('modal').findByProps({ className: 'bg-black/50 absolute top-0 left-0 h-full w-full' });

    if (backdrop.parent) {
      fireEvent.press(backdrop.parent);
    } else {
      throw new Error('Backdrop parent is null');
    }

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('does not call onClose when backdrop pressed if loading', () => {
    const { getByTestId } = render(
      <Modal isVisible={true} onClose={onCloseMock} isLoading={true} testID="modal">
        <></>
      </Modal>
    );

    const backdrop = getByTestId('modal').findByProps({ className: 'bg-black/50 absolute top-0 left-0 h-full w-full' });

    if (backdrop.parent) {
      fireEvent.press(backdrop.parent);
    } else {
      throw new Error('Backdrop parent is null');
    }

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('renders loading indicator and message when isLoading is true', () => {
    const { getByText } = render(
      <Modal isVisible={true} onClose={onCloseMock} isLoading={true} loadingMessage="Please wait...">
        <></>
      </Modal>
    );

    expect(getByText('Please wait...')).toBeTruthy();
  });

  it('renders footer content when provided and not loading', () => {
    const { getByText } = render(
      <Modal isVisible={true} onClose={onCloseMock} footer={<Text>Footer Content</Text>} testID="modal">
        <></>
      </Modal>
    );

    expect(getByText('Footer Content')).toBeTruthy();
  });

  it('does not render footer when loading', () => {
    const { queryByText } = render(
      <Modal isVisible={true} onClose={onCloseMock} footer={<Text>Footer Content</Text>} isLoading testID="modal">
        <></>
      </Modal>
    );

    expect(queryByText('Footer Content')).toBeNull();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <Modal
        isVisible={true}
        onClose={onCloseMock}
        testID="modal"
        footer={<Button testID="modal-close-button" label="Close" onPress={onCloseMock} />}
      >
        <></>
      </Modal>
    );

    const closeButton = getByTestId('modal-close-button');
    fireEvent.press(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
