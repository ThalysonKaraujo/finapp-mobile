import {
  Calendar,
  Hash,
  Layers,
  Pencil,
  Tag,
  Trash2,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category, categoryApi } from '@/entities/category';
import { Transaction, transactionApi } from '@/entities/transaction';
import { Wallet, walletApi } from '@/entities/wallet';
import { formatCentsToBRL, formatDateFull } from '@/shared/lib';
import { colors, spacing, typography } from '@/shared/theme';
import { Badge, Button, Card, Header, ScreenWrapper } from '@/shared/ui';

interface TransactionDetailsPageProps {
  transaction: Transaction;
  onBack: () => void;
  onDeleted: () => void;
  onEdit?: () => void;
}

export const TransactionDetailsPage: React.FC<TransactionDetailsPageProps> = ({
  transaction,
  onBack,
  onDeleted,
  onEdit,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const walletId =
    transaction.walletId || (transaction as any).wallet_id || undefined;
  const categoryId =
    transaction.categoryId || (transaction as any).category_id || undefined;

  useEffect(() => {
    async function loadAuxiliaryInfo() {
      try {
        if (walletId) {
          try {
            const w = await walletApi.getWalletById(walletId);
            if (w) setWallet(w);
          } catch {
            const wallets = await walletApi.getWallets();
            const found = wallets.find((item) => item.id === walletId);
            if (found) setWallet(found);
          }
        }

        if (categoryId) {
          const categories = await categoryApi.getCategories();
          const found = categories.find((c) => c.id === categoryId);
          if (found) setCategory(found);
        }
      } catch {
        // Handled silently
      }
    }
    loadAuxiliaryInfo();
  }, [walletId, categoryId]);

  const isIncome =
    transaction.type === 'INCOME' || transaction.type === 'TRANSFER_IN';

  const handleDelete = () => {
    Alert.alert(
      'Excluir Transação',
      'Tem certeza de que deseja remover esta transação? Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await transactionApi.deleteTransaction(transaction.id);
              Alert.alert('Sucesso', 'Transação excluída com sucesso.', [
                { text: 'OK', onPress: onDeleted },
              ]);
            } catch (err: any) {
              Alert.alert(
                'Erro',
                err?.message || 'Falha ao excluir transação.',
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  const getTypeBadge = () => {
    switch (transaction.type) {
      case 'INCOME':
        return <Badge label='Receita' variant='income' />;
      case 'EXPENSE':
        return <Badge label='Despesa' variant='expense' />;
      case 'TRANSFER_IN':
        return <Badge label='Transferência Recebida' variant='transfer' />;
      case 'TRANSFER_OUT':
        return <Badge label='Transferência Enviada' variant='transfer' />;
      default:
        return <Badge label={transaction.type} variant='neutral' />;
    }
  };

  return (
    <ScreenWrapper scrollable>
      <Header
        title='Detalhes da Transação'
        onBack={onBack}
        rightAction={
          onEdit ? (
            <TouchableOpacity onPress={onEdit} style={styles.headerIconButton}>
              <Pencil size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      {/* Hero Card */}
      <Card variant='outlined' padding='lg' style={styles.heroCard}>
        <View style={styles.badgeWrapper}>{getTypeBadge()}</View>

        <Text
          style={[
            styles.amount,
            isIncome ? styles.incomeAmount : styles.expenseAmount,
          ]}
        >
          {isIncome ? '+' : '-'} {formatCentsToBRL(transaction.amount)}
        </Text>

        <Text style={styles.title}>{transaction.title}</Text>
      </Card>

      {/* Info List Card */}
      <Card variant='outlined' padding='lg' style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informações Gerais</Text>

        {/* Date */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrapper}>
            <Calendar size={18} color={colors.primary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>
              {formatDateFull(transaction.date)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Wallet info */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrapper}>
            <WalletIcon size={18} color={colors.primary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Carteira / Conta</Text>
            <Text style={styles.infoValue}>
              {wallet ? wallet.name : walletId ? 'Carregando...' : 'Nenhuma'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Category info if present */}
        {category && (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Tag size={18} color={category.color || colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Categoria</Text>
                <View style={styles.categoryNameRow}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: category.color || colors.primary },
                    ]}
                  />
                  <Text style={styles.infoValue}>{category.name}</Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Installments */}
        {transaction.installmentNumber && (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Layers size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Parcela</Text>
                <Text style={styles.infoValue}>
                  {transaction.installmentNumber} de{' '}
                  {transaction.totalInstallments || 'Recorrente'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Identifier */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrapper}>
            <Hash size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>ID da Transação</Text>
            <Text style={styles.infoValueMuted} numberOfLines={1}>
              {transaction.id}
            </Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {onEdit && (
          <Button
            title='Editar Transação'
            variant='outline'
            size='lg'
            leftIcon={<Pencil size={20} color={colors.primary} />}
            onPress={onEdit}
            style={styles.editButton}
          />
        )}

        <Button
          title='Excluir Transação'
          variant='outline'
          size='lg'
          leftIcon={<Trash2 size={20} color={colors.expense} />}
          textStyle={{ color: colors.expense }}
          onPress={handleDelete}
          loading={isDeleting}
          style={styles.deleteButton}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerIconButton: {
    padding: spacing.xs,
  },
  heroCard: {
    alignItems: 'center',
    marginVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  badgeWrapper: {
    marginBottom: spacing.md,
  },
  amount: {
    ...typography.currencyLarge,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  incomeAmount: {
    color: colors.income,
  },
  expenseAmount: {
    color: colors.textPrimary,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  infoValueMuted: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  categoryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  actionsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  editButton: {
    borderColor: colors.border,
  },
  deleteButton: {
    borderColor: colors.expenseBorder,
  },
});
