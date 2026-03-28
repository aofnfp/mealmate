import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Crown, Music, BarChart3, Palette, ShieldOff } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { usePremiumStore } from '@/store/premium-store';

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
}

const FEATURES = [
  { icon: Music, label: 'All ambient sounds' },
  { icon: BarChart3, label: 'Detailed analytics' },
  { icon: Palette, label: 'Premium themes' },
  { icon: ShieldOff, label: 'No ads' },
];

export default function Paywall({ visible, onClose }: PaywallProps) {
  const { colors } = useTheme();
  const { isLoading, buyMonthly, buyAnnual, restore } = usePremiumStore();

  const handleMonthly = useCallback(async () => {
    const success = await buyMonthly();
    if (success) {
      onClose();
      Alert.alert('Welcome to Premium!', 'Enjoy all FocusFlow features.');
    }
  }, [buyMonthly, onClose]);

  const handleAnnual = useCallback(async () => {
    const success = await buyAnnual();
    if (success) {
      onClose();
      Alert.alert('Welcome to Premium!', 'Enjoy all FocusFlow features.');
    }
  }, [buyAnnual, onClose]);

  const handleRestore = useCallback(async () => {
    const success = await restore();
    if (success) {
      onClose();
      Alert.alert('Restored!', 'Your premium access has been restored.');
    } else {
      Alert.alert('No Purchases Found', 'We could not find any previous purchases.');
    }
  }, [restore, onClose]);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    crownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: 20,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 14,
    },
    featureText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    planCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1.5,
      borderColor: colors.outline,
      marginBottom: 10,
    },
    planCardHighlight: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}08`,
    },
    planRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    planTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    planPrice: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
    planSub: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    saveBadge: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.accent,
      backgroundColor: `${colors.accent}15`,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      overflow: 'hidden',
      marginTop: 6,
      alignSelf: 'flex-start',
    },
    restoreBtn: {
      alignItems: 'center',
      marginTop: 16,
    },
    restoreText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      textDecorationLine: 'underline',
    },
    disclaimer: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 14,
      lineHeight: 16,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
          <View style={styles.header}>
            <View style={styles.crownRow}>
              <Crown size={24} color={colors.accent} />
              <Text style={styles.title}>Go Premium</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Unlock all sounds, detailed stats, premium themes, and remove ads.
          </Text>

          {FEATURES.map(({ icon: Icon, label }) => (
            <View key={label} style={styles.featureRow}>
              <Icon size={18} color={colors.primary} />
              <Text style={styles.featureText}>{label}</Text>
            </View>
          ))}

          <View style={{ height: 20 }} />

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              {/* Annual plan (best value) */}
              <TouchableOpacity
                style={[styles.planCard, styles.planCardHighlight]}
                onPress={handleAnnual}
                activeOpacity={0.7}
              >
                <View style={styles.planRow}>
                  <Text style={styles.planTitle}>Annual</Text>
                  <Text style={styles.planPrice}>$29.99/yr</Text>
                </View>
                <Text style={styles.planSub}>$2.50/mo — billed annually</Text>
                <Text style={styles.saveBadge}>SAVE 58%</Text>
              </TouchableOpacity>

              {/* Monthly plan */}
              <TouchableOpacity
                style={styles.planCard}
                onPress={handleMonthly}
                activeOpacity={0.7}
              >
                <View style={styles.planRow}>
                  <Text style={styles.planTitle}>Monthly</Text>
                  <Text style={styles.planPrice}>$4.99/mo</Text>
                </View>
                <Text style={styles.planSub}>Cancel anytime</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
                <Text style={styles.restoreText}>Restore purchases</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.disclaimer}>
            Payment charged to your App Store or Google Play account. Subscription
            automatically renews unless cancelled at least 24 hours before the
            end of the current period.
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
