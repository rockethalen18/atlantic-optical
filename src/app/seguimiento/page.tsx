'use client';

import { useState } from 'react';
import Icons from '@/components/ui/Icons';

const stages = [
  { label: 'Pedido Recibido', icon: Icons.Package },
  { label: 'En Proceso', icon: Icons.Settings },
  { label: 'Enviado', icon: Icons.Truck },
  { label: 'En Transito', icon: Icons.MapPin },
  { label: 'Entregado', icon: Icons.CheckCircle },
];

const faqs = [
  { q: '¿Cuanto tarda en actualizarse el estado?', a: 'El estado de tu pedido se actualiza cada 24 horas.' },
  { q: '¿Que hago si mi pedido no llega?', a: 'Contacta a nuestro equipo de soporte por WhatsApp o email y te ayudaremos a localizar tu pedido.' },
  { q: '¿Puedo cambiar la direccion de envio?', a: 'Si tu pedido no ha sido enviado, podemos cambiar la direccion de envio. Contactanos lo antes posible.' },
];

export default function SeguimientoPage() {
  const [orderNum, setOrderNum] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentStage, setCurrentStage] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNum && email) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setOrderNum('');
    setEmail('');
    setCurrentStage(2);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-white relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--blue) 1px, transparent 1px), linear-gradient(90deg, var(--blue) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">Seguimiento</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Seguimiento de Pedido
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-3 max-w-[500px] mx-auto">Ingresa tu numero de orden y correo electronico para conocer el estado de tu envio.</p>
        </div>
      </div>

      <section className="max-w-[800px] mx-auto px-6 md:px-10 py-12 md:py-16">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-8 bg-[var(--bg-alt)] border border-[var(--border)]">
            <h2 className="text-[18px] font-bold text-[var(--text)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Buscar Pedido</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Numero de Pedido *</label>
                <input
                  type="text"
                  required
                  placeholder="Numero de pedido (ej: AO-20260614-A1B2C3)"
                  value={orderNum}
                  onChange={e => setOrderNum(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--blue)] transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Correo Electronico *</label>
                <input
                  type="email"
                  required
                  placeholder="Correo electronico"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--blue)] transition-colors"
                />
              </div>
              <button type="submit" className="w-full px-8 py-3.5 bg-[var(--blue)] text-white text-[12px] font-bold uppercase tracking-[0.08em] hover:bg-[var(--blue-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)] hover:-translate-y-0.5">
                Rastrear Pedido
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="p-6 bg-[var(--bg-alt)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[18px] font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Pedido #{orderNum}</h2>
                <button onClick={handleReset} className="text-[12px] font-bold text-[var(--blue)] hover:underline cursor-pointer">
                  Buscar otro
                </button>
              </div>
              <p className="text-[13px] text-[var(--text-muted)]">Enviado a: {email}</p>
            </div>

            {/* Timeline */}
            <div className="p-6 bg-[var(--bg-alt)] border border-[var(--border)]">
              <h3 className="text-[14px] font-bold text-[var(--text)] mb-6">Estado del Envio</h3>
              <div className="relative">
                {stages.map((stage, i) => {
                  const isActive = i <= currentStage;
                  const isCurrent = i === currentStage;
                  return (
                    <div key={i} className="flex items-start gap-4 mb-6 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 flex items-center justify-center border-2 transition-colors ${
                          isCurrent ? 'bg-[var(--blue)] border-[var(--blue)] text-white' :
                          isActive ? 'bg-[var(--blue)]/10 border-[var(--blue)] text-[var(--blue)]' :
                          'bg-white border-[var(--border)] text-[var(--text-muted)]'
                        }`}>
                          <stage.icon size={16} />
                        </div>
                        {i < stages.length - 1 && (
                          <div className={`w-[2px] h-8 ${
                            i < currentStage ? 'bg-[var(--blue)]' : 'bg-[var(--border)]'
                          }`} />
                        )}
                      </div>
                      <div className="pt-2">
                        <p className={`text-[13px] font-bold ${
                          isCurrent ? 'text-[var(--blue)]' :
                          isActive ? 'text-[var(--text)]' :
                          'text-[var(--text-muted)]'
                        }`}>{stage.label}</p>
                        {isCurrent && (
                          <p className="text-[12px] text-[var(--text-muted)] mt-1">Estado actual</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-6 bg-[var(--blue-light)] border border-[var(--blue)]/20">
              <div className="flex items-center gap-3 mb-2">
                <Icons.Clock size={18} className="text-[var(--blue)]" />
                <h3 className="text-[14px] font-bold text-[var(--text)]">Entrega Estimada</h3>
              </div>
              <p className="text-[13px] text-[var(--text-muted)]">Tu pedido llegara entre el <strong className="text-[var(--text)]">15 y 20 de julio, 2026</strong></p>
            </div>

            {/* WhatsApp Note */}
            <div className="p-5 bg-white border border-[var(--border)] flex items-start gap-3">
              <Icons.Phone size={18} className="text-[var(--green)] mt-0.5 flex-shrink-0" />
              <p className="text-[13px] text-[var(--text-muted)]">
                Si no encuentras tu pedido, contactanos por{' '}
                <a href="https://wa.me/8613405595150" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--green)] hover:underline">
                  WhatsApp
                </a>
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="bg-[var(--bg-alt)] border-y border-[var(--border)] py-12 md:py-16">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">Centro de Ayuda</span>
            <h2 className="text-[24px] font-bold text-[var(--text)] mt-2" style={{ fontFamily: 'var(--font-display)' }}>Preguntas sobre Seguimiento</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-[var(--border)] hover:border-[var(--blue)]/20 transition-colors overflow-hidden">
                <summary className="flex items-center gap-4 cursor-pointer p-5 md:p-6">
                    <div className="w-10 h-10 bg-[var(--blue)]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--blue)]/15 transition-colors">
                    <Icons.Package size={18} className="text-[var(--blue)]" />
                  </div>
                  <span className="flex-1 text-[14px] font-bold text-[var(--text)]">{faq.q}</span>
                  <Icons.ChevronDown size={16} className="text-[var(--text-muted)] group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                  <div className="pl-14">
                    <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">{faq.a}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
