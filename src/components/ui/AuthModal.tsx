'use client';

import { useState, useEffect, useRef } from 'react';
import Icons from '@/components/ui/Icons';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      style={{
        backgroundColor: 'var(--glass, rgba(255,255,255,0.85))',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.12)] border border-[var(--border-light)] overflow-hidden transition-all duration-300 ${
          open ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
          aria-label="Cerrar"
        >
          <Icons.X size={20} />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-light)]">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-[0.06em] transition-all duration-200 ${
              activeTab === 'login'
                ? 'text-[var(--blue)] border-b-2 border-[var(--blue)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-[0.06em] transition-all duration-200 ${
              activeTab === 'signup'
                ? 'text-[var(--blue)] border-b-2 border-[var(--blue)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="p-6 md:p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Email
              </label>
              <div className="relative">
                <Icons.Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Icons.Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/80 border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--blue)] focus:ring-[var(--blue)]/20"
                />
                <span className="text-xs text-[var(--text-muted)]">Recordarme</span>
              </label>
              <a href="#" className="text-xs text-[var(--blue)] hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--blue)] hover:bg-[var(--blue)]/90 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[var(--blue)]/20 hover:shadow-xl hover:shadow-[var(--blue)]/30"
            >
              Iniciar Sesión
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="p-6 md:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <Icons.User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Email
              </label>
              <div className="relative">
                <Icons.Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Teléfono <span className="normal-case font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <Icons.Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Icons.Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/80 border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Icons.Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/80 border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {showConfirmPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--blue)] hover:bg-[var(--blue)]/90 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[var(--blue)]/20 hover:shadow-xl hover:shadow-[var(--blue)]/30"
            >
              Crear Cuenta
            </button>

            <p className="text-xs text-[var(--text-muted)] text-center leading-relaxed">
              Al crear cuenta aceptas nuestros{' '}
              <a href="/terminos" className="text-[var(--blue)] hover:underline font-medium">
                Términos y Condiciones
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
