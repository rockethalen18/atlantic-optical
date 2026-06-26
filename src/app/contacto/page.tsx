'use client';

import { useState } from 'react';
import Icons from '@/components/ui/Icons';

export default function ContactoPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[var(--text)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--green-status)] uppercase tracking-[0.2em]">Contacto</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-white tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Hablemos de tu Proyecto
          </h1>
          <p className="text-[14px] text-white/50 mt-3 max-w-[400px] mx-auto">Solicita una cotizacion personalizada o resuelve tus dudas con nuestro equipo.</p>
        </div>
      </div>

      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact cards */}
          <div className="space-y-4">
            <div className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors">
              <div className="w-10 h-10 bg-[var(--green)]/10 flex items-center justify-center mb-4">
                <Icons.Phone size={18} className="text-[var(--green)]" />
              </div>
              <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">Telefono</h3>
              <p className="text-[13px] text-[var(--text-muted)]">+52 (55) 1234-5678</p>
              <p className="text-[11px] text-[var(--text-soft)] mt-1">Lun - Vie, 9:00 - 18:00</p>
            </div>
            <div className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors">
              <div className="w-10 h-10 bg-[var(--green)]/10 flex items-center justify-center mb-4">
                <Icons.Mail size={18} className="text-[var(--green)]" />
              </div>
              <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">Email</h3>
              <p className="text-[13px] text-[var(--text-muted)]">ventas@atlanticoptical.mx</p>
              <p className="text-[11px] text-[var(--text-soft)] mt-1">Respuesta en 24 horas</p>
            </div>
            <div className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors">
              <div className="w-10 h-10 bg-[var(--green)]/10 flex items-center justify-center mb-4">
                <Icons.MapPin size={18} className="text-[var(--green)]" />
              </div>
              <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">Ubicacion</h3>
              <p className="text-[13px] text-[var(--text-muted)]">Ciudad de Mexico, Mexico</p>
              <p className="text-[11px] text-[var(--text-soft)] mt-1">Envio a toda la republica</p>
            </div>
            <div className="p-6 bg-[var(--green)] text-center">
              <p className="text-[13px] font-bold text-white mb-2">¿Necesitas ayuda urgente?</p>
              <a href="https://wa.me/525512345678" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[var(--green)] font-bold text-[11px] uppercase tracking-[0.08em] px-6 py-2.5 hover:bg-white/90 transition-colors">
                WhatsApp <Icons.ArrowRight size={10} />
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="text-center py-20 bg-[var(--bg-alt)] border border-[var(--border)]">
                <div className="w-16 h-16 bg-[var(--green)]/10 flex items-center justify-center mx-auto mb-5">
                  <Icons.CheckCircle size={32} className="text-[var(--green)]" />
                </div>
                <h2 className="text-[22px] font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Mensaje Enviado</h2>
                <p className="text-[13px] text-[var(--text-muted)] max-w-[300px] mx-auto">Te contactaremos pronto con una cotizacion personalizada.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 bg-[var(--bg-alt)] border border-[var(--border)]">
                <h2 className="text-[18px] font-bold text-[var(--text)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Envianos un Mensaje</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Nombre *</label>
                      <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Email *</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Telefono</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Empresa</label>
                      <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Mensaje *</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors resize-none" />
                  </div>
                  <button type="submit" className="px-8 py-3.5 bg-[var(--green)] text-white text-[12px] font-bold uppercase tracking-[0.08em] hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)] hover:-translate-y-0.5">
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
