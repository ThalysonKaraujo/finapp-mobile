import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Wallet } from 'lucide-react-native';
import { useAuthStore } from '@/features/auth';
import { borderRadius, colors, spacing, typography } from '@/shared/theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const { isInitializing, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (isInitializing) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoBadge}>
          <Wallet size={36} color={colors.textInverse} />
        </View>
        <Text style={styles.splashTitle}>FinApp</Text>
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.spinner}
        />
      </View>
    );
  }

  return <SafeAreaProvider>{children}</SafeAreaProvider>;
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  splashTitle: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  spinner: {
    marginTop: spacing.xl,
  },
});
