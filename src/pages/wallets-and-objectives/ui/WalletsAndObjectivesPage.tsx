import { useFocusEffect } from '@react-navigation/native';
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Target,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Objective, objectiveApi } from '@/entities/objective';
import { Wallet, walletApi } from '@/entities/wallet';
import { formatCentsToBRL, formatDateShort } from '@/shared/lib';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '@/shared/theme';
import {
  Button,
  Card,
  EmptyState,
  Header,
  ProgressBar,
  ScreenWrapper,
} from '@/shared/ui';

interface WalletsAndObjectivesPageProps {
  onNavigateToCreateWallet: () => void;
  onNavigateToCreateObjective: () => void;
  onNavigateToTransfer: () => void;
  onNavigateToDepositWithdraw: (
    objective: Objective,
    mode: 'DEPOSIT' | 'WITHDRAW',
  ) => void;
}

export const WalletsAndObjectivesPage: React.FC<
  WalletsAndObjectivesPageProps
> = ({
  onNavigateToCreateWallet,
  onNavigateToCreateObjective,
  onNavigateToTransfer,
  onNavigateToDepositWithdraw,
}) => {
  const [activeTab, setActiveTab] = useState<'WALLETS' | 'OBJECTIVES'>(
    'WALLETS',
  );
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [walletsData, objectivesData] = await Promise.all([
        walletApi.getWallets(),
        objectiveApi.getObjectives(),
      ]);
      setWallets(walletsData);
      setObjectives(objectivesData);
    } catch {
      // Handled silently with empty states
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const totalWalletsBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
  const totalObjectivesSaved = objectives.reduce(
    (acc, o) => acc + o.currentAmount,
    0,
  );

  return (
    <ScreenWrapper>
      <Header title='Carteiras & Metas' />

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('WALLETS')}
          style={[
            styles.tabButton,
            activeTab === 'WALLETS' && styles.tabButtonActive,
          ]}
        >
          <WalletIcon
            size={18}
            color={
              activeTab === 'WALLETS' ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'WALLETS' && styles.tabButtonTextActive,
            ]}
          >
            Carteiras ({wallets.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('OBJECTIVES')}
          style={[
            styles.tabButton,
            activeTab === 'OBJECTIVES' && styles.tabButtonActive,
          ]}
        >
          <Target
            size={18}
            color={
              activeTab === 'OBJECTIVES' ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'OBJECTIVES' && styles.tabButtonTextActive,
            ]}
          >
            Metas ({objectives.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Summary Card */}
      <Card variant='default' padding='lg' style={styles.heroCard}>
        <Text style={styles.heroLabel}>
          {activeTab === 'WALLETS'
            ? 'Saldo Total em Carteiras'
            : 'Total Poupado em Metas'}
        </Text>
        <Text style={styles.heroAmount}>
          {formatCentsToBRL(
            activeTab === 'WALLETS'
              ? totalWalletsBalance
              : totalObjectivesSaved,
          )}
        </Text>

        <View style={styles.heroActions}>
          {activeTab === 'WALLETS' ? (
            <>
              <Button
                title='Transferir'
                variant='outline'
                size='sm'
                leftIcon={<ArrowRightLeft size={16} color={colors.primary} />}
                onPress={onNavigateToTransfer}
                style={styles.heroBtn}
              />
              <Button
                title='+ Nova Carteira'
                variant='primary'
                size='sm'
                onPress={onNavigateToCreateWallet}
                style={styles.heroBtn}
              />
            </>
          ) : (
            <Button
              title='+ Nova Meta'
              variant='primary'
              size='sm'
              onPress={onNavigateToCreateObjective}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </Card>

      {/* Main List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : activeTab === 'WALLETS' ? (
        <FlatList
          data={wallets}
          keyExtractor={(item) => item.id}
          refreshing={isRefreshing}
          onRefresh={() => loadData(true)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card variant='outlined' padding='md' style={styles.itemCard}>
              <View style={styles.walletRow}>
                <View style={styles.walletIconCircle}>
                  <WalletIcon size={20} color={colors.primary} />
                </View>
                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>{item.name}</Text>
                  <Text style={styles.walletBalance}>
                    {formatCentsToBRL(item.balance)}
                  </Text>
                </View>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<WalletIcon size={32} color={colors.primary} />}
              title='Nenhuma carteira cadastrada'
              description='Cadastre suas contas bancárias ou carteiras para gerenciar seus saldos.'
              actionTitle='Criar Primeira Carteira'
              onAction={onNavigateToCreateWallet}
            />
          }
        />
      ) : (
        <FlatList
          data={objectives}
          keyExtractor={(item) => item.id}
          refreshing={isRefreshing}
          onRefresh={() => loadData(true)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const percentage = Math.round(
              (item.currentAmount / item.targetAmount) * 100,
            );
            return (
              <Card variant='outlined' padding='md' style={styles.itemCard}>
                <View style={styles.objectiveHeader}>
                  <Text style={styles.objectiveTitle}>{item.name}</Text>
                  <Text style={styles.objectivePercentage}>{percentage}%</Text>
                </View>

                <ProgressBar
                  progress={percentage}
                  color={percentage >= 100 ? colors.income : colors.primary}
                  height={8}
                />

                <View style={styles.objectiveAmountsRow}>
                  <Text style={styles.objectiveSaved}>
                    {formatCentsToBRL(item.currentAmount)}
                  </Text>
                  <Text style={styles.objectiveTarget}>
                    Meta: {formatCentsToBRL(item.targetAmount)}
                  </Text>
                </View>

                {item.deadline && (
                  <Text style={styles.deadlineText}>
                    Prazo: {formatDateShort(item.deadline)}
                  </Text>
                )}

                <View style={styles.objectiveActionsRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.depositBtn]}
                    onPress={() => onNavigateToDepositWithdraw(item, 'DEPOSIT')}
                  >
                    <ArrowDownLeft size={16} color={colors.income} />
                    <Text style={styles.depositText}>Depositar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.withdrawBtn]}
                    onPress={() =>
                      onNavigateToDepositWithdraw(item, 'WITHDRAW')
                    }
                  >
                    <ArrowUpRight size={16} color={colors.expense} />
                    <Text style={styles.withdrawText}>Resgatar</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon={<Target size={32} color={colors.primary} />}
              title='Nenhuma meta cadastrada'
              description='Defina metas de poupança (ex: Viagem, Carro Novo) e acompanhe seu progresso.'
              actionTitle='Criar Primeira Meta'
              onAction={onNavigateToCreateObjective}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginVertical: spacing.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  tabButtonActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  tabButtonText: {
    ...typography.subtitle,
    color: colors.textSecondary,
    fontSize: 13,
  },
  tabButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    ...typography.currencyLarge,
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  heroBtn: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 90,
  },
  itemCard: {
    marginBottom: spacing.sm,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  walletBalance: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: 2,
  },
  objectiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  objectiveTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  objectivePercentage: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: '800',
  },
  objectiveAmountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  objectiveSaved: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  objectiveTarget: {
    ...typography.caption,
    color: colors.textMuted,
  },
  deadlineText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  objectiveActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  depositBtn: {
    backgroundColor: colors.incomeBackground,
  },
  depositText: {
    ...typography.caption,
    color: colors.income,
    fontWeight: '700',
  },
  withdrawBtn: {
    backgroundColor: colors.expenseBackground,
  },
  withdrawText: {
    ...typography.caption,
    color: colors.expense,
    fontWeight: '700',
  },
});
