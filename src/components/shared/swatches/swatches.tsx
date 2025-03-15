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
    '#d32f2f',
    '#0000FF',
    '#4B0082',
    '#8A2BE2',
    '#00FFFF',
    '#FFC0CB',
    '#D3D3D3',
    '#000000',
    '#FFD700',
    '#FF6347',
    //TODO: EASTER-EGG on white color
    '#fff',
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
