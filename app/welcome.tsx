import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  FlatList,
  useWindowDimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Linking } from 'react-native';
import { ChevronRight, Check, UserPlus } from 'lucide-react-native';
import { TEAMS, Team } from '@/constants/teams';
import { useTeam } from '@/providers/TeamProvider';
import { useAuth } from '@/providers/AuthProvider';

const WELCOME_BG = require('@/assets/images/welcome-bg.png');

type WelcomeStep = 'hero' | 'auth' | 'picker';

const SeparatorComponent = React.memo(() => <View style={{ height: 6 }} />);

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { selectTeam } = useTeam();
  const { signInWithApple, signInAsGuest, isSignedIn } = useAuth();

  const [step, setStep] = useState<WelcomeStep>('hero');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const bgFade = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const btnFade = useRef(new Animated.Value(0)).current;
  const stepFade = useRef(new Animated.Value(0)).current;
  const stepSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bgFade, { toValue: 1, duration: 1200, useNativeDriver: false }),
      Animated.parallel([
        Animated.timing(titleFade, { toValue: 1, duration: 600, useNativeDriver: false }),
        Animated.spring(titleSlide, { toValue: 0, friction: 12, tension: 50, useNativeDriver: false }),
      ]),
      Animated.timing(subtitleFade, { toValue: 1, duration: 500, useNativeDriver: false }),
      Animated.timing(btnFade, { toValue: 1, duration: 400, useNativeDriver: false }),
    ]).start();
  }, []);

  const animateToStep = useCallback((nextStep: WelcomeStep) => {
    stepFade.setValue(0);
    stepSlide.setValue(40);
    setStep(nextStep);
    Animated.parallel([
      Animated.timing(stepFade, { toValue: 1, duration: 350, useNativeDriver: false }),
      Animated.spring(stepSlide, { toValue: 0, friction: 14, tension: 60, useNativeDriver: false }),
    ]).start();
  }, [stepFade, stepSlide]);

  const openAuth = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateToStep('auth');
  }, [animateToStep]);

  const goToPicker = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateToStep('picker');
  }, [animateToStep]);

  const handleAppleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    const success = await signInWithApple();
    setIsSigningIn(false);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      animateToStep('picker');
    }
  }, [signInWithApple, animateToStep]);

  const handleGuestContinue = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signInAsGuest(guestName.trim());
    animateToStep('picker');
  }, [guestName, signInAsGuest, animateToStep]);

  const handleSelect = useCallback((teamId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedId(teamId);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    selectTeam(selectedId);
    router.replace('/(tabs)/(home)');
  }, [selectedId, selectTeam, router]);

  const renderTeamItem = useCallback(({ item }: { item: Team }) => {
    const isSelected = item.id === selectedId;
    return (
      <Pressable
        onPress={() => handleSelect(item.id)}
        style={[
          styles.teamRow,
          isSelected && styles.teamRowSelected,
          { borderLeftColor: item.primaryColor },
        ]}
        testID={`welcome-team-${item.id}`}
      >
        <View style={[styles.teamColorDot, { backgroundColor: item.secondaryColor }]} />
        <View style={styles.teamRowInfo}>
          <Text style={[styles.teamRowPark, isSelected && styles.teamRowParkSelected]}>
            {item.parkName.toUpperCase()}
          </Text>
          <Text style={[styles.teamRowMascot, { color: item.secondaryColor }]}>
            {item.mascot}
          </Text>
        </View>
        {isSelected && (
          <View style={[styles.checkCircle, { backgroundColor: item.secondaryColor }]}>
            <Check size={14} color="#0D0D0D" strokeWidth={3} />
          </View>
        )}
      </Pressable>
    );
  }, [selectedId, handleSelect]);

  const keyExtractor = useCallback((item: Team) => item.id, []);

  const renderHero = () => (
    <View style={[styles.heroContent, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 30 }]}>
      <View style={styles.heroTop} />
      <View style={styles.heroBottom}>
        <Animated.View style={{ opacity: titleFade, transform: [{ translateY: titleSlide }] }}>
          <Text style={styles.heroWelcome}>WELCOME TO</Text>
          <Text style={styles.heroTitle}>PARK FOOTBALL{' '}NEVADA</Text>
        </Animated.View>
        <Animated.Text style={[styles.heroTagline, { opacity: subtitleFade }]}>
          Sign in to follow your park team all season
        </Animated.Text>
        <Animated.View style={{ opacity: btnFade }}>
          <Pressable
            onPress={openAuth}
            style={({ pressed }) => [
              styles.ctaBtn,
              pressed && styles.ctaBtnPressed,
            ]}
            testID="get-started-btn"
          >
            <Text style={styles.ctaBtnText}>GET STARTED</Text>
            <ChevronRight size={18} color="#0D0D0D" strokeWidth={2.5} />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );

  const renderAuth = () => (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View
        style={[
          styles.authContainer,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 16,
            opacity: stepFade,
            transform: [{ translateY: stepSlide }],
          },
        ]}
      >
        <Text style={styles.authTitle}>JOIN THE LEAGUE</Text>
        <Text style={styles.authSub}>
          Create an account to track your team
        </Text>
        <View style={styles.authDivider} />

        <View style={styles.authOptions}>
          {Platform.OS === 'ios' && (
            <Pressable
              onPress={handleAppleSignIn}
              disabled={isSigningIn}
              style={({ pressed }) => [
                styles.appleBtn,
                pressed && styles.appleBtnPressed,
                isSigningIn && styles.appleBtnDisabled,
              ]}
              testID="apple-sign-in-btn"
            >
              <Text style={styles.appleIcon}></Text>
              <Text style={styles.appleBtnText}>
                {isSigningIn ? 'SIGNING IN...' : 'SIGN IN WITH APPLE'}
              </Text>
            </Pressable>
          )}

          {Platform.OS === 'ios' && (
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
          )}

          <Text style={styles.guestLabel}>CONTINUE AS GUEST</Text>
          <View style={styles.nameInputWrap}>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name (optional)"
              placeholderTextColor="rgba(139,115,85,0.35)"
              value={guestName}
              onChangeText={setGuestName}
              autoCapitalize="words"
              returnKeyType="done"
              testID="guest-name-input"
            />
          </View>

          <Pressable
            onPress={handleGuestContinue}
            style={({ pressed }) => [
              styles.guestBtn,
              pressed && styles.guestBtnPressed,
            ]}
            testID="guest-continue-btn"
          >
            <UserPlus size={16} color="#0D0D0D" strokeWidth={2.5} />
            <Text style={styles.guestBtnText}>CONTINUE</Text>
          </Pressable>
        </View>

        <View style={styles.authFooter}>
          <Text style={styles.authFooterText}>
            By continuing, you agree to our{' '}
            <Text
              style={styles.authFooterLink}
              onPress={() => Linking.openURL('https://parkfootballnevada.com/terms')}
            >
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text
              style={styles.authFooterLink}
              onPress={() => Linking.openURL('https://parkfootballnevada.com/privacy')}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );

  const renderPicker = () => (
    <Animated.View
      style={[
        styles.pickerContainer,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          opacity: stepFade,
          transform: [{ translateY: stepSlide }],
        },
      ]}
    >
      <Text style={styles.pickerTitle}>SELECT YOUR TEAM</Text>
      <Text style={styles.pickerSub}>
        Pick the park team you want to follow
      </Text>
      <View style={styles.pickerDivider} />

      <FlatList
        data={TEAMS}
        renderItem={renderTeamItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={SeparatorComponent}
      />

      <Pressable
        onPress={handleConfirm}
        disabled={!selectedId}
        style={({ pressed }) => [
          styles.confirmBtn,
          !selectedId && styles.confirmBtnDisabled,
          pressed && selectedId ? styles.confirmBtnPressed : undefined,
        ]}
        testID="confirm-team-btn"
      >
        <Text style={[styles.confirmBtnText, !selectedId && styles.confirmBtnTextDisabled]}>
          {selectedId ? 'LET\'S GO' : 'SELECT A TEAM'}
        </Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgFade }]}>
        <Image
          source={WELCOME_BG}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="top center"
        />
        <View style={styles.bgOverlay} />
      </Animated.View>

      {step === 'hero' && renderHero()}
      {step === 'auth' && (
        <>
          <View style={styles.stepOverlay} />
          {renderAuth()}
        </>
      )}
      {step === 'picker' && (
        <>
          <View style={styles.stepOverlay} />
          {renderPicker()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.35)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
  },
  heroTop: {
    flex: 1,
  },
  heroBottom: {
    gap: 16,
  },
  heroWelcome: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 4,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#C8A84E',
    fontSize: 38,
    fontWeight: '900' as const,
    letterSpacing: 2,
    lineHeight: 42,
  },

  heroTagline: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    marginTop: 4,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C8A84E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 2,
    marginTop: 8,
  },
  ctaBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaBtnText: {
    color: '#0D0D0D',
    fontSize: 14,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  authTitle: {
    color: '#C8A84E',
    fontSize: 24,
    fontWeight: '900' as const,
    letterSpacing: 2,
    textAlign: 'center' as const,
  },
  authSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    marginTop: 6,
  },
  authDivider: {
    height: 1,
    backgroundColor: 'rgba(200,168,78,0.2)',
    marginVertical: 24,
  },
  authOptions: {
    flex: 1,
    gap: 16,
  },
  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  appleBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  appleBtnDisabled: {
    opacity: 0.6,
  },
  appleIcon: {
    fontSize: 20,
    color: '#000000',
    marginTop: -2,
  },
  appleBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 4,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  orText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  guestLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  nameInputWrap: {
    borderWidth: 1,
    borderColor: 'rgba(139,115,85,0.3)',
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  nameInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500' as const,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C8A84E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  guestBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  guestBtnText: {
    color: '#0D0D0D',
    fontSize: 14,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  authFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  authFooterText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    textAlign: 'center' as const,
  },
  authFooterLink: {
    color: 'rgba(200,168,78,0.6)',
    textDecorationLine: 'underline' as const,
  },
  stepOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 1,
  },
  pickerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  pickerTitle: {
    color: '#C8A84E',
    fontSize: 22,
    fontWeight: '900' as const,
    letterSpacing: 2,
    textAlign: 'center' as const,
  },
  pickerSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    marginTop: 6,
  },
  pickerDivider: {
    height: 1,
    backgroundColor: 'rgba(200,168,78,0.2)',
    marginVertical: 16,
  },
  listContent: {
    paddingBottom: 12,
  },
  separator: {
    height: 6,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    borderLeftWidth: 3,
    gap: 12,
  },
  teamRowSelected: {
    backgroundColor: 'rgba(200,168,78,0.15)',
    borderLeftColor: '#C8A84E',
    borderWidth: 1,
    borderColor: 'rgba(200,168,78,0.3)',
    borderLeftWidth: 3,
  },
  teamColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teamRowInfo: {
    flex: 1,
  },
  teamRowPark: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  teamRowParkSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  teamRowMascot: {
    fontSize: 15,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    backgroundColor: '#C8A84E',
    paddingVertical: 16,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmBtnDisabled: {
    backgroundColor: 'rgba(200,168,78,0.2)',
  },
  confirmBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  confirmBtnText: {
    color: '#0D0D0D',
    fontSize: 14,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  confirmBtnTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
});
