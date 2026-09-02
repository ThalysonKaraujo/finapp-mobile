import {
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Layers,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Category, categoryApi } from '@/entities/category';
import { Wallet, walletApi } from '@/entities/wallet';
import { useCreateTransaction } from '@/features/create-transaction';
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

interface CreateTransactionPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateTransactionPage: React.FC<CreateTransactionPageProps> = ({
  onBack,
  onSuccess,
}) => {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amountCents, setAmountCents] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [installments, setInstallments] = useState('');
  const [walletId, setWalletId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadAuxiliaryData() {
      try {
        const [walletsList, categoriesList] = await Promise.all([
          walletApi.getWallets(),
          categoryApi.getCategories(),
        ]);
        setWallets(walletsList);
        setCategories(categoriesList);
      } catch {
        // Handled silently
      }
    }
    loadAuxiliaryData();
  }, []);

  const { submit, isLoading, error, validationErrors, clearErrors } =
    useCreateTransaction(() => {
      Alert.alert('Sucesso', 'Transação registrada com sucesso!', [
        { text: 'OK', onPress: onSuccess },
      ]);
    });

  const handleSubmit = async () => {
    clearErrors();

    if (amountCents <= 0) {
      Alert.alert('Atenção', 'Informe um valor maior que zero.');
      return;
    }

    const payload = {
      title: title.trim(),
      amount: amountCents,
      type,
      date: date.toISOString(),
      walletId,
      categoryId,
      installments: installments
        ? Number.parseInt(installments, 10)
        : undefined,
    };

    await submit(payload);
  };

  return (
    <ScreenWrapper scrollable>
      <Header title='Nova Transação' onBack={onBack} />

      {/* Type Selector Tabs */}
      <View style={styles.typeSelectorContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setType('EXPENSE')}
          style={[
            styles.typeTab,
            type === 'EXPENSE' ? styles.expenseTabActive : styles.tabInactive,
          ]}
        >
          <ArrowUpRight
            size={18}
            color={type === 'EXPENSE' ? colors.expense : colors.textSecondary}
          />
          <Text
            style={[
              styles.typeTabText,
              type === 'EXPENSE' && styles.expenseTextActive,
            ]}
          >
            Despesa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setType('INCOME')}
          style={[
            styles.typeTab,
            type === 'INCOME' ? styles.incomeTabActive : styles.tabInactive,
          ]}
        >
          <ArrowDownLeft
            size={18}
            color={type === 'INCOME' ? colors.income : colors.textSecondary}
          />
          <Text
            style={[
              styles.typeTabText,
              type === 'INCOME' && styles.incomeTextActive,
            ]}
          >
            Receita
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Amount Input */}
      <Card variant='outlined' padding='lg' style={styles.amountCard}>
        <AmountInput
          valueCents={amountCents}
          onChangeCents={setAmountCents}
          type={type}
          label='Valor da transação'
          error={validationErrors.amount}
        />
      </Card>

      {/* Form Fields Card */}
      <Card variant='outlined' padding='lg' style={styles.formCard}>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <Input
          label='Título / Descrição'
          placeholder='Ex: Supermercado, Salário, Internet'
          value={title}
          onChangeText={setTitle}
          leftIcon={<FileText size={20} color={colors.textSecondary} />}
          error={validationErrors.title}
        />

        {/* Category Selector if available */}
        {categories.length > 0 && (
          <View style={styles.selectorSection}>
            <Text style={styles.selectorLabel}>Categoria (Opcional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {categories.map((cat) => {
                const isSelected = cat.id === categoryId;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.7}
                    onPress={() =>
                      setCategoryId(isSelected ? undefined : cat.id)
                    }
                    style={[
                      styles.selectorPill,
                      isSelected && styles.selectorPillSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.catDot,
                        { backgroundColor: cat.color || colors.primary },
                      ]}
                    />
                    <Text
                      style={[
                        styles.selectorPillText,
                        isSelected && styles.selectorPillTextSelected,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Wallet Selector if available */}
        {wallets.length > 0 && (
          <View style={styles.selectorSection}>
            <Text style={styles.selectorLabel}>
              Carteira / Conta (Opcional)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {wallets.map((w) => {
                const isSelected = w.id === walletId;
                return (
                  <TouchableOpacity
                    key={w.id}
                    activeOpacity={0.7}
                    onPress={() => setWalletId(isSelected ? undefined : w.id)}
                    style={[
                      styles.selectorPill,
                      isSelected && styles.selectorPillSelected,
                    ]}
                  >
                    <WalletIcon
                      size={14}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.selectorPillText,
                        isSelected && styles.selectorPillTextSelected,
                      ]}
                    >
                      {w.name} ({formatCentsToBRL(w.balance)})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <DatePickerInput
          label='Data da transação'
          value={date}
          onChange={setDate}
          error={validationErrors.date}
        />

        {type === 'EXPENSE' && (
          <Input
            label='Parcelamento (Opcional)'
            placeholder='Ex: 1 para única, 12 para 12x'
            value={installments}
            onChangeText={setInstallments}
            keyboardType='numeric'
            leftIcon={<Layers size={20} color={colors.textSecondary} />}
            helperText='Deixe em branco para transação única'
            error={validationErrors.installments}
          />
        )}

        <Button
          title={type === 'EXPENSE' ? 'Adicionar Despesa' : 'Adicionar Receita'}
          variant={type === 'EXPENSE' ? 'danger' : 'primary'}
          size='lg'
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitBtn}
        />
      </Card>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  typeSelectorContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  typeTab: {
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
  expenseTabActive: {
    backgroundColor: colors.expenseBackground,
    borderWidth: 1.5,
    borderColor: colors.expense,
  },
  incomeTabActive: {
    backgroundColor: colors.incomeBackground,
    borderWidth: 1.5,
    borderColor: colors.income,
  },
  typeTabText: {
    ...typography.subtitle,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  expenseTextActive: {
    color: colors.expense,
    fontWeight: '700',
  },
  incomeTextActive: {
    color: colors.income,
    fontWeight: '700',
  },
  amountCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  formCard: {
    marginBottom: spacing.xxl,
  },
  selectorSection: {
    marginBottom: spacing.base,
  },
  selectorLabel: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  horizontalScroll: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  selectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  selectorPillSelected: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectorPillText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  selectorPillTextSelected: {
    color: colors.primary,
    fontWeight: '700',
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
  submitBtn: {
    marginTop: spacing.md,
  },
});
