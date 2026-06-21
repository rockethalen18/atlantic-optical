import Icons from '@/components/ui/Icons';

export default function GarantiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--green)] uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-[2px] bg-[var(--green)]" />Garantía<span className="w-6 h-[2px] bg-[var(--green)]" />
            </span>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-[var(--text)] mb-8">
              Política de Garantía
            </h1>
            <div className="prose prose-slate max-w-none space-y-6 text-[var(--text-secondary)] text-[15px] leading-relaxed">
              <div className="p-6 bg-[var(--green-light)] rounded-2xl border border-[var(--green)]/10">
                <div className="flex items-center gap-3 mb-3">
                  <Icons.Shield size={20} className="text-[var(--green)]" />
                  <h2 className="text-lg font-bold text-[var(--text)]">12 meses de garantía</h2>
                </div>
                <p>Todos nuestros equipos incluyen garantía de 12 meses contra defectos de fabricación.</p>
              </div>
              <h2 className="text-xl font-bold text-[var(--text)]">Cubrimos</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><Icons.CheckCircle size={15} className="text-[var(--green)]" /> Defectos de fabricación</li>
                <li className="flex items-center gap-2"><Icons.CheckCircle size={15} className="text-[var(--green)]" /> Componentes defectuosos</li>
                <li className="flex items-center gap-2"><Icons.CheckCircle size={15} className="text-[var(--green)]" /> Reparación o reemplazo gratuito</li>
              </ul>
              <h2 className="text-xl font-bold text-[var(--text)]">No cubre</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><Icons.XCircle size={15} className="text-[var(--red)]" /> Daños por uso indebido</li>
                <li className="flex items-center gap-2"><Icons.XCircle size={15} className="text-[var(--red)]" /> Desgaste natural</li>
                <li className="flex items-center gap-2"><Icons.XCircle size={15} className="text-[var(--red)]" /> Modificaciones no autorizadas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
