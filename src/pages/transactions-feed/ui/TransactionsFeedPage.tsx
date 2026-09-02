import { LogOut, Plus, Receipt } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Transaction } from '@/entities/transaction';
import { useAuthStore } from '@/features/auth';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '@/shared/theme';
import { EmptyState, ScreenWrapper } from '@/shared/ui';
import { useTransactionsFeed } from '../model/useTransactionsFeed';
import { BalanceCard } from './BalanceCard';
import { FilterBar } from './FilterBar';
import { TransactionItem } from './TransactionItem';

interface TransactionsFeedPageProps {
  onNavigateToCreate: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
}

export const TransactionsFeedPage: React.FC<TransactionsFeedPageProps> = ({
  onNavigateToCreate,
  onSelectTransaction,
}) => {
  const { user, signOut } = useAuthStore();
  const {
    transactions,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    isLoading,
    isRefreshing,
    filter,
    setFilter,
    metrics,
    isBalanceVisible,
    toggleBalanceVisibility,
    onRefresh,
    loadMore,
  } = useTransactionsFeed();

  const handleSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza de que deseja encerrar sua sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => signOut() },
      ],
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Bem-vindo'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.logoutButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <LogOut size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onPress={onSelectTransaction} />
        )}
        ListHeaderComponent={
          <View>
            <BalanceCard
              netBalance={metrics.netBalance}
              totalIncome={metrics.totalIncome}
              totalExpense={metrics.totalExpense}
              isVisible={isBalanceVisible}
              onToggleVisibility={toggleBalanceVisibility}
            />

            <View style={styles.feedHeader}>
              <Text style={styles.feedTitle}>Transações</Text>
              <FilterBar currentFilter={filter} onSelectFilter={setFilter} />

              {categories.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryFilterContainer}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedCategoryId(null)}
                    style={[
                      styles.categoryFilterPill,
                      !selectedCategoryId
                        ? styles.categoryFilterPillActive
                        : styles.categoryFilterPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryFilterText,
                        !selectedCategoryId
                          ? styles.categoryFilterTextActive
                          : styles.categoryFilterTextInactive,
                      ]}
                    >
                      Todas
                    </Text>
                  </TouchableOpacity>

                  {categories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() =>
                          setSelectedCategoryId(isSelected ? null : cat.id)
                        }
                        style={[
                          styles.categoryFilterPill,
                          isSelected
                            ? styles.categoryFilterPillActive
                            : styles.categoryFilterPillInactive,
                        ]}
                      >
                        {cat.color && (
                          <View
                            style={[
                              styles.catDot,
                              { backgroundColor: cat.color },
                            ]}
                          />
                        )}
                        <Text
                          style={[
                            styles.categoryFilterText,
                            isSelected
                              ? styles.categoryFilterTextActive
                              : styles.categoryFilterTextInactive,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={colors.primary} />
            </View>
          ) : (
            <EmptyState
              icon={<Receipt size={32} color={colors.primary} />}
              title='Nenhuma transação encontrada'
              description={
                filter === 'ALL' && !selectedCategoryId
                  ? 'Você ainda não registrou movimentações. Toque no botão abaixo para adicionar sua primeira transação.'
                  : 'Nenhuma transação encontrada para este filtro.'
              }
              actionTitle={
                filter === 'ALL' && !selectedCategoryId
                  ? 'Nova Transação'
                  : undefined
              }
              onAction={
                filter === 'ALL' && !selectedCategoryId
                  ? onNavigateToCreate
                  : undefined
              }
            />
          )
        }
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onNavigateToCreate}
        style={styles.fab}
      >
        <Plus size={24} color={colors.textInverse} />
        <Text style={styles.fabText}>Nova</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: '700',
  },
  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  feedHeader: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  feedTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  categoryFilterContainer: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  categoryFilterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryFilterPillInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  categoryFilterText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  categoryFilterTextActive: {
    color: colors.surface,
  },
  categoryFilterTextInactive: {
    color: colors.textSecondary,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  listContent: {
    paddingBottom: 90,
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.base,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    ...shadows.lg,
  },
  fabText: {
    ...typography.subtitle,
    color: colors.textInverse,
    fontWeight: '700',
  },
});
