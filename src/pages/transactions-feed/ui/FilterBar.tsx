import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme';
import { TransactionFilter } from '../model/useTransactionsFeed';

interface FilterBarProps {
  currentFilter: TransactionFilter;
  onSelectFilter: (filter: TransactionFilter) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onSelectFilter,
}) => {
  const filters: { key: TransactionFilter; label: string }[] = [
    { key: 'ALL', label: 'Todas' },
    { key: 'INCOME', label: 'Receitas' },
    { key: 'EXPENSE', label: 'Despesas' },
  ];

  return (
    <View style={styles.container}>
      {filters.map((item) => {
        const isActive = currentFilter === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.7}
            onPress={() => onSelectFilter(item.key)}
            style={[
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                isActive ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  pill: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    ...typography.subtitle,
    fontSize: 13,
  },
  pillTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  pillTextInactive: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
