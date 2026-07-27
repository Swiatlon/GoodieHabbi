import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Loader from '@/components/shared/loader/loader';
import PodiumUser from '@/components/views/leaderboard/podium-user';
import RegularLeaderboardItem from '@/components/views/leaderboard/regular-leaderboard-item';
import { useGetLeaderboardXPQuery } from '@/redux/api/leaderboard/leaderboard-api';

const Leaderboard = () => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { data = [], isLoading, refetch } = useGetLeaderboardXPQuery();

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  if (isLoading) {
    return <Loader message={t('leaderboard.loading')} />;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <Text className="text-center text-gray-500 mt-8">{t('leaderboard.noUsers')}</Text>;
  }

  const topThree = data.slice(0, 3);
  const reordered = [topThree[1], topThree[0], topThree[2]];
  const remaining = data.slice(3);

  return (
    <View className="flex-1 px-4 py-6">
      <Text className="text-2xl font-bold text-primary text-center mb-6">🏆 {t('leaderboard.title')}</Text>
      <FlatList
        data={remaining}
        keyExtractor={(item, index) => `${item.nickname}-${index + 3}`}
        ListHeaderComponent={
          <View className="mb-8">
            <View className="flex-row justify-center items-end mb-8">
              {reordered.map((user, i) => (
                <PodiumUser key={user.nickname} nickname={user.nickname} xp={user.xp} position={[1, 0, 2][i]} delay={i * 300} />
              ))}
            </View>
            {remaining.length > 0 && (
              <>
                <View className="h-px bg-gray-300" />
                <Text className="text-center text-gray-500 text-sm mt-2">{t('leaderboard.otherRankings')}</Text>
              </>
            )}
          </View>
        }
        renderItem={({ item, index }) => <RegularLeaderboardItem nickname={item.nickname} xp={item.xp} index={index + 3} />}
      />
    </View>
  );
};

export default Leaderboard;
