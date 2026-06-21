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
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--green)] uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-[2px] bg-[var(--green)]" />Contacto<span className="w-6 h-[2px] bg-[var(--green)]" />
            </span>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-[var(--text)] mb-4">
              Hablemos de tu proyecto
            </h1>
            <p className="text-[var(--text-muted)] text-[15px]">
              Solicita una cotización personalizada o resuelve tus dudas con nuestro equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
                <div className="w-10 h-10 bg-[var(--green-light)] flex items-center justify-center rounded-xl flex-shrink-0">
                  <Icons.Phone size={17} className="text-[var(--green)]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">Teléfono</h3>
                  <p className="text-[13px] text-[var(--text-muted)]">+52 (55) 1234-5678</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
                <div className="w-10 h-10 bg-[var(--green-light)] flex items-center justify-center rounded-xl flex-shrink-0">
                  <Icons.Mail size={17} className="text-[var(--green)]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">Email</h3>
                  <p className="text-[13px] text-[var(--text-muted)]">ventas@atlanticoptical.mx</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
                <div className="w-10 h-10 bg-[var(--green-light)] flex items-center justify-center rounded-xl flex-shrink-0">
                  <Icons.MapPin size={17} className="text-[var(--green)]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">Ubicación</h3>
                  <p className="text-[13px] text-[var(--text-muted)]">Ciudad de México, México</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {sent ? (
                <div className="text-center py-16 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
                  <Icons.CheckCircle size={48} className="text-[var(--green)] mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-[var(--text)] mb-2">Mensaje enviado</h2>
                  <p className="text-[var(--text-muted)]">Te contactaremos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 p-8 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="text" placeholder="Nombre *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-4 py-3 bg-white border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    <input type="email" placeholder="Email *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="px-4 py-3 bg-white border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="tel" placeholder="Teléfono" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-4 py-3 bg-white border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    <input type="text" placeholder="Empresa" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="px-4 py-3 bg-white border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                  </div>
                  <textarea placeholder="Mensaje *" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors resize-none" />
                  <button type="submit" className="px-8 py-3.5 bg-[var(--green)] text-white text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[var(--green-hover)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(0,101,53,0.25)] rounded-xl">
                    Enviar mensaje
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
