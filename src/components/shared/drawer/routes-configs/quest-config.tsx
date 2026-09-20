import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

/**
 * Four entries where there used to be nine. The Daily / Weekly / Monthly / Seasonal / One-time split
 * stopped being a split once a quest could be "twice a week, any days" or "every other day" — neither
 * had a screen to live on. Those distinctions are now chips on the Habits list.
 */
const QuestConfig = () => {
  const { t } = useTranslation();

  return (
    <CustomDrawerItem
      label={t('nav.quests.root')}
      icon={<Ionicons name="trophy-outline" />}
      defaultOpen
      items={[
        {
          label: t('nav.quests.today'),
          route: '(authorized)/quests/today',
          icon: <Ionicons name="today-outline" />,
        },
        {
          label: t('nav.quests.all'),
          icon: <Ionicons name="repeat-outline" />,
          route: '(authorized)/quests/all',
        },
        {
          label: t('nav.quests.analytics'),
          route: '(authorized)/quests/analytics',
          icon: <Ionicons name="stats-chart-outline" />,
        },
        {
          label: t('nav.quests.tags'),
          route: '(authorized)/quests/tags',
          icon: <Ionicons name="pricetags-outline" />,
        },
      ]}
    />
  );
};

export default QuestConfig;
