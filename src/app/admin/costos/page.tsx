'use client';

import { useState } from 'react';
import { formatMXN } from '@/lib/utils';
import { Save, DollarSign, Truck } from 'lucide-react';

const defaultRates = [
  { id: 1, method: 'maritimo', method_label: 'Envío Marítimo', price_per_kg_usd: 4.50, min_days: 20, max_days: 40 },
  { id: 2, method: 'aereo', method_label: 'Envío Aéreo', price_per_kg_usd: 12.00, min_days: 5, max_days: 10 },
  { id: 3, method: 'express', method_label: 'Envío Express', price_per_kg_usd: 20.00, min_days: 3, max_days: 7 },
];

export default function AdminCosts() {
  const [rates, setRates] = useState(defaultRates);
  const [exchangeRate, setExchangeRate] = useState(17.50);
  const [taxRate, setTaxRate] = useState(16);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateRate = (id: number, field: string, value: number) => {
    setRates(rates.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const exampleCost = 2800;
  const exampleWeight = 12;
  const exampleMargin = 2.2;

  return (
    <div className="bg-[var(--bg-alt)] min-h-screen">
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Costos Variables y Envío</h1>
            <p className="text-[var(--text-muted)] text-sm">Configura los costos de envío desde China y tipo de cambio</p>
          </div>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${saved ? 'bg-[var(--green-status)] text-white' : 'bg-[var(--green)] text-white hover:bg-[var(--green-hover)]'}`}>
            <Save size={16} />
            {saved ? 'Guardado ✓' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 shadow-sm border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text)]">Tipo de Cambio</h3>
                <p className="text-xs text-[var(--text-muted)]">USD → MXN</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">$1 USD =</span>
              <input type="number" step="0.01" value={exchangeRate} onChange={e => setExchangeRate(parseFloat(e.target.value))} className="w-24 px-3 py-2 border border-[var(--border)] text-lg font-bold text-right focus:outline-none focus:border-[var(--green)]" />
              <span className="text-sm text-[var(--text-muted)]">MXN</span>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">%</span>
              </div>
              <div>
                <h3 className="font-bold text-[var(--text)]">IVA (México)</h3>
                <p className="text-xs text-[var(--text-muted)]">Impuesto al valor agregado</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" step="1" value={taxRate} onChange={e => setTaxRate(parseInt(e.target.value))} className="w-20 px-3 py-2 border border-[var(--border)] text-lg font-bold text-right focus:outline-none focus:border-[var(--green)]" />
              <span className="text-sm text-[var(--text-muted)]">%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] p-6 text-white">
            <h3 className="font-bold mb-2">Fórmula de Cálculo</h3>
            <div className="text-sm space-y-1 opacity-90">
              <p>Precio = (Costo × Margen + Envío/kg × Peso) × Tipo de Cambio × (1 + IVA)</p>
              <p className="text-[var(--blue)] font-medium mt-3">Ejemplo con ARK-7000:</p>
              <p>= ($2,800 × 2.2 + $4.50 × 12) × 17.50 × 1.16</p>
              <p className="text-lg font-bold text-[var(--blue)]">= {formatMXN((exampleCost * exampleMargin + 4.50 * exampleWeight) * exchangeRate * (1 + taxRate/100))}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-[var(--border)]">
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--green)] flex items-center justify-center">
                <Truck size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-[var(--text)]">Métodos de Envío (China → México)</h2>
                <p className="text-xs text-[var(--text-muted)]">Costos por kilogramo en USD</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-[var(--border-light)]">
            {rates.map(rate => (
              <div key={rate.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="font-bold text-[var(--text)]">{rate.method_label}</div>
                  <div className="text-sm text-[var(--text-muted)]">{rate.min_days}-{rate.max_days} días hábiles</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--text-muted)]">$</span>
                    <input type="number" step="0.10" value={rate.price_per_kg_usd} onChange={e => updateRate(rate.id, 'price_per_kg_usd', parseFloat(e.target.value))} className="w-20 px-3 py-2 border border-[var(--border)] text-sm font-bold text-right focus:outline-none focus:border-[var(--green)]" />
                    <span className="text-sm text-[var(--text-muted)]">USD/kg</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <input type="number" value={rate.min_days} onChange={e => updateRate(rate.id, 'min_days', parseInt(e.target.value))} className="w-14 px-2 py-1 border border-[var(--border)] text-center text-sm focus:outline-none focus:border-[var(--green)]" />
                    <span>-</span>
                    <input type="number" value={rate.max_days} onChange={e => updateRate(rate.id, 'max_days', parseInt(e.target.value))} className="w-14 px-2 py-1 border border-[var(--border)] text-center text-sm focus:outline-none focus:border-[var(--green)]" />
                    <span>días</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
