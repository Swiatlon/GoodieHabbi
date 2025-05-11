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
  min?: number;
  max?: number;
}

const days = Array.from({ length: 31 }, (_, i) => i + 1);

const DayPickerModal: React.FC<DayPickerModalProps> = ({ isVisible, onClose, onConfirm, selectedDay, label, min = 1, max = 31 }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="bg-white rounded-lg p-4">
        <Text className="text-lg font-bold text-center mb-4">{label}</Text>
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {days.map(day => {
            const isDisabled = day < min || day > max;

            return (
              <TouchableOpacity
                key={day}
                onPress={() => !isDisabled && onConfirm(day)}
                className={`w-12 h-12 m-1 rounded-full justify-center items-center ${day === selectedDay ? 'bg-blue-500' : 'bg-slate-200'} ${isDisabled ? 'opacity-20' : ''}`}
                disabled={isDisabled}
              >
                <Text className={`text-sm font-bold ${day === selectedDay ? 'text-white' : 'text-gray-700'} ${isDisabled ? 'text-gray-600' : ''}`}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View className="flex-row justify-between mt-4">
          <Button label="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default DayPickerModal;
