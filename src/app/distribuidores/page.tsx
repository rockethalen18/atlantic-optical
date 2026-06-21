import Icons from '@/components/ui/Icons';

export default function DistribuidoresPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--green)] uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-[2px] bg-[var(--green)]" />Distribuidores<span className="w-6 h-[2px] bg-[var(--green)]" />
            </span>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-[var(--text)] mb-4">
              Programa de Distribuidores
            </h1>
            <p className="text-[var(--text-muted)] text-[15px]">
              Únete a nuestra red de distribuidores en toda Latinoamérica.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Icons.DollarSign, title: 'Precios especiales', desc: 'Descuentos exclusivos para distribuidores autorizados.' },
              { icon: Icons.Truck, title: 'Soporte logístico', desc: 'Ayuda con envíos y documentación de importación.' },
              { icon: Icons.Headphones, title: 'Capacitación', desc: 'Entrenamiento técnico sobre todos nuestros productos.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
                <div className="w-12 h-12 bg-[var(--green-light)] flex items-center justify-center rounded-xl mx-auto mb-5">
                  <item.icon size={20} className="text-[var(--green)]" />
                </div>
                <h3 className="text-[16px] font-bold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
