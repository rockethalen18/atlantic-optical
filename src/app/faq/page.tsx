import Icons from '@/components/ui/Icons';

const faqs = [
  { q: '¿Cómo se calcula el precio final?', a: 'El precio se calcula con la fórmula: (Costo Base x Margen + Envio/kg x Peso) x Tipo de Cambio x (1 + IVA). Puedes ver el desglose en tiempo real en cada producto cuando el backend este conectado.', icon: Icons.Tag },
  { q: '¿Cuanto tarda el envio?', a: 'Maritimo: 20-40 dias. Aereo: 5-10 dias. Express: 3-7 dias. El tiempo depende del metodo seleccionado y la aduana de destino.', icon: Icons.Truck },
  { q: 'Hay minimo de pedido?', a: 'No hay minimo de pedido. Puedes comprar una sola unidad o volumenes grandes con descuentos por mayoreo.', icon: Icons.Package },
  { q: '¿Como funciona la garantia?', a: 'Todos nuestros equipos tienen 12 meses de garantia contra defectos de fabricacion. Cubre reparacion o reemplazo gratuito durante el primer año.', icon: Icons.ShieldCheck },
  { q: '¿Puedo solicitar una cotizacion personalizada?', a: 'Si, contactanos por WhatsApp o el formulario de contacto para proyectos completos con precios especiales y descuentos por volumen.', icon: Icons.Phone },
  { q: '¿Que metodos de pago aceptan?', a: 'Aceptamos transferencia bancaria, tarjetas de credito/debito y PayPal. Para pedidos grandes ofrecemos planes de financiamiento.', icon: Icons.CreditCard },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[var(--text)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--green-status)] uppercase tracking-[0.2em]">Ayuda</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-white tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Preguntas Frecuentes
          </h1>
          <p className="text-[14px] text-white/50 mt-3 max-w-[400px] mx-auto">Resolvemos tus dudas sobre productos, envios y garantias.</p>
        </div>
      </div>

      <section className="max-w-[900px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group bg-white border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors overflow-hidden">
              <summary className="flex items-center gap-4 cursor-pointer p-5 md:p-6">
                <div className="w-10 h-10 bg-[var(--green)]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--green)]/15 transition-colors">
                  <f.icon size={18} className="text-[var(--green)]" />
                </div>
                <span className="flex-1 text-[14px] font-bold text-[var(--text)]">{f.q}</span>
                <Icons.ChevronDown size={16} className="text-[var(--text-muted)] group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                <div className="pl-14">
                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">{f.a}</p>
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-[var(--green)] text-center">
          <h3 className="text-[18px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>¿No encontraste tu respuesta?</h3>
          <p className="text-[13px] text-white/60 mb-5">Contacta a nuestro equipo de soporte tecnico.</p>
          <a href="/contacto" className="inline-flex items-center gap-2 bg-white text-[var(--green)] font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-white/90 transition-colors">
            Contactar <Icons.ArrowRight size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}
