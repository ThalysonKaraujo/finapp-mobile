import { Lock, Mail, User as UserIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RegisterSchema, useAuthStore } from '@/features/auth';
import { borderRadius, colors, spacing, typography } from '@/shared/theme';
import { Button, Card, Header, Input, ScreenWrapper } from '@/shared/ui';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    setErrors({});
    clearError();

    const validation = RegisterSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      const result = await signUp(name.trim(), email.trim(), password);

      if (result.requiresVerification) {
        Alert.alert(
          'Conta criada com sucesso!',
          'Enviamos um e-mail de confirmação para sua caixa de entrada. Por favor, confirme seu e-mail antes de fazer login.',
          [{ text: 'Ir para o Login', onPress: onNavigateToLogin }],
        );
      }
    } catch (_err: any) {}
  };

  return (
    <ScreenWrapper backgroundColor={colors.surface} scrollable>
      <Header title='' onBack={onNavigateToLogin} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            Comece a organizar suas finanças em poucos segundos.
          </Text>
        </View>

        <Card variant='outlined' padding='lg' style={styles.card}>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <Input
            label='Nome completo'
            placeholder='Como quer ser chamado?'
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            autoCapitalize='words'
            leftIcon={<UserIcon size={20} color={colors.textSecondary} />}
            error={errors.name}
          />

          <Input
            label='E-mail'
            placeholder='seu.email@exemplo.com'
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
            error={errors.email}
          />

          <Input
            label='Senha'
            placeholder='No mínimo 6 caracteres'
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: '' }));
            }}
            isPassword
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
            error={errors.password}
          />

          <Input
            label='Confirmar senha'
            placeholder='Repita sua senha'
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }
            }}
            isPassword
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
            error={errors.confirmPassword}
          />

          <Button
            title='Criar conta'
            onPress={handleRegister}
            loading={isLoading}
            size='lg'
            style={styles.submitButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já possui uma conta?</Text>
          <TouchableOpacity
            onPress={onNavigateToLogin}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.loginLink}> Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
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
  loginLink: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '700',
  },
});
