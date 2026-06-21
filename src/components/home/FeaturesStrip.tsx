'use client';

import Icons from '@/components/ui/Icons';

const features = [
  { icon: Icons.Truck, title: 'Envío Directo', desc: 'China → México' },
  { icon: Icons.ShieldCheck, title: 'Garantía 12 Meses', desc: 'Soporte incluido' },
  { icon: Icons.Tag, title: 'Mejor Precio', desc: 'Directo de fábrica' },
  { icon: Icons.Headphones, title: 'Soporte 24/7', desc: 'Asesoría técnica' },
];

export default function FeaturesStrip() {
  return (
    <section className="bg-[var(--bg-alt)] border-y border-[var(--border-light)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className={`wow-fadeUp flex items-center gap-3 py-5 px-4 md:py-6 md:px-6 ${i < 3 ? 'border-r border-[var(--border-light)]' : ''} ${i < 2 ? 'border-b md:border-b-0 border-[var(--border-light)]' : ''} ${i === 2 ? 'border-b md:border-b-0 border-[var(--border-light)]' : ''}`}
            style={{ transitionDelay: `${0.08 * i}s` }}
            >
              <f.icon size={18} className="text-[var(--green)]" />
              <div>
                <div className="text-[12px] font-bold text-[var(--text)]">{f.title}</div>
                <div className="text-[11px] text-[var(--text-soft)]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
