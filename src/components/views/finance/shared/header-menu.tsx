import React, { useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoniconName } from '@/utils/icons/ionicon-name';

export interface HeaderMenuItem {
  icon: IoniconName;
  label: string;
  onPress: () => void;
  tintColor?: string;
  showDot?: boolean;
}

interface HeaderMenuProps {
  items: HeaderMenuItem[];
  accessibilityLabel: string;
}

// Rendered in a Modal (its own native layer) rather than positioned inline, so the dropdown
// isn't clipped by the ScrollView/overflow-hidden ancestors it opens from.
const HeaderMenu: React.FC<HeaderMenuProps> = ({ items, accessibilityLabel }) => {
  const buttonRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, right: 0 });

  const openMenu = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      // +10 instead of a token +4 — the button sits right above the month-chip row, so the dropdown needs
      // real breathing room or it visually lands on top of the chip directly beneath it.
      // Math.max(..., 12) keeps a minimum margin from the screen edge instead of running flush against it.
      setAnchor({ top: y + height + 10, right: Math.max(Dimensions.get('window').width - (x + width), 12) });
      setIsOpen(true);
    });
  };

  return (
    <>
      <TouchableOpacity ref={buttonRef} onPress={openMenu} className="px-2.5 py-1.5 rounded-lg bg-gray-100" accessibilityLabel={accessibilityLabel}>
        <Ionicons name="ellipsis-vertical" size={16} color="#4b5563" />
      </TouchableOpacity>

      {/* A dim backdrop (matching the app's shared Modal) instead of a fully transparent one — without it the
          dropdown has no visual cue that it's an overlay and reads as if it collided with the chip row below it. */}
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable className="flex-1 bg-black/20" onPress={() => setIsOpen(false)}>
          <View className="absolute bg-white rounded-xl shadow-lg py-3 min-w-[220px]" style={{ top: anchor.top, right: anchor.right }}>
            {items.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  setIsOpen(false);
                  item.onPress();
                }}
                className={`flex-row items-center gap-3 px-4 pt-3.5 pb-6 ${idx < items.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="w-5 items-center">
                  <Ionicons name={item.icon} size={16} color={item.tintColor ?? '#4b5563'} />
                </View>
                <Text className="text-sm text-gray-700 flex-1">{item.label}</Text>
                {item.showDot && <View className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default HeaderMenu;
