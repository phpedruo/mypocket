'use client';

import React, { useState } from 'react';
import { useTransactions, useFinancialStats, useMonthlyTrend, useCategoryBreakdown } from '@/lib/hooks/useTransactions';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus,
  Download,
  Upload
} from 'lucide-react';
import { LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function DashboardClient() {
  const { transactions, addTransaction, deleteTransaction, exportTransactions, importTransactions, loading } = useTransactions();
  const stats = useFinancialStats();
  const [chartPeriod, setChartPeriod] = useState(6);
  const monthlyTrend = useMonthlyTrend(chartPeriod);
  const expenseBreakdown = useCategoryBreakdown('expense');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'yearly'>('monthly');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) return;
    
    await addTransaction({
      type: transactionType,
      amount: parseFloat(amount),
      description,
      category: category ? { id: '', name: category, type: transactionType } : null,
      date: new Date(date),
      recurring: isRecurring,
      frequency: isRecurring ? recurringFrequency : null
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setIsRecurring(false);
    setShowAddModal(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importTransactions(file);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">💰 MyPocket</h1>
          <div className="flex gap-3">
            <button
              onClick={exportTransactions}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer">
              <Upload className="w-5 h-5" />
              Importar
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
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
                className="px-3 py-1 border border-slate-300 rounded-lg"
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
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${formatCurrency(entry.value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => {
                    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                  })}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </RechartsPie>
            </ResponsiveContainer>
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
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                <Plus className="w-5 h-5" />
                Adicionar Receita
              </button>
              <button
                onClick={() => {
                  setTransactionType('expense');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-red-500 hover:text-red-700"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">
                {transactionType === 'income' ? 'Nova Receita' : 'Nova Despesa'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    id="recurring"
                  />
                  <label htmlFor="recurring">Recorrente</label>
                  {isRecurring && (
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value as 'monthly' | 'yearly')}
                      className="px-3 py-1 border border-slate-300 rounded-lg"
                    >
                      <option value="monthly">Mensal</option>
                      <option value="yearly">Anual</option>
                    </select>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
