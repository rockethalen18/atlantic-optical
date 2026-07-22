'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface ShippingRate {
  id?: number;
  method: string;
  method_label?: string;
  cost_per_kg: number;
  description?: string;
  estimated_days?: string;
  min_days?: number;
  max_days?: number;
  is_active?: number;
}

const fallbackRates: ShippingRate[] = [
  { method: 'maritimo', method_label: 'Marítimo', cost_per_kg: 4.50, min_days: 20, max_days: 40, description: 'Ideal para equipos grandes y pesados.' },
  { method: 'aereo', method_label: 'Aéreo', cost_per_kg: 12.00, min_days: 5, max_days: 10, description: 'Equilibrio entre velocidad y costo.' },
  { method: 'express', method_label: 'Express', cost_per_kg: 20.00, min_days: 3, max_days: 7, description: 'Máxima urgencia. Para equipos críticos.' },
];

export function useShippingRates() {
  const [rates, setRates] = useState<ShippingRate[]>(fallbackRates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/shipping`)
      .then(r => r.json())
      .then(data => {
        if (data?.data?.rates && data.data.rates.length > 0) {
          setRates(data.data.rates.map((r: ShippingRate) => ({ ...r, cost_per_kg: Number(r.cost_per_kg) })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getRate = (method: string) => rates.find(r => r.method === method) || fallbackRates.find(r => r.method === method);

  const getDays = (method: string) => {
    const r = getRate(method);
    if (r?.min_days && r?.max_days) return `${r.min_days}-${r.max_days} días`;
    if (r?.estimated_days) return r.estimated_days;
    return '';
  };

  return { rates, loading, getRate, getDays };
}
