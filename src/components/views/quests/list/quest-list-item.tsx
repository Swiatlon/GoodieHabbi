import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import UpdateQuestModal from '../quest-form/update-quest-modal';
import QuestItemCompletion from '../reusable/quest-item/quest-item-completion';
import QuestItemContainer from '../reusable/quest-item/quest-item-container';
import QuestItemDate from '../reusable/quest-item/quest-item-date';
import QuestItemDifficulty from '../reusable/quest-item/quest-item-difficulty';
import QuestItemEmoji from '../reusable/quest-item/quest-item-emoji';
import QuestItemPeriod from '../reusable/quest-item/quest-item-period';
import QuestItemPriority from '../reusable/quest-item/quest-item-priority';
import QuestItemSchedule from '../reusable/quest-item/quest-item-schedule';
import QuestItemScheduledTime from '../reusable/quest-item/quest-item-scheduled-time';
import QuestItemTag from '../reusable/quest-item/quest-item-tag';
import QuestItemTitle from '../reusable/quest-item/quest-item-title';
import QuestShowModal from './quest-show-modal';
import { IQuest } from '@/contract/quests/quest.contract';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface QuestListItemProps {
  quest: IQuest;
  /** Today's list already filters by schedule, so repeating the recurrence line there is noise. */
  withSchedule?: boolean;
}

/**
 * One row for every quest, on every screen. The five per-type items it replaces differed only in which
 * badge they rendered, which is now a single `QuestItemSchedule`.
 */
const QuestListItem: React.FC<QuestListItemProps> = ({ quest, withSchedule = true }) => {
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const openShowModal = () => setIsShowModalVisible(true);
  const closeShowModal = () => setIsShowModalVisible(false);
  const closeUpdateModal = () => setIsUpdateModalVisible(false);

  const animatedStyle = useTransformFade({});

  return (
    <>
      <QuestItemContainer style={animatedStyle} completed={quest.isCompleted}>
        <View className="flex-1 flex-row items-center">
          <TouchableOpacity onPress={openShowModal} className="flex-1" testID="quest-item-touchable">
            <View className="flex-row items-center gap-2">
              <QuestItemEmoji emoji={quest.emoji} />
              <View className="flex-1 gap-2">
                <QuestItemTitle title={quest.title} isCompleted={quest.isCompleted} />
                {withSchedule && <QuestItemSchedule schedule={quest.schedule} target={quest.target} onPress={openShowModal} />}
                <QuestItemPeriod period={quest.currentPeriod} target={quest.target} />
                <QuestItemPriority priority={quest.priority} />
                <QuestItemDate startDate={quest.startDate} endDate={quest.endDate} />
                <QuestItemScheduledTime scheduledTime={quest.scheduledTime} endDate={quest.endDate} />
                <QuestItemDifficulty difficulty={quest.difficulty} />
                <QuestItemTag tags={quest.labels} onPress={openShowModal} />
              </View>
            </View>
          </TouchableOpacity>
          <QuestItemCompletion quest={quest} />
        </View>
      </QuestItemContainer>

      <QuestShowModal
        quest={quest}
        isVisible={isShowModalVisible}
        onClose={closeShowModal}
        onUpdate={() => {
          closeShowModal();
          setIsUpdateModalVisible(true);
        }}
      />
      {isUpdateModalVisible && <UpdateQuestModal isVisible={isUpdateModalVisible} onClose={closeUpdateModal} quest={quest} />}
    </>
  );
};

export default QuestListItem;
