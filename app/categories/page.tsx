'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

const expenseCategories = {
  fixed: {
    title: '🏠 Despesas Fixas',
    description: 'Gastos mensais previsíveis e constantes',
    items: [
      { id: 'aluguel', name: 'Aluguel/Financiamento', icon: '🏠' },
      { id: 'condominio', name: 'Condomínio', icon: '🏢' },
      { id: 'iptu', name: 'IPTU', icon: '📄' },
      { id: 'veiculo', name: 'Parcelas de Veículos', icon: '🚗' },
      { id: 'seguros', name: 'Seguros', icon: '🛡️' },
      { id: 'mensalidades', name: 'Mensalidades (escola, academia)', icon: '🎓' },
      { id: 'assinaturas', name: 'Assinaturas (streaming, celular)', icon: '📱' }
    ]
  },
  variable: {
    title: '📊 Despesas Variáveis',
    description: 'Gastos que mudam de acordo com o consumo',
    items: [
      { id: 'alimentacao', name: 'Alimentação (supermercado)', icon: '🛒' },
      { id: 'restaurantes', name: 'Restaurantes', icon: '🍽️' },
      { id: 'transporte', name: 'Transporte (combustível)', icon: '⛽' },
      { id: 'agua', name: 'Água', icon: '💧' },
      { id: 'luz', name: 'Luz', icon: '💡' },
      { id: 'gas', name: 'Gás', icon: '🔥' },
      { id: 'internet', name: 'Internet', icon: '🌐' },
      { id: 'compras', name: 'Compras (roupas, acessórios)', icon: '👕' }
    ]
  },
  essential: {
    title: '❤️ Despesas Essenciais',
    description: 'Necessidades básicas para qualidade de vida',
    items: [
      { id: 'moradia_essencial', name: 'Moradia', icon: '🏡' },
      { id: 'alimentacao_essencial', name: 'Alimentação', icon: '🍎' },
      { id: 'saude', name: 'Saúde (plano, remédios)', icon: '⚕️' },
      { id: 'transporte_essencial', name: 'Transporte básico', icon: '🚌' },
      { id: 'vestuario', name: 'Vestuário básico', icon: '👔' },
      { id: 'educacao', name: 'Educação', icon: '📚' }
    ]
  },
  nonEssential: {
    title: '🎉 Despesas Não Essenciais',
    description: 'Gastos com entretenimento e luxos',
    items: [
      { id: 'entretenimento', name: 'Entretenimento', icon: '🎮' },
      { id: 'luxos', name: 'Luxos', icon: '💎' },
      { id: 'impulso', name: 'Compras por impulso', icon: '🛍️' },
      { id: 'restaurantes_luxo', name: 'Restaurantes (além do básico)', icon: '🍷' },
      { id: 'viagens', name: 'Viagens', icon: '✈️' },
      { id: 'hobbies', name: 'Hobbies', icon: '🎨' }
    ]
  }
};

export default function CategoriesPage() {
  const [userName, setUserName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      alert('Selecione pelo menos uma categoria de despesa');
      return;
    }
    localStorage.setItem('expenseCategories', JSON.stringify(selectedCategories));
    router.push('/income');
  };
if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Olá, {userName}! 👋
          </h1>
          <p className="text-xl text-slate-600">
            Selecione as categorias de despesas que fazem parte da sua vida:
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-8 mb-8">
          {Object.entries(expenseCategories).map(([key, group]) => (
            <div key={key} className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{group.title}</h2>
              <p className="text-slate-600 mb-6">{group.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleCategory(item.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedCategories.includes(item.id)
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="flex-1 text-left font-medium text-slate-700">{item.name}</span>
                    {selectedCategories.includes(item.id) && (
                      <Check className="text-emerald-500" size={24} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600">
              {selectedCategories.length} categoria{selectedCategories.length !== 1 ? 's' : ''} selecionada{selectedCategories.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedCategories.length === 0}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}
