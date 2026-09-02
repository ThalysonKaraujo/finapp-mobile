import { ArrowRightLeft, FileText } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  TransferTransactionSchema,
  transactionApi,
} from '@/entities/transaction';
import { Wallet, walletApi } from '@/entities/wallet';
import { formatCentsToBRL } from '@/shared/lib';
import { borderRadius, colors, spacing, typography } from '@/shared/theme';
import {
  AmountInput,
  Button,
  Card,
  DatePickerInput,
  Header,
  Input,
  ScreenWrapper,
} from '@/shared/ui';

interface TransferPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const TransferPage: React.FC<TransferPageProps> = ({
  onBack,
  onSuccess,
}) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [sourceWalletId, setSourceWalletId] = useState('');
  const [destWalletId, setDestWalletId] = useState('');
  const [amountCents, setAmountCents] = useState(0);
  const [title, setTitle] = useState('Transferência entre contas');
  const [date, setDate] = useState<Date>(new Date());
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadWallets() {
      try {
        const list = await walletApi.getWallets();
        setWallets(list);
        if (list.length >= 2) {
          setSourceWalletId(list[0].id);
          setDestWalletId(list[1].id);
        } else if (list.length === 1) {
          setSourceWalletId(list[0].id);
        }
      } catch (err: any) {
        Alert.alert('Erro', err?.message || 'Falha ao carregar carteiras.');
      } finally {
        setIsLoadingWallets(false);
      }
    }
    loadWallets();
  }, []);

  const handleTransfer = async () => {
    setErrors({});
    const validation = TransferTransactionSchema.safeParse({
      sourceWalletId,
      destinationWalletId: destWalletId,
      amount: amountCents,
      title: title.trim(),
      date: date.toISOString(),
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

    setIsSubmitting(true);
    try {
      await transactionApi.transfer(validation.data);
      Alert.alert('Sucesso', 'Transferência realizada com sucesso!', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Falha ao realizar transferência.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingWallets) {
    return (
      <ScreenWrapper>
        <Header title='Transferência' onBack={onBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (wallets.length < 2) {
    return (
      <ScreenWrapper>
        <Header title='Transferência' onBack={onBack} />
        <Card variant='outlined' padding='lg' style={styles.card}>
          <Text style={styles.emptyTitle}>Carteiras Insuficientes</Text>
          <Text style={styles.emptyDescription}>
            Você precisa de pelo menos 2 carteiras cadastradas para realizar uma
            transferência.
          </Text>
          <Button
            title='Voltar'
            variant='outline'
            onPress={onBack}
            style={styles.submitBtn}
          />
        </Card>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable>
      <Header title='Transferência entre Carteiras' onBack={onBack} />

      <Card variant='outlined' padding='lg' style={styles.amountCard}>
        <AmountInput
          valueCents={amountCents}
          onChangeCents={setAmountCents}
          type='DEFAULT'
          label='Valor a transferir'
          error={errors.amount}
        />
      </Card>

      <Card variant='outlined' padding='lg' style={styles.card}>
        <Text style={styles.sectionLabel}>
          Carteira de Origem (De onde sai)
        </Text>
        <View style={styles.walletPills}>
          {wallets.map((w) => {
            const isSelected = w.id === sourceWalletId;
            return (
              <TouchableOpacity
                key={w.id}
                activeOpacity={0.7}
                onPress={() => setSourceWalletId(w.id)}
                style={[
                  styles.walletPill,
                  isSelected && styles.walletPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.walletPillName,
                    isSelected && styles.walletPillTextSelected,
                  ]}
                >
                  {w.name}
                </Text>
                <Text
                  style={[
                    styles.walletPillBalance,
                    isSelected && styles.walletPillTextSelected,
                  ]}
                >
                  {formatCentsToBRL(w.balance)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.sourceWalletId && (
          <Text style={styles.errorText}>{errors.sourceWalletId}</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>
          Carteira de Destino (Para onde vai)
        </Text>
        <View style={styles.walletPills}>
          {wallets.map((w) => {
            const isSelected = w.id === destWalletId;
            return (
              <TouchableOpacity
                key={w.id}
                activeOpacity={0.7}
                onPress={() => setDestWalletId(w.id)}
                style={[
                  styles.walletPill,
                  isSelected && styles.walletPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.walletPillName,
                    isSelected && styles.walletPillTextSelected,
                  ]}
                >
                  {w.name}
                </Text>
                <Text
                  style={[
                    styles.walletPillBalance,
                    isSelected && styles.walletPillTextSelected,
                  ]}
                >
                  {formatCentsToBRL(w.balance)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.destinationWalletId && (
          <Text style={styles.errorText}>{errors.destinationWalletId}</Text>
        )}

        <View style={styles.divider} />

        <Input
          label='Descrição'
          placeholder='Ex: Transferência para Poupança'
          value={title}
          onChangeText={setTitle}
          leftIcon={<FileText size={20} color={colors.textSecondary} />}
          error={errors.title}
        />

        <DatePickerInput
          label='Data da Transferência'
          value={date}
          onChange={setDate}
          error={errors.date}
        />

        <Button
          title='Confirmar Transferência'
          leftIcon={<ArrowRightLeft size={20} color='#FFFFFF' />}
          onPress={handleTransfer}
          loading={isSubmitting}
          size='lg'
          style={styles.submitBtn}
        />
      </Card>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  amountCard: {
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  card: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  walletPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  walletPill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  walletPillSelected: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  walletPillName: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  walletPillBalance: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  walletPillTextSelected: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.base,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.expense,
    marginTop: spacing.xs,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
