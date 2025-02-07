import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AddDailyQuestModal from '../../daily/quest-modals/add-daily-quest-modal';
import AddMonthlyQuestModal from '../../monthly/quest-modals/add-monthly-quest-modal';
import AddOneTimeQuestModal from '../../one-time/quest-modals/add-one-time-quest-modal';
import AddSeasonalQuestModal from '../../seasonal/quest-modals/add-seasonal-quest-modal';
import AddWeeklyQuestModal from '../../weekly/quest-modals/add-weekly-quest-modal';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import { QuestTypesEnum, QuestTypesEnumType } from '@/contract/quests/base-quests';

interface AddAllQuestModalProps extends IBaseModalProps {}

const questIcons: Record<QuestTypesEnumType, { icon: string; color: string }> = {
  [QuestTypesEnum.ONE_TIME]: { icon: 'flag-checkered', color: 'bg-red-600' },
  [QuestTypesEnum.SEASONAL]: { icon: 'leaf', color: 'bg-green-600' },
  [QuestTypesEnum.MONTHLY]: { icon: 'calendar-alt', color: 'bg-purple-600' },
  [QuestTypesEnum.DAILY]: { icon: 'sun', color: 'bg-yellow-600' },
  [QuestTypesEnum.WEEKLY]: { icon: 'calendar-week', color: 'bg-orange-600' },
};

const AddAllQuestModal = ({ isVisible, onClose }: AddAllQuestModalProps) => {
  const [selectedQuestType, setSelectedQuestType] = useState<QuestTypesEnumType | null>(null);

  const handleClose = () => {
    setSelectedQuestType(null);
    onClose();
  };

  const renderQuestSelection = () => (
    <View className="bg-white rounded-lg px-4 py-6 gap-4">
      <Text className="text-lg font-bold text-center">Select Quest Type</Text>
      <FlatList
        data={Object.values(QuestTypesEnum)}
        keyExtractor={item => item}
        renderItem={({ item }) => {
          const { icon, color } = questIcons[item as QuestTypesEnumType];

          return (
            <TouchableOpacity
              className={`flex-row items-center justify-center py-3 px-4 ${color} rounded-lg my-2`}
              onPress={() => setSelectedQuestType(item as QuestTypesEnumType)}
              activeOpacity={0.8}
            >
              <FontAwesome5 name={icon} size={20} color="white" className="mr-3" />
              <Text className="text-white text-lg font-semibold">{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      {!selectedQuestType ? renderQuestSelection() : null}
      {selectedQuestType === QuestTypesEnum.ONE_TIME && <AddOneTimeQuestModal isVisible={true} onClose={handleClose} />}
      {selectedQuestType === QuestTypesEnum.SEASONAL && <AddSeasonalQuestModal isVisible={true} onClose={handleClose} />}
      {selectedQuestType === QuestTypesEnum.MONTHLY && <AddMonthlyQuestModal isVisible={true} onClose={handleClose} />}
      {selectedQuestType === QuestTypesEnum.DAILY && <AddDailyQuestModal isVisible={true} onClose={handleClose} />}
      {selectedQuestType === QuestTypesEnum.WEEKLY && <AddWeeklyQuestModal isVisible={true} onClose={handleClose} />}
    </Modal>
  );
};

export default AddAllQuestModal;
