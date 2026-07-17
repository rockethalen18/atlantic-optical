'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (loading || !ready) return;
    if (!user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, ready, router, pathname]);

  if (loading || !ready) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') return null;

  return <>{children}</>;
}
