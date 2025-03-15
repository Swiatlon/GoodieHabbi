import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  const [isVisibleForAddModals, setIsVisibleForAddModals] = useState(false);

  const handleClose = () => {
    setIsVisibleForAddModals(false);
    setSelectedQuestType(null);
    onClose();
  };

  const openQuestModal = (questType: QuestTypesEnumType) => {
    onClose();
    setSelectedQuestType(questType);
    setIsVisibleForAddModals(true);
  };

  const renderQuestSelection = () => (
    <View className="bg-white rounded-lg px-4 gap-5 py-2">
      <Text className="text-lg font-bold text-center">Select Quest Type</Text>
      {Object.values(QuestTypesEnum).map(item => {
        const { icon, color } = questIcons[item as QuestTypesEnumType];

        return (
          <TouchableOpacity
            key={item}
            className={`flex-row items-center justify-center py-3 px-4 ${color} rounded-lg`}
            onPress={() => openQuestModal(item as QuestTypesEnumType)}
            activeOpacity={0.8}
          >
            <FontAwesome5 name={icon} size={20} color="white" className="mr-3" />
            <Text className="text-white text-lg font-semibold">{item}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <>
      <Modal isVisible={isVisible} onClose={onClose}>
        {!isVisibleForAddModals && renderQuestSelection()}
      </Modal>

      {selectedQuestType === QuestTypesEnum.ONE_TIME && <AddOneTimeQuestModal isVisible={isVisibleForAddModals} onClose={handleClose} />}
      {selectedQuestType === QuestTypesEnum.SEASONAL && <AddSeasonalQuestModal isVisible={isVisibleForAddModals} onClose={handleClose} />}
      {selectedQuestType === QuestTypesEnum.MONTHLY && <AddMonthlyQuestModal isVisible={isVisibleForAddModals} onClose={handleClose} />}
      {selectedQuestType === QuestTypesEnum.DAILY && <AddDailyQuestModal isVisible={isVisibleForAddModals} onClose={handleClose} />}
      {selectedQuestType === QuestTypesEnum.WEEKLY && <AddWeeklyQuestModal isVisible={isVisibleForAddModals} onClose={handleClose} />}
    </>
  );
};

export default AddAllQuestModal;
