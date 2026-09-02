import { ArrowDownLeft, ArrowUpRight, Repeat } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Transaction } from '@/entities/transaction';
import { formatCentsToBRL, formatDateFriendly } from '@/shared/lib';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '@/shared/theme';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const isIncome =
    transaction.type === 'INCOME' || transaction.type === 'TRANSFER_IN';
  const isTransfer =
    transaction.type === 'TRANSFER_IN' || transaction.type === 'TRANSFER_OUT';

  const getIcon = () => {
    if (isTransfer) {
      return <Repeat size={18} color={colors.transfer} />;
    }
    if (isIncome) {
      return <ArrowDownLeft size={18} color={colors.income} />;
    }
    return <ArrowUpRight size={18} color={colors.expense} />;
  };

  const getIconBg = () => {
    if (isTransfer) return colors.transferBackground;
    if (isIncome) return colors.incomeBackground;
    return colors.expenseBackground;
  };

  const formattedAmount = formatCentsToBRL(transaction.amount);
  const displaySign = isIncome ? '+' : '-';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(transaction)}
      style={styles.card}
    >
      <View style={[styles.iconWrapper, { backgroundColor: getIconBg() }]}>
        {getIcon()}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {transaction.title}
          </Text>
          {transaction.installmentNumber && transaction.totalInstallments && (
            <View style={styles.installmentBadge}>
              <Text style={styles.installmentText}>
                {transaction.installmentNumber}/{transaction.totalInstallments}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {formatDateFriendly(transaction.date)}
          </Text>

          {transaction.category && (
            <View style={styles.categoryPill}>
              <View
                style={[
                  styles.categoryDot,
                  {
                    backgroundColor:
                      transaction.category.color || colors.primary,
                  },
                ]}
              />
              <Text style={styles.categoryText} numberOfLines={1}>
                {transaction.category.name}
              </Text>
            </View>
          )}

          {transaction.wallet && (
            <Text style={styles.walletText} numberOfLines={1}>
              • {transaction.wallet.name}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            isIncome ? styles.incomeAmount : styles.expenseAmount,
          ]}
        >
          {displaySign} {formattedAmount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '600',
    flexShrink: 1,
  },
  installmentBadge: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xs,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  installmentText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
    flexWrap: 'wrap',
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: borderRadius.full,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  walletText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  amount: {
    ...typography.subtitle,
    fontWeight: '700',
    fontSize: 14,
  },
  incomeAmount: {
    color: colors.income,
  },
  expenseAmount: {
    color: colors.textPrimary,
  },
});
