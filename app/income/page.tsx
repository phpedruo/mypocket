'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import Image from 'next/image';

const incomeCategories = [
  { id: 'salario', name: 'Salário (CLT)', icon: '💼' },
  { id: 'freelance', name: 'Freelance', icon: '💻' },
  { id: 'negocios', name: 'Negócios Próprios', icon: '🏪' },
  { id: 'investimentos', name: 'Investimentos', icon: '📈' },
  { id: 'aluguel_renda', name: 'Aluguel (renda)', icon: '🏠' },
  { id: 'pensao', name: 'Pensão/Aposentadoria', icon: '🧓' },
  { id: 'outros', name: 'Outros', icon: '💰' }
];

export default function IncomePage() {
  const [userName, setUserName] = useState('');
  const [selectedIncomes, setSelectedIncomes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        router.push('/login');
        return;
      }

      const name = localStorage.getItem('userName');
      if (!name) {
        router.push('/welcome');
      } else {
        setUserName(name);
        setLoading(false);
      }
    } catch {
      router.push('/login');
    }
  };

  const toggleIncome = (incomeId: string) => {
    setSelectedIncomes(prev =>
      prev.includes(incomeId)
        ? prev.filter(id => id !== incomeId)
        : [...prev, incomeId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
      </div>
    );
  }

  const handleContinue = () => {
    if (selectedIncomes.length === 0) {
      alert('Selecione pelo menos uma fonte de renda');
      return;
    }
    localStorage.setItem('incomeCategories', JSON.stringify(selectedIncomes));
    localStorage.setItem('onboardingCompleted', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <Image 
                src="/logo.svg" 
                alt="MyPocket Logo" 
                width={120} 
                height={120}
                className="w-30 h-30"
              />
            </div>
            <span className="text-4xl font-bold text-slate-800 font-raleway">My Pocket</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Perfeito, {userName}! 💚
          </h1>
          <p className="text-xl text-slate-600">
            Agora me conte: quais são suas fontes de renda?
          </p>
        </div>

        {/* Income Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">💵 Fontes de Renda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomeCategories.map(income => (
              <button
                key={income.id}
                onClick={() => toggleIncome(income.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedIncomes.includes(income.id)
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-3xl">{income.icon}</span>
                <span className="flex-1 text-left font-medium text-slate-700">{income.name}</span>
                {selectedIncomes.includes(income.id) && (
                  <Check className="text-green-500" size={24} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600">
              {selectedIncomes.length} fonte{selectedIncomes.length !== 1 ? 's' : ''} de renda selecionada{selectedIncomes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedIncomes.length === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-400 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            Finalizar e Ver Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
