import { useFocusEffect } from '@react-navigation/native';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  PieChart,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MonthlyReport, reportApi } from '@/entities/report';
import { formatCentsToBRL } from '@/shared/lib';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '@/shared/theme';
import {
  Card,
  EmptyState,
  Header,
  ProgressBar,
  ScreenWrapper,
} from '@/shared/ui';

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const ReportsPage: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchReport = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const data = await reportApi.getMonthlySummary(
          selectedMonth,
          selectedYear,
        );
        setReport(data);
      } catch {
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedMonth, selectedYear],
  );

  useFocusEffect(
    useCallback(() => {
      fetchReport();
    }, [fetchReport]),
  );

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const totalExpenses = report?.expenses || 0;

  return (
    <ScreenWrapper
      scrollable
      refreshing={isRefreshing}
      onRefresh={() => fetchReport(true)}
    >
      <Header title='Relatórios Mensais' />

      <View style={styles.monthNavigator}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePreviousMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.monthTitle}>
          {MONTH_NAMES[selectedMonth - 1]} de {selectedYear}
        </Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNextMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronRight size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : (
        <>
          <Card variant='outlined' padding='lg' style={styles.summaryCard}>
            <Text style={styles.cardSectionTitle}>Resumo do Período</Text>

            <View style={styles.metricRow}>
              <View style={styles.metricCol}>
                <View
                  style={[styles.metricDot, { backgroundColor: colors.income }]}
                >
                  <ArrowDownLeft size={14} color='#FFFFFF' />
                </View>
                <View>
                  <Text style={styles.metricLabel}>Receitas</Text>
                  <Text style={[styles.metricValue, { color: colors.income }]}>
                    {formatCentsToBRL(report?.incomes || 0)}
                  </Text>
                </View>
              </View>

              <View style={styles.dividerVertical} />

              <View style={styles.metricCol}>
                <View
                  style={[
                    styles.metricDot,
                    { backgroundColor: colors.expense },
                  ]}
                >
                  <ArrowUpRight size={14} color='#FFFFFF' />
                </View>
                <View>
                  <Text style={styles.metricLabel}>Despesas</Text>
                  <Text style={[styles.metricValue, { color: colors.expense }]}>
                    {formatCentsToBRL(report?.expenses || 0)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.dividerHorizontal} />

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Saldo do Mês</Text>
              <Text
                style={[
                  styles.balanceValue,
                  (report?.balance || 0) >= 0
                    ? { color: colors.primary }
                    : { color: colors.expense },
                ]}
              >
                {formatCentsToBRL(report?.balance || 0)}
              </Text>
            </View>
          </Card>

          <Card variant='outlined' padding='lg' style={styles.categoryCard}>
            <Text style={styles.cardSectionTitle}>Gastos por Categoria</Text>

            {report?.expensesByCategory &&
            report.expensesByCategory.length > 0 ? (
              report.expensesByCategory.map((cat) => {
                const categoryPercentage =
                  totalExpenses > 0
                    ? Math.round((cat.total / totalExpenses) * 100)
                    : 0;

                return (
                  <View key={cat.categoryId} style={styles.categoryItem}>
                    <View style={styles.categoryInfoRow}>
                      <View style={styles.categoryNameContainer}>
                        <View
                          style={[
                            styles.categoryColorDot,
                            { backgroundColor: cat.color || colors.primary },
                          ]}
                        />
                        <Text style={styles.categoryName}>{cat.name}</Text>
                      </View>

                      <View style={styles.categoryAmountContainer}>
                        <Text style={styles.categoryAmount}>
                          {formatCentsToBRL(cat.total)}
                        </Text>
                        <Text style={styles.categoryPercent}>
                          ({categoryPercentage}%)
                        </Text>
                      </View>
                    </View>

                    <ProgressBar
                      progress={categoryPercentage}
                      color={cat.color || colors.primary}
                      height={6}
                    />
                  </View>
                );
              })
            ) : (
              <EmptyState
                icon={<PieChart size={28} color={colors.primary} />}
                title='Sem despesas categorizadas'
                description='Nenhuma despesa vinculada a categorias foi encontrada neste mês.'
              />
            )}
          </Card>
        </>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  monthNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.md,
    ...shadows.sm,
  },
  navButton: {
    padding: spacing.xs,
  },
  monthTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  cardSectionTitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metricDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metricValue: {
    ...typography.subtitle,
    fontWeight: '700',
    fontSize: 14,
  },
  dividerVertical: {
    width: 1,
    height: 36,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.sm,
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  balanceValue: {
    ...typography.h3,
    fontWeight: '800',
  },
  categoryCard: {
    marginBottom: spacing.xxl,
  },
  categoryItem: {
    marginBottom: spacing.md,
  },
  categoryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  categoryAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryAmount: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  categoryPercent: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
