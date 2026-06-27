export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-28">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--green)] uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-[2px] bg-[var(--green)]" />Legal<span className="w-6 h-[2px] bg-[var(--green)]" />
            </span>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-[var(--text)] mb-8">
              Términos y Condiciones
            </h1>
            <div className="space-y-6 text-[var(--text-secondary)] text-[15px] leading-relaxed">
              <p><strong>Última actualización:</strong> Junio 2026</p>
              <h2 className="text-xl font-bold text-[var(--text)]">1. Aceptación</h2>
              <p>Al usar el sitio web de Atlantic Optical, aceptas estos términos y condiciones.</p>
              <h2 className="text-xl font-bold text-[var(--text)]">2. Precios</h2>
              <p>Los precios se calculan automáticamente incluyendo envío y impuestos. Están sujetos a cambio sin previo aviso.</p>
              <h2 className="text-xl font-bold text-[var(--text)]">3. Envíos</h2>
              <p>Los tiempos de entrega son estimados. Atlantic Optical no se hace responsable por retrasos aduanales.</p>
              <h2 className="text-xl font-bold text-[var(--text)]">4. Garantía</h2>
              <p>Todos los productos incluyen 12 meses de garantía contra defectos de fabricación.</p>
              <h2 className="text-xl font-bold text-[var(--text)]">5. Devoluciones</h2>
              <p>Los productos pueden devolverse dentro de 30 días si no han sido usados y están en su empaque original.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
