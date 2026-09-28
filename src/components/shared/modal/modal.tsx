import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Portal } from 'react-native-portalize';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

/** Breathing room between the modal and the system bars, on top of the insets themselves. */
const SYSTEM_BAR_GAP = 16;

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children, className = '', footer, isLoading, loadingMessage, testID }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
      {/*
        The portal spans the whole screen, and on Android edge-to-edge that includes the area under the
        navigation bar — without the insets the footer buttons land behind it and a tap goes home instead.
      */}
      <View
        className="h-full w-full flex justify-center items-center"
        style={{ paddingTop: insets.top + SYSTEM_BAR_GAP, paddingBottom: insets.bottom + SYSTEM_BAR_GAP }}
        testID={testID}
      >
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View className="bg-black/50 absolute inset-0" style={backdropStyle} />
        </TouchableWithoutFeedback>
        <Animated.View className={`w-11/12 bg-white rounded-lg shadow-lg max-h-full m-auto py-6 px-4 ${className}`} style={modalStyle}>
          {isLoading && <Loader size="large" message={loadingMessage || t('common.loading')} fullscreen />}
          <View className="absolute top-[14px] right-2 z-20">
            <IconButton onPress={handleBackdropPress}>
              <Ionicons name="close-outline" size={24} color="#1987EE" />
            </IconButton>
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flexShrink: 1 }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 0, position: 'relative', display: 'flex', flexGrow: 1 }}
            >
              <View className="h-full">{children}</View>
            </ScrollView>
            {footer && !isLoading && <View className="mt-4 px-4">{footer}</View>}
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Portal>
  );
};

export default Modal;
