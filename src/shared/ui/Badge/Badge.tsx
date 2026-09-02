import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../theme';

export type BadgeVariant = 'income' | 'expense' | 'transfer' | 'info' | 'warning' | 'neutral';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.textBase, styles[`text_${variant}`], textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  textBase: {
    ...typography.caption,
    fontWeight: '600',
  },
  // Variants
  income: {
    backgroundColor: colors.incomeBackground,
    borderWidth: 1,
    borderColor: colors.incomeBorder,
  },
  expense: {
    backgroundColor: colors.expenseBackground,
    borderWidth: 1,
    borderColor: colors.expenseBorder,
  },
  transfer: {
    backgroundColor: colors.transferBackground,
    borderWidth: 1,
    borderColor: colors.transferBorder,
  },
  info: {
    backgroundColor: colors.infoBackground,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  warning: {
    backgroundColor: colors.warningBackground,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  neutral: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Text Colors
  text_income: {
    color: colors.income,
  },
  text_expense: {
    color: colors.expense,
  },
  text_transfer: {
    color: colors.transfer,
  },
  text_info: {
    color: colors.info,
  },
  text_warning: {
    color: colors.warning,
  },
  text_neutral: {
    color: colors.textSecondary,
  },
});
