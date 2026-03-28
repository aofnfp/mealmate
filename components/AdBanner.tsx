import React from 'react';
import { View, Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_ID } from '@/lib/ads';
import { usePremiumStore } from '@/store/premium-store';

interface AdBannerProps {
  style?: object;
}

export default function AdBanner({ style }: AdBannerProps) {
  const isPremium = usePremiumStore((s) => s.isPremium);

  if (isPremium || Platform.OS === 'web' || !BANNER_ID) return null;

  return (
    <View style={[{ alignItems: 'center', paddingVertical: 8 }, style]}>
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
