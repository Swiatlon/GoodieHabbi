import React, { useState } from 'react';
import { Text, View } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import Select from '@/components/shared/select/select';

interface EmojiPickerComponentProps {
  selectedEmoji: string | null;
  onEmojiSelected: (emoji: string | null) => void;
  formVersion?: boolean;
  label?: string;
}

const EmojiPickerComponent: React.FC<EmojiPickerComponentProps> = ({
  selectedEmoji,
  onEmojiSelected,
  formVersion,
  label,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlePick = (emojiObject: EmojiType) => {
    onEmojiSelected(emojiObject.emoji);
    setIsOpen(false);
  };

  return (
    <View className="flex gap-2">
      {formVersion && label && <Text className="text-sm font-semibold text-gray-500">{label}:</Text>}
      <Select
        placeholder="Tap to pick emoji for quest"
        placeholderWhenSelected=" "
        value={selectedEmoji}
        isEditable={false}
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
