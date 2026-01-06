'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTransactions, useFinancialStats, useMonthlyTrend, useCategoryBreakdown } from '@/lib/hooks/useTransactions';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus,
  LogOut
} from 'lucide-react';
import { LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function DashboardClient() {
  const { transactions, deleteTransaction, loading, refreshTransactions } = useTransactions();
  const stats = useFinancialStats();
  const [chartPeriod, setChartPeriod] = useState(6);
  const monthlyTrend = useMonthlyTrend(chartPeriod);
  const [userName, setUserName] = useState('');

  // Buscar nome do usuário
  useState(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => setUserName(data.user?.name || ''))
        .catch(() => {});
    }
  });

  // Saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };
  const expenseBreakdown = useCategoryBreakdown('expense');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mapeamento completo de categorias com ícones
  const categoryData: Record<string, { name: string; icon: string }> = {
    // Despesas Fixas
    'aluguel': { name: 'Aluguel/Financiamento', icon: '🏠' },
    'condominio': { name: 'Condomínio', icon: '🏢' },
    'iptu': { name: 'IPTU', icon: '📄' },
    'veiculo': { name: 'Parcelas de Veículos', icon: '🚗' },
    'seguros': { name: 'Seguros', icon: '🛡️' },
    'mensalidades': { name: 'Mensalidades (escola, academia)', icon: '🎓' },
    'assinaturas': { name: 'Assinaturas (streaming, celular)', icon: '📱' },
    // Despesas Variáveis
    'agua': { name: 'Água', icon: '💧' },
    'luz': { name: 'Luz', icon: '💡' },
    'gas': { name: 'Gás', icon: '🔥' },
    'internet': { name: 'Internet', icon: '🌐' },
    'combustivel': { name: 'Combustível', icon: '⛽' },
    // Despesas Essenciais
    'alimentacao': { name: 'Alimentação', icon: '🛒' },
    'saude': { name: 'Saúde (plano, remédios)', icon: '⚕️' },
    'transporte': { name: 'Transporte', icon: '🚌' },
    'vestuario': { name: 'Vestuário', icon: '👔' },
    'educacao': { name: 'Educação', icon: '📚' },
    'higiene': { name: 'Higiene e Limpeza', icon: '🧼' },
    // Despesas Não Essenciais
    'restaurantes': { name: 'Restaurantes', icon: '🍽️' },
    'entretenimento': { name: 'Entretenimento', icon: '🎮' },
    'compras': { name: 'Compras (roupas, acessórios)', icon: '🛍️' },
    'viagens': { name: 'Viagens', icon: '✈️' },
    'hobbies': { name: 'Hobbies', icon: '🎨' },
    'luxos': { name: 'Luxos', icon: '💎' },
    'outros_despesa': { name: 'Outros', icon: '📦' },
    // Receitas
    'salario': { name: 'Salário (CLT)', icon: '💼' },
    'freelance': { name: 'Freelance', icon: '💻' },
    'negocios': { name: 'Negócios Próprios', icon: '🏪' },
    'investimentos': { name: 'Investimentos', icon: '📈' },
    'aluguel_renda': { name: 'Aluguel (renda)', icon: '🏠' },
    'pensao': { name: 'Pensão/Aposentadoria', icon: '🧓' },
    'outros': { name: 'Outros', icon: '💰' }
  };

  // Buscar categorias escolhidas do localStorage
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [userIncomes, setUserIncomes] = useState<string[]>([]);

  useState(() => {
    if (typeof window !== 'undefined') {
      const savedExpenseCategories = localStorage.getItem('expenseCategories');
      const savedIncomeCategories = localStorage.getItem('incomeCategories');
      
      if (savedExpenseCategories) {
        setUserCategories(JSON.parse(savedExpenseCategories));
      }
      if (savedIncomeCategories) {
        setUserIncomes(JSON.parse(savedIncomeCategories));
      }
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCurrencyInput = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    
    // Converte para número e divide por 100 para ter centavos
    const amount = parseFloat(numbers) / 100;
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const parseCurrencyInput = (value: string): number => {
    // Remove R$, pontos e substitui vírgula por ponto
    const numbers = value.replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(numbers) || 0;
  };

  const getCategoryId = async (categoryName: string, categoryType: string): Promise<string | null> => {
    if (!categoryName) return null;

    try {
      // Buscar categorias existentes
      const response = await fetch('/api/categories');
      if (!response.ok) return null;
      
      const categories = await response.json();
      const existing = categories.find((cat: any) => cat.name === categoryName);
      
      if (existing) {
        return existing.id;
      }

      // Se não existir, criar nova categoria
      const createResponse = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: [{ name: categoryName, type: categoryType }]
        })
      });

      if (!createResponse.ok) return null;

      // Buscar novamente para pegar o ID
      const refreshResponse = await fetch('/api/categories');
      if (!refreshResponse.ok) return null;
      
      const refreshedCategories = await refreshResponse.json();
      const newCategory = refreshedCategories.find((cat: any) => cat.name === categoryName);
      
      return newCategory?.id || null;
    } catch (error) {
      console.error('Erro ao obter categoryId:', error);
      return null;
    }
  };

  const getIncomeSourceId = async (sourceName: string): Promise<string | null> => {
    if (!sourceName) return null;

    try {
      // Buscar fontes de renda existentes
      const response = await fetch('/api/income-sources');
      if (!response.ok) return null;
      
      const sources = await response.json();
      const existing = sources.find((src: any) => src.name === sourceName);
      
      if (existing) {
        return existing.id;
      }

      // Se não existir, criar nova fonte
      const createResponse = await fetch('/api/income-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomeSources: [{ name: sourceName }] })
      });

      if (!createResponse.ok) return null;

      // Buscar novamente para pegar o ID
      const refreshResponse = await fetch('/api/income-sources');
      if (!refreshResponse.ok) return null;
      
      const refreshedSources = await refreshResponse.json();
      const newSource = refreshedSources.find((src: any) => src.name === sourceName);
      
      return newSource?.id || null;
    } catch (error) {
      console.error('Erro ao obter incomeSourceId:', error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir múltiplos cliques
    if (isSubmitting) return;
    
    if (!amount || !description) return;
    
    const parsedAmount = parseCurrencyInput(amount);
    if (parsedAmount <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Obter IDs corretos do banco de dados
      let categoryId = null;
      let incomeSourceId = null;

      if (transactionType === 'expense' && category) {
        categoryId = await getCategoryId(category, 'expense');
      } else if (transactionType === 'income' && category) {
        incomeSourceId = await getIncomeSourceId(category);
      }
      
      // Criar transação com IDs corretos
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: transactionType,
          amount: parsedAmount,
          description,
          categoryId,
          incomeSourceId,
          date: new Date(date).toISOString(),
          recurring: isRecurring,
          frequency: isRecurring ? recurringFrequency : null
        })
      });

      if (response.ok) {
        // Atualizar lista de transações preservando scroll
        await refreshTransactions(true);

        // Reset form
        setAmount('');
        setDescription('');
        setCategory('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setIsRecurring(false);
        setShowAddModal(false);
      } else {
        alert('Erro ao adicionar transação');
      }
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      alert('Erro ao adicionar transação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      // Deletar todas as transações
      await Promise.all(transactions.map(t => deleteTransaction(t.id)));
      setShowDeleteAllModal(false);
      alert('Todas as transações foram deletadas!');
    } catch (error) {
      console.error('Erro ao deletar transações:', error);
      alert('Erro ao deletar transações');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo.svg" 
              alt="MyPocket Logo" 
              width={192} 
              height={192}
              className="w-48 h-48"
            />
            <div>
              <h1 className="text-4xl font-bold text-slate-800 font-dm-serif">My Pocket</h1>
              <p className="text-lg text-slate-600 mt-1">
                {getGreeting()}{userName && `, ${userName}`}! 👋
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteAllModal(true)}
              className="px-4 py-2 border-2 border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 hover:border-red-400 transition-all cursor-pointer"
              title="Resetar conta"
            >
              Resetar conta
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-800 bg-white rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer"
              title="Sair da conta"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Saldo</p>
                <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.balance)}
                </p>
              </div>
              <Wallet className="w-12 h-12 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Receitas</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-300" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Despesas</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(stats.totalExpense)}
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-300" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Tendência Mensal</h2>
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(Number(e.target.value))}
                className="px-3 py-1 border-2 border-slate-300 rounded-lg text-slate-800 font-medium bg-white hover:border-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
              >
                <option value={1}>1 Mês</option>
                <option value={3}>3 Meses</option>
                <option value={6}>6 Meses</option>
                <option value={12}>1 Ano</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" name="Receita" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Despesa" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Despesas por Categoria</h2>
            {expenseBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => {
                      const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#a855f7', '#d946ef', '#0ea5e9'];
                      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend 
                    formatter={(value, entry: any) => `${value} (${formatCurrency(entry.payload.value)})`}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                <p>Nenhuma despesa cadastrada ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Transações Recentes</h2>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setTransactionType('income');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Adicionar Receita
              </button>
              <button
                onClick={() => {
                  setTransactionType('expense');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Adicionar Despesa
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? '💰' : '💳'}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{transaction.description}</div>
                    <div className="text-sm text-slate-500">
                      {transaction.category?.name} • {format(new Date(transaction.date), 'dd/MM/yyyy')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-xl font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </div>
                  <button
                    onClick={() => {
                      setTransactionToDelete(transaction.id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Excluir transação"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">
                {transactionType === 'income' ? 'Nova Receita' : 'Nova Despesa'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Valor</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      setAmount(formatted);
                    }}
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg placeholder:text-slate-400 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Descrição</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Compras no mercado"
                    minLength={3}
                    maxLength={100}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg placeholder:text-slate-400 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    {transactionType === 'income' ? 'Fonte de Renda' : 'Categoria'}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                    {(transactionType === 'income' ? userIncomes : userCategories).map((catId) => {
                      const catData = categoryData[catId];
                      const isSelected = category === (catData?.name || catId);
                      return (
                        <button
                          key={catId}
                          type="button"
                          onClick={() => setCategory(catData?.name || catId)}
                          className={`flex items-start gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer min-w-0 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="text-2xl flex-shrink-0 leading-none">{catData?.icon || '📌'}</span>
                          <span className="text-xs font-medium text-slate-700 text-left break-words leading-tight min-w-0 flex-1">
                            {catData?.name || catId}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg placeholder:text-slate-400 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    id="recurring"
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="recurring" className="text-slate-700 font-medium cursor-pointer">Recorrente</label>
                  {isRecurring && (
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value as 'monthly' | 'yearly')}
                      className="px-3 py-2 border-2 border-slate-300 rounded-lg text-slate-800 font-medium bg-white cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="monthly">Mensal</option>
                      <option value="yearly">Anual</option>
                    </select>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-400 transition-colors cursor-pointer shadow-md"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">
                Confirmar Exclusão
              </h3>
              <p className="text-slate-600 mb-6">
                Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (transactionToDelete) {
                      deleteTransaction(transactionToDelete);
                    }
                    setShowDeleteModal(false);
                    setTransactionToDelete(null);
                  }}
                  className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors cursor-pointer shadow-md"
                >
                  Sim, Excluir
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTransactionToDelete(null);
                  }}
                  className="flex-1 bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-400 transition-colors cursor-pointer shadow-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão em Massa */}
        {showDeleteAllModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-red-600">
                ⚠️ Resetar Conta
              </h3>
              <p className="text-slate-600 mb-6">
                Ao resetar sua conta, <strong>todas as {transactions.length} transações serão permanentemente perdidas</strong>. Esta ação não pode ser desfeita. Tem certeza que deseja continuar?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAll}
                  className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors cursor-pointer shadow-md"
                >
                  Sim, Resetar Conta
                </button>
                <button
                  onClick={() => setShowDeleteAllModal(false)}
                  className="flex-1 bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-400 transition-colors cursor-pointer shadow-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
