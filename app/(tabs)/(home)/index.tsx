import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TEAMS } from '@/constants/teams';
import Colors from '@/constants/colors';
import AppHeader from '@/components/AppHeader';
import { useCity } from '@/providers/CityProvider';

const FEATURED_PLAYER_IMAGE = require('@/assets/images/rivalry-faceoff.png');

export default function HomeScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { selectedCity } = useCity();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(1.02)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-15)).current;
  const carouselFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  const CARD_WIDTH = screenWidth * 0.36;
  const CARD_HEIGHT = CARD_WIDTH * 1.25;

  const filteredTeams = TEAMS.filter(t => t.city === selectedCity);
  const teamsWithImages = filteredTeams.filter(t => t.images.length > 0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(heroScale, { toValue: 1, duration: 1600, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(titleFade, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.spring(titleSlide, { toValue: 0, friction: 10, tension: 40, useNativeDriver: true }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(buttonFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.delay(700),
        Animated.timing(carouselFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const navigateToTeam = useCallback((teamId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/team/[id]', params: { id: teamId } });
  }, [router]);

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        bounces={false}
      >
        <View style={styles.heroFrameOuter}>
          <View style={styles.heroFrame}>
            <Animated.View
              style={[
                styles.heroImageWrap,
                { opacity: fadeAnim, transform: [{ scale: heroScale }] },
              ]}
            >
              <Image
                source={FEATURED_PLAYER_IMAGE}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                contentPosition="center"
                transition={400}
              />
              <View style={styles.heroImageOverlay} />
            </Animated.View>

            <View style={styles.heroOverlayBottom}>
              <Animated.View style={[styles.actionRow, { opacity: buttonFade }]}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/(tabs)/parkteams' as any);
                  }}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    pressed && styles.actionBtnPressed,
                  ]}
                  testID="explore-teams-btn"
                >
                  <Text style={styles.actionBtnText}>EXPLORE PARK TEAMS</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/(tabs)/standings' as any);
                  }}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    pressed && styles.actionBtnPressed,
                  ]}
                  testID="view-standings-btn"
                >
                  <Text style={styles.actionBtnText}>VIEW STANDINGS</Text>
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </View>

        <Animated.View style={[styles.carouselSection, { opacity: carouselFade }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            decelerationRate="fast"
          >
            {teamsWithImages.map((team) => (
              <Pressable
                key={team.id}
                onPress={() => navigateToTeam(team.id)}
                style={({ pressed }) => [
                  styles.teamCard,
                  { width: CARD_WIDTH },
                  pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                ]}
                testID={`team-card-${team.id}`}
              >
                <View style={[styles.teamCardImageWrap, { height: CARD_HEIGHT }]}>
                  <Image
                    source={{ uri: team.images[0]?.url }}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                    contentPosition="top center"
                    transition={300}
                  />
                  <View style={styles.teamCardOverlay} />
                </View>

                <View style={styles.teamCardInfo}>
                  <Text style={[styles.teamCardPark, { color: Colors.accentDark }]} numberOfLines={1}>
                    {team.parkName.replace(' Park', '').toUpperCase()}
                  </Text>
                  <Text style={styles.teamCardMascot} numberOfLines={1}>
                    {team.mascot.toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.teamCardAccent, { backgroundColor: Colors.accent }]} />
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {filteredTeams.length === 0 && (
          <View style={styles.emptyCity}>
            <Text style={styles.emptyCityText}>TEAMS COMING SOON</Text>
            <Text style={styles.emptyCitySub}>Season 1 launches in Henderson.</Text>
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
  heroFrameOuter: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  heroFrame: {
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    aspectRatio: 1.6,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      web: {},
    }),
  },
  heroImageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.15)',
  },
  heroOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: 16,
    backgroundColor: 'rgba(26,26,26,0.7)',
    paddingTop: 30,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: '#8B7355',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
  },
  actionBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
    backgroundColor: '#252525',
  },
  actionBtnText: {
    color: '#8B7355',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1,
    textAlign: 'center' as const,
  },
  carouselSection: {
    marginBottom: 4,
  },
  carouselContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  teamCard: {
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  teamCardImageWrap: {
    overflow: 'hidden',
    position: 'relative',
  },
  teamCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.1)',
  },
  teamCardInfo: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#1F1F1F',
  },
  teamCardPark: {
    fontSize: 8,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  teamCardMascot: {
    color: '#8B7355',
    fontSize: 12,
    fontWeight: '900' as const,
    letterSpacing: 0.3,
  },
  teamCardAccent: {
    height: 2.5,
  },
  emptyCity: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 40,
  },
  emptyCityText: {
    color: '#8B7355',
    fontSize: 20,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  emptyCitySub: {
    color: '#6B5740',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});
