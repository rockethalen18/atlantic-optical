import Icons from '@/components/ui/Icons';

export default function OEMODMPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--green)] uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-[2px] bg-[var(--green)]" />OEM / ODM<span className="w-6 h-[2px] bg-[var(--green)]" />
            </span>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-[var(--text)] mb-4">
              Manufactura personalizada
            </h1>
            <p className="text-[var(--text-muted)] text-[15px]">
              Diseñamos y fabricamos equipo oftálmico con tu marca.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
              <h3 className="text-xl font-bold text-[var(--text)] mb-3">OEM</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4">
                Fabricamos nuestros equipos existentes con tu marca y diseño personalizado.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]"><Icons.CheckCircle size={14} className="text-[var(--green)]" /> Marca propia</li>
                <li className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]"><Icons.CheckCircle size={14} className="text-[var(--green)]" /> Embalaje personalizado</li>
                <li className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]"><Icons.CheckCircle size={14} className="text-[var(--green)]" /> Mínimo 50 unidades</li>
              </ul>
            </div>
            <div className="p-8 bg-[var(--bg-alt)] rounded-2xl border border-[var(--border-light)]">
              <h3 className="text-xl font-bold text-[var(--text)] mb-3">ODM</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4">
                Diseñamos y fabricamos equipos según tus especificaciones exactas.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]"><Icons.CheckCircle size={14} className="text-[var(--green)]" /> Diseño a medida</li>
                <li className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]"><Icons.CheckCircle size={14} className="text-[var(--green)]" /> Prototipos incluidos</li>
                <li className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]"><Icons.CheckCircle size={14} className="text-[var(--green)]" /> Mínimo 100 unidades</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
