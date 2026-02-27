import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useSegments } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LOCATIONS } from '@/constants/teams';
import { useCity } from '@/providers/CityProvider';

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const { selectedCity, setSelectedCity } = useCity();
  const router = useRouter();
  const segments = useSegments();

  const handleCityChange = (city: typeof LOCATIONS[number]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCity(city);
    const isOnTeamPage = segments[0] === 'team';
    if (isOnTeamPage) {
      router.push('/');
    }
  };

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 6 }]}>
      <View style={styles.brandRow}>
        <View style={styles.brandLine} />
        <Text style={styles.brandText}>PARK FOOTBALL NEVADA</Text>
        <View style={styles.brandLine} />
      </View>

      <View style={styles.cityBar}>
        {LOCATIONS.map((city, index) => (
          <React.Fragment key={city}>
            {index > 0 && <View style={styles.divider} />}
            <Pressable
              onPress={() => handleCityChange(city)}
              style={[styles.cityTab, selectedCity === city && styles.cityTabActive]}
              testID={`header-city-${city}`}
            >
              <Text style={[styles.cityTabText, selectedCity === city && styles.cityTabTextActive]}>
                {city.toUpperCase()}
              </Text>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#141414',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 12,
  },
  brandLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  brandText: {
    color: '#8B7355',
    fontSize: 15,
    fontWeight: '900' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
  },
  cityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#2A2A2A',
  },
  cityTab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
  },
  cityTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#8B7355',
  },
  cityTabText: {
    color: '#4A4A4A',
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  cityTabTextActive: {
    color: '#8B7355',
    fontWeight: '700' as const,
  },
});
