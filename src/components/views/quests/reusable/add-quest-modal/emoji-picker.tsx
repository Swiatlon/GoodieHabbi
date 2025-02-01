import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import ControlledSelect from '@/components/shared/select/controlled-select';

interface EmojiPickerComponentProps {
  formVersion?: boolean;
  label?: string;
  name: string;
}

const EmojiPickerComponent: React.FC<EmojiPickerComponentProps> = ({ name, formVersion, label }) => {
  const { setValue } = useFormContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlePick = (emojiObject: EmojiType) => {
    setValue(name, emojiObject.emoji);
    setIsOpen(false);
  };

  return (
    <View className="flex gap-2">
      {formVersion && label && <Text className="text-sm font-semibold text-gray-500">{label}</Text>}
      <ControlledSelect
        name={name}
        placeholder="Tap to pick emoji for quest"
        isEditable={false}
        onPress={() => setIsOpen(true)}
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
