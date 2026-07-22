'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ordersAPI } from '@/lib/api';

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

export default function PedidosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/cuenta');
      return;
    }
    if (user) {
      setLoadingOrders(true);
      ordersAPI.byEmail(user.email).then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && typeof data === 'object' && 'orders' in data) {
          setOrders((data as any).orders);
        } else {
          setOrders([]);
        }
      }).catch(() => setOrders([])).finally(() => setLoadingOrders(false));
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--navy)]">Mis Pedidos</h1>
        <Link href="/cuenta/perfil" className="text-sm text-[var(--blue)] hover:underline font-medium">
          Mi Perfil →
        </Link>
      </div>

      {loadingOrders ? (
        <div className="text-center py-12 text-gray-400">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-gray-300 text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-[var(--navy)] mb-2">Sin pedidos aún</h2>
          <p className="text-gray-500 mb-6">Cuando hagas un pedido, aparecerá aquí</p>
          <Link href="/productos" className="inline-block px-6 py-3 bg-[var(--blue)] text-white font-bold rounded-lg hover:bg-[var(--navy)] transition-colors">
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusLabels[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-bold text-[var(--navy)]">{order.order_number}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="font-bold text-[var(--navy)]">
                      ${Number(order.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-6 pb-4 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Método de envío:</span>
                        <span className="ml-2 font-medium capitalize">{order.shipping_method || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Costo de envío:</span>
                        <span className="ml-2 font-medium">${Number(order.shipping_cost || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Productos:</h4>
                        <div className="space-y-2">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                              <span>{item.product_name} <span className="text-gray-400">×{item.quantity}</span></span>
                              <span className="font-medium">${Number(item.total_price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
