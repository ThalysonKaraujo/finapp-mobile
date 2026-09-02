import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Category, categoryApi } from '@/entities/category';
import { Transaction, transactionApi } from '@/entities/transaction';

export type TransactionFilter = 'ALL' | 'INCOME' | 'EXPENSE';

export function useTransactionsFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>('ALL');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const fetchTransactions = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (pageNum === 1 && transactions.length === 0) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const [response, catList] = await Promise.all([
          transactionApi.getTransactions(pageNum, 30),
          categoryApi.getCategories().catch(() => []),
        ]);

        if (pageNum === 1) {
          setTransactions(response.data);
        } else {
          setTransactions((prev) => [...prev, ...response.data]);
        }
        setCategories(catList);
        setHasMore(response.meta.page < response.meta.totalPages);
        setPage(pageNum);
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar transações.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [transactions.length],
  );

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(1);
    }, [fetchTransactions]),
  );

  const onRefresh = useCallback(() => {
    fetchTransactions(1, true);
  }, [fetchTransactions]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchTransactions(page + 1);
    }
  }, [isLoading, hasMore, page, fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (
        filter === 'INCOME' &&
        t.type !== 'INCOME' &&
        t.type !== 'TRANSFER_IN'
      ) {
        return false;
      }
      if (
        filter === 'EXPENSE' &&
        t.type !== 'EXPENSE' &&
        t.type !== 'TRANSFER_OUT'
      ) {
        return false;
      }

      if (selectedCategoryId) {
        const catId = t.categoryId || (t as any).category_id || t.category?.id;
        if (catId !== selectedCategoryId) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filter, selectedCategoryId]);

  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const item of transactions) {
      if (item.type === 'INCOME' || item.type === 'TRANSFER_IN') {
        totalIncome += item.amount;
      } else if (item.type === 'EXPENSE' || item.type === 'TRANSFER_OUT') {
        totalExpense += item.amount;
      }
    }

    const netBalance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      netBalance,
    };
  }, [transactions]);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };

  return {
    transactions: filteredTransactions,
    rawTransactions: transactions,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    isLoading,
    isRefreshing,
    error,
    filter,
    setFilter,
    metrics,
    isBalanceVisible,
    toggleBalanceVisibility,
    onRefresh,
    loadMore,
  };
}
