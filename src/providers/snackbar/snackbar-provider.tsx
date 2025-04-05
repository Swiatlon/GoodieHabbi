import React, { useState } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Ionicons } from '@expo/vector-icons';
import { SnackbarContext, SnackbarOptions, SnackbarVariantEnum, SnackbarVariantEnumType } from './snackbar-context';

const getSnackbarStyle = (variant?: SnackbarVariantEnumType) => {
  switch (variant) {
    case SnackbarVariantEnum.SUCCESS:
      return 'bg-success';
    case SnackbarVariantEnum.ERROR:
      return 'bg-error';
    case SnackbarVariantEnum.INFO:
    default:
      return 'bg-primary';
  }
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarOptions | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  const showSnackbar = ({ text, variant = SnackbarVariantEnum.INFO }: SnackbarOptions) => {
    setSnackbar({ text, variant });
    setIsVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        setSnackbar(null);
      });
    }, 3000);
  };

  const handleCloseSnackbar = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      setSnackbar(null);
    });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {isVisible && snackbar && (
        <Portal>
          <Animated.View className="flex items-center absolute top-4 left-0 right-0" style={{ opacity: fadeAnim }}>
            <View className={`rounded-lg p-4 shadow-md w-11/12 m-4 flex-row items-center justify-between ${getSnackbarStyle(snackbar.variant)}`}>
              <Text className="text-white font-bold flex-1">{snackbar.text}</Text>
              <TouchableOpacity onPress={handleCloseSnackbar}>
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Portal>
      )}

      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
