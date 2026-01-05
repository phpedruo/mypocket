'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';

export default function DashboardPage() {
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

      const completed = localStorage.getItem('onboardingCompleted');
      if (!completed) {
        router.push('/welcome');
      }
    } catch {
      router.push('/login');
    }
  };

  return <DashboardClient />;
}
