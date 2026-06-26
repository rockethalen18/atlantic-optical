import Icons from '@/components/ui/Icons';

const oemFeatures = ['Marca propia', 'Embalaje personalizado', 'Minimo 50 unidades', 'Certificacion incluida', 'Soporte tecnico dedicado'];
const odmFeatures = ['Diseno a medida', 'Prototipos incluidos', 'Minimo 100 unidades', 'Ingenieria completa', 'Propiedad intelectual'];

const process = [
  { step: '01', title: 'Consulta', desc: 'Comparte tus requisitos y vision del proyecto.', icon: Icons.Phone },
  { step: '02', title: 'Diseno', desc: 'Nuestro equipo crea prototipos y planos.', icon: Icons.FileText },
  { step: '03', title: 'Produccion', desc: 'Fabricacion en serie con control de calidad.', icon: Icons.Factory },
  { step: '04', title: 'Entrega', desc: 'Envio directo a tu ubicacion con documentacion.', icon: Icons.Truck },
];

export default function OEMODMPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[var(--text)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--green-status)] uppercase tracking-[0.2em]">Manufactura</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-white tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            OEM / ODM
          </h1>
          <p className="text-[14px] text-white/50 mt-3 max-w-[400px] mx-auto">Disenamos y fabricamos equipo oftalmico con tu marca.</p>
        </div>
      </div>

      {/* OEM / ODM Cards */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OEM */}
          <div className="p-8 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors">
            <div className="w-12 h-12 bg-[var(--green)]/10 flex items-center justify-center mb-5">
              <Icons.Tag size={22} className="text-[var(--green)]" />
            </div>
            <h3 className="text-[22px] font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>OEM</h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7] mb-6">
              Fabricamos nuestros equipos existentes con tu marca y diseno personalizado. Ideal para marcas que quieren entrar al mercado con productos probados.
            </p>
            <div className="space-y-2.5">
              {oemFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Icons.CheckCircle size={14} className="text-[var(--green)] flex-shrink-0" />
                  <span className="text-[13px] text-[var(--text-secondary)]">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ODM */}
          <div className="p-8 bg-[var(--text)] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mb-5">
                <Icons.FileText size={22} className="text-white" />
              </div>
              <h3 className="text-[22px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>ODM</h3>
              <p className="text-[14px] text-white/70 leading-[1.7] mb-6">
                Disenamos y fabricamos equipos segun tus especificaciones exactas. Para empresas que quieren un producto unico y diferenciado.
              </p>
              <div className="space-y-2.5">
                {odmFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icons.CheckCircle size={14} className="text-[var(--green-status)] flex-shrink-0" />
                    <span className="text-[13px] text-white/80">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[var(--bg-alt)] border-y border-[var(--border)] py-14">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Proceso</span>
            <h2 className="text-[28px] font-bold text-[var(--text)] mt-2" style={{ fontFamily: 'var(--font-display)' }}>Como Trabajamos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-[var(--green)]/10 flex items-center justify-center">
                  <p.icon size={20} className="text-[var(--green)]" />
                </div>
                <div className="text-[24px] font-black text-[var(--green)] opacity-20 mb-1" style={{ fontFamily: 'var(--font-display)' }}>{p.step}</div>
                <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">{p.title}</h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-[1.6]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="max-w-[600px] mx-auto px-6 md:px-10 text-center">
          <h2 className="text-[24px] font-bold text-[var(--text)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>¿Tienes un Proyecto en Mente?</h2>
          <p className="text-[13px] text-[var(--text-muted)] mb-6">Contacta a nuestro equipo de ingenieria para discutir tu proyecto OEM o ODM.</p>
          <a href="/contacto" className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)]">
            Contactar Equipo <Icons.ArrowRight size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}
