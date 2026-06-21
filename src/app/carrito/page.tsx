'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatMXN } from '@/lib/utils';
import Icons from '@/components/ui/Icons';

interface CartItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  weight: number;
  quantity: number;
  img: string;
}

const shippingRates: Record<string, { price: number; label: string; days: string }> = {
  maritimo: { price: 4.50, label: 'Marítimo (20-40 días)', days: '20-40' },
  aereo: { price: 12.00, label: 'Aéreo (5-10 días)', days: '5-10' },
  express: { price: 20.00, label: 'Express (3-7 días)', days: '3-7' },
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState('maritimo');

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  const shippingCost = shippingRates[shippingMethod].price * totalWeight;
  const tax = subtotal * 0.16;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="bg-[var(--bg-alt)] min-h-screen">
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Carrito de Compras</h1>
          <p className="text-[var(--text-muted)] text-sm">{items.length} productos en tu carrito</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="bg-white p-16 text-center border border-[var(--border)] shadow-sm">
            <div className="w-20 h-20 bg-[var(--bg-alt)] flex items-center justify-center mx-auto mb-5">
              <Icons.ShoppingCart size={32} className="text-[var(--text-soft)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Tu carrito está vacío</h2>
            <p className="text-[var(--text-muted)] mb-6">Agrega productos del catálogo para comenzar</p>
            <Link href="/productos" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] hover:bg-[var(--green-hover)] transition-colors">
              Ver Catálogo <Icons.ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 md:p-5 border border-[var(--border)] shadow-sm flex gap-4">
                  <div className="w-20 h-20 bg-[var(--bg-alt)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--text)] text-sm">{item.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{item.sku}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{item.weight} kg por unidad</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-alt)] transition-colors">
                          <Icons.ChevronDown size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-[var(--text)]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-alt)] transition-colors">
                          <Icons.ChevronDown size={14} className="rotate-180" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[var(--text)]">{formatMXN(item.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.id)} className="text-[var(--text-soft)] hover:text-red-500 transition-colors">
                          <Icons.XCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 border border-[var(--border)] shadow-sm sticky top-24">
                <h2 className="font-bold text-[var(--text)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Resumen del Pedido</h2>

                <div className="mb-4">
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Método de Envío</label>
                  <div className="space-y-2">
                    {Object.entries(shippingRates).map(([key, rate]) => (
                      <label key={key} className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${shippingMethod === key ? 'border-[var(--green)] bg-[var(--green-light)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'}`}>
                        <input type="radio" name="shipping" value={key} checked={shippingMethod === key} onChange={() => setShippingMethod(key)} className="accent-[var(--green)]" />
                        <Icons.Truck size={16} className="text-[var(--text-soft)]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[var(--text)]">{rate.label}</div>
                          <div className="text-xs text-[var(--text-muted)]">${rate.price}/kg</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--border-light)]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Subtotal</span>
                    <span className="font-medium text-[var(--text)]">{formatMXN(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Envío ({totalWeight} kg × ${shippingRates[shippingMethod].price})</span>
                    <span className="font-medium text-[var(--text)]">{formatMXN(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">IVA (16%)</span>
                    <span className="font-medium text-[var(--text)]">{formatMXN(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-[var(--border-light)]">
                    <span className="text-[var(--text)]">Total</span>
                    <span className="text-[var(--green)]">{formatMXN(total)}</span>
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] hover:bg-[var(--green-hover)] transition-colors">
                  Proceder al Pago
                </button>

                <p className="text-xs text-[var(--text-soft)] text-center mt-3">
                  * Precios calculados en tiempo real con costo de envío incluido
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
