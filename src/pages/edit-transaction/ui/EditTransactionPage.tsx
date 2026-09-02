import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  FileText,
  Layers,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Category, categoryApi } from '@/entities/category';
import {
  Transaction,
  transactionApi,
  UpdateTransactionInput,
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

interface EditTransactionPageProps {
  transaction: Transaction;
  onBack: () => void;
  onSuccess: () => void;
}

export const EditTransactionPage: React.FC<EditTransactionPageProps> = ({
  transaction,
  onBack,
  onSuccess,
}) => {
  const isTransfer =
    transaction.type === 'TRANSFER_IN' || transaction.type === 'TRANSFER_OUT';
  const initialType: 'INCOME' | 'EXPENSE' =
    transaction.type === 'INCOME' ? 'INCOME' : 'EXPENSE';

  const [type, setType] = useState<'INCOME' | 'EXPENSE'>(initialType);
  const [amountCents, setAmountCents] = useState<number>(transaction.amount);
  const [title, setTitle] = useState(transaction.title);
  const [date, setDate] = useState<Date>(new Date(transaction.date));
  const [walletId, setWalletId] = useState<string | undefined>(
    transaction.walletId || (transaction as any).wallet_id || undefined,
  );
  const [categoryId, setCategoryId] = useState<string | undefined>(
    transaction.categoryId || (transaction as any).category_id || undefined,
  );
  const [updateFutureInstallments, setUpdateFutureInstallments] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } catch {}
    }
    loadAuxiliaryData();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || title.trim().length < 2) {
      Alert.alert(
        'Atenção',
        'O título da transação deve ter pelo menos 2 caracteres.',
      );
      return;
    }

    if (amountCents <= 0) {
      Alert.alert('Atenção', 'Informe um valor maior que zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpdateTransactionInput = {
        title: title.trim(),
        amount: amountCents,
        type: isTransfer ? undefined : type,
        date: date.toISOString(),
        walletId: walletId || undefined,
        categoryId: categoryId || undefined,
        updateFutureInstallments: transaction.recurrenceId
          ? updateFutureInstallments
          : undefined,
      };

      await transactionApi.updateTransaction(transaction.id, payload);
      Alert.alert('Sucesso', 'Transação atualizada com sucesso!', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Erro',
        err?.response?.data?.message ||
          err?.message ||
          'Falha ao atualizar a transação.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper scrollable>
      <Header title='Editar Transação' onBack={onBack} />

      {!isTransfer ? (
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
      ) : (
        <Card variant='outlined' padding='md' style={styles.transferBadgeCard}>
          <Text style={styles.transferBadgeText}>
            {transaction.type === 'TRANSFER_IN'
              ? 'Transferência Recebida'
              : 'Transferência Enviada'}
          </Text>
        </Card>
      )}

      <Card variant='outlined' padding='lg' style={styles.amountCard}>
        <Text style={styles.amountLabel}>Valor da Transação</Text>
        <AmountInput
          valueCents={amountCents}
          onChangeCents={setAmountCents}
          type={type}
        />
        <Text style={styles.amountHelper}>
          {amountCents > 0
            ? `${type === 'INCOME' ? '+' : '-'} ${formatCentsToBRL(amountCents)}`
            : 'R$ 0,00'}
        </Text>
      </Card>

      <Card variant='outlined' padding='lg' style={styles.formCard}>
        <Input
          label='Título / Descrição'
          placeholder='Ex: Aluguel, Salário, Mercado...'
          value={title}
          onChangeText={setTitle}
          leftIcon={<FileText size={18} color={colors.textSecondary} />}
        />

        {wallets.length > 0 && (
          <View style={styles.selectorSection}>
            <View style={styles.selectorHeader}>
              <WalletIcon size={16} color={colors.primary} />
              <Text style={styles.selectorLabel}>Carteira / Conta</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsContainer}
            >
              <TouchableOpacity
                onPress={() => setWalletId(undefined)}
                style={[
                  styles.pill,
                  !walletId ? styles.pillSelected : styles.pillUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    !walletId
                      ? styles.pillTextSelected
                      : styles.pillTextUnselected,
                  ]}
                >
                  Nenhuma
                </Text>
              </TouchableOpacity>
              {wallets.map((w) => (
                <TouchableOpacity
                  key={w.id}
                  onPress={() => setWalletId(w.id)}
                  style={[
                    styles.pill,
                    walletId === w.id
                      ? styles.pillSelected
                      : styles.pillUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      walletId === w.id
                        ? styles.pillTextSelected
                        : styles.pillTextUnselected,
                    ]}
                  >
                    {w.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {categories.length > 0 && (
          <View style={styles.selectorSection}>
            <View style={styles.selectorHeader}>
              <Layers size={16} color={colors.primary} />
              <Text style={styles.selectorLabel}>Categoria</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsContainer}
            >
              <TouchableOpacity
                onPress={() => setCategoryId(undefined)}
                style={[
                  styles.pill,
                  !categoryId ? styles.pillSelected : styles.pillUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    !categoryId
                      ? styles.pillTextSelected
                      : styles.pillTextUnselected,
                  ]}
                >
                  Nenhuma
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  style={[
                    styles.pill,
                    categoryId === cat.id
                      ? styles.pillSelected
                      : styles.pillUnselected,
                  ]}
                >
                  {cat.color && (
                    <View
                      style={[styles.catDot, { backgroundColor: cat.color }]}
                    />
                  )}
                  <Text
                    style={[
                      styles.pillText,
                      categoryId === cat.id
                        ? styles.pillTextSelected
                        : styles.pillTextUnselected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <DatePickerInput
          label='Data da Transação'
          value={date}
          onChange={setDate}
        />

        {transaction.recurrenceId && (
          <View style={styles.recurrenceOption}>
            <View style={styles.recurrenceTextContainer}>
              <Text style={styles.recurrenceTitle}>
                Atualizar parcelas futuras
              </Text>
              <Text style={styles.recurrenceDescription}>
                Aplicar alterações para esta e todas as próximas parcelas da
                recorrência.
              </Text>
            </View>
            <Switch
              value={updateFutureInstallments}
              onValueChange={setUpdateFutureInstallments}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
            />
          </View>
        )}
      </Card>

      <Button
        title='Salvar Alterações'
        size='lg'
        leftIcon={<Check size={20} color={colors.surface} />}
        onPress={handleSubmit}
        loading={isSubmitting}
        style={styles.submitButton}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  typeSelectorContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  tabInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  expenseTabActive: {
    backgroundColor: colors.expenseBackground,
    borderColor: colors.expense,
  },
  incomeTabActive: {
    backgroundColor: colors.incomeBackground,
    borderColor: colors.income,
  },
  typeTabText: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  expenseTextActive: {
    color: colors.expense,
    fontWeight: '700',
  },
  incomeTextActive: {
    color: colors.income,
    fontWeight: '700',
  },
  transferBadgeCard: {
    alignItems: 'center',
    marginVertical: spacing.md,
    backgroundColor: colors.surfaceSubtle,
  },
  transferBadgeText: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: '600',
  },
  amountCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  amountLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountHelper: {
    ...typography.subtitle,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  formCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  selectorSection: {
    marginVertical: spacing.xs,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  selectorLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  pillsContainer: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillUnselected: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
  },
  pillText: {
    ...typography.caption,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: colors.surface,
  },
  pillTextUnselected: {
    color: colors.textSecondary,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recurrenceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  recurrenceTextContainer: {
    flex: 1,
  },
  recurrenceTitle: {
    ...typography.subtitle,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  recurrenceDescription: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  submitButton: {
    marginBottom: spacing.xxl,
  },
});
