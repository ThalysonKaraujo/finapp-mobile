import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Objective, objectiveApi } from '@/entities/objective';
import { formatCentsToBRL } from '@/shared/lib';
import { borderRadius, colors, spacing, typography } from '@/shared/theme';
import { AmountInput, Button, Card, Header, ScreenWrapper } from '@/shared/ui';

interface DepositWithdrawObjectivePageProps {
  objective: Objective;
  initialMode?: 'DEPOSIT' | 'WITHDRAW';
  onBack: () => void;
  onSuccess: () => void;
}

export const DepositWithdrawObjectivePage: React.FC<
  DepositWithdrawObjectivePageProps
> = ({ objective, initialMode = 'DEPOSIT', onBack, onSuccess }) => {
  const [mode, setMode] = useState<'DEPOSIT' | 'WITHDRAW'>(initialMode);
  const [amountCents, setAmountCents] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isDeposit = mode === 'DEPOSIT';

  const handleSubmit = async () => {
    if (amountCents <= 0) {
      Alert.alert('Atenção', 'Informe um valor maior que zero.');
      return;
    }

    if (!isDeposit && amountCents > objective.currentAmount) {
      Alert.alert(
        'Saldo Insuficiente',
        `O valor máximo para resgate é ${formatCentsToBRL(objective.currentAmount)}.`,
      );
      return;
    }

    setIsLoading(true);
    try {
      if (isDeposit) {
        await objectiveApi.deposit(objective.id, { amount: amountCents });
      } else {
        await objectiveApi.withdraw(objective.id, { amount: amountCents });
      }

      Alert.alert(
        'Sucesso',
        isDeposit
          ? 'Depósito realizado com sucesso!'
          : 'Resgate realizado com sucesso!',
        [{ text: 'OK', onPress: onSuccess }],
      );
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Falha ao processar operação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable>
      <Header
        title={isDeposit ? 'Depositar na Meta' : 'Resgatar da Meta'}
        onBack={onBack}
      />

      {/* Target Objective Summary */}
      <Card variant='subtle' padding='md' style={styles.objectiveInfo}>
        <Text style={styles.objectiveName}>{objective.name}</Text>
        <Text style={styles.objectiveBalance}>
          Saldo atual: {formatCentsToBRL(objective.currentAmount)}
        </Text>
      </Card>

      {/* Mode Switcher */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setMode('DEPOSIT')}
          style={[
            styles.modeTab,
            isDeposit ? styles.depositTabActive : styles.tabInactive,
          ]}
        >
          <ArrowDownLeft
            size={18}
            color={isDeposit ? colors.income : colors.textSecondary}
          />
          <Text
            style={[styles.modeTabText, isDeposit && styles.depositTextActive]}
          >
            Depositar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setMode('WITHDRAW')}
          style={[
            styles.modeTab,
            !isDeposit ? styles.withdrawTabActive : styles.tabInactive,
          ]}
        >
          <ArrowUpRight
            size={18}
            color={!isDeposit ? colors.expense : colors.textSecondary}
          />
          <Text
            style={[
              styles.modeTabText,
              !isDeposit && styles.withdrawTextActive,
            ]}
          >
            Resgatar
          </Text>
        </TouchableOpacity>
      </View>

      <Card variant='outlined' padding='lg' style={styles.amountCard}>
        <AmountInput
          valueCents={amountCents}
          onChangeCents={setAmountCents}
          type={isDeposit ? 'INCOME' : 'EXPENSE'}
          label='Valor da Operação'
        />

        <Button
          title={isDeposit ? 'Confirmar Depósito' : 'Confirmar Resgate'}
          variant={isDeposit ? 'primary' : 'danger'}
          onPress={handleSubmit}
          loading={isLoading}
          size='lg'
          style={styles.submitBtn}
        />
      </Card>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  objectiveInfo: {
    marginVertical: spacing.sm,
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  objectiveName: {
    ...typography.h3,
    color: colors.primary,
  },
  objectiveBalance: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  tabInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  depositTabActive: {
    backgroundColor: colors.incomeBackground,
    borderWidth: 1.5,
    borderColor: colors.income,
  },
  withdrawTabActive: {
    backgroundColor: colors.expenseBackground,
    borderWidth: 1.5,
    borderColor: colors.expense,
  },
  modeTabText: {
    ...typography.subtitle,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  depositTextActive: {
    color: colors.income,
    fontWeight: '700',
  },
  withdrawTextActive: {
    color: colors.expense,
    fontWeight: '700',
  },
  amountCard: {
    marginBottom: spacing.xxl,
  },
  submitBtn: {
    marginTop: spacing.lg,
  },
});
