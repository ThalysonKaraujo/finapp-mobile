import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff } from 'lucide-react-native';
import { formatCentsToBRL } from '@/shared/lib';
import { borderRadius, colors, shadows, spacing, typography } from '@/shared/theme';

interface BalanceCardProps {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  netBalance,
  totalIncome,
  totalExpense,
  isVisible,
  onToggleVisibility,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Header inside card */}
      <View style={styles.topRow}>
        <Text style={styles.label}>Saldo Disponível</Text>
        <TouchableOpacity
          onPress={onToggleVisibility}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.eyeButton}
        >
          {isVisible ? (
            <Eye size={18} color={colors.textInverse} opacity={0.8} />
          ) : (
            <EyeOff size={18} color={colors.textInverse} opacity={0.8} />
          )}
        </TouchableOpacity>
      </View>

      {/* Main Balance Display */}
      <Text style={styles.balanceAmount}>
        {isVisible ? formatCentsToBRL(netBalance) : '••••••••'}
      </Text>

      {/* Income & Expense Badges */}
      <View style={styles.metricsContainer}>
        {/* Income */}
        <View style={styles.metricItem}>
          <View style={[styles.metricIconCircle, styles.incomeIconBg]}>
            <ArrowDownLeft size={16} color={colors.income} />
          </View>
          <View>
            <Text style={styles.metricLabel}>Receitas</Text>
            <Text style={styles.metricValue}>
              {isVisible ? formatCentsToBRL(totalIncome) : '••••'}
            </Text>
          </View>
        </View>

        <View style={styles.metricDivider} />

        {/* Expense */}
        <View style={styles.metricItem}>
          <View style={[styles.metricIconCircle, styles.expenseIconBg]}>
            <ArrowUpRight size={16} color={colors.expense} />
          </View>
          <View>
            <Text style={styles.metricLabel}>Despesas</Text>
            <Text style={styles.metricValue}>
              {isVisible ? formatCentsToBRL(totalExpense) : '••••'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textInverse,
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  eyeButton: {
    padding: 2,
  },
  balanceAmount: {
    ...typography.currencyLarge,
    color: colors.textInverse,
    marginBottom: spacing.lg,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: spacing.sm,
  },
  metricIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  expenseIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textInverse,
    opacity: 0.85,
  },
  metricValue: {
    ...typography.subtitle,
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 13,
  },
});
