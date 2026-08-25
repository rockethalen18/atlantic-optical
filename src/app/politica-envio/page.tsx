import Icons from '@/components/ui/Icons';
import Link from 'next/link';

const shippingMethods = [
  {
    icon: Icons.Shipping,
    title: 'Envio Maritimo',
    time: '20-40 dias',
    price: 'desde $4.50/kg',
    desc: 'Ideal para pedidos grandes y equipamiento voluminoso.',
    color: '#0ea5e9',
  },
  {
    icon: Icons.Plane,
    title: 'Envio Aereo',
    time: '5-10 dias',
    price: 'desde $12/kg',
    desc: 'Rapido y seguro para equipos de alto valor.',
    color: '#0284c7',
  },
  {
    icon: Icons.Zap,
    title: 'Express Courier',
    time: '3-7 dias',
    price: 'desde $25/kg',
    desc: 'Para urgencias que no pueden esperar.',
    color: '#0369a1',
  },
];

const processSteps = [
  { num: '01', title: 'Confirmas tu pedido y proporcionas direccion de envio', icon: Icons.CheckCircle },
  { num: '02', title: 'Coordinamos el metodo de envio optimal', icon: Icons.Truck },
  { num: '03', title: 'Recibes numero de rastreo por WhatsApp/Email', icon: Icons.Mail },
  { num: '04', title: 'Seguimiento en tiempo real hasta tu puerta', icon: Icons.MapPin },
];

const notes = [
  'Todos los equipos son bivoltaje (110V-240V)',
  'Incluimos enchufe compatible con tu pais',
  'Documentacion aduanal incluida',
  'Seguro de envio incluido',
];

export default function PoliticaEnvioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-white relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--blue) 1px, transparent 1px), linear-gradient(90deg, var(--blue) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">Politica de Envio</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Envio Internacional Directo
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-3 max-w-[400px] mx-auto">Desde China a cualquier parte del mundo.</p>
        </div>
      </div>

      {/* Shipping Methods */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-14">
        <h2 className="text-[22px] font-bold text-[var(--text)] mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>Metodos de Envio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shippingMethods.map((method, i) => (
            <div key={i} className="group p-6 bg-white border border-[var(--border)] hover:border-[var(--blue)]/30 transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ background: `${method.color}10` }}>
                <method.icon size={22} className="text-[var(--blue)]" />
              </div>
              <h3 className="text-[16px] font-bold text-[var(--text)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{method.title}</h3>
              <p className="text-[22px] font-black text-[var(--blue)] mb-1">{method.price}</p>
              <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-[0.1em] mb-3">{method.time}</p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{method.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-[var(--bg-alt)] border-y border-[var(--border)] py-14">
        <div className="max-w-[900px] mx-auto px-6 md:px-10">
          <h2 className="text-[22px] font-bold text-[var(--text)] mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>Proceso de Envio</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-[var(--border)]" />
            <div className="space-y-6">
              {processSteps.map((step, i) => (
                <div key={i} className="flex gap-5 relative">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 z-10 bg-[var(--blue)]/10">
                    <span className="text-[11px] font-bold text-[var(--blue)]">{step.num}</span>
                  </div>
                  <div className="flex-1 pb-6 border-b border-[var(--border-light)]">
                    <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">{step.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="max-w-[900px] mx-auto px-6 md:px-10 py-14">
        <div className="p-6 md:p-8 bg-[var(--blue)]/5 border border-[var(--blue)]/10">
          <div className="flex items-center gap-2 mb-5">
            <Icons.ShieldCheck size={18} className="text-[var(--blue)]" />
            <h2 className="text-[15px] font-bold text-[var(--text)]">Lo que Incluye tu Envio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icons.CheckCircle size={14} className="text-[var(--blue)] flex-shrink-0" />
                <p className="text-[13px] text-[var(--text-secondary)]">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-alt)] border-t border-[var(--border)] py-12">
        <div className="max-w-[900px] mx-auto px-6 md:px-10 text-center">
          <h2 className="text-[20px] font-bold text-[var(--text)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>¿Necesitas una cotizacion personalizada?</h2>
          <p className="text-[13px] text-[var(--text-muted)] mb-6">Contacta a nuestro equipo para un presupuesto adaptado a tu destino y volumen.</p>
          <Link href="/contacto" className="inline-flex items-center gap-2 bg-[var(--blue)] text-white font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-[var(--blue)]/90 transition-all hover:shadow-[0_16px_40px_rgba(14,165,233,0.2)]">
            Cotizar Ahora <Icons.ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
}
