'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Icons from '@/components/ui/Icons';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.replace('/admin');
    } catch (err: any) {
      setAttempts(a => a + 1);
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#10b981] flex items-center justify-center mx-auto mb-4">
            <Icons.Eye size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Atlantic Optical</h1>
          <p className="text-white/40 text-sm mt-1">Panel de Administración</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] border border-white/10 p-8">
          <h2 className="text-white font-bold text-lg mb-1">Iniciar Sesión</h2>
          <p className="text-white/40 text-sm mb-6">Ingresa tus credenciales para acceder</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-[0.14em] mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Icons.Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#10b981] transition-colors"
                  placeholder="admin@atlanticopticalgroup.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-[0.14em] mb-1.5">Contraseña</label>
              <div className="relative">
                <Icons.Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#10b981] transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                  {showPassword ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20">
                <Icons.AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {attempts >= 3 && (
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20">
                <Icons.Shield size={14} className="text-amber-400 flex-shrink-0" />
                <p className="text-amber-400 text-xs">Múltiples intentos fallidos. La cuenta puede ser bloqueada.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || attempts >= 5}
              className="w-full py-2.5 bg-[#10b981] text-white font-bold text-sm hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Icons.Lock size={14} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 text-white/20 text-[11px]">
              <Icons.Shield size={12} />
              <span>Conexión cifrada • Sesión segura</span>
            </div>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/30 text-sm hover:text-white/60 transition-colors">
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  );
}
