'use client';

import Icons from '@/components/ui/Icons';

const values = [
  { icon: Icons.Award, title: 'Experiencia', desc: 'Mas de 15 años distribuyendo equipo oftalmico de alta calidad a clinicas y consultorios.', color: '#1e3a5f' },
  { icon: Icons.Truck, title: 'Logistica Global', desc: 'Envio directo desde China con costos transparentes por kg. Maritimo, aereo y express.', color: '#2563eb' },
  { icon: Icons.ShieldCheck, title: 'Garantia', desc: 'Todos nuestros equipos incluyen 12 meses de garantia contra defectos de fabricacion.', color: '#f59e0b' },
  { icon: Icons.Headphones, title: 'Soporte Tecnico', desc: 'Equipo de soporte disponible 24/7 para asistencia tecnica y post-venta.', color: '#0f2340' },
];

const stats = [
  { value: '500+', label: 'Equipos Entregados' },
  { value: '15+', label: 'Años de Experiencia' },
  { value: '50+', label: 'Fabricas Aliadas' },
  { value: '200+', label: 'Modelos Disponibles' },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[var(--text)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--green-status)] uppercase tracking-[0.2em]">Nuestra Historia</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-white tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Sobre Nosotros
          </h1>
          <p className="text-[14px] text-white/50 mt-3 max-w-[500px] mx-auto">Lideres en distribucion de equipo oftalmico profesional en Latinoamerica.</p>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Nuestra Historia</span>
            <h2 className="text-[28px] md:text-[34px] font-black text-[var(--text)] tracking-[-0.04em] mt-2 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Democratizando el acceso a equipo oftalmico
            </h2>
            <div className="space-y-4 text-[14px] text-[var(--text-secondary)] leading-[1.7]">
              <p>
                Desde 2010, Atlantic Optical ha sido el socio de confianza para clinicas,
                consultorios y laboratorios opticos en toda Latinoamerica.
              </p>
              <p>
                Nuestra mision es democratizar el acceso a equipo oftalmico profesional,
                ofreciendo precios transparentes y logistica directa desde fabrica.
              </p>
              <p>
                Trabajamos con las mejores fabricas certificadas ISO 13485 del mundo
                para garantizar la mas alta calidad en cada producto que entregamos.
              </p>
            </div>
          </div>
          {/* Stats card */}
          <div className="bg-gradient-to-br from-[var(--green-dark)] via-[var(--green)] to-[var(--blue)] p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />
            <div className="relative z-10 grid grid-cols-2 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-[28px] md:text-[34px] font-black text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                  <div className="text-[9px] font-semibold text-white/60 uppercase tracking-[0.14em] mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[var(--bg-alt)] border-y border-[var(--border)] py-14">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Valores</span>
            <h2 className="text-[28px] font-bold text-[var(--text)] mt-2" style={{ fontFamily: 'var(--font-display)' }}>Lo Que Nos Define</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div key={i} className="p-6 bg-white border border-[var(--border)] hover:border-[var(--green)]/20 transition-all hover:shadow-md text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" style={{ background: `${v.color}10` }}>
                  <span style={{ color: v.color }}><v.icon size={20} /></span>
                </div>
                <h3 className="text-[14px] font-bold text-[var(--text)] mb-2">{v.title}</h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-[1.6]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-[800px] mx-auto px-6 md:px-10 py-14 text-center">
        <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Mision</span>
        <h2 className="text-[24px] font-bold text-[var(--text)] mt-2 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Nuestra Mision</h2>
        <p className="text-[15px] text-[var(--text-secondary)] leading-[1.8]">
          Democratizar el acceso a equipo oftalmico profesional en Latinoamerica,
          ofreciendo precios transparentes, logistica directa desde fabrica y soporte
          tecnico excepcional para cada cliente.
        </p>
      </section>
    </div>
  );
}
