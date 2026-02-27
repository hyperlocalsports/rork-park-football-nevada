import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import {
  User,
  Star,
  MapPin,
  Trophy,
  Calendar,
  ChevronRight,
  Bell,
  Settings,
  Heart,
  LogOut,
  Shield,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { usePurchases } from '@/providers/PurchasesProvider';

import { useAuth } from '@/providers/AuthProvider';

import AppHeader from '@/components/AppHeader';

export default function ProfileScreen() {
  const { isParkSupporter } = usePurchases();

  const { user, isSignedIn, signOut } = useAuth();
  const router = useRouter();

  const displayName = user?.fullName || 'PARK FAN';
  const displayEmail = user?.email || null;
  const isAppleUser = user?.authProvider === 'apple';

  const handleSignOut = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/welcome');
          },
        },
      ]
    );
  }, [signOut, router]);

  const menuItems = [
    { icon: Bell, label: 'NOTIFICATIONS', sublabel: 'Coming Soon', disabled: true },
    { icon: Calendar, label: 'MY SCHEDULE', sublabel: 'Upcoming games', disabled: false },
    { icon: MapPin, label: 'CHECK-IN HISTORY', sublabel: 'Coming Soon', disabled: true },
    { icon: Heart, label: 'FAVORITE TEAMS', sublabel: 'Coming Soon', disabled: true },
    { icon: Settings, label: 'SETTINGS', sublabel: 'App preferences', disabled: false },
  ];

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.heroArea}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarBox}>
              <User color="#8B7355" size={36} strokeWidth={2} />
            </View>
            {isAppleUser && (
              <View style={styles.verifiedBadge}>
                <Shield color="#C8A84E" size={10} fill="#C8A84E" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{displayName.toUpperCase()}</Text>
          {displayEmail && (
            <Text style={styles.userEmail}>{displayEmail}</Text>
          )}
          <Text style={styles.userSub}>
            {isAppleUser ? 'Apple Account' : 'Guest Account'} • Henderson, Nevada
          </Text>

          {isParkSupporter && (
            <View style={styles.supporterBadge}>
              <Star color="#8B7355" size={12} fill="#8B7355" />
              <Text style={styles.supporterText}>PARK SUPPORTER</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Trophy color="#8B7355" size={18} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>CHECK-INS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <MapPin color="#8B7355" size={18} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>PARKS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Calendar color="#8B7355" size={18} />
            <Text style={styles.statValue}>S1</Text>
            <Text style={styles.statLabel}>SEASON</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => !item.disabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={({ pressed }) => [
                styles.menuItem,
                !item.disabled && pressed && { backgroundColor: '#252525' },
                item.disabled && { opacity: 0.6 },
              ]}
            >
              <View style={styles.menuIconWrap}>
                <item.icon color="#8B7355" size={18} />
              </View>
              <View style={styles.menuTextWrap}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={[styles.menuSublabel, item.disabled && styles.menuSublabelDisabled]}>{item.sublabel}</Text>
              </View>
              {!item.disabled && <ChevronRight color="#4A4A4A" size={16} />}
            </Pressable>
          ))}
        </View>

        <View style={styles.signOutSection}>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.signOutBtn,
              pressed && { backgroundColor: '#2A1A1A' },
            ]}
            testID="sign-out-btn"
          >
            <LogOut color="#8B4040" size={18} />
            <Text style={styles.signOutText}>SIGN OUT</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerAccent} />
          <Text style={styles.footerBrand}>PARK FOOTBALL NEVADA</Text>
          <Text style={styles.footerVersion}>Season One • v1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  heroArea: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatarWrap: {
    marginBottom: 14,
    position: 'relative' as const,
  },
  avatarBox: {
    width: 72,
    height: 72,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1F1F',
    borderWidth: 2,
    borderColor: '#8B7355',
  },
  verifiedBadge: {
    position: 'absolute' as const,
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C8A84E',
  },
  userName: {
    color: '#8B7355',
    fontSize: 22,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  userEmail: {
    color: 'rgba(139,115,85,0.6)',
    fontSize: 12,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  userSub: {
    color: '#6B5740',
    fontSize: 12,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  supporterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 0,
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#8B7355',
  },
  supporterText: {
    color: '#8B7355',
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#1F1F1F',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingVertical: 18,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: '#8B7355',
    fontSize: 20,
    fontWeight: '800' as const,
  },
  statLabel: {
    color: '#6B5740',
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2A2A2A',
  },
  menuSection: {
    paddingHorizontal: 16,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 0,
    gap: 14,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 0,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    color: '#8B7355',
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  menuSublabel: {
    color: '#6B5740',
    fontSize: 11,
    marginTop: 2,
  },
  menuSublabelDisabled: {
    color: '#4A4A4A',
    fontStyle: 'italic' as const,
  },
  signOutSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(139,64,64,0.3)',
    backgroundColor: 'rgba(139,64,64,0.08)',
  },
  signOutText: {
    color: '#8B4040',
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  footerAccent: {
    width: 36,
    height: 2,
    backgroundColor: '#8B7355',
    opacity: 0.3,
    marginBottom: 14,
  },
  footerBrand: {
    color: '#8B7355',
    fontSize: 11,
    fontWeight: '800' as const,
    letterSpacing: 4,
    opacity: 0.5,
  },
  footerVersion: {
    color: '#6B5740',
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 1,
    opacity: 0.4,
  },
});
