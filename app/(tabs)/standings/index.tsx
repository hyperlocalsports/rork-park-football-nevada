import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Shield, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { getStandings, Team } from '@/constants/teams';
import AppHeader from '@/components/AppHeader';
import { useCity } from '@/providers/CityProvider';

const TeamRow = React.memo(({ team, rank, onPress }: { team: Team; rank: number; onPress: (id: string) => void }) => {
  const totalGames = team.wins + team.losses + team.ties;
  const winPct = totalGames > 0 ? (team.wins / totalGames).toFixed(3) : '.000';
  const heroImage = team.images[0]?.url;

  return (
    <Pressable
      onPress={() => onPress(team.id)}
      style={({ pressed }) => [
        styles.teamRow,
        pressed && { opacity: 0.8, backgroundColor: '#252525' },
      ]}
      testID={`standing-${team.id}`}
    >
      <View style={styles.rankCol}>
        <Text style={[
          styles.rankText,
          rank <= 3 && { color: '#8B7355' },
        ]}>
          {rank}
        </Text>
      </View>
      <View style={styles.teamInfoCol}>
        <View style={[styles.teamAvatar, { backgroundColor: '#252525' }]}>
          {heroImage ? (
            <Image source={{ uri: heroImage }} style={styles.teamAvatarImage} contentFit="cover" />
          ) : (
            <Shield color="#8B7355" size={16} />
          )}
        </View>
        <View style={styles.teamNameWrap}>
          <Text style={styles.teamMascot} numberOfLines={1}>{team.mascot.toUpperCase()}</Text>
          <Text style={styles.teamPark} numberOfLines={1}>
            {team.parkName}
          </Text>
        </View>
      </View>
      <View style={styles.statCol}>
        <Text style={styles.statValue}>{team.wins}</Text>
      </View>
      <View style={styles.statCol}>
        <Text style={styles.statValue}>{team.losses}</Text>
      </View>
      <View style={styles.statCol}>
        <Text style={styles.statValue}>{team.ties}</Text>
      </View>
      <View style={styles.pctCol}>
        <Text style={[styles.pctValue, rank <= 3 && { color: '#8B7355' }]}>
          {winPct}
        </Text>
      </View>
      <ChevronRight color="#4A4A4A" size={14} />
    </Pressable>
  );
});

export default function StandingsScreen() {
  const router = useRouter();
  const { selectedCity } = useCity();

  const standings = useMemo(() => getStandings(selectedCity), [selectedCity]);

  const handleTeamPress = useCallback((teamId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/team/[id]', params: { id: teamId } });
  }, [router]);

  return (
    <View style={styles.container}>
      <AppHeader />

      <View style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>STANDINGS · {selectedCity.toUpperCase()} DIVISION</Text>
      </View>

      <View style={styles.tableHeader}>
        <View style={styles.rankCol}>
          <Text style={styles.tableHeaderText}>#</Text>
        </View>
        <View style={styles.teamInfoCol}>
          <Text style={styles.tableHeaderText}>TEAM</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={styles.tableHeaderText}>W</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={styles.tableHeaderText}>L</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={styles.tableHeaderText}>T</Text>
        </View>
        <View style={styles.pctCol}>
          <Text style={styles.tableHeaderText}>PCT</Text>
        </View>
        <View style={{ width: 14 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {standings.map((team, index) => (
          <TeamRow
            key={team.id}
            team={team}
            rank={index + 1}
            onPress={handleTeamPress}
          />
        ))}
        {standings.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>TEAMS COMING SOON</Text>
            <Text style={styles.emptyText}>Season 1 launches in Henderson.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  sectionLabel: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  sectionLabelText: {
    color: '#6B5740',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  tableHeaderText: {
    color: '#6B5740',
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  rankCol: {
    width: 28,
    alignItems: 'center',
  },
  rankText: {
    color: '#6B5740',
    fontSize: 14,
    fontWeight: '800' as const,
  },
  teamInfoCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamAvatar: {
    width: 36,
    height: 36,
    borderRadius: 0,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarImage: {
    width: 36,
    height: 36,
  },
  teamNameWrap: {
    flex: 1,
  },
  teamMascot: {
    color: '#8B7355',
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  teamPark: {
    fontSize: 10,
    fontWeight: '600' as const,
    marginTop: 1,
    color: '#6B5740',
  },
  statCol: {
    width: 32,
    alignItems: 'center',
  },
  statValue: {
    color: '#8B7355',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  pctCol: {
    width: 44,
    alignItems: 'center',
  },
  pctValue: {
    color: '#6B5740',
    fontSize: 13,
    fontWeight: '700' as const,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#8B7355',
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  emptyText: {
    color: '#6B5740',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center' as const,
  },
});
