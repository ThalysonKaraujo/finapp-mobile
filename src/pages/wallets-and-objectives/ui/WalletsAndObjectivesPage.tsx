import { useFocusEffect } from '@react-navigation/native';
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  CheckCircle2,
  RotateCcw,
  Target,
  Trash2,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  Badge,
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
  const [objectivesSubTab, setObjectivesSubTab] = useState<
    'ACTIVE' | 'COMPLETED'
  >('ACTIVE');
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

  const activeObjectives = objectives.filter((o) => !o.isCompleted);
  const completedObjectives = objectives.filter((o) => o.isCompleted);
  const currentObjectivesList =
    objectivesSubTab === 'ACTIVE' ? activeObjectives : completedObjectives;

  const handleFinalizeObjective = (item: Objective) => {
    Alert.alert(
      'Finalizar Meta 🎉',
      `Deseja marcar a meta "${item.name}" como concluída? Ela será movida para a aba de Concluídas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, Finalizar',
          style: 'default',
          onPress: async () => {
            try {
              await objectiveApi.finalizeObjective(item.id);
              setObjectives((prev) =>
                prev.map((o) =>
                  o.id === item.id ? { ...o, isCompleted: true } : o,
                ),
              );
              Alert.alert('Parabéns! 🚀', `A meta "${item.name}" foi concluída com sucesso!`);
            } catch {
              Alert.alert('Erro', 'Não foi possível finalizar a meta.');
            }
          },
        },
      ],
    );
  };

  const handleReopenObjective = (item: Objective) => {
    Alert.alert(
      'Reabrir Meta',
      `Deseja reabrir a meta "${item.name}" para a aba Em Andamento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reabrir',
          onPress: async () => {
            try {
              await objectiveApi.reopenObjective(item.id);
              setObjectives((prev) =>
                prev.map((o) =>
                  o.id === item.id ? { ...o, isCompleted: false } : o,
                ),
              );
              Alert.alert('Sucesso', `A meta "${item.name}" foi reaberta!`);
            } catch {
              Alert.alert('Erro', 'Não foi possível reabrir a meta.');
            }
          },
        },
      ],
    );
  };

  const handleDeleteObjective = (item: Objective) => {
    Alert.alert(
      'Excluir Meta',
      `Tem certeza que deseja excluir a meta "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await objectiveApi.deleteObjective(item.id);
              setObjectives((prev) => prev.filter((o) => o.id !== item.id));
              Alert.alert('Sucesso', 'Meta excluída com sucesso.');
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a meta.');
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenWrapper>
      <Header title='Carteiras & Metas' />

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

      {activeTab === 'OBJECTIVES' && (
        <View style={styles.subTabContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setObjectivesSubTab('ACTIVE')}
            style={[
              styles.subTabButton,
              objectivesSubTab === 'ACTIVE' && styles.subTabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.subTabButtonText,
                objectivesSubTab === 'ACTIVE' && styles.subTabButtonTextActive,
              ]}
            >
              Em Andamento ({activeObjectives.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setObjectivesSubTab('COMPLETED')}
            style={[
              styles.subTabButton,
              objectivesSubTab === 'COMPLETED' && styles.subTabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.subTabButtonText,
                objectivesSubTab === 'COMPLETED' &&
                  styles.subTabButtonTextActive,
              ]}
            >
              Concluídas ({completedObjectives.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
          data={currentObjectivesList}
          keyExtractor={(item) => item.id}
          refreshing={isRefreshing}
          onRefresh={() => loadData(true)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const percentage = Math.round(
              (item.currentAmount / item.targetAmount) * 100,
            );
            const isDone = item.isCompleted || percentage >= 100;

            return (
              <Card
                variant='outlined'
                padding='md'
                style={[
                  styles.itemCard,
                  item.isCompleted && styles.completedItemCard,
                ]}
              >
                <View style={styles.objectiveHeader}>
                  <View style={styles.titleRow}>
                    <Text style={styles.objectiveTitle}>{item.name}</Text>
                    {item.isCompleted && (
                      <Badge
                        label='Concluída 🎉'
                        variant='income'
                        style={styles.completedBadge}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.objectivePercentage,
                      item.isCompleted && { color: colors.income },
                    ]}
                  >
                    {percentage}%
                  </Text>
                </View>

                <ProgressBar
                  progress={item.isCompleted ? 100 : percentage}
                  color={
                    item.isCompleted
                      ? colors.income
                      : item.color ||
                        (percentage >= 100 ? colors.income : colors.primary)
                  }
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

                {item.isCompleted ? (
                  <View style={styles.objectiveActionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.reopenBtn]}
                      onPress={() => handleReopenObjective(item)}
                    >
                      <RotateCcw size={15} color={colors.primary} />
                      <Text style={styles.reopenText}>Reabrir Meta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.deleteBtn]}
                      onPress={() => handleDeleteObjective(item)}
                    >
                      <Trash2 size={15} color={colors.expense} />
                      <Text style={styles.deleteText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.objectiveActionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.depositBtn]}
                      onPress={() =>
                        onNavigateToDepositWithdraw(item, 'DEPOSIT')
                      }
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

                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        styles.finalizeBtn,
                        isDone && styles.finalizeBtnHighlight,
                      ]}
                      onPress={() => handleFinalizeObjective(item)}
                    >
                      <CheckCircle2
                        size={16}
                        color={isDone ? colors.surface : colors.income}
                      />
                      <Text
                        style={[
                          styles.finalizeText,
                          isDone && styles.finalizeTextHighlight,
                        ]}
                      >
                        Finalizar
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            );
          }}
          ListEmptyComponent={
            objectivesSubTab === 'ACTIVE' ? (
              <EmptyState
                icon={<Target size={32} color={colors.primary} />}
                title='Nenhuma meta em andamento'
                description='Defina metas de poupança (ex: Viagem, Carro Novo) e acompanhe seu progresso.'
                actionTitle='Criar Primeira Meta'
                onAction={onNavigateToCreateObjective}
              />
            ) : (
              <EmptyState
                icon={<CheckCircle2 size={32} color={colors.income} />}
                title='Nenhuma meta concluída'
                description='Quando você concluir ou finalizar uma meta financeira, ela aparecerá aqui no seu histórico de conquistas!'
              />
            )
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
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  subTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
  },
  subTabButtonActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  subTabButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  subTabButtonTextActive: {
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
  completedItemCard: {
    borderColor: colors.incomeBorder,
    backgroundColor: colors.surface,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    flexWrap: 'wrap',
  },
  completedBadge: {
    marginLeft: 4,
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
    gap: spacing.xs,
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
  finalizeBtn: {
    backgroundColor: colors.incomeBackground,
    borderWidth: 1,
    borderColor: colors.incomeBorder,
  },
  finalizeBtnHighlight: {
    backgroundColor: colors.income,
    borderColor: colors.income,
  },
  finalizeText: {
    ...typography.caption,
    color: colors.income,
    fontWeight: '700',
  },
  finalizeTextHighlight: {
    color: colors.surface,
    fontWeight: '800',
  },
  reopenBtn: {
    backgroundColor: colors.primarySubtle,
  },
  reopenText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: colors.expenseBackground,
  },
  deleteText: {
    ...typography.caption,
    color: colors.expense,
    fontWeight: '700',
  },
});
