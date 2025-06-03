/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import AppBar from './app-bar';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  ParamListBase: {},
}));

jest.mock('@/hooks/animations/use-transform-fade-in', () => ({
  useTransformFade: jest.fn(),
}));

jest.mock('@/utils/jwt-utils', () => ({
  useIsCorrectAccessToken: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    View: (props: { children: React.ReactNode }) => <>{props.children}</>,
  },
}));

// Mock image assets
jest.mock('@/assets/images/exampleUserIcon.png', () => 'exampleUserIcon');
jest.mock('@/assets/images/logoheader.png', () => 'logoHeader');

describe('AppBar Component', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    toggleDrawer: jest.fn(),
  };

  const mockUseTransformFade = useTransformFade as jest.MockedFunction<typeof useTransformFade>;
  const mockUseIsCorrectAccessToken = useIsCorrectAccessToken as jest.MockedFunction<typeof useIsCorrectAccessToken>;
  const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;

  const defaultAnimatedStyle = { opacity: 1, transform: [{ translateX: 0 }] };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseNavigation.mockReturnValue(mockNavigation);
    mockUseTransformFade.mockReturnValue(defaultAnimatedStyle);
    mockUseIsCorrectAccessToken.mockReturnValue({ isCorrect: true, accessToken: 'mock-token' });
  });

  describe('Rendering', () => {
    it('renders menu button correctly', () => {
      render(<AppBar />);

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton).toBeTruthy();
    });

    it('renders logo image correctly', () => {
      render(<AppBar />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toBeTruthy();
    });

    it('renders profile image when authenticated', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: true,
        accessToken: 'mock-token',
      });

      render(<AppBar />);

      const profileImage = screen.getByTestId('profile-image');
      expect(profileImage).toBeTruthy();
    });

    it('renders profile section with opacity-100 when authenticated', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: true,
        accessToken: 'mock-token',
      });

      render(<AppBar />);
      const profileSection = screen.getByTestId('profile-section');
      expect(profileSection.props.className).toMatch(/opacity-100/);
    });

    it('renders profile section with opacity-0 when not authenticated', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: false,
        accessToken: null,
      });

      render(<AppBar />);

      const profileSection = screen.getByTestId('profile-section');
      expect(profileSection.props.className).toMatch(/opacity-0/);
    });
  });

  describe('Authentication States', () => {
    it('handles authenticated state correctly', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: true,
        accessToken: 'mock-token',
      });

      render(<AppBar />);

      expect(mockUseTransformFade).toHaveBeenCalledWith({
        direction: 'left',
        isContentLoading: false,
      });
    });

    it('handles unauthenticated state correctly', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: false,
        accessToken: null,
      });

      render(<AppBar />);

      expect(mockUseTransformFade).toHaveBeenCalledWith({
        direction: 'left',
        isContentLoading: true,
      });
    });
  });

  describe('Navigation Interactions', () => {
    it('calls navigation.toggleDrawer when menu button is pressed', () => {
      render(<AppBar />);

      const menuButton = screen.getByTestId('menu-button');
      fireEvent.press(menuButton);

      expect(mockNavigation.toggleDrawer).toHaveBeenCalledTimes(1);
    });

    it('navigates to dashboard when logo is clicked and user is authenticated', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: true,
        accessToken: 'mock-token',
      });

      render(<AppBar />);

      const logoContainer = screen.getByTestId('logo-container');
      fireEvent.press(logoContainer);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('(authorized)/dashboard');
    });

    it('navigates to login when logo is clicked and user is not authenticated', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: false,
        accessToken: null,
      });

      render(<AppBar />);

      const logoContainer = screen.getByTestId('logo-container');
      fireEvent.press(logoContainer);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('(not-authorized)/login');
    });

    it('navigates to profile when profile image is clicked', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: true,
        accessToken: 'mock-token',
      });

      render(<AppBar />);

      const profileContainer = screen.getByTestId('profile-container');
      fireEvent.press(profileContainer);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('(authorized)/profile');
    });
  });

  describe('Animation Hook Calls', () => {
    it('calls useTransformFade with correct parameters for menu animation', () => {
      render(<AppBar />);

      expect(mockUseTransformFade).toHaveBeenCalledWith({ direction: 'right' });
    });

    it('calls useTransformFade with correct parameters for logo animation', () => {
      render(<AppBar />);

      expect(mockUseTransformFade).toHaveBeenCalledWith({ direction: 'bottom' });
    });

    it('calls useTransformFade with correct parameters for profile animation when authenticated', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: true,
        accessToken: 'mock-token',
      });

      render(<AppBar />);

      expect(mockUseTransformFade).toHaveBeenCalledWith({
        direction: 'left',
        isContentLoading: false,
      });
    });

    it('calls useTransformFade with correct parameters for profile animation when not authenticated', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: false,
        accessToken: null,
      });

      render(<AppBar />);

      expect(mockUseTransformFade).toHaveBeenCalledWith({
        direction: 'left',
        isContentLoading: true,
      });
    });
  });

  describe('Hook Dependencies', () => {
    it('calls useNavigation hook', () => {
      render(<AppBar />);

      expect(mockUseNavigation).toHaveBeenCalledTimes(1);
    });

    it('calls useIsCorrectAccessToken hook', () => {
      render(<AppBar />);

      expect(mockUseIsCorrectAccessToken).toHaveBeenCalledTimes(1);
    });

    it('calls useTransformFade hook three times for different animations', () => {
      render(<AppBar />);

      expect(mockUseTransformFade).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge Cases', () => {
    it('handles navigation error gracefully', () => {
      const mockNavigationWithError = {
        ...mockNavigation,
        navigate: jest.fn(() => {
          throw new Error('Navigation error');
        }),
      };

      mockUseNavigation.mockReturnValue(mockNavigationWithError);

      render(<AppBar />);

      const logoContainer = screen.getByTestId('logo-container');

      expect(() => fireEvent.press(logoContainer)).toThrow('Navigation error');
    });

    it('handles toggleDrawer error gracefully', () => {
      const mockNavigationWithError = {
        ...mockNavigation,
        toggleDrawer: jest.fn(() => {
          throw new Error('Toggle drawer error');
        }),
      };

      mockUseNavigation.mockReturnValue(mockNavigationWithError);

      render(<AppBar />);

      const menuButton = screen.getByTestId('menu-button');

      expect(() => fireEvent.press(menuButton)).toThrow('Toggle drawer error');
    });
  });

  describe('Image Properties', () => {
    it('renders logo image with correct dimensions and resize mode', () => {
      render(<AppBar />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage.props.style).toEqual({ width: 50, height: 50 });
      expect(logoImage.props.resizeMode).toBe('contain');
    });

    it('renders profile image with correct dimensions and resize mode', () => {
      mockUseIsCorrectAccessToken.mockReturnValue({
        isCorrect: true,
        accessToken: 'mock-token',
      });

      render(<AppBar />);

      const profileImage = screen.getByTestId('profile-image');
      expect(profileImage.props.style).toEqual({ width: 50, height: 50 });
      expect(profileImage.props.resizeMode).toBe('contain');
    });
  });
});
