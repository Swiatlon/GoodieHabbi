import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';

interface DayPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (day: number) => void;
  selectedDay: number | null;
  label: string;
}

const DayPickerModal: React.FC<DayPickerModalProps> = ({ isVisible, onClose, onConfirm, selectedDay, label }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Generate numbers 1 to 31

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="bg-white rounded-lg p-4">
        <Text className="text-lg font-bold text-center mb-4">{label}</Text>
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {days.map(day => (
            <TouchableOpacity
              key={day}
              onPress={() => onConfirm(day)}
              className={`w-12 h-12 m-1 rounded-full justify-center items-center ${
                day === selectedDay ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <Text className={`text-sm font-bold ${day === selectedDay ? 'text-white' : 'text-gray-700'}`}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View className="flex-row justify-between mt-4">
          <Button label="Cancel" onPress={onClose} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2" />
        </View>
      </View>
    </Modal>
  );
};

export default DayPickerModal;
