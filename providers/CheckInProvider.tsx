import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';

export interface CheckInRecord {
  teamId: string;
  timestamp: number;
  parkName: string;
}

const STORAGE_KEY = 'park_checkins';
const CHECK_IN_RADIUS_METERS = 300;

function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
  if (Platform.OS === 'web') {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(error.message));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  const Location = await import('expo-location');
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }
  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  };
}

export const [CheckInProvider, useCheckIn] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);

  const checkInsQuery = useQuery({
    queryKey: ['checkins'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CheckInRecord[]) : [];
    },
  });

  useEffect(() => {
    if (checkInsQuery.data) {
      setCheckIns(checkInsQuery.data);
    }
  }, [checkInsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (records: CheckInRecord[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return records;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins'] });
    },
  });

  const performCheckIn = useCallback(
    async (teamId: string, parkName: string, parkLat: number, parkLon: number) => {
      console.log('[CheckIn] Starting check-in for', teamId);
      const userLoc = await getUserLocation();
      console.log('[CheckIn] User location:', userLoc);

      const distance = getDistanceMeters(
        userLoc.latitude,
        userLoc.longitude,
        parkLat,
        parkLon
      );
      console.log('[CheckIn] Distance to park:', distance, 'meters');

      if (distance > CHECK_IN_RADIUS_METERS) {
        throw new Error(
          `You're ${Math.round(distance)}m away. You need to be within ${CHECK_IN_RADIUS_METERS}m of the park to check in.`
        );
      }

      const record: CheckInRecord = {
        teamId,
        timestamp: Date.now(),
        parkName,
      };
      const updated = [record, ...checkIns];
      setCheckIns(updated);
      saveMutation.mutate(updated);
      return record;
    },
    [checkIns, saveMutation]
  );

  const getCheckInsForTeam = useCallback(
    (teamId: string) => {
      return checkIns.filter((c) => c.teamId === teamId);
    },
    [checkIns]
  );

  const getLastCheckIn = useCallback(
    (teamId: string): CheckInRecord | undefined => {
      return checkIns.find((c) => c.teamId === teamId);
    },
    [checkIns]
  );

  const getTotalCheckIns = useCallback(
    (teamId: string) => {
      return checkIns.filter((c) => c.teamId === teamId).length;
    },
    [checkIns]
  );

  return {
    checkIns,
    performCheckIn,
    getCheckInsForTeam,
    getLastCheckIn,
    getTotalCheckIns,
    isLoading: checkInsQuery.isLoading,
  };
});
