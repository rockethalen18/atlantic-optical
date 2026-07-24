import Icons from '@/components/ui/Icons';

const steps = [
  { icon: Icons.Phone, title: 'Contacto', desc: 'Reporta el problema con tu equipo por telefono, email o WhatsApp.', color: '#1e3a5f' },
  { icon: Icons.CheckCircle, title: 'Diagnostico', desc: 'Nuestro equipo tecnico evalua la situacion y determina la accion correctiva.', color: '#2563eb' },
  { icon: Icons.Wrench, title: 'Reparacion', desc: 'Reparacion o reemplazo gratuito durante el periodo de garantia de 12 meses.', color: '#f59e0b' },
  { icon: Icons.Package, title: 'Devolucion', desc: 'Envio del equipo reparado o nuevo a tu ubicacion sin costo adicional.', color: '#0f2340' },
];

const coverage = [
  { title: 'Defectos de fabricacion', desc: 'Cualquier defecto presente desde la fabrica.' },
  { title: 'Componentes defectuosos', desc: 'Piezas que no funcionan correctamente.' },
  { title: 'Reparacion gratuita', desc: 'Sin costo durante los 12 meses.' },
  { title: 'Reemplazo gratuito', desc: 'Equipo nuevo si no es posible reparar.' },
];

const exclusions = [
  'Danos por uso indebido o accidentes',
  'Desgaste natural por uso prolongado',
  'Modificaciones no autorizadas',
  'Daños por ambiente no controlado',
];

export default function GarantiaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[var(--text)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--green-status)] uppercase tracking-[0.2em]">Proteccion</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-white tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Politica de Garantia
          </h1>
          <p className="text-[14px] text-white/50 mt-3 max-w-[400px] mx-auto">12 meses de garantia en todos nuestros equipos.</p>
        </div>
      </div>

      {/* Badge */}
      <div className="max-w-[900px] mx-auto px-6 md:px-10 -mt-8 relative z-10">
        <div className="bg-[var(--green)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-5">
          <div className="w-14 h-14 bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icons.ShieldCheck size={28} className="text-white" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-[20px] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>12 Meses de Garantia</h2>
            <p className="text-[13px] text-white/70 mt-1">Todos nuestros equipos incluyen garantia contra defectos de fabricacion.</p>
          </div>
        </div>
      </div>

      {/* Process timeline */}
      <section className="max-w-[900px] mx-auto px-6 md:px-10 py-14">
        <h2 className="text-[22px] font-bold text-[var(--text)] mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>Proceso de Garantia</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[var(--border)]" />

          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-5 relative">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 z-10" style={{ background: `${s.color}15` }}>
                  <span style={{ color: s.color }}><s.icon size={18} /></span>
                </div>
                <div className="flex-1 pb-6 border-b border-[var(--border-light)]">
                  <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">{s.title}</h3>
                  <p className="text-[13px] text-[var(--text-muted)] leading-[1.6]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage & Exclusions */}
      <section className="max-w-[900px] mx-auto px-6 md:px-10 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[var(--green-light)] border border-[var(--green)]/10">
            <div className="flex items-center gap-2 mb-4">
              <Icons.CheckCircle size={18} className="text-[var(--green)]" />
              <h3 className="text-[15px] font-bold text-[var(--text)]">Cubrimos</h3>
            </div>
            <div className="space-y-3">
              {coverage.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icons.CheckCircle size={13} className="text-[var(--green)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--text)]">{c.title}</p>
                    <p className="text-[12px] text-[var(--text-muted)]">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-red-50 border border-red-100">
            <div className="flex items-center gap-2 mb-4">
              <Icons.XCircle size={18} className="text-[var(--red)]" />
              <h3 className="text-[15px] font-bold text-[var(--text)]">No Cubre</h3>
            </div>
            <div className="space-y-3">
              {exclusions.map((e, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icons.XCircle size={13} className="text-[var(--red)] flex-shrink-0" />
                  <p className="text-[13px] text-[var(--text-secondary)]">{e}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-alt)] border-t border-[var(--border)] py-12">
        <div className="max-w-[900px] mx-auto px-6 md:px-10 text-center">
          <h2 className="text-[20px] font-bold text-[var(--text)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>¿Necesitas Activar tu Garantia?</h2>
          <p className="text-[13px] text-[var(--text-muted)] mb-6">Contacta a nuestro equipo tecnico para iniciar el proceso.</p>
          <a href="/contacto" className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)]">
            Contactar Soporte <Icons.ArrowRight size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}
