'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/admin/AuthGuard';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return (
      <AuthProvider>
        <AuthGuard>{children}</AuthGuard>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="flex min-h-screen bg-[var(--bg-alt)]">
          <Sidebar />
          <main className="flex-1 ml-[260px] transition-all duration-300">
            {children}
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
