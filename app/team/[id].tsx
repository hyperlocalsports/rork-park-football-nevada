import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  ActivityIndicator,
  Modal,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  MapPin,
  Users,
  Home,
  Star,
  X,
  Heart,
  Zap,
  RotateCcw,
  ChevronRight,
  Shield,
} from 'lucide-react-native';
import { getTeamById, TEAMS, Team } from '@/constants/teams';
import { teamRosters, RosterPlayer } from '@/constants/rosters';
import Colors from '@/constants/colors';
import { usePurchases } from '@/providers/PurchasesProvider';
import AppHeader from '@/components/AppHeader';

function PaywallModal({ visible, onClose, team }: { visible: boolean; onClose: () => void; team: Team }) {
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { monthlyPackage, purchase, isPurchasing, restorePurchases, isRestoring } = usePurchases();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 100, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 600, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  const handlePurchase = useCallback(async () => {
    if (!monthlyPackage) {
      Alert.alert('Unavailable', 'No subscription plan is available right now. Please try again later.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await purchase(monthlyPackage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
      Alert.alert('Welcome, Park Supporter!', 'Thank you for supporting your local park team.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Purchase failed';
      if (!msg.includes('cancelled') && !msg.includes('cancel')) {
        Alert.alert('Purchase Failed', msg);
      }
    }
  }, [monthlyPackage, purchase, onClose]);

  const handleRestore = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await restorePurchases();
      Alert.alert('Restored', 'Your purchases have been restored.');
      onClose();
    } catch {
      Alert.alert('Restore Failed', 'No previous purchases found.');
    }
  }, [restorePurchases, onClose]);

  const price = monthlyPackage?.product?.priceString ?? '$5.00';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.paywallBackdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.paywallSheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.paywallHandle} />
          <Pressable onPress={onClose} style={styles.paywallClose} hitSlop={12}>
            <X color="#6B5740" size={18} />
          </Pressable>
          <View style={styles.paywallBadgeRow}>
            <View style={styles.paywallBadge}>
              <Star color="#8B7355" size={12} fill="#8B7355" />
              <Text style={styles.paywallBadgeText}>PARK SUPPORTER</Text>
            </View>
          </View>
          <Text style={styles.paywallTitle}>Support Your{'\n'}Local Park Team</Text>
          <Text style={styles.paywallSub}>Your monthly support keeps this park community alive and thriving.</Text>
          <View style={styles.paywallPerks}>
            {[
              { icon: Heart, label: 'Directly support the park & team' },
              { icon: Star, label: 'Park Supporter badge on your profile' },
              { icon: Zap, label: 'Early access to game schedules & events' },
              { icon: MapPin, label: 'Exclusive park updates & announcements' },
            ].map(({ icon: Icon, label }) => (
              <View key={label} style={styles.paywallPerkRow}>
                <View style={styles.paywallPerkIcon}>
                  <Icon color="#8B7355" size={14} strokeWidth={2} />
                </View>
                <Text style={styles.paywallPerkText}>{label}</Text>
              </View>
            ))}
          </View>
          <Pressable
            onPress={handlePurchase}
            disabled={isPurchasing || isRestoring}
            style={styles.paywallCTA}
            testID="purchase-button"
          >
            {isPurchasing ? (
              <ActivityIndicator color="#1A1A1A" size="small" />
            ) : (
              <>
                <Text style={styles.paywallCTAText}>BECOME A SUPPORTER</Text>
                <Text style={styles.paywallCTAPrice}>{price}/month</Text>
              </>
            )}
          </Pressable>
          <Text style={styles.paywallLegal}>Cancel anytime. Billed monthly. Subscription auto-renews.</Text>
          <Pressable onPress={handleRestore} disabled={isRestoring} style={styles.paywallRestore}>
            {isRestoring ? (
              <ActivityIndicator color="#6B5740" size="small" />
            ) : (
              <View style={styles.paywallRestoreRow}>
                <RotateCcw color="#6B5740" size={12} />
                <Text style={styles.paywallRestoreText}>Restore Purchases</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(1.02)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-15)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const carouselFade = useRef(new Animated.Value(0)).current;

  const { isParkSupporter } = usePurchases();
  const [paywallVisible, setPaywallVisible] = useState<boolean>(false);

  const team = getTeamById(id ?? '');

  const CARD_WIDTH = screenWidth * 0.36;
  const CARD_HEIGHT = CARD_WIDTH * 1.25;

  const roster = useMemo(() => {
    if (!team) return [];
    return teamRosters[team.id] ?? [];
  }, [team]);

  const sameCity = useMemo(() => {
    if (!team) return [];
    return TEAMS.filter(t => t.city === team.city && t.id !== team.id && t.images.length > 0);
  }, [team]);

  useEffect(() => {
    fadeAnim.setValue(0);
    heroScale.setValue(1.02);
    titleFade.setValue(0);
    titleSlide.setValue(-15);
    buttonFade.setValue(0);
    carouselFade.setValue(0);

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
  }, [id]);

  const scrollRef = useRef<ScrollView>(null);
  const rosterYRef = useRef<number>(0);

  const scrollToRoster = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollRef.current?.scrollTo({ y: rosterYRef.current - 10, animated: true });
  }, []);

  const navigateToTeam = useCallback((teamId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/team/[id]', params: { id: teamId } });
  }, [router]);

  const handleSupporterPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPaywallVisible(true);
  }, []);

  if (!team) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.errorText}>Team not found</Text>
      </View>
    );
  }

  const hasImages = team.images.length > 0;
  const athleteImage = hasImages ? team.images[0].url : null;

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        ref={scrollRef as any}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        bounces={false}
      >
        <View style={[styles.topSection, { paddingTop: 6 }]}>
          <Animated.View style={[styles.logoArea, { opacity: titleFade, transform: [{ translateY: titleSlide }] }]}>
            <Text style={styles.logoMain}>{team.mascot.toUpperCase()}</Text>
            <View style={styles.logoSubWrap}>
              <View style={styles.logoLine} />
              <Text style={styles.logoSub}>
                {team.parkName.replace(' Park', '').toUpperCase()}
              </Text>
              <View style={styles.logoLine} />
            </View>
          </Animated.View>
        </View>

        <Animated.View style={[styles.actionRowSection, { opacity: buttonFade }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/' as any);
            }}
            style={({ pressed }) => [
              styles.heroActionBtn,
              pressed && { opacity: 0.8, transform: [{ scale: 0.97 }], backgroundColor: '#252525' },
            ]}
            testID="home-btn"
          >
            <Home color="#8B7355" size={15} strokeWidth={2} />
            <Text style={styles.heroActionBtnText}>HOME</Text>
          </Pressable>
          {roster.length > 0 && (
            <Pressable
              onPress={scrollToRoster}
              style={({ pressed }) => [
                styles.heroActionBtn,
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }], backgroundColor: '#252525' },
              ]}
              testID="roster-btn"
            >
              <Users color="#8B7355" size={15} strokeWidth={2} />
              <Text style={styles.heroActionBtnText}>ROSTER</Text>
            </Pressable>
          )}
        </Animated.View>

        <View style={styles.heroFrameOuter}>
          <View style={styles.heroFrame}>
            <Animated.View
              style={[
                styles.heroImageWrap,
                { opacity: fadeAnim, transform: [{ scale: heroScale }] },
              ]}
            >
              {athleteImage ? (
                <Image
                  source={{ uri: athleteImage }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  contentPosition="top center"
                  transition={400}
                />
              ) : (
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#252525', alignItems: 'center', justifyContent: 'center' }]}>
                  <Shield color="#8B735520" size={140} strokeWidth={0.5} />
                </View>
              )}
              <View style={styles.heroImageOverlay} />
            </Animated.View>
          </View>
        </View>

        {roster.length > 0 && (
          <Animated.View onLayout={(e) => { rosterYRef.current = e.nativeEvent.layout.y; }} style={[styles.rosterSection, { opacity: buttonFade }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.carouselLabel}>ROSTER</Text>
              <View style={styles.sectionLine} />
            </View>
            <View style={styles.rosterTable}>
              <View style={styles.rosterHeaderRow}>
                <Text style={styles.rosterHeaderNum}>#</Text>
                <Text style={styles.rosterHeaderName}>NAME</Text>
                <Text style={styles.rosterHeaderPos}>POS</Text>
              </View>
              {roster.map((player: RosterPlayer) => (
                <View key={player.id} style={styles.rosterRow} testID={`roster-${player.id}`}>
                  <View style={styles.rosterNumWrap}>
                    <Text style={styles.rosterNum}>{player.number}</Text>
                  </View>
                  <Text style={styles.rosterName}>{player.name}</Text>
                  <View style={styles.rosterPosWrap}>
                    <Text style={styles.rosterPos}>{player.position}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.supporterArea, { opacity: buttonFade }]}>
          {!isParkSupporter ? (
            <Pressable
              onPress={handleSupporterPress}
              style={({ pressed }) => [
                styles.supporterBtn,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
              testID="supporter-promo"
            >
              <Heart color="#1A1A1A" size={16} strokeWidth={2.5} />
              <Text style={styles.supporterBtnText}>BECOME A PARK SUPPORTER</Text>
              <ChevronRight color="#1A1A1A" size={16} />
            </Pressable>
          ) : (
            <View style={styles.supporterActiveBadge}>
              <Star color="#8B7355" size={14} fill="#8B7355" />
              <Text style={styles.supporterActiveText}>PARK SUPPORTER</Text>
            </View>
          )}
        </Animated.View>

        {sameCity.length > 0 && (
          <Animated.View style={[styles.carouselSection, { opacity: carouselFade }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.carouselLabel}>MORE {team.city.toUpperCase()} TEAMS</Text>
              <View style={styles.sectionLine} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              decelerationRate="fast"
            >
              {sameCity.map((otherTeam) => (
                <Pressable
                  key={otherTeam.id}
                  onPress={() => navigateToTeam(otherTeam.id)}
                  style={({ pressed }) => [
                    styles.teamCard,
                    { width: CARD_WIDTH },
                    pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                  ]}
                  testID={`team-card-${otherTeam.id}`}
                >
                  <View style={[styles.teamCardImageWrap, { height: CARD_HEIGHT }]}>
                    <Image
                      source={{ uri: otherTeam.images[0]?.url }}
                      style={StyleSheet.absoluteFillObject}
                      contentFit="cover"
                      contentPosition="top center"
                      transition={300}
                    />
                    <View style={styles.teamCardOverlay} />
                  </View>
                  <View style={styles.teamCardInfo}>
                    <Text style={styles.teamCardPark} numberOfLines={1}>
                      {otherTeam.parkName.replace(' Park', '').toUpperCase()}
                    </Text>
                    <Text style={styles.teamCardMascot} numberOfLines={1}>
                      {otherTeam.mascot.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.teamCardAccent} />
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </ScrollView>

      <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} team={team} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  errorText: {
    color: '#6B5740',
    fontSize: 16,
    textAlign: 'center' as const,
    marginTop: 40,
  },
  topSection: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  logoArea: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  logoMain: {
    fontSize: 24,
    fontWeight: '900' as const,
    letterSpacing: 3,
    textAlign: 'center' as const,
    color: '#8B7355',
  },
  logoSubWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 8,
  },
  logoLine: {
    width: 20,
    height: 1,
    backgroundColor: '#8B735540',
  },
  logoSub: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 4,
    color: '#6B5740',
  },
  heroFrameOuter: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  heroFrame: {
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    aspectRatio: 0.7,
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
    backgroundColor: 'rgba(26,26,26,0.1)',
  },
  heroActionBtn: {
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: '#8B7355',
    backgroundColor: '#1A1A1A',
  },
  heroActionBtnText: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    color: '#8B7355',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  actionRowSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  supporterArea: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  supporterBtn: {
    borderRadius: 0,
    overflow: 'hidden',
    width: '100%' as const,
    maxWidth: 340,
    alignSelf: 'center' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 28,
    backgroundColor: '#8B7355',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
      web: {},
    }),
  },
  supporterBtnText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    textAlign: 'center' as const,
  },
  supporterActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center' as const,
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 0,
    borderWidth: 1,
    maxWidth: 340,
    borderColor: '#8B7355',
    backgroundColor: '#252525',
  },
  supporterActiveText: {
    fontSize: 14,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: '#8B7355',
  },
  rosterSection: {
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  rosterTable: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#1F1F1F',
  },
  rosterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    backgroundColor: '#252525',
  },
  rosterHeaderNum: {
    width: 36,
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: '#6B5740',
  },
  rosterHeaderName: {
    flex: 1,
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: '#6B5740',
  },
  rosterHeaderPos: {
    width: 44,
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: '#6B5740',
    textAlign: 'right' as const,
  },
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  rosterNumWrap: {
    width: 36,
  },
  rosterNum: {
    fontSize: 14,
    fontWeight: '900' as const,
    color: '#8B7355',
    letterSpacing: 0.5,
  },
  rosterName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#C4B89A',
  },
  rosterPosWrap: {
    width: 44,
    alignItems: 'flex-end' as const,
  },
  rosterPos: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1,
    color: '#6B5740',
    backgroundColor: '#252525',
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  carouselSection: {
    marginBottom: 4,
  },
  carouselLabel: {
    color: '#6B5740',
    fontSize: 11,
    fontWeight: '800' as const,
    letterSpacing: 2,
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
    color: '#6B5740',
  },
  teamCardMascot: {
    color: '#8B7355',
    fontSize: 12,
    fontWeight: '900' as const,
    letterSpacing: 0.3,
  },
  teamCardAccent: {
    height: 2.5,
    backgroundColor: '#8B7355',
  },
  paywallBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end' as const,
  },
  paywallSheet: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    overflow: 'hidden',
    borderTopWidth: 2,
    borderTopColor: '#8B7355',
  },
  paywallHandle: {
    width: 36,
    height: 4,
    borderRadius: 0,
    backgroundColor: '#2A2A2A',
    alignSelf: 'center',
    marginBottom: 16,
  },
  paywallClose: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  paywallBadgeRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  paywallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 0,
    borderWidth: 1,
    backgroundColor: '#252525',
    borderColor: '#8B7355',
  },
  paywallBadgeText: {
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 2,
    color: '#8B7355',
  },
  paywallTitle: {
    color: '#8B7355',
    fontSize: 28,
    fontWeight: '900' as const,
    letterSpacing: -0.8,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },
  paywallSub: {
    color: '#6B5740',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  paywallPerks: {
    gap: 12,
    marginBottom: 28,
  },
  paywallPerkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paywallPerkIcon: {
    width: 32,
    height: 32,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  paywallPerkText: {
    color: '#8B7355',
    fontSize: 14,
    fontWeight: '500' as const,
    flex: 1,
  },
  paywallCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 17,
    paddingHorizontal: 22,
    borderRadius: 0,
    marginBottom: 12,
    backgroundColor: '#8B7355',
  },
  paywallCTAText: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  paywallCTAPrice: {
    color: 'rgba(26,26,26,0.6)',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  paywallLegal: {
    color: '#4A4A4A',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  paywallRestore: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  paywallRestoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paywallRestoreText: {
    color: '#6B5740',
    fontSize: 13,
    fontWeight: '500' as const,
  },
});
