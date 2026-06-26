import Icons from '@/components/ui/Icons';

const benefits = [
  { icon: Icons.DollarSign, title: 'Precios Especiales', desc: 'Descuentos exclusivos para distribuidores autorizados con margenes preferenciales.', color: '#1e3a5f' },
  { icon: Icons.Truck, title: 'Soporte Logistico', desc: 'Ayuda completa con envios, documentacion de importacion y seguimiento.', color: '#2563eb' },
  { icon: Icons.Headphones, title: 'Capacitacion', desc: 'Entrenamiento tecnico sobre todos nuestros productos y soporte continuo.', color: '#f59e0b' },
  { icon: Icons.ShieldCheck, title: 'Garantia Extendida', desc: 'Garantia extendida para distribuidores y acceso prioritario a soporte.', color: '#0f2340' },
];

const steps = [
  { step: '01', title: 'Solicita', desc: 'Completa el formulario de contacto para unirte a nuestro programa.' },
  { step: '02', title: 'Evaluamos', desc: 'Nuestro equipo revisa tu solicitud y te contacta en 48 horas.' },
  { step: '03', title: 'Capacitamos', desc: 'Te ofrecemos entrenamiento completo sobre productos y procesos.' },
  { step: '04', title: 'Operas', desc: 'Comienza a vender con precios especiales y soporte continuo.' },
];

export default function DistribuidoresPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[var(--text)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--green-status)] uppercase tracking-[0.2em]">Programa</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-white tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Programa de Distribuidores
          </h1>
          <p className="text-[14px] text-white/50 mt-3 max-w-[400px] mx-auto">Unete a nuestra red de distribuidores en toda Latinoamerica.</p>
        </div>
      </div>

      {/* Benefits */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Beneficios</span>
          <h2 className="text-[28px] font-bold text-[var(--text)] mt-2" style={{ fontFamily: 'var(--font-display)' }}>¿Por que Ser Distribuidor?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Process */}
      <section className="bg-[var(--bg-alt)] border-y border-[var(--border)] py-14">
        <div className="max-w-[900px] mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Proceso</span>
            <h2 className="text-[28px] font-bold text-[var(--text)] mt-2" style={{ fontFamily: 'var(--font-display)' }}>Como Empezar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="text-[32px] font-black text-[var(--green)] opacity-20 mb-2" style={{ fontFamily: 'var(--font-display)' }}>{s.step}</div>
                <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">{s.title}</h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="max-w-[600px] mx-auto px-6 md:px-10 text-center">
          <h2 className="text-[24px] font-bold text-[var(--text)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>¿Listo para Ser Distribuidor?</h2>
          <p className="text-[13px] text-[var(--text-muted)] mb-6">Contacta a nuestro equipo para comenzar el proceso de incorporacion.</p>
          <a href="/contacto" className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)]">
            Solicitar Informacion <Icons.ArrowRight size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}
