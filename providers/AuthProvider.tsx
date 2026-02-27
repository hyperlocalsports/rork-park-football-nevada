import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

const AUTH_STORAGE_KEY = 'auth_user';

export interface AuthUser {
  id: string;
  email: string | null;
  fullName: string | null;
  authProvider: 'apple' | 'guest';
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const authQuery = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      console.log('[AuthProvider] Loaded stored user:', stored);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    },
  });

  useEffect(() => {
    if (authQuery.isSuccess) {
      setUser(authQuery.data ?? null);
      setHasLoaded(true);
    }
  }, [authQuery.isSuccess, authQuery.data]);

  const saveUserMutation = useMutation({
    mutationFn: async (authUser: AuthUser) => {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      console.log('[AuthProvider] Saved user:', authUser.id);
      return authUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });

  const signInWithApple = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Sign in with Apple is only available on iOS devices.');
      return false;
    }

    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Not Available', 'Sign in with Apple is not available on this device.');
        return false;
      }

      const nonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Crypto.getRandomBytes(32).toString()
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      });

      console.log('[AuthProvider] Apple sign in success:', credential.user);

      let fullName: string | null = null;
      if (credential.fullName) {
        const parts = [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean);
        if (parts.length > 0) {
          fullName = parts.join(' ');
        }
      }

      const existingStored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const existingUser = existingStored ? (JSON.parse(existingStored) as AuthUser) : null;

      const authUser: AuthUser = {
        id: credential.user,
        email: credential.email ?? existingUser?.email ?? null,
        fullName: fullName ?? existingUser?.fullName ?? null,
        authProvider: 'apple',
      };

      setUser(authUser);
      saveUserMutation.mutate(authUser);
      return true;
    } catch (error: unknown) {
      const e = error as { code?: string; message?: string };
      if (e.code === 'ERR_REQUEST_CANCELED') {
        console.log('[AuthProvider] User canceled Apple sign in');
        return false;
      }
      console.error('[AuthProvider] Apple sign in error:', e);
      Alert.alert('Sign In Failed', 'Something went wrong. Please try again.');
      return false;
    }
  }, [saveUserMutation]);

  const signInAsGuest = useCallback(async (name: string) => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const authUser: AuthUser = {
      id: guestId,
      email: null,
      fullName: name || 'Park Fan',
      authProvider: 'guest',
    };
    setUser(authUser);
    saveUserMutation.mutate(authUser);
  }, [saveUserMutation]);

  const signOut = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    queryClient.invalidateQueries({ queryKey: ['authUser'] });
    console.log('[AuthProvider] User signed out');
  }, [queryClient]);

  const updateName = useCallback(async (name: string) => {
    if (!user) return;
    const updated = { ...user, fullName: name };
    setUser(updated);
    saveUserMutation.mutate(updated);
  }, [user, saveUserMutation]);

  return {
    user,
    isSignedIn: user !== null,
    hasLoaded,
    signInWithApple,
    signInAsGuest,
    signOut,
    updateName,
  };
});
