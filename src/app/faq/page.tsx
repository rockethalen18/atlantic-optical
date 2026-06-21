import Icons from '@/components/ui/Icons';

const faqs = [
  { q: '¿Cómo se calcula el precio final?', a: 'El precio se calcula con la fórmula: (Costo Base × Margen + Envío/kg × Peso) × Tipo de Cambio × (1 + IVA). Puedes ver el desglose en tiempo real en cada producto.' },
  { q: '¿Cuánto tarda el envío?', a: 'Marítimo: 20-40 días. Aéreo: 5-10 días. Express: 3-7 días. El tiempo depende del método seleccionado y la aduana.' },
  { q: '¿Hay mínimo de pedido?', a: 'No hay mínimo de pedido. Puedes comprar una sola unidad o volúmenes grandes con descuentos.' },
  { q: '¿Cómo funciona la garantía?', a: 'Todos nuestros equipos tienen 12 meses de garantía contra defectos de fabricación. Cubre reparación o reemplazo gratuito.' },
  { q: '¿Puedo solicitar una cotización personalizada?', a: 'Sí, contáctanos por WhatsApp o el formulario de contacto para proyectos completos con precios especiales.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos transferencia bancaria, tarjetas de crédito/débito y PayPal.' },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--green)] uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-[2px] bg-[var(--green)]" />FAQ<span className="w-6 h-[2px] bg-[var(--green)]" />
            </span>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-[var(--text)] mb-12">
              Preguntas frecuentes
            </h1>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <details key={i} className="group p-6 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
                  <summary className="flex items-center justify-between cursor-pointer text-[15px] font-bold text-[var(--text)]">
                    {f.q}
                    <Icons.ChevronDown size={16} className="text-[var(--text-muted)] group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-3 text-[14px] text-[var(--text-secondary)] leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
