import React, { useState } from 'react';
import { View } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import Select from '@/components/shared/select/Select';

interface EmojiPickerComponentProps {
  selectedEmoji: string | null;
  onEmojiSelected: (emoji: string | null) => void;
}

const EmojiPickerComponent: React.FC<EmojiPickerComponentProps> = ({ selectedEmoji, onEmojiSelected }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlePick = (emojiObject: EmojiType) => {
    onEmojiSelected(emojiObject.emoji);
    setIsOpen(false);
  };

  return (
    <View>
      <Select
        placeholder="Tap to pick emoji for quest"
        placeholderWhenSelected="Emoji"
        value={selectedEmoji}
        onPress={() => setIsOpen(true)}
        onClear={() => onEmojiSelected(null)}
      />

      <EmojiPicker
        open={isOpen}
        onEmojiSelected={handlePick}
        onClose={() => setIsOpen(false)}
        enableSearchBar
        enableRecentlyUsed
        categoryPosition="top"
        emojiSize={24}
        expandedHeight="50%"
        disableSafeArea
        theme={{
          knob: '#1987EE',
          container: '#ffffff',
          header: '#1987EE',
          category: {
            icon: '#ffffff',
            iconActive: '#1987EE',
            container: '#1987EE',
            containerActive: '#ffffff',
          },
        }}
      />
    </View>
  );
};

export default EmojiPickerComponent;
