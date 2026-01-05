'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function WelcomePage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        router.push('/login');
        return;
      }

      const { user } = await response.json();
      if (user.name) {
        setName(user.name);
      }

      setLoading(false);
    } catch {
      router.push('/login');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      router.push('/categories');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-10 rounded-3xl shadow-2xl">
            <Image 
              src="/logo.svg" 
              alt="MyPocket Logo" 
              width={240} 
              height={240}
              className="w-60 h-60"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-6xl font-bold text-slate-800 mb-6 font-raleway">
          Bem-vindo ao My Pocket! 💰
        </h1>
        
        <p className="text-2xl text-slate-600 mb-12">
          Sua jornada para uma vida financeira organizada começa agora.
        </p>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <label className="block text-left mb-4">
            <span className="text-lg font-semibold text-slate-700">Como podemos te chamar?</span>
          </label>
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome..."
            className="w-full px-6 py-4 text-xl border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 text-slate-800"
            autoFocus
            required
          />

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xl font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Continuar →
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-8">
          🔒 Seus dados são criptografados e armazenados de forma segura
        </p>
      </div>
    </div>
  );
}
