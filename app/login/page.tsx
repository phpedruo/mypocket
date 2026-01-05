'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        router.push('/dashboard');
      }
    } catch {
      // Não autenticado, continua na página
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignUp 
        ? { email, password, name } 
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na autenticação');
      }

      if (isSignUp) {
        setMessage('✅ Conta criada com sucesso!');
        localStorage.setItem('userName', name);
        localStorage.setItem('onboardingCompleted', 'false');
        setTimeout(() => router.push('/welcome'), 500);
      } else {
        setMessage('✅ Login realizado!');
        localStorage.setItem('userName', data.user.name);
        const completed = localStorage.getItem('onboardingCompleted');
        setTimeout(() => router.push(completed === 'true' ? '/dashboard' : '/welcome'), 500);
      }
    } catch (error: any) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl">
            <Image 
              src="/logo.svg" 
              alt="MyPocket Logo" 
              width={200} 
              height={200}
              className="w-50 h-50"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 font-raleway">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
          </h1>
          <p className="text-slate-600">
            {isSignUp ? 'Comece a gerenciar suas finanças' : 'Acesse sua conta My Pocket'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 text-slate-800"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 text-slate-800"
                required
                minLength={6}
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.startsWith('✅') 
                  ? 'bg-green-100 text-green-700' 
                  : message.startsWith('⚠️')
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Aguarde...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage('');
              }}
              className="w-full text-slate-600 hover:text-slate-800 font-medium"
            >
              {isSignUp ? 'Já tem conta? Entrar' : 'Não tem conta? Criar agora'}
            </button>
          </form>
        </div>

        <p className="text-sm text-slate-500 mt-6 text-center">
          🔒 Seus dados são armazenados localmente com segurança
        </p>
      </div>
    </div>
  );
}
