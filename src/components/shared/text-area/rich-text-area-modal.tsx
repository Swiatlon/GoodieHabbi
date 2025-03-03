import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import Modal, { IBaseModalProps } from '../modal/modal';

interface RichTextAreaModalModalProps extends IBaseModalProps {
  label: string;
  onChange: (e: string) => void;
  value?: string;
}

const RichTextAreaModal: React.FC<RichTextAreaModalModalProps> = ({ isVisible, onClose, onChange, value, label }) => {
  const [initialValue] = useState(value);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: initialValue || '',
    onChange: async () => {
      onChange(await editor.getHTML());
    },
  });

  return (
    <Modal isVisible={isVisible} onClose={onClose} className="w-full h-full pt-4 pb-0">
      <View className="flex h-full relative">
        <View className="pt-4 h-full">
          <Text className="text-base font-semibold mb-3 text-gray-500 mt-1">{label}</Text>
          <RichText editor={editor} />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={exampleStyles.keyboardAvoidingView}>
          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default RichTextAreaModal;

const exampleStyles = StyleSheet.create({
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
