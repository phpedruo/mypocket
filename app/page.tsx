'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const completed = localStorage.getItem('onboardingCompleted');
        if (completed) {
          router.push('/dashboard');
        } else {
          router.push('/welcome');
        }
      } else {
        router.push('/login');
      }
    } catch {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 mx-auto"></div>
        <p className="text-slate-600 mt-4">Carregando...</p>
      </div>
    </div>
  );
}
