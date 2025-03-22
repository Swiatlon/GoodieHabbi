import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface SwatchesProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

const Swatches: React.FC<SwatchesProps> = ({ selectedColor, onSelect }) => {
  const colors = [
    '#1987EE',
    '#4b465d',
    '#47B64E',
    '#C8102E',
    '#8A2BE2',
    '#000000',
    '#FFD700',

    '#FF1493',
    '#20B2AA',
    '#D2691E',
    '#A52A2A',
    '#800080',
    '#C71585',
    '#2F4F4F',
    //TODO: EASTER-EGG on white color
    // '#fff',
  ];

  return (
    <View className="flex flex-row flex-wrap gap-2">
      {colors.map(color => (
        <TouchableOpacity
          key={color}
          onPress={() => onSelect(color)}
          className={`w-10 h-10 rounded-full flex justify-center items-center border-2 ${
            color === selectedColor ? 'border-primary border-2' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
        >
          {color === selectedColor && <Text className="text-white font-bold">✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Swatches;
