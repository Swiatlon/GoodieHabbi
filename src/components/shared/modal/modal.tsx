import React, { useEffect } from 'react';
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Portal } from 'react-native-portalize';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../icon-button/icon-button';
import Loader from '../loader/loader';

export interface IBaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  testID?: string;
}

interface ModalProps extends IBaseModalProps {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children, className = '', footer, isLoading, loadingMessage, testID }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
      translateY.value = withTiming(50, { duration: 200 });
    }
  }, [isVisible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleBackdropPress = () => {
    if (isLoading) return;

    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.8, { duration: 200 });
    translateY.value = withTiming(50, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Portal>
      <View className="h-full w-full flex justify-center items-center" testID={testID}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View className="bg-black/50 absolute top-0 left-0 h-full w-full" style={backdropStyle} />
        </TouchableWithoutFeedback>
        <Animated.View className={`w-11/12 bg-white rounded-lg shadow-lg max-h-[90vh] m-auto py-6 px-4 ${className}`} style={modalStyle}>
          {isLoading && <Loader size="large" message={loadingMessage || 'Loading...'} fullscreen />}
          <View className="absolute top-[14px] right-2 z-20">
            <IconButton onPress={handleBackdropPress} icon={<Ionicons name="close-outline" size={24} color="#1987EE" />} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 0, position: 'relative', display: 'flex', flexGrow: 1 }}>
            <View className="h-full">{children}</View>
          </ScrollView>
          {footer && !isLoading && <View className="mt-4 px-4">{footer}</View>}
        </Animated.View>
      </View>
    </Portal>
  );
};

export default Modal;
