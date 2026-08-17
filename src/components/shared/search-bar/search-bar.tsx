import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  testID?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder, testID }) => (
  <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3">
    <Ionicons name="search-outline" size={16} color="#9ca3af" />
    <TextInput
      className="flex-1 py-2.5 px-2 text-sm text-gray-800"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      testID={testID}
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close-circle" size={16} color="#9ca3af" />
      </TouchableOpacity>
    )}
  </View>
);

export default SearchBar;
