'use client';

import { useState } from 'react';
import { formatMXN } from '@/lib/utils';
import Icons from '@/components/ui/Icons';

interface OrderRow {
  id: number;
  order_number: string;
  customer: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: number;
  date: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-100', icon: <Icons.Clock size={16} /> },
  processing: { label: 'Procesando', color: 'text-blue-700', bg: 'bg-blue-100', icon: <Icons.Package size={16} /> },
  shipped: { label: 'Enviado', color: 'text-purple-700', bg: 'bg-purple-100', icon: <Icons.Truck size={16} /> },
  delivered: { label: 'Entregado', color: 'text-[var(--green)]', bg: 'bg-[var(--green-light)]', icon: <Icons.CheckCircle size={16} /> },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-100', icon: <Icons.XCircle size={16} /> },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const updateStatus = (id: number, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="bg-[var(--bg-alt)] min-h-screen">
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-6">
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Gestionar Pedidos</h1>
          <p className="text-[var(--text-muted)] text-sm">{orders.length} pedidos totales</p>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = orders.filter(o => o.status === key).length;
            return (
              <button key={key} onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)} aria-pressed={filterStatus === key} className={`p-4 text-left transition-all ${filterStatus === key ? 'ring-2 ring-[var(--green)] bg-white shadow-sm' : 'bg-white shadow-sm border border-[var(--border)]'}`}>
                <div className={`w-8 h-8 ${config.bg} flex items-center justify-center mb-2`}>
                  {config.icon}
                </div>
                <div className="text-lg font-bold text-[var(--text)]">{count}</div>
                <div className="text-xs text-[var(--text-muted)]">{config.label}</div>
              </button>
            );
          })}
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[var(--border)] shadow-sm">
            <div className="w-16 h-16 bg-[var(--bg-alt)] flex items-center justify-center mx-auto mb-4">
              <Icons.ShoppingCart size={24} className="text-[var(--text-soft)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Sin pedidos</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
              Aún no hay pedidos. Los pedidos aparecerán aquí cuando los clientes realicen compras.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-alt)] border-b border-[var(--border)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Pedido</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Cliente</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Items</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Total</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Estado</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Fecha</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {filtered.map(order => {
                    const status = statusConfig[order.status];
                    return (
                      <tr key={order.id} className="hover:bg-[var(--bg-alt)]">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{order.order_number}</td>
                        <td className="px-4 py-3 text-[var(--text)]">{order.customer}</td>
                        <td className="px-4 py-3 text-[var(--text-muted)]">{order.items} artículos</td>
                        <td className="px-4 py-3 font-bold text-[var(--text)]">{formatMXN(order.total)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{order.date}</td>
                        <td className="px-4 py-3">
                          <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className="text-xs border border-[var(--border)] px-2 py-1 focus:outline-none focus:border-[var(--green)]">
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <option key={key} value={key}>{config.label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
