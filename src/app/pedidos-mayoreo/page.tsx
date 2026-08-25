'use client';

import { useState } from 'react';
import Icons from '@/components/ui/Icons';

const benefits = [
  { icon: Icons.Tag, title: 'Descuentos por Volumen', desc: 'Hasta 30% de descuento segun la cantidad de tu pedido.', color: '#0ea5e9' },
  { icon: Icons.Headphones, title: 'Soporte Tecnico Dedicado', desc: 'Equipo tecnico exclusivo para pedidos mayoristas.', color: '#0ea5e9' },
  { icon: Icons.Truck, title: 'Envio Consolidado', desc: 'Optimizamos costos de logistica con envios combinados.', color: '#0ea5e9' },
  { icon: Icons.ShieldCheck, title: 'Garantia Extendida', desc: 'Cobertura prolongada para compras al mayoreo.', color: '#0ea5e9' },
  { icon: Icons.Factory, title: 'Personalizacion OEM/ODM', desc: 'Adaptamos productos con tu marca y especificaciones.', color: '#0ea5e9' },
  { icon: Icons.CreditCard, title: 'Pago a Credito', desc: 'Terminos de pago flexibles para compras recurrentes.', color: '#0ea5e9' },
];

const faqs = [
  { q: '¿Cual es la cantidad minima?', a: 'Depende del producto. Contactanos para detalles.' },
  { q: '¿Ofrecen descuentos?', a: 'Si, descuentos progresivos segun volumen.' },
  { q: '¿Puedo personalizar productos?', a: 'Si, ofrecemos servicios OEM/ODM.' },
];

export default function PedidosMayoreoPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: '',
    quantity: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
          <span className="text-[10px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">Mayoreo</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Pedidos al Mayoreo
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-3 max-w-[400px] mx-auto">Precios especiales para distribuidores y clinicas.</p>
        </div>
      </div>

      {/* Benefits */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Beneficios</span>
          <h2 className="text-[28px] font-bold text-[var(--text)] mt-2" style={{ fontFamily: 'var(--font-display)' }}>¿Por que Comprar al Mayoreo?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--green)]/20 transition-all hover:shadow-md text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" style={{ background: `${b.color}10` }}>
                <span style={{ color: b.color }}><b.icon size={20} /></span>
              </div>
              <h3 className="text-[14px] font-bold text-[var(--text)] mb-2">{b.title}</h3>
              <p className="text-[12px] text-[var(--text-muted)] leading-[1.6]">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="bg-[var(--bg-alt)] border-y border-[var(--border)] py-14">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <div className="mb-8">
                <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Solicitud</span>
                <h2 className="text-[28px] font-bold text-[var(--text)] mt-2" style={{ fontFamily: 'var(--font-display)' }}>Solicita tu Cotizacion</h2>
                <p className="text-[13px] text-[var(--text-muted)] mt-2">Completa el formulario y te contactaremos con precios especiales.</p>
              </div>

              {sent ? (
                <div className="text-center py-20 bg-white border border-[var(--border)]">
                  <div className="w-16 h-16 bg-[var(--green)]/10 flex items-center justify-center mx-auto mb-5">
                    <Icons.CheckCircle size={32} className="text-[var(--green)]" />
                  </div>
                  <h2 className="text-[22px] font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Solicitud Enviada</h2>
                  <p className="text-[13px] text-[var(--text-muted)] max-w-[300px] mx-auto">Te contactaremos pronto con una cotizacion personalizada para tu pedido al mayoreo.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 bg-white border border-[var(--border)]">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Nombre Completo *</label>
                      <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Empresa / Clinica *</label>
                      <input type="text" required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Correo Electronico *</label>
                        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Telefono / WhatsApp *</label>
                        <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Producto de Interes *</label>
                      <select required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors appearance-none">
                        <option value="">Selecciona una categoria</option>
                        <option value="autorefractometros">Autorefractometros</option>
                        <option value="tonometros">Tonometros</option>
                        <option value="keratometros">Keratometros</option>
                        <option value="lamparas-hendidura">Lamparas de Hendidura</option>
                        <option value="montadoras">Montadoras</option>
                        <option value="optotipos">Optotipos</option>
                        <option value="campimetros">Campimetros</option>
                        <option value="oct">OCT</option>
                        <option value="ecografos">Ecografos Oculares</option>
                        <option value="microscopios">Microscopios Quirurgicos</option>
                        <option value="mobiliario">Mobiliario Clinico</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Cantidad Estimada</label>
                      <input type="text" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="Ej: 10 unidades" className="w-full px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1.5 block">Mensaje / Detalles</label>
                      <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Describe tu necesidad, especificaciones o cualquier detalle adicional..." className="w-full px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors resize-none" />
                    </div>
                    <button type="submit" className="w-full px-8 py-3.5 bg-[var(--green)] text-white text-[12px] font-bold uppercase tracking-[0.08em] hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)] hover:-translate-y-0.5">
                      Enviar Solicitud
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <div className="mb-8">
                <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">FAQ</span>
                <h2 className="text-[28px] font-bold text-[var(--text)] mt-2" style={{ fontFamily: 'var(--font-display)' }}>Preguntas Frecuentes</h2>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center gap-4 p-5 text-left"
                    >
                      <div className="w-10 h-10 bg-[var(--green)]/8 flex items-center justify-center flex-shrink-0">
                        <Icons.FileText size={18} className="text-[var(--green)]" />
                      </div>
                      <span className="flex-1 text-[14px] font-bold text-[var(--text)]">{faq.q}</span>
                      <Icons.ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 pt-0">
                        <div className="pl-14">
                          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">{faq.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-8 p-6 bg-[var(--green)] text-center">
                <p className="text-[13px] font-bold text-white mb-2">¿Necesitas una cotizacion inmediata?</p>
                <p className="text-[12px] text-white/70 mb-4">Contactanos directamente por WhatsApp</p>
                <a href="https://wa.me/8613405595150" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[var(--green)] font-bold text-[11px] uppercase tracking-[0.08em] px-6 py-2.5 hover:bg-white/90 transition-colors">
                  WhatsApp <Icons.ArrowRight size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="max-w-[600px] mx-auto px-6 md:px-10 text-center">
          <h2 className="text-[24px] font-bold text-[var(--text)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>¿Necesitas algo mas especifico?</h2>
          <p className="text-[13px] text-[var(--text-muted)] mb-6">Si buscas personalizacion completa o fabricacion con tu marca, revisa nuestro servicio OEM/ODM.</p>
          <a href="/oem-odm" className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)]">
            Conocer OEM/ODM <Icons.ArrowRight size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}
