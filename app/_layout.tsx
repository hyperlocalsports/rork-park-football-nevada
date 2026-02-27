import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { PurchasesProvider } from "@/providers/PurchasesProvider";
import { CityProvider } from "@/providers/CityProvider";
import { TeamProvider, useTeam } from "@/providers/TeamProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { useRouter, useSegments } from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { hasLoaded, hasSelectedTeam } = useTeam();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!hasLoaded) return;
    const onWelcome = segments[0] === 'welcome';
    if (!hasSelectedTeam && !onWelcome) {
      router.replace('/welcome');
    } else if (hasSelectedTeam && onWelcome) {
      router.replace('/(tabs)/(home)');
    }
  }, [hasLoaded, hasSelectedTeam, segments]);

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.accent,
        headerTitleStyle: { color: Colors.text },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="team"
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TeamProvider>
          <CityProvider>
            <PurchasesProvider>
                {Platform.OS === 'web' ? (
                  <View style={{ flex: 1 }}>
                    <StatusBar style="light" />
                    <RootLayoutNav />
                  </View>
                ) : (
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <StatusBar style="light" />
                    <RootLayoutNav />
                  </GestureHandlerRootView>
                )}
            </PurchasesProvider>
          </CityProvider>
        </TeamProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
