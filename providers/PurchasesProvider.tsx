import React from 'react';
import { Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';

type PurchasesOffering = any;
type PurchasesPackage = any;
type CustomerInfo = any;

const isWeb = Platform.OS === 'web';

function getRCToken(): string {
  if (__DEV__ || isWeb) {
    return process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ?? '';
  }
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? '',
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? '',
    default: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ?? '',
  }) ?? '';
}

let rcConfigured = false;
async function ensureRCConfigured() {
  if (isWeb || rcConfigured) return;
  const apiKey = getRCToken();
  if (!apiKey || apiKey.trim().length < 20) {
    console.log('[Purchases] Skipped: no valid API key');
    return;
  }
  try {
    const Purchases = (await import('react-native-purchases')).default;
    const { LOG_LEVEL } = await import('react-native-purchases');
    Purchases.setLogLevel(LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey });
    rcConfigured = true;
    console.log('[Purchases] RevenueCat configured');
  } catch {
    console.log('[Purchases] RevenueCat not available on this platform');
  }
}

async function getPurchasesModule() {
  if (isWeb) return null;
  await ensureRCConfigured();
  if (!rcConfigured) return null;
  const Purchases = (await import('react-native-purchases')).default;
  return Purchases;
}

export const [PurchasesProvider, usePurchases] = createContextHook(() => {
  const queryClient = useQueryClient();

  const offeringsQuery = useQuery<PurchasesOffering | null>({
    queryKey: ['rc_offerings'],
    queryFn: async () => {
      const Purchases = await getPurchasesModule();
      if (!Purchases) return null;
      console.log('[Purchases] Fetching offerings...');
      const offerings = await Purchases.getOfferings();
      console.log('[Purchases] Offerings:', JSON.stringify(offerings?.current?.identifier));
      return offerings.current ?? null;
    },
    staleTime: 1000 * 60 * 5,
  });

  const customerInfoQuery = useQuery<CustomerInfo | null>({
    queryKey: ['rc_customer_info'],
    queryFn: async () => {
      const Purchases = await getPurchasesModule();
      if (!Purchases) return null;
      console.log('[Purchases] Fetching customer info...');
      const info = await Purchases.getCustomerInfo();
      console.log('[Purchases] Active entitlements:', Object.keys(info.entitlements.active));
      return info;
    },
    staleTime: 1000 * 30,
  });

  const purchaseMutation = useMutation<CustomerInfo, Error, PurchasesPackage>({
    mutationFn: async (pkg: PurchasesPackage) => {
      const Purchases = await getPurchasesModule();
      if (!Purchases) throw new Error('Purchases not supported on this platform');
      console.log('[Purchases] Purchasing package:', pkg.identifier);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    },
    onSuccess: (customerInfo) => {
      console.log('[Purchases] Purchase success');
      queryClient.setQueryData(['rc_customer_info'], customerInfo);
      queryClient.invalidateQueries({ queryKey: ['rc_customer_info'] });
    },
    onError: (error) => {
      console.error('[Purchases] Purchase error:', error.message);
    },
  });

  const restoreMutation = useMutation<CustomerInfo, Error, void>({
    mutationFn: async () => {
      const Purchases = await getPurchasesModule();
      if (!Purchases) throw new Error('Purchases not supported on this platform');
      console.log('[Purchases] Restoring purchases...');
      const info = await Purchases.restorePurchases();
      return info;
    },
    onSuccess: (customerInfo) => {
      console.log('[Purchases] Restore success');
      queryClient.setQueryData(['rc_customer_info'], customerInfo);
      queryClient.invalidateQueries({ queryKey: ['rc_customer_info'] });
    },
    onError: (error) => {
      console.error('[Purchases] Restore error:', error.message);
    },
  });

  const isParkSupporter = !!customerInfoQuery.data?.entitlements.active['park_supporter'];

  const monthlyPackage = offeringsQuery.data?.availablePackages.find(
    (pkg: any) => pkg.packageType === 'MONTHLY' || pkg.identifier === '$rc_monthly'
  ) ?? null;

  return {
    offering: offeringsQuery.data ?? null,
    monthlyPackage,
    customerInfo: customerInfoQuery.data ?? null,
    isParkSupporter,
    isLoadingOfferings: offeringsQuery.isLoading,
    isLoadingCustomerInfo: customerInfoQuery.isLoading,
    purchase: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    restorePurchases: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
  };
});
