'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatMXN } from '@/lib/utils';
import { useShippingRates } from '@/lib/useShippingRates';
import Icons from '@/components/ui/Icons';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface CartItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  weight: number;
  quantity: number;
  img: string;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState('maritimo');
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState<{ type: string; value: number; code: string } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { rates, getRate, getDays } = useShippingRates();

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    card_number: '',
    card_expiry: '',
    card_cvc: '',
    card_name: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountError('');
    try {
      const res = await fetch(`${API_BASE}/orders?action=validate-discount&code=${encodeURIComponent(discountCode)}`);
      const data = await res.json();
      if (data.success) {
        setDiscount(data.data);
      } else {
        setDiscountError(data.error || 'Codigo invalido');
        setDiscount(null);
      }
    } catch {
      setDiscountError('Error al validar codigo');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  const currentRate = getRate(shippingMethod);
  const shippingCost = (currentRate?.cost_per_kg || 0) * totalWeight;

  let discountAmount = 0;
  if (discount) {
    discountAmount = discount.type === 'percentage' ? subtotal * (discount.value / 100) : Math.min(discount.value, subtotal);
  }

  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.16;
  const total = taxableAmount + shippingCost + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          shipping_address: form.shipping_address,
          shipping_method: shippingMethod,
          discount_code: discount?.code || null,
          currency: 'MXN',
          payment_method: 'card',
          items: items.map(item => ({
            product_id: item.id,
            product_name: item.name,
            product_sku: item.sku,
            unit_price_mxn: item.price,
            quantity: item.quantity,
            weight_kg: item.weight,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.data.order_number);
        setOrderPlaced(true);
        localStorage.removeItem('cart');
      }
    } catch {}
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[var(--bg-alt)] flex items-center justify-center">
        <div className="bg-white p-12 border border-[var(--border)] shadow-sm text-center max-w-[500px]">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Icons.CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-[24px] font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Pedido Recibido</h1>
          <p className="text-[14px] text-[var(--text-muted)] mb-4">Tu numero de pedido es:</p>
          <p className="text-[20px] font-mono font-bold text-[var(--green)] mb-6">{orderNumber}</p>
          <p className="text-[13px] text-[var(--text-secondary)] mb-6">
            Recibirás un correo electronico con los detalles de tu pedido y las instrucciones de pago.
          </p>
          <Link href="/productos" className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-[var(--green-hover)] transition-colors">
            Seguir Comprando <Icons.ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-alt)] min-h-screen">
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
          <h1 className="text-[28px] md:text-[34px] font-black text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>
          <p className="text-[var(--text-muted)] text-[13px]">Completa tus datos para finalizar la compra</p>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
        {items.length === 0 ? (
          <div className="bg-white p-16 text-center border border-[var(--border)] shadow-sm">
            <h2 className="text-xl font-bold text-[var(--text)] mb-2">Tu carrito esta vacio</h2>
            <Link href="/productos" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] mt-4">
              Ver Catalogo <Icons.ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Datos personales */}
                <div className="bg-white p-6 border border-[var(--border)] shadow-sm">
                  <h2 className="font-bold text-[var(--text)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Datos Personales</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Nombre completo</label>
                      <input type="text" required value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className="w-full px-4 py-3 border border-[var(--border)] text-[14px]" />
                    </div>
                    <div className="form-group">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Email</label>
                      <input type="email" required value={form.customer_email} onChange={e => setForm({...form, customer_email: e.target.value})} className="w-full px-4 py-3 border border-[var(--border)] text-[14px]" />
                    </div>
                    <div className="form-group">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Telefono</label>
                      <input type="tel" value={form.customer_phone} onChange={e => setForm({...form, customer_phone: e.target.value})} className="w-full px-4 py-3 border border-[var(--border)] text-[14px]" />
                    </div>
                    <div className="form-group md:col-span-2">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Direccion de envio</label>
                      <textarea required value={form.shipping_address} onChange={e => setForm({...form, shipping_address: e.target.value})} className="w-full px-4 py-3 border border-[var(--border)] text-[14px]" rows={3} />
                    </div>
                  </div>
                </div>

                {/* Metodo de envio */}
                <div className="bg-white p-6 border border-[var(--border)] shadow-sm">
                  <h2 className="font-bold text-[var(--text)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Metodo de Envio</h2>
                  <div className="space-y-2">
                    {rates.map(rate => (
                      <label key={rate.method} className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${shippingMethod === rate.method ? 'border-[var(--green)] bg-[var(--green-light)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'}`}>
                        <input type="radio" name="shipping" value={rate.method} checked={shippingMethod === rate.method} onChange={() => setShippingMethod(rate.method)} className="accent-[var(--green)]" />
                        <Icons.Truck size={16} className="text-[var(--text-soft)]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[var(--text)]">{rate.method_label || rate.method} ({getDays(rate.method)})</div>
                          <div className="text-xs text-[var(--text-muted)]">${rate.cost_per_kg}/kg</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pago */}
                <div className="bg-white p-6 border border-[var(--border)] shadow-sm">
                  <h2 className="font-bold text-[var(--text)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Datos de Pago</h2>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
                    <p className="text-[12px] text-blue-700 flex items-center gap-2">
                      <Icons.ShieldCheck size={14} />
                      Pago seguro con encriptacion SSL. Tu informacion esta protegida.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group md:col-span-2">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Numero de tarjeta</label>
                      <input type="text" placeholder="1234 5678 9012 3456" value={form.card_number} onChange={e => setForm({...form, card_number: e.target.value})} className="w-full px-4 py-3 border border-[var(--border)] text-[14px] font-mono" maxLength={19} />
                    </div>
                    <div className="form-group">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Fecha de expiracion</label>
                      <input type="text" placeholder="MM/AA" value={form.card_expiry} onChange={e => setForm({...form, card_expiry: e.target.value})} className="w-full px-4 py-3 border border-[var(--border)] text-[14px] font-mono" maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">CVC</label>
                      <input type="text" placeholder="123" value={form.card_cvc} onChange={e => setForm({...form, card_cvc: e.target.value})} className="w-full px-4 py-3 border border-[var(--border)] text-[14px] font-mono" maxLength={4} />
                    </div>
                    <div className="form-group md:col-span-2">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Nombre en la tarjeta</label>
                      <input type="text" placeholder="Como aparece en la tarjeta" value={form.card_name} onChange={e => setForm({...form, card_name: e.target.value})} className="w-full px-4 py-3 border border-[var(--border)] text-[14px]" />
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-soft)] mt-3">
                    * La pasarela de pagos se conectara con tu banco en una futura fase. Por ahora se registra el pedido sin cobrar.
                  </p>
                </div>
              </div>

              {/* Resumen */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 border border-[var(--border)] shadow-sm sticky top-24">
                  <h2 className="font-bold text-[var(--text)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Resumen del Pedido</h2>

                  <div className="max-h-[200px] overflow-y-auto mb-4 space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 text-[13px]">
                        <div className="w-10 h-10 bg-[var(--bg-alt)] flex-shrink-0 overflow-hidden">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[var(--text)] truncate">{item.name}</div>
                          <div className="text-[var(--text-muted)]">x{item.quantity}</div>
                        </div>
                        <span className="font-medium text-[var(--text)]">{formatMXN(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Descuento */}
                  <div className="mb-4 pb-4 border-b border-[var(--border-light)]">
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Codigo de descuento</label>
                    <div className="flex gap-2">
                      <input type="text" value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="CODIGO" className="flex-1 px-3 py-2 border border-[var(--border)] text-[13px] font-mono uppercase" />
                      <button type="button" onClick={applyDiscount} className="px-4 py-2 bg-[var(--green)] text-white text-[12px] font-bold uppercase">Aplicar</button>
                    </div>
                    {discountError && <p className="text-[11px] text-red-500 mt-1">{discountError}</p>}
                    {discount && <p className="text-[11px] text-green-600 mt-1">Descuento aplicado: {discount.type === 'percentage' ? discount.value + '%' : '$' + discount.value}</p>}
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Subtotal</span>
                      <span className="font-medium text-[var(--text)]">{formatMXN(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuento</span>
                        <span>-{formatMXN(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Envio ({totalWeight} kg)</span>
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

                  <button type="submit" disabled={loading || items.length === 0} className="w-full mt-6 px-6 py-4 bg-[var(--green)] text-white font-bold text-[13px] uppercase tracking-[0.08em] hover:bg-[var(--green-hover)] transition-colors disabled:opacity-50">
                    {loading ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
