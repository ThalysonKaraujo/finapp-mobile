import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Lock, Mail, ShieldCheck, Wallet } from 'lucide-react-native';
import { LoginSchema, useAuthStore } from '@/features/auth';
import { Button, Card, Input, ScreenWrapper } from '@/shared/ui';
import { borderRadius, colors, spacing, typography } from '@/shared/theme';

interface LoginPageProps {
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    setErrors({});
    clearError();

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0] === 'email') fieldErrors.email = issue.message;
        if (issue.path[0] === 'password') fieldErrors.password = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      // Error handled by store
    }
  };

  return (
    <ScreenWrapper backgroundColor={colors.surface} scrollable>
      <View style={styles.container}>
        {/* Header Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Wallet size={32} color={colors.primary} />
          </View>
          <Text style={styles.brandTitle}>FinApp</Text>
          <Text style={styles.brandSubtitle}>
            Gestão financeira inteligente, transparente e descomplicada.
          </Text>
        </View>

        {/* Login Card */}
        <Card variant="outlined" padding="lg" style={styles.card}>
          <Text style={styles.formTitle}>Acesse sua conta</Text>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <Input
            label="E-mail"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
            error={errors.email}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            isPassword
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
            error={errors.password}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
            style={styles.submitButton}
          />
        </Card>

        {/* Register CTA */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={onNavigateToRegister} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.registerLink}> Criar conta</Text>
          </TouchableOpacity>
        </View>

        {/* Security badge */}
        <View style={styles.securityBadge}>
          <ShieldCheck size={16} color={colors.textMuted} />
          <Text style={styles.securityText}>Conexão criptografada de ponta a ponta</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xxl,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  brandTitle: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
  },
  formTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    backgroundColor: colors.expenseBackground,
    borderWidth: 1,
    borderColor: colors.expenseBorder,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorBannerText: {
    ...typography.bodySmall,
    color: colors.expense,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '700',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    gap: 6,
  },
  securityText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
