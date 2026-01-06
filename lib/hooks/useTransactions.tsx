import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  recurring: boolean;
  frequency?: string | null;
  category?: { id: string; name: string; type: string } | null;
  incomeSource?: { id: string; name: string } | null;
}

// Contexto para compartilhar transações
const TransactionsContext = createContext<{
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: (preserveScroll?: boolean) => Promise<void>;
} | null>(null);

// Provider do contexto
export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (preserveScroll: boolean = false) => {
    try {
      // Salvar posição do scroll antes de atualizar
      const scrollY = preserveScroll ? window.scrollY : 0;
      
      setLoading(true);
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar transações');
      }

      const data = await response.json();
      setTransactions(data.map((t: any) => ({
        ...t,
        date: new Date(t.date),
      })));
      setError(null);
      
      // Restaurar posição do scroll após atualizar
      if (preserveScroll) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transaction,
          categoryId: transaction.category?.id,
          incomeSourceId: transaction.incomeSource?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar transação');
      }

      await fetchTransactions(true);
    } catch (err) {
      throw err;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transaction,
          categoryId: transaction.category?.id,
          incomeSourceId: transaction.incomeSource?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar transação');
      }

      await fetchTransactions(true);
    } catch (err) {
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar transação');
      }

      await fetchTransactions(true);
    } catch (err) {
      throw err;
    }
  };

  return (
    <TransactionsContext.Provider value={{
      transactions,
      loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      refreshTransactions: fetchTransactions,
    }}>
      {children}
    </TransactionsContext.Provider>
  );
}

// Hook principal - Gerencia transações
export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions deve ser usado dentro de TransactionsProvider');
  }
  return context;
}

// Hook para estatísticas financeiras
export function useFinancialStats() {
  const { transactions } = useTransactions();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Estatísticas do mês atual
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.date >= monthStart && t.date <= monthEnd)
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter(t => t.type === 'expense' && t.date >= monthStart && t.date <= monthEnd)
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance,
    monthlyIncome,
    monthlyExpense,
    monthlyBalance: monthlyIncome - monthlyExpense,
  };
}

// Hook para tendência mensal
export function useMonthlyTrend(months: number = 6) {
  const { transactions } = useTransactions();

  const trend = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const targetDate = subMonths(now, i);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);

    const income = transactions
      .filter(t => t.type === 'income' && t.date >= monthStart && t.date <= monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense' && t.date >= monthStart && t.date <= monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    trend.push({
      month: format(targetDate, 'MMM/yy'),
      income,
      expense,
      balance: income - expense,
    });
  }

  return trend;
}

// Hook para breakdown por categoria
export function useCategoryBreakdown(type: 'income' | 'expense') {
  const { transactions } = useTransactions();

  const filtered = transactions.filter(t => t.type === type);

  const categories = type === 'expense' 
    ? Array.from(new Set(filtered.map(t => t.category?.name).filter(Boolean)))
    : Array.from(new Set(filtered.map(t => t.incomeSource?.name).filter(Boolean)));

  const result = categories.map(cat => {
    const amount = filtered
      .filter(t => type === 'expense' ? t.category?.name === cat : t.incomeSource?.name === cat)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      name: cat as string,
      value: amount,
      percentage: 0, // Será calculado depois
    };
  }).filter(item => item.value > 0);

  const total = result.reduce((sum, item) => sum + item.value, 0);
  result.forEach(item => {
    item.percentage = total > 0 ? (item.value / total) * 100 : 0;
  });

  return result.sort((a, b) => b.value - a.value);
}
