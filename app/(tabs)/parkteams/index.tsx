import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Search, MapPin, Shield, X, SearchX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { TEAMS, Team } from '@/constants/teams';
import Colors from '@/constants/colors';
import AppHeader from '@/components/AppHeader';
import { useCity } from '@/providers/CityProvider';

export default function ParkTeamsScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { selectedCity } = useCity();
  const [searchQuery, setSearchQuery] = useState('');

  const GRID_CARD_WIDTH = (screenWidth - 52) / 2;

  const filteredTeams = useMemo(
    () =>
      TEAMS.filter(
        (team) =>
          team.city === selectedCity &&
          (team.mascot.toLowerCase().includes(searchQuery.toLowerCase()) ||
           team.parkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           team.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [searchQuery, selectedCity]
  );

  const navigateToTeam = useCallback(
    (teamId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({ pathname: '/team/[id]', params: { id: teamId } });
    },
    [router]
  );

  const renderGridItem = useCallback(
    ({ item: team }: { item: Team }) => {
      const heroImage = team.images[0]?.url;
      return (
        <Pressable
          onPress={() => navigateToTeam(team.id)}
          style={({ pressed }) => [
            styles.gridCard,
            { width: GRID_CARD_WIDTH },
            pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
          ]}
          testID={`parkteam-${team.id}`}
        >
          <View style={[styles.gridImageWrap, { backgroundColor: '#252525' }]}>
            {heroImage ? (
              <Image
                source={{ uri: heroImage }}
                style={styles.gridImage}
                contentFit="cover"
                contentPosition="top center"
                transition={300}
              />
            ) : (
              <View style={styles.gridPlaceholder}>
                <Shield color="#8B735530" size={40} />
              </View>
            )}
            <View style={styles.gridOverlay} />
            <View style={styles.gridAccentTop} />
          </View>
          <View style={styles.gridInfo}>
            <Text style={styles.gridMascot} numberOfLines={1}>{team.mascot.toUpperCase()}</Text>
            <View style={styles.gridParkRow}>
              <MapPin color="#8B7355" size={9} />
              <Text style={styles.gridPark} numberOfLines={1}>
                {team.parkName}
              </Text>
            </View>
            <Text style={styles.gridRecord}>
              {team.wins}-{team.losses}{team.ties > 0 ? `-${team.ties}` : ''}
            </Text>
          </View>
          <View style={styles.gridBottomBar}>
            <View style={styles.gridBottomAccent} />
          </View>
        </Pressable>
      );
    },
    [navigateToTeam, GRID_CARD_WIDTH]
  );

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <SearchX color="#6B5740" size={48} strokeWidth={1.2} />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'NO TEAMS FOUND' : 'TEAMS COMING SOON'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Try a different search term' : 'Season 1 launches in Henderson.'}
      </Text>
      {searchQuery.length > 0 && (
        <Pressable onPress={() => setSearchQuery('')} style={styles.emptyClearBtn}>
          <Text style={styles.emptyClearText}>CLEAR SEARCH</Text>
        </Pressable>
      )}
    </View>
  ), [searchQuery, selectedCity]);

  return (
    <View style={styles.container}>
      <AppHeader />

      <View style={styles.searchBar}>
        <Search color="#6B5740" size={16} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teams or parks..."
          placeholderTextColor="#4A4A4A"
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="parkteam-search"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <X color="#6B5740" size={16} />
          </Pressable>
        )}
      </View>

      <View style={styles.countRow}>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{filteredTeams.length} TEAMS</Text>
        </View>
        <View style={styles.countDivider} />
      </View>

      <FlatList
        data={filteredTeams}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#1F1F1F',
    borderRadius: 0,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: '#8B735550',
  },
  searchInput: {
    flex: 1,
    color: '#8B7355',
    fontSize: 14,
    height: 42,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  countPill: {
    backgroundColor: '#252525',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  countText: {
    color: '#8B7355',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  countDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridCard: {
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  gridImageWrap: {
    height: 120,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(26,26,26,0.5)',
  },
  gridAccentTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#8B7355',
  },
  gridPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridInfo: {
    padding: 10,
    paddingBottom: 8,
  },
  gridMascot: {
    color: '#8B7355',
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  gridParkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  gridPark: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#6B5740',
  },
  gridRecord: {
    color: '#4A4A4A',
    fontSize: 10,
    fontWeight: '700' as const,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  gridBottomBar: {
    height: 4,
    backgroundColor: '#252525',
  },
  gridBottomAccent: {
    height: '100%',
    width: '40%',
    backgroundColor: '#8B7355',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#8B7355',
    fontSize: 18,
    fontWeight: '700' as const,
    marginTop: 16,
    letterSpacing: 2,
  },
  emptySubtitle: {
    color: '#6B5740',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyClearBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 0,
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#8B7355',
  },
  emptyClearText: {
    color: '#8B7355',
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 1,
  },
});
