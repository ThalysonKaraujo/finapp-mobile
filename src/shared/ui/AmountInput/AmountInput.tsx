import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { formatCentsToBRL, parseRawDigitsToCents } from '../../lib';
import { colors, spacing, typography } from '../../theme';

export interface AmountInputProps {
  valueCents: number;
  onChangeCents: (cents: number) => void;
  type?: 'INCOME' | 'EXPENSE' | 'DEFAULT';
  label?: string;
  error?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  valueCents,
  onChangeCents,
  type = 'DEFAULT',
  label = 'Valor',
  error,
}) => {
  const handleChangeText = (text: string) => {
    const cents = parseRawDigitsToCents(text);
    onChangeCents(cents);
  };

  const getTextColor = () => {
    if (type === 'INCOME') return colors.income;
    if (type === 'EXPENSE') return colors.expense;
    return colors.primary;
  };

  const formattedValue = formatCentsToBRL(valueCents);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <Text style={[styles.amountDisplay, { color: getTextColor() }]}>
          {formattedValue}
        </Text>

        <TextInput
          style={styles.hiddenInput}
          keyboardType='numeric'
          value={valueCents === 0 ? '' : String(valueCents)}
          onChangeText={handleChangeText}
          caretHidden
          contextMenuHidden
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.base,
    alignItems: 'center',
    width: '100%',
  },
  label: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 12,
  },
  inputWrapper: {
    position: 'relative',
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  amountDisplay: {
    ...typography.currencyLarge,
    textAlign: 'center',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    color: 'transparent',
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.expense,
    marginTop: spacing.xs,
  },
});
