'use client';

import Icons from '@/components/ui/Icons';

export default function AdminConfiguracion() {
  return (
    <div className="min-h-screen bg-[var(--bg-alt)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--green)] uppercase tracking-[0.2em] mb-3">
            <span className="w-6 h-[2px] bg-[var(--green)]" />Admin
          </span>
          <h1 className="text-3xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Configuración</h1>
        </div>
        <div className="bg-white border border-[var(--border)] p-10 text-center">
          <Icons.User size={40} className="text-[var(--text-soft)] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Configuración del sitio</h2>
          <p className="text-[var(--text-muted)] text-[14px] max-w-md mx-auto">
            Administra la configuración general, usuarios, y preferencias del sitio.
            Próximamente disponible con el backend conectado.
          </p>
        </div>
      </div>
    </div>
  );
}
